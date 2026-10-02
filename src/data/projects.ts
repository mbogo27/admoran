// Portfolio data. Spec §10.1: only industries confirmed from the WordPress
// export (or named directly by Vincent) may be set — everything else stays
// 'UNCONFIRMED' rather than guessed.
//
// Only 3 of the 19 live portfolio projects are confirmed from
// admoranmarketing_WordPress_2026-08-08.xml: decl.co.ke, smiledent.co.ke,
// zikopoint.co.ke. The remaining 16 are not in this file — inventing
// placeholder entries for real, unnamed businesses would violate the
// no-invented-data rule as badly as inventing metrics would. Vincent adds
// the rest (see the build report).
//
// No screenshot field: spec §2.6 requires all 19 shot at identical
// viewport and treatment, which this pass has no way to produce. /work/
// and /work/decl/ render a neutral placeholder tile instead of a fabricated
// or generic-stock image standing in for a specific real client's site.

export interface Project {
  slug: string;
  name: string;
  url: string;
  industry: string;
  kind: 'client' | 'own';
  services: ('web-design' | 'redesign' | 'ecommerce' | 'seo')[];
  year: number;
  blurb: string;
  hasPage: boolean;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'decl',
    name: 'DECL — Diligent Environmental Consultancy Limited',
    url: 'https://decl.co.ke/',
    industry: 'Environmental consultancy',
    kind: 'client',
    services: ['web-design', 'seo'],
    year: 2023,
    blurb: 'A Kenyan environmental consultancy specialising in ESIA and Environmental Audit, built for search-led lead generation.',
    hasPage: true,
    featured: true,
  },
  {
    slug: 'smile-dent',
    name: 'Smile Dent Center',
    url: 'https://smiledent.co.ke/',
    industry: 'Dental clinic',
    kind: 'client',
    services: ['redesign', 'seo'],
    year: 2023,
    blurb: 'A dental clinic in Nakuru, redesigned for local search visibility and online appointment requests.',
    hasPage: true,
    featured: true,
  },
  {
    slug: 'zikopoint',
    name: 'Zikopoint',
    url: 'https://zikopoint.co.ke/',
    industry: 'Fashion ecommerce',
    kind: 'client',
    services: ['ecommerce'],
    year: 2023,
    blurb: 'An ecommerce storefront specialising in fashion.',
    hasPage: false,
    featured: true,
  },
];
