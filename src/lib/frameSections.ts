// Extracts <!-- frame:xxx --> ... <!-- /frame --> sections from a guide's
// markdown body. Used by scripts/validate.mjs (to warn on a declared frame
// with no marked section) and scripts/report.mjs (to build _frames.json).
// See spec §5.4.
const FRAME_SECTION_RE = /<!--\s*frame:(\w+)\s*-->\s*\r?\n(##[ \t]+.+?)\r?\n([\s\S]*?)<!--\s*\/frame\s*-->/g;

export interface FrameSection {
  frame: string;
  heading: string;
  body: string;
}

export function extractFrameSections(markdownBody: string): FrameSection[] {
  const sections: FrameSection[] = [];
  for (const match of markdownBody.matchAll(FRAME_SECTION_RE)) {
    const [, frame, heading, body] = match;
    sections.push({ frame, heading: heading.replace(/^##\s*/, '').trim(), body: body.trim() });
  }
  return sections;
}
