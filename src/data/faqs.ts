export type FAQ = {
  question: string;
  answer: string;
};

// Home page FAQ — also emitted as FAQPage JSON-LD via SEO.astro / index.astro
export const homeFaqs: FAQ[] = [
  {
    question: 'How much does SEO cost in Kenya?',
    answer:
      "Honest market breakdown: around KES 5,000/month buys you content mills — avoid these. KES 45,000–100,000/month buys competent solo consultants and small agencies, which is this tier. KES 150,000+ buys full agencies with account teams. What you pay reflects what you get.",
  },
  {
    question: 'Why do some agencies charge KES 5,000 and others KES 100,000+ per month?',
    answer:
      "Doing SEO properly takes hours of real work, paid tools, and expertise — that costs money. Anything under roughly KES 30,000/month usually means unpaid interns, AI-spun content, or link farms that put your site at risk of a Google penalty. Cheap SEO is rarely actually cheap once you count the cleanup.",
  },
  {
    question: 'How long does SEO take to work in Kenya?',
    answer:
      "Real answer: 3 months for early technical wins, 6 months for meaningful ranking movement, 12 months for durable growth. Anyone promising results in 30 days is either lying or setting you up for a Google penalty.",
  },
  {
    question: 'Do you guarantee first-page rankings?',
    answer:
      "No, and neither should anyone else — Google explicitly bans rank guarantees. What I do guarantee is measurable, honest work. You'll see exactly what changed and why.",
  },
  {
    question: 'What happens if I stop paying for SEO? Will my rankings disappear immediately?',
    answer:
      "No, unlike ads. Well-earned rankings tend to persist for months, sometimes years, though competitors and Google updates gradually erode them without upkeep. SEO behaves more like compound interest than rent.",
  },
  {
    question: 'Is it better to pay for Google Ads or invest in SEO?',
    answer:
      "Both, at different stages. Ads work for immediate revenue and testing offers. SEO builds durable, compounding traffic. If you're forced to pick one for the long haul, SEO wins on unit economics almost every time.",
  },
  {
    question: "What's the difference between an SEO consultant and an SEO agency in Kenya?",
    answer:
      'Agencies bring teams, overhead, and account managers. Consultants bring direct relationships and a lower cost per hour of actual thought. For SMEs under KES 100k/month, consultants usually deliver more per shilling.',
  },
  {
    question: 'How do I make sure my business gets recommended when someone asks ChatGPT or Perplexity?',
    answer:
      'This is emerging as its own discipline alongside traditional SEO. It comes down to structured data, entity clarity, and topical authority — things I bake into the retainer at the Growth tier.',
  },
  {
    question: 'What is AI Search and does my old website need to be rebuilt for it?',
    answer:
      "AI Search means Google AI Mode, ChatGPT, and Perplexity surfacing answers directly instead of just links. Most existing sites don't need rebuilding — they need better structured data, clearer entity signals, and content that actually answers real questions. It's an optimization job, not a rebuild.",
  },
  {
    question: 'Do you work with businesses outside Nairobi?',
    answer:
      'Yes, remotely across Kenya — Mombasa, Kisumu, Nakuru, Eldoret, and beyond. Google Business Profile work benefits from local knowledge but does not require physical presence.',
  },
];

// Services hub FAQ — quick buying-decision questions
export const servicesFaqs: FAQ[] = [
  {
    question: "What's the difference between the audit and the retainer?",
    answer: 'The audit is a diagnosis. The retainer is the treatment plan.',
  },
  {
    question: 'Can I start with the audit and move to a retainer?',
    answer:
      'Yes — the audit fee is credited against your first retainer month if you sign within 30 days.',
  },
  {
    question: 'What happens after 6 months on the retainer?',
    answer: 'It rolls to month-to-month, with 30-day notice either way.',
  },
  {
    question: 'What if my industry is very niche?',
    answer:
      "Ask on WhatsApp with your URL. Some niches are a great SEO fit, some aren't. I'll tell you honestly either way.",
  },
  {
    question: 'Do you invoice with GST/VAT?',
    answer: 'Yes — formal invoices with all tax details.',
  },
];

// SEO Audit page FAQ
export const auditFaqs: FAQ[] = [
  {
    question: "What if I don't understand the technical parts of the report?",
    answer:
      "That's what the walkthrough call is for. I explain every finding in plain language and translate technical issues into what they mean for your traffic and revenue — no jargon dump left for you to decipher alone.",
  },
  {
    question: 'Can I hire you to implement the fixes afterwards?',
    answer:
      'Yes. Many audit clients move to a monthly retainer to have me implement the fix list directly. The audit fee is credited against your first retainer month if you sign within 30 days.',
  },
  {
    question: 'Do you audit e-commerce sites?',
    answer:
      'Yes, with some adjustments for product page templates, category structure, and faceted navigation — areas that cause the most technical SEO problems on e-commerce specifically.',
  },
  {
    question: "What if I've already had an audit from someone else?",
    answer:
      "Send it over before we start. If it's thorough and current, I'll tell you honestly rather than charging you to repeat it. Often prior audits are outdated or too generic to actually act on, in which case a fresh one is worth it.",
  },
  {
    question: 'Do you work with WordPress / Shopify / Wix / custom sites?',
    answer:
      'Yes, all of them. The audit process adapts to your platform — the technical fixes differ, but the diagnostic approach is the same across WordPress, Shopify, Wix, and custom-built sites.',
  },
];

// Local SEO & GBP page FAQ
export const localSeoFaqs: FAQ[] = [
  {
    question: 'How do I get my business to show up on Google Maps when someone searches nearby?',
    answer:
      'It comes down to three things: a fully optimized Google Business Profile, consistent business information across the web, and enough positive review signal. Most businesses are missing at least one of the three — that gap is usually where GBP Rescue starts.',
  },
  {
    question: 'Why is my competitor showing up in the Map pack instead of me, even though I have better reviews?',
    answer:
      "Reviews are one ranking factor among many — category selection, proximity, keyword relevance in your business description, and posting activity all matter too. It's common to have better reviews but a weaker profile everywhere else. The audit tells you exactly which factor is costing you the spot.",
  },
  {
    question: 'How do I get more 5-star Google reviews from Kenyan customers, and do they actually help me rank?',
    answer:
      'Yes, review volume and recency both affect Maps ranking. The most reliable approach is asking at the moment of a good experience, ideally with a direct link, rather than a generic blanket request. GBP Rescue includes a request template built for that.',
  },
  {
    question: 'My business has multiple branches in Nairobi and Mombasa — do I need separate websites for each?',
    answer:
      "No — usually a separate, well-optimized GBP profile plus a dedicated landing page per location on one website outperforms running multiple sites. Multiple sites tend to split your authority rather than strengthen it.",
  },
  {
    question: 'How can I stop fake or negative reviews from damaging my Google ranking?',
    answer:
      "You can flag reviews that violate Google's policies for removal, though it's not guaranteed or fast. In the meantime, a thoughtful public response and a steady stream of genuine positive reviews do more for your ranking and reputation than fighting every negative one.",
  },
  {
    question: "What's the difference between GBP Rescue and ongoing local SEO?",
    answer:
      'GBP Rescue is a fast, one-time fix to your Google Business Profile — the highest-leverage starting point. Ongoing local SEO adds location landing pages, citation consistency, and continuous review and ranking monitoring, which happens as part of the monthly retainer.',
  },
];

// Monthly retainer page FAQ
export const retainerFaqs: FAQ[] = [
  {
    question: 'What specific metrics will you report every month to prove this is working?',
    answer:
      'Keyword rankings for your priority terms, organic traffic and trend, Google Business Profile views and actions, and a plain-language summary of what moved, why, and what happens next. No vanity "impressions" metrics with no connection to revenue.',
  },
  {
    question: 'What happens if I stop paying for SEO? Will my rankings disappear?',
    answer:
      "No, not immediately — earned rankings persist for months. But without upkeep, technical issues creep back in, content goes stale, and competitors who keep working will gradually overtake you. SEO compounds while you invest in it and slowly decays once you stop.",
  },
  {
    question: 'Can I upgrade or downgrade tiers mid-engagement?',
    answer:
      'Yes, at the start of any billing month. Most clients start on Starter and move to Growth once initial technical and on-page work is done and content/link velocity becomes the priority.',
  },
  {
    question: 'What happens after the 6-month minimum ends?',
    answer: 'It rolls to month-to-month automatically, with 30-day notice either way.',
  },
  {
    question: 'How is the retainer different from the audit?',
    answer:
      'The audit is a one-time diagnosis with a fix list you can act on yourself or hand to a developer. The retainer is me doing the ongoing work — implementation, content, links, monitoring — month after month.',
  },
  {
    question: 'Do you invoice with GST/VAT?',
    answer: 'Yes — formal invoices with all tax details, every month.',
  },
];

// /web-design/ hub FAQ
export const webDesignFaqs: FAQ[] = [
  {
    question: 'How much does a website cost in Kenya?',
    answer:
      'For a real business site — properly structured, fast, with schema and analytics wired up — expect from KES 50,000. Cheaper builds usually skip the SEO foundation entirely, which costs more to fix later than it would have cost to do right the first time.',
  },
  {
    question: 'How long does it take?',
    answer:
      'Most brochure sites: 2–3 weeks from content-ready to launch. Ecommerce and larger builds run longer — see the ecommerce page for specifics.',
  },
  {
    question: 'Do I own the site and domain?',
    answer:
      'Yes. The domain is registered in your name, and you get full access to the hosting and codebase. I don’t hold sites hostage between renewals.',
  },
  {
    question: 'What about hosting and maintenance?',
    answer:
      'I set up hosting as part of the build and can manage it ongoing for a small monthly fee, or hand you the keys if you’d rather run it yourself. Either way, it’s your call, not a lock-in.',
  },
  {
    question: 'Can I update it myself?',
    answer:
      'Depends on the platform. Astro builds are fast and search-friendly but need a developer for content changes beyond text tweaks. WordPress builds are slower and heavier but you can edit them yourself — that tradeoff is covered honestly in "Stack, honestly" above.',
  },
  {
    question: 'Do you do logos and branding?',
    answer:
      'No — I don’t do logo design or brand identity work. If you need that first, I can point you to people who do it well, then build the site around what you bring me.',
  },
];

// /web-design/website-redesign/ FAQ
export const redesignFaqs: FAQ[] = [
  {
    question: 'Will I lose my rankings?',
    answer:
      'Not if the redesign is done properly. Rankings are lost when URLs change without redirects, internal links get dropped, or content gets cut for visual cleanliness without anyone checking what it was doing for search first. The pre-redesign inventory exists specifically to prevent that.',
  },
  {
    question: 'Can you redesign without changing my URLs?',
    answer:
      'Yes, and it\'s often the better option — keeping URLs stable while rebuilding what sits behind them avoids the redirect risk entirely. If URLs do need to change, every one gets mapped to a 301 redirect before launch, not after someone notices traffic dropped.',
  },
  {
    question: 'What happens to my old content?',
    answer:
      'It gets audited before anything is touched — what\'s ranking, what\'s getting links, what\'s actually being read. Content that\'s doing work gets carried forward or improved, not deleted because it looked dated.',
  },
  {
    question: 'Do I need to move hosting?',
    answer:
      'Not necessarily. If your current hosting is reliable and fast enough, the redesign can go on top of it. I\'ll tell you honestly if it\'s the bottleneck.',
  },
];

// /web-design/ecommerce/ FAQ
export const ecommerceFaqs: FAQ[] = [
  {
    question: 'How much does an ecommerce site cost in Kenya?',
    answer:
      'From KES 150,000. That covers a properly built storefront with payment integration and a real product structure — not a brochure site with a cart plugin bolted on.',
  },
  {
    question: 'Can you integrate M-Pesa?',
    answer:
      'Yes — M-Pesa integration is standard for Kenyan ecommerce builds, alongside card payments where relevant.',
  },
  {
    question: 'Shopify or WooCommerce?',
    answer:
      'Depends on your catalogue size, who\'s managing it, and your budget for ongoing platform fees. I\'ll walk through the honest tradeoffs for your specific case rather than defaulting to one.',
  },
  {
    question: 'Who manages products after launch?',
    answer:
      'You do, day to day — catalogue and stock management is ongoing client work, not something I do indefinitely as part of the build. I set the system up so it\'s straightforward to run yourself.',
  },
  {
    question: 'Do you handle product photography?',
    answer:
      'No. Product photography, copywriting, and initial catalogue entry aren\'t included — I can point you to people who do them well, then build the storefront around what you supply.',
  },
];
