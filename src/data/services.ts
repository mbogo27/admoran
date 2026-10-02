// Spec §10.3 — every displayed price reads from src/data/pricing.ts. This
// file holds copy and structure only; price/priceValue are derived, never
// re-typed, so a price edited in pricing.ts can't drift out of sync here.
import { prices } from './pricing';

export type ServiceOffer = {
  slug: 'audit' | 'local-seo' | 'retainer';
  name: string;
  price: string;
  priceValue: number;
  timeframe: string;
  description: string;
  href: string;
};

// Summary cards for the home page "Three ways to work with me" section and the services hub
export const offers: ServiceOffer[] = [
  {
    slug: 'audit',
    name: 'SEO Audit',
    price: prices.seoAudit.display,
    priceValue: prices.seoAudit.amount,
    timeframe: '5–7 days',
    description:
      'See exactly what’s holding your site back and what to fix, in priority order.',
    href: '/seo-services/seo-audit/',
  },
  {
    slug: 'local-seo',
    name: 'Local SEO & GBP Rescue',
    price: prices.localSeo.display,
    priceValue: prices.localSeo.amount,
    timeframe: '5 days',
    description:
      'Get found in the Google Maps pack. Full profile optimization plus 30-day monitoring.',
    href: '/seo-services/local-seo/',
  },
  {
    slug: 'retainer',
    name: 'Monthly Retainer',
    price: `From ${prices.retainerStarter.display}`,
    priceValue: prices.retainerStarter.amount,
    timeframe: '6-month minimum',
    description:
      'Ongoing SEO for businesses serious about growing organic traffic and rankings.',
    href: '/seo-services/seo-retainer/',
  },
];

export const auditIncludes: string[] = [
  'Full technical crawl (site speed, Core Web Vitals, crawl errors, indexation, mobile usability)',
  'On-page SEO review of top 20 pages (titles, meta, headings, internal links, content depth)',
  'Google Search Console analysis (impressions, clicks, position trends, opportunity queries)',
  'Competitor mapping (3 direct competitors — where they beat you, where you can beat them)',
  'Google Business Profile audit',
  'Schema & entity review',
  'Prioritized fix list — critical, important, nice-to-have',
  '1-hour walkthrough call',
  '2 weeks of WhatsApp Q&A after delivery',
];

export const gbpIncludes: string[] = [
  'Full GBP audit against 40+ ranking factors',
  'Category + service selection (getting this right is 60% of local ranking)',
  'Attribute optimization (accessibility, payment methods, service options)',
  'Service area configuration for multi-location or delivery businesses',
  'Photo strategy — what to add, in what order, tagged correctly',
  'Review response templates (positive + negative)',
  'Q&A seeding with real customer questions',
  'Google Posts publishing schedule',
  '30-day monitoring with weekly check-ins',
];

export type RetainerTier = {
  name: string;
  price: string;
  priceValue: number;
  minimum: string;
  features: string[];
  fits: string;
};

export const retainerTiers: RetainerTier[] = [
  {
    name: 'Starter',
    price: prices.retainerStarter.display,
    priceValue: prices.retainerStarter.amount,
    minimum: '6-month minimum',
    features: [
      'Google Business Profile maintenance',
      'On-page SEO for up to 10 pages',
      'Monthly technical health check',
      '2 blog posts/month (900–1200 words each, written or edited by me)',
      'Basic link outreach (2–3 quality mentions/month)',
      'Monthly reporting call (30 min)',
      'WhatsApp support during business hours',
    ],
    fits: 'Fits: single-location clinic, small professional service, local retailer',
  },
  {
    name: 'Growth',
    price: prices.retainerGrowth.display,
    priceValue: prices.retainerGrowth.amount,
    minimum: '6-month minimum',
    features: [
      'Everything in Starter, plus:',
      'Full technical SEO management',
      'Schema & entity work (this is where AI-visibility optimization lives)',
      '4 blog posts/month (900–1500 words each)',
      'Active link acquisition (5+ quality mentions/month)',
      'Competitor tracking dashboard',
      'Monthly strategy call (60 min)',
      'Priority WhatsApp response',
    ],
    fits: 'Fits: multi-service business, growing e-commerce, professional practice with real growth intent',
  },
];
