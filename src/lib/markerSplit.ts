// Splits a compiled-HTML string on a literal HTML-comment marker written
// once by the author in the markdown body (CO-02 §2). Used to inject a
// component at an author-chosen section boundary without interleaving it
// mid-section — the marker must sit on its own line, immediately before
// an H2, so the split point is always a section boundary (v0.2 §4.3).
// HTML comments survive Astro's markdown compilation into
// `entry.rendered.html` unmodified — verified directly against the
// content layer before this was relied on.
export function splitOnMarker(html: string, marker: string): [string, string | null] {
  const idx = html.indexOf(marker);
  if (idx === -1) return [html, null];
  return [html.slice(0, idx), html.slice(idx + marker.length)];
}
