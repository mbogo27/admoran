// Single source of truth for every price displayed anywhere on the site.
// Spec §10.3: nothing is hard-coded into a template.

export interface PriceEntry {
  key: string;
  label: string;
  amount: number;
  currency: 'KES';
  unit?: 'flat' | 'month';
  display: string;
}

export const prices: Record<string, PriceEntry> = {
  seoAudit: {
    key: 'seoAudit',
    label: 'SEO Audit',
    amount: 35000,
    currency: 'KES',
    unit: 'flat',
    display: 'KES 35,000 flat',
  },
  localSeo: {
    key: 'localSeo',
    label: 'Local SEO & GBP Rescue',
    amount: 25000,
    currency: 'KES',
    unit: 'flat',
    display: 'KES 25,000 one-time',
  },
  retainerStarter: {
    key: 'retainerStarter',
    label: 'SEO Retainer — Starter',
    amount: 45000,
    currency: 'KES',
    unit: 'month',
    display: 'KES 45,000/month',
  },
  retainerGrowth: {
    key: 'retainerGrowth',
    label: 'SEO Retainer — Growth',
    amount: 75000,
    currency: 'KES',
    unit: 'month',
    display: 'KES 75,000/month',
  },
  webDesignFrom: {
    key: 'webDesignFrom',
    label: 'Web design, from',
    amount: 50000,
    currency: 'KES',
    unit: 'flat',
    display: 'from KES 50,000',
  },
  ecommerceFrom: {
    key: 'ecommerceFrom',
    label: 'Ecommerce web design, from',
    amount: 150000,
    currency: 'KES',
    unit: 'flat',
    display: 'from KES 150,000',
  },
};
