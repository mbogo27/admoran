#!/usr/bin/env node
// Implements spec §1.7 exactly. Exit 1 on any FAIL, exit 0 with warnings
// printed on WARN only. Run standalone (not through Astro) so it can gate
// `pnpm build` before Astro's own content-collection validation even runs.
import { readRawGuides } from '../src/lib/graph.ts';
import { extractFrameSections } from '../src/lib/frameSections.ts';
import { zoomConfig, FRAMES } from '../src/lib/zoom.ts';

const fails = [];
const warns = [];

function fail(msg) {
  fails.push(msg);
}
function warn(msg) {
  warns.push(msg);
}

const raw = readRawGuides();

// --- duplicate slug ---
const bySlug = new Map();
for (const { file, data } of raw) {
  if (!data.slug) {
    fail(`missing slug in ${file}`);
    continue;
  }
  if (!bySlug.has(data.slug)) bySlug.set(data.slug, []);
  bySlug.get(data.slug).push(file);
}
for (const [slug, files] of bySlug) {
  if (files.length > 1) {
    fail(`duplicate slug: ${slug} (${files.map((f) => `src/content/guides/${f}`).join(', ')})`);
  }
}

// From here on, use one entry per slug (first-seen) so downstream checks
// don't cascade-fail on an already-reported duplicate.
const entries = [...bySlug.entries()].map(([slug, files]) => {
  const entry = raw.find((r) => r.data.slug === slug && r.file === files[0]);
  return entry;
});
const slugSet = new Set(entries.map((e) => e.data.slug));

// --- frames vocabulary ---
for (const { data } of entries) {
  for (const f of data.frames ?? []) {
    if (!FRAMES.includes(f)) {
      fail(`${data.slug}: frame "${f}" is not in the site vocabulary (${FRAMES.join(', ')})`);
    }
  }
}

// --- zoom > 1 with empty parents ---
for (const { data } of entries) {
  if (data.zoom > 1 && (!data.parents || data.parents.length === 0)) {
    fail(`${data.slug}: zoom ${data.zoom} but parents is empty (only zoom 1 may have no parents)`);
  }
}

// --- primary_parent must be in parents ---
for (const { data } of entries) {
  if (data.primary_parent && !(data.parents ?? []).includes(data.primary_parent)) {
    fail(`${data.slug}: primary_parent "${data.primary_parent}" is not present in its own parents list`);
  }
}

// --- parents point to a real published file ---
for (const { data } of entries) {
  for (const p of data.parents ?? []) {
    if (!slugSet.has(p)) {
      fail(`${data.slug}: parent "${p}" has no corresponding file`);
      continue;
    }
    const parentEntry = entries.find((e) => e.data.slug === p);
    if (parentEntry.data.status !== 'published') {
      fail(`${data.slug}: parent "${p}" exists but is not published (status: ${parentEntry.data.status})`);
    }
  }
}

// --- cycle detection over the full parents graph (directed) ---
// Polyhierarchy means a node can have multiple parents, so this is a
// general DFS cycle check, not just the primary_parent breadcrumb walk.
const parentsOf = new Map(entries.map((e) => [e.data.slug, e.data.parents ?? []]));
const WHITE = 0, GRAY = 1, BLACK = 2;
const color = new Map(entries.map((e) => [e.data.slug, WHITE]));

function dfsCycle(slug, path) {
  color.set(slug, GRAY);
  path.push(slug);
  for (const parent of parentsOf.get(slug) ?? []) {
    if (!slugSet.has(parent)) continue;
    if (color.get(parent) === GRAY) {
      const cycleStart = path.indexOf(parent);
      const cyclePath = [...path.slice(cycleStart), parent];
      fail(`cycle detected: ${cyclePath.join(' → ')}`);
      return true;
    }
    if (color.get(parent) === WHITE) {
      if (dfsCycle(parent, path)) return true;
    }
  }
  path.pop();
  color.set(slug, BLACK);
  return false;
}
for (const slug of slugSet) {
  if (color.get(slug) === WHITE) dfsCycle(slug, []);
}

// --- warnings: parents.length > max_parents_warn ---
for (const { data } of entries) {
  if ((data.parents ?? []).length > zoomConfig.max_parents_warn) {
    warn(`${data.slug}: has ${data.parents.length} parents (warn threshold: ${zoomConfig.max_parents_warn})`);
  }
}

// --- warnings: frames.length > max_frames_warn ---
for (const { data } of entries) {
  if ((data.frames ?? []).length > zoomConfig.max_frames_warn) {
    warn(`${data.slug}: has ${data.frames.length} frames (warn threshold: ${zoomConfig.max_frames_warn})`);
  }
}

// --- warnings: parent zoom >= child zoom ---
const zoomOf = new Map(entries.map((e) => [e.data.slug, e.data.zoom]));
for (const { data } of entries) {
  for (const p of data.parents ?? []) {
    if (!slugSet.has(p)) continue;
    if (zoomOf.get(p) >= data.zoom) {
      warn(`${data.slug}: parent zoom (${zoomOf.get(p)}) >= child zoom (${data.zoom}) [parent: ${p}]`);
    }
  }
}

// --- warnings: declared frame with no marked section (§5.4) ---
for (const { data, body } of entries) {
  const sections = extractFrameSections(body);
  const markedFrames = new Set(sections.map((s) => s.frame));
  for (const f of data.frames ?? []) {
    if (!markedFrames.has(f)) {
      warn(`${data.slug}: declares frame "${f}" but has no <!-- frame:${f} --> block`);
    }
  }
}

// --- hand-written navigation lists in the body (v0.2.1 §4.4) ---
// Navigation is computed by ChildrenBlock/FrameBlock/ByConcern now. A
// list item whose first content is a link to another guide, repeated
// two or more times in a run, is a hand-written nav block duplicating
// what the layout already renders — it must be deleted, not kept as
// prose. A single inline link mid-sentence, or a single list item that
// happens to link somewhere, is argument, not navigation, and stays.
// Allows an optional **bold** wrapper around the link — this repo's nav
// lists write link text bold (`- **[text](url)** — blurb`), and the rule
// is about the list being navigation, not about the exact markdown used
// to style it.
const LIST_LINK = /^\s*(?:[-*+]|\d+\.)\s+\*{0,2}\[([^\]]+)\]\(([^)]+)\)/;

function findNavLists(body, allSlugs, file) {
  const failures = [];
  const lines = body.split('\n');
  let run = [];

  const flush = () => {
    const internal = run.filter((href) => {
      const s = href.replace(/^\/guides\//, '').replace(/^\//, '').split('#')[0];
      return allSlugs.has(s);
    });
    if (internal.length >= 2) {
      failures.push(
        `${file}: list of ${internal.length} internal guide links in body. ` +
          `Navigation is computed (v0.2.1 §4.4). Links: ${internal.join(', ')}`
      );
    }
    run = [];
  };

  for (const line of lines) {
    const m = line.match(LIST_LINK);
    if (m) {
      run.push(m[2]);
    } else if (line.trim() === '' && run.length) {
      // blank line inside a list doesn't break it; keep accumulating
    } else if (run.length) {
      flush();
    }
  }
  if (run.length) flush();
  return failures;
}

for (const { file, body } of entries) {
  for (const msg of findNavLists(body, slugSet, file)) {
    fail(msg);
  }
}

// --- warning: zoom-1 file missing the <!-- children --> placement marker (v0.2.1 §2) ---
// Not a FAIL: the template falls back to rendering the children block at
// the bottom of the page when the marker is absent. That fallback is
// acceptable, just worse than an author-chosen placement.
for (const { data, body } of entries) {
  if (data.zoom === 1 && !body.includes('<!-- children -->')) {
    warn(`${data.slug}: zoom 1 but has no <!-- children --> marker — children block will fall back to the bottom of the page`);
  }
}

// --- loud warning: frame appearing at fewer than two distinct zoom levels (§1.3) ---
const zoomsByFrame = new Map(FRAMES.map((f) => [f, new Set()]));
for (const { data } of entries) {
  for (const f of data.frames ?? []) {
    if (zoomsByFrame.has(f)) zoomsByFrame.get(f).add(data.zoom);
  }
}
for (const [frame, zooms] of zoomsByFrame) {
  if (zooms.size < 2) {
    warn(`frame "${frame}" appears at only ${zooms.size} zoom level${zooms.size === 1 ? '' : 's'} — this is a category, not a frame (see §1.3)`);
  }
}

// --- print ---
for (const f of fails) console.log(`FAIL  ${f}`);
for (const w of warns) console.log(`WARN  ${w}`);

if (fails.length > 0) {
  console.log(`\n${fails.length} failure(s), ${warns.length} warning(s).`);
  process.exit(1);
} else {
  console.log(`\n0 failures, ${warns.length} warning(s).`);
  process.exit(0);
}
