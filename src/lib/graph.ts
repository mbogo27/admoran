// Builds the computed Zoom Map graph once, from the raw frontmatter of
// every file in src/content/guides/. This module has no Astro-specific
// imports so it can be loaded identically by Astro pages/components and
// by the plain Node scripts under scripts/ (via `node --experimental-strip-types`).
// Nothing else may recompute relationships — see spec §4.
//
// Paths are resolved from process.cwd(), not import.meta.url: once Astro
// bundles this module into dist/, import.meta.url points at the bundled
// chunk's location, not the source tree, and a relative path off it no
// longer reaches src/content/guides. cwd is stable across `astro dev`,
// `astro build`, and `node scripts/*.mjs` — all are invoked from the
// project root.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const GUIDES_DIR = join(process.cwd(), 'src', 'content', 'guides');

export interface GuideNode {
  slug: string;
  title: string;
  zoom: number;
  parents: string[];
  primaryParent: string | null;
  frames: string[];
  summary: string;
  status: string;
  related: string[];
  targets: string[];
  description: string | null;
  childOrder: string[];
  sourceFile: string;
  // computed
  children: string[];
  frameSiblings: string[];
  frameCoverage: string[];
  inboundRefCount: number;
  breadcrumb: string[];
}

interface RawFrontmatter {
  title: string;
  slug: string;
  zoom: number;
  parents?: string[];
  status: string;
  primary_parent?: string;
  frames?: string[];
  related?: string[];
  child_order?: string[];
  summary?: string;
  description?: string;
  targets?: string[];
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Reads every guide's raw frontmatter and body, keyed by source file name. */
export function readRawGuides(): Array<{ file: string; data: RawFrontmatter; body: string }> {
  const files = readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.md'));
  return files.map((file) => {
    const contents = readFileSync(join(GUIDES_DIR, file), 'utf-8');
    const match = contents.match(FRONTMATTER_RE);
    if (!match) {
      throw new Error(`No frontmatter found in ${file}`);
    }
    const data = parseYaml(match[1]) as RawFrontmatter;
    const body = contents.slice(match[0].length);
    return { file, data, body };
  });
}

let cached: Map<string, GuideNode> | null = null;

/**
 * Builds the full computed graph. Nodes are keyed by slug, so a duplicate
 * slug silently overwrites its predecessor here — that case is a build
 * FAIL and is caught explicitly by scripts/validate.mjs before this
 * function's output is trusted for anything else.
 */
export function buildGraph(): Map<string, GuideNode> {
  if (cached) return cached;

  const raw = readRawGuides();
  const nodes = new Map<string, GuideNode>();

  for (const { file, data } of raw) {
    const parents = data.parents ?? [];
    nodes.set(data.slug, {
      slug: data.slug,
      title: data.title,
      zoom: data.zoom,
      parents,
      primaryParent: data.primary_parent ?? parents[0] ?? null,
      frames: data.frames ?? [],
      summary: data.summary ?? '',
      status: data.status,
      related: data.related ?? [],
      targets: data.targets ?? [],
      description: data.description ?? null,
      childOrder: data.child_order ?? [],
      sourceFile: file,
      children: [],
      frameSiblings: [],
      frameCoverage: [],
      inboundRefCount: 0,
      breadcrumb: [],
    });
  }

  // children — every file whose parents includes this slug, ordered by
  // the parent's child_order, then title.
  for (const node of nodes.values()) {
    const kids = [...nodes.values()].filter((n) => n.parents.includes(node.slug));
    kids.sort((a, b) => {
      const ai = node.childOrder.indexOf(a.slug);
      const bi = node.childOrder.indexOf(b.slug);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.title.localeCompare(b.title);
    });
    node.children = kids.map((n) => n.slug);
  }

  // inboundRefCount — files pointing here via parents or related
  for (const node of nodes.values()) {
    let count = 0;
    for (const other of nodes.values()) {
      if (other.slug === node.slug) continue;
      if (other.parents.includes(node.slug)) count++;
      if (other.related.includes(node.slug)) count++;
    }
    node.inboundRefCount = count;
  }

  // frameSiblings — shares >=1 frame; excludes own parents + children + self.
  // Sorted by absolute zoom distance ascending, then title. Rendering caps
  // this at 4 and filters to a different zoom level — see spec §5.2.
  for (const node of nodes.values()) {
    const excluded = new Set([node.slug, ...node.parents, ...node.children]);
    const siblings = [...nodes.values()].filter(
      (n) => !excluded.has(n.slug) && n.frames.some((f) => node.frames.includes(f))
    );
    siblings.sort((a, b) => {
      const da = Math.abs(a.zoom - node.zoom);
      const db = Math.abs(b.zoom - node.zoom);
      if (da !== db) return da - db;
      return a.title.localeCompare(b.title);
    });
    node.frameSiblings = siblings.map((n) => n.slug);
  }

  // frameCoverage — zoom 1-2 only: union of frames across the subtree,
  // walked transitively via children.
  for (const node of nodes.values()) {
    if (node.zoom > 2) continue;
    const subtree = new Set<string>();
    const stack = [...node.children];
    while (stack.length) {
      const slug = stack.pop()!;
      if (subtree.has(slug)) continue;
      subtree.add(slug);
      const child = nodes.get(slug);
      if (child) stack.push(...child.children);
    }
    const frameSet = new Set<string>(node.frames);
    for (const slug of subtree) {
      const n = nodes.get(slug);
      if (n) for (const f of n.frames) frameSet.add(f);
    }
    node.frameCoverage = [...frameSet];
  }

  // breadcrumb — walked via primaryParent, root first. Visited set guards
  // against cycles: polyhierarchy makes them easy to create by accident,
  // and a silent infinite loop in a build script is unrecoverable.
  for (const node of nodes.values()) {
    const trail: string[] = [];
    const visited = new Set<string>();
    let current: GuideNode | undefined = node;
    while (current) {
      if (visited.has(current.slug)) {
        throw new Error(`Cycle detected while walking breadcrumb from "${node.slug}": revisited "${current.slug}"`);
      }
      visited.add(current.slug);
      trail.unshift(current.slug);
      current = current.primaryParent ? nodes.get(current.primaryParent) : undefined;
    }
    node.breadcrumb = trail;
  }

  cached = nodes;
  return nodes;
}

/**
 * Independent loops in the undirected graph: E - V + C, where C is the
 * number of connected components. `parents` mode counts only parent
 * edges; `parents+frames` also adds one edge per unordered frame-sibling
 * pair, deduplicated against parent edges. See spec §4 and §9.4.
 */
export function loopCount(mode: 'parents' | 'parents+frames', nodes: Map<string, GuideNode> = buildGraph()): number {
  const edges = buildEdgeSet(mode, nodes);
  return loopCountFromEdges(nodes, edges);
}

/** E - V + C for an arbitrary edge set over the given node set. Exposed so
 * scripts/report.mjs can ablate individual frames' edges for §9.4. */
export function loopCountFromEdges(nodes: Map<string, GuideNode>, edges: Set<string>): number {
  const V = nodes.size;
  const E = edges.size;
  const C = countComponents(nodes, edges);
  return E - V + C;
}

export function buildEdgeSet(mode: 'parents' | 'parents+frames', nodes: Map<string, GuideNode>): Set<string> {
  const edges = new Set<string>();
  const edgeKey = (a: string, b: string) => (a < b ? `${a}::${b}` : `${b}::${a}`);

  for (const node of nodes.values()) {
    for (const parent of node.parents) {
      if (nodes.has(parent)) edges.add(edgeKey(node.slug, parent));
    }
  }

  if (mode === 'parents+frames') {
    for (const node of nodes.values()) {
      for (const sibSlug of node.frameSiblings) {
        edges.add(edgeKey(node.slug, sibSlug));
      }
    }
  }

  return edges;
}

function countComponents(nodes: Map<string, GuideNode>, edges: Set<string>): number {
  const adjacency = new Map<string, Set<string>>();
  for (const slug of nodes.keys()) adjacency.set(slug, new Set());
  for (const key of edges) {
    const [a, b] = key.split('::');
    adjacency.get(a)?.add(b);
    adjacency.get(b)?.add(a);
  }

  const visited = new Set<string>();
  let components = 0;
  for (const slug of nodes.keys()) {
    if (visited.has(slug)) continue;
    components++;
    const stack = [slug];
    while (stack.length) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const neighbor of adjacency.get(current) ?? []) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
  }
  return components;
}
