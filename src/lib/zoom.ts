// Path resolved from process.cwd(), not import.meta.url — see the note
// in graph.ts. Once Astro bundles this module, import.meta.url points
// into dist/, not the source tree.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { FRAMES, type FrameId } from './frames.generated.ts';

export { FRAMES };
export type { FrameId };

export interface ZoomConfig {
  zoom_levels: Record<number, string>;
  frames: Record<FrameId, string>;
  max_parents_warn: number;
  max_frames_warn: number;
  undersupply_threshold: number;
}

const configPath = join(process.cwd(), 'src', 'content', '_zoom.yaml');
const raw = readFileSync(configPath, 'utf-8');

export const zoomConfig: ZoomConfig = parse(raw);

export function frameLabel(id: string): string {
  return zoomConfig.frames[id as FrameId] ?? id;
}

export function zoomLevelName(zoom: number): string {
  return zoomConfig.zoom_levels[zoom] ?? String(zoom);
}
