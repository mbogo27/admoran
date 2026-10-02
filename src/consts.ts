// Spec §5 — the single global staged-publishing switch. Stays true for the
// whole full-build phase; flip to false at publish time, then set draft:
// false only on the pages actually being published.
export const NOINDEX = true;

export const SITE_TITLE = 'Admoran';
export const SITE_DESCRIPTION =
  'SEO and web design in Kenya. Vincent Mbogo — solo consultant, Nairobi.';
