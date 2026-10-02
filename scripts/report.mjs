#!/usr/bin/env node
// Implements spec §9. Runs post-build, writes JSON + a combined report.md
// to dist/_reports/.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  buildGraph,
  readRawGuides,
  buildEdgeSet,
  loopCount,
  loopCountFromEdges,
} from '../src/lib/graph.ts';
import { extractFrameSections } from '../src/lib/frameSections.ts';
import { zoomConfig, FRAMES } from '../src/lib/zoom.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const reportsDir = join(distDir, '_reports');

if (!existsSync(distDir)) {
  console.error('dist/ does not exist — run `pnpm build` before `pnpm report`.');
  process.exit(1);
}
mkdirSync(reportsDir, { recursive: true });

const nodes = buildGraph();
const raw = readRawGuides();

// ---------------------------------------------------------------------
// 9.1 gaps.json
// ---------------------------------------------------------------------
const allSlugs = new Set(nodes.keys());
const orphanParents = [];
for (const node of nodes.values()) {
  for (const p of node.parents) {
    if (!allSlugs.has(p)) orphanParents.push({ from: node.slug, missingParent: p });
  }
}

const underSupply = [];
for (const node of nodes.values()) {
  if (node.children.length === 0) continue; // leaves have no ratio to speak of
  const ratio = node.inboundRefCount / node.children.length;
  if (ratio > zoomConfig.undersupply_threshold) {
    underSupply.push({
      slug: node.slug,
      inboundRefCount: node.inboundRefCount,
      childrenCount: node.children.length,
      ratio: Number(ratio.toFixed(2)),
    });
  }
}

const frameCoverageGaps = [...nodes.values()]
  .filter((n) => n.zoom <= 2)
  .map((n) => ({
    slug: n.slug,
    zoom: n.zoom,
    covered: n.frameCoverage,
    missing: FRAMES.filter((f) => !n.frameCoverage.includes(f)),
  }));

const gaps = { orphanParents, underSupply, frameCoverage: frameCoverageGaps };
writeFileSync(join(reportsDir, 'gaps.json'), JSON.stringify(gaps, null, 2));

// ---------------------------------------------------------------------
// 9.2 frames.json
// ---------------------------------------------------------------------
const framesExtract = {};
for (const { data, body } of raw) {
  const sections = extractFrameSections(body);
  for (const section of sections) {
    framesExtract[`${data.slug}::${section.frame}`] = {
      slug: data.slug,
      frame: section.frame,
      heading: section.heading,
      body: section.body,
    };
  }
}
writeFileSync(join(reportsDir, 'frames.json'), JSON.stringify(framesExtract, null, 2));

// ---------------------------------------------------------------------
// 9.3 invariants.json
// ---------------------------------------------------------------------
const invariants = {};
for (const frame of FRAMES) {
  const pages = [...nodes.values()].filter((n) => n.frames.includes(frame));
  const zoomLevels = [...new Set(pages.map((p) => p.zoom))].sort();
  invariants[frame] = {
    zoomLevels,
    pageCount: pages.length,
    pass: zoomLevels.length >= 2,
  };
}
writeFileSync(join(reportsDir, 'invariants.json'), JSON.stringify(invariants, null, 2));

// ---------------------------------------------------------------------
// 9.4 shape.json — the experiment
// ---------------------------------------------------------------------
const parentEdges = buildEdgeSet('parents', nodes);
const fullEdges = buildEdgeSet('parents+frames', nodes);
const frameEdgesOnly = new Set([...fullEdges].filter((e) => !parentEdges.has(e)));

const loopsParentsOnly = loopCount('parents', nodes);
const loopsWithFrames = loopCountFromEdges(nodes, fullEdges);
const loopsAddedByFrames = loopsWithFrames - loopsParentsOnly;

// Per-frame edge set: pairs of nodes that both declare this frame, using
// the same parent/child exclusion as frameSiblings (see graph.ts).
function edgesForFrame(frame) {
  const edgeKey = (a, b) => (a < b ? `${a}::${b}` : `${b}::${a}`);
  const edges = new Set();
  const list = [...nodes.values()].filter((n) => n.frames.includes(frame));
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      const excluded = a.parents.includes(b.slug) || b.parents.includes(a.slug);
      if (!excluded) edges.add(edgeKey(a.slug, b.slug));
    }
  }
  return edges;
}

const perFrame = {};
for (const frame of FRAMES) {
  const framesExcludingThis = FRAMES.filter((f) => f !== frame);
  const edgesWithoutFrame = new Set(parentEdges);
  for (const f of framesExcludingThis) {
    for (const e of edgesForFrame(f)) edgesWithoutFrame.add(e);
  }
  const loopsWithoutFrame = loopCountFromEdges(nodes, edgesWithoutFrame);
  const loopsAdded = loopsWithFrames - loopsWithoutFrame;
  const edgesAdded = fullEdges.size - edgesWithoutFrame.size;
  perFrame[frame] = { edgesAdded, loopsAdded };
}

const shape = {
  nodes: nodes.size,
  parentEdges: parentEdges.size,
  frameEdges: frameEdgesOnly.size,
  loopsParentsOnly,
  loopsWithFrames,
  loopsAddedByFrames,
  perFrame,
};
writeFileSync(join(reportsDir, 'shape.json'), JSON.stringify(shape, null, 2));

// ---------------------------------------------------------------------
// 9.5 report.md
// ---------------------------------------------------------------------
const zeroLoopFrames = FRAMES.filter((f) => invariants[f].pass && perFrame[f].loopsAdded === 0);

const lines = [];
lines.push('# Zoom Map v0.2 — Build Report');
lines.push('');
lines.push('## §9.4 — The loop-count experiment (primary result)');
lines.push('');
lines.push(
  `The claim under test: a genuine frame — one that cuts across zoom levels — creates loops in the ` +
    `undirected graph, because it connects pages the parent structure had kept in separate branches. ` +
    `A frame that is secretly a category creates none.`
);
lines.push('');
lines.push(`- Nodes: **${shape.nodes}**`);
lines.push(`- Parent edges: **${shape.parentEdges}**`);
lines.push(`- Frame edges (deduplicated against parent edges): **${shape.frameEdges}**`);
lines.push(`- Loops, parents only: **${shape.loopsParentsOnly}**`);
lines.push(`- Loops, parents + frames: **${shape.loopsWithFrames}**`);
lines.push(`- Loops added by frames: **${shape.loopsAddedByFrames}**`);
lines.push('');
lines.push('| frame | edges added | loops added (ablation) | passes §1.3 two-zoom rule |');
lines.push('|---|---|---|---|');
for (const f of FRAMES) {
  lines.push(
    `| ${f} | ${perFrame[f].edgesAdded} | ${perFrame[f].loopsAdded} | ${invariants[f].pass ? '✓' : '✗'} |`
  );
}
lines.push('');
if (zeroLoopFrames.length > 0) {
  lines.push(
    `**Notable:** ${zeroLoopFrames.join(', ')} satisf${zeroLoopFrames.length === 1 ? 'ies' : 'y'} the ` +
      `two-zoom-level rule but added zero loops. Per spec §9.4, this is reported prominently rather than ` +
      `smoothed over — it would mean the rule in §1.3 is weaker than the framework claims.`
  );
} else {
  lines.push(
    `Every frame that passes the §1.3 two-zoom-level rule also added at least one loop. This is consistent ` +
      `with the framework's claim that a genuine cross-zoom frame is structurally distinguishable from a ` +
      `disguised category.`
  );
}
lines.push('');

lines.push('## §9.3 — Frame invariants');
lines.push('');
lines.push('| frame | zoom levels | pages | pass |');
lines.push('|---|---|---|---|');
for (const f of FRAMES) {
  const inv = invariants[f];
  lines.push(`| ${f} | ${inv.zoomLevels.join(', ')} | ${inv.pageCount} | ${inv.pass ? '✓' : '✗ FAIL'} |`);
}
lines.push('');

lines.push('## §9.1 — Gaps');
lines.push('');
lines.push(`- Orphan parents: **${orphanParents.length}**${orphanParents.length === 0 ? ' (none — clean)' : ''}`);
if (orphanParents.length > 0) {
  for (const o of orphanParents) lines.push(`  - ${o.from} → missing parent "${o.missingParent}"`);
}
lines.push(`- Under-supplied nodes (ratio > ${zoomConfig.undersupply_threshold}): **${underSupply.length}**`);
for (const u of underSupply) {
  lines.push(`  - ${u.slug}: ${u.inboundRefCount} inbound / ${u.childrenCount} children = ${u.ratio}`);
}
lines.push('');
lines.push('Frame coverage across zoom 1–2 subtrees:');
lines.push('');
lines.push('| node | zoom | covered | missing |');
lines.push('|---|---|---|---|');
for (const g of frameCoverageGaps) {
  lines.push(`| ${g.slug} | ${g.zoom} | ${g.covered.join(', ') || '—'} | ${g.missing.join(', ') || '—'} |`);
}
lines.push('');

lines.push('## §9.2 — Frame sections extracted');
lines.push('');
lines.push(`${Object.keys(framesExtract).length} sections extracted to \`frames.json\`. Not yet consumed by anything.`);
lines.push('');

writeFileSync(join(reportsDir, 'report.md'), lines.join('\n'));

console.log(`Reports written to ${reportsDir}`);
console.log(`Loops: parents-only=${loopsParentsOnly}, with-frames=${loopsWithFrames}, added=${loopsAddedByFrames}`);
if (zeroLoopFrames.length > 0) {
  console.log(`NOTE: zero-loop frames despite passing two-zoom rule: ${zeroLoopFrames.join(', ')}`);
}
