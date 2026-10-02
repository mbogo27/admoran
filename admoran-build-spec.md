# admoran.com — Full Build Spec

**Target:** Claude Code
**Owner:** Vincent Mbogo
**Domain:** admoran.com
**Stack:** Astro 5 (static) · Tailwind v4 via `@tailwindcss/vite` · Cloudflare Pages
**WhatsApp:** +254 743 747 496 → `wa.me/254743747496`

**Source repos:**
- **Build A** — `Projects/july/taskbee` — 7-page SEO consultancy site. Supplies the shell.
- **Build B** — `Projects/august/zoom` — Zoom Map v0.2 test build, 15 guides. Supplies `/guides/`.
- **Target** — the empty admoran folder already created.

**Prior documents that still apply:** `spec.md` (Build A base), `changes.md` (Build A service split), `taskbee-zoom-spec.md` (framework), `taskbee-change-order-01.md`, `taskbee-change-order-02.md`. This document supersedes all of them where they conflict. Where it is silent, they stand.

---

## 0. What this build is

A **full build** — every page in §3 exists and renders. This is deliberately more than will be published. The purpose is to see the whole shape at once, then trim to a publishable set and expand back gradually. §5 defines how that staging works without risking the live domain.

**Read this whole document before writing code.** Sections 1 and 2 must complete before any content moves; §4 must be correct before DNS changes.

**Do not deviate silently.** If something here is wrong, unbuildable, or contradicts a prior spec in a way this document does not resolve, stop and say so.

---

## 1. Merge procedure

Build A is the shell. Build B folds into it. This is not a merge of equals — B adopts A's layout, design system, navigation, and head component, and contributes only its guides subsystem.

### 1.1 Order of operations

Follow this order. Steps 1–2 must be complete and building before step 3.

1. **Scaffold from Build A.** Copy Build A into the admoran folder. Confirm `npm install && npm run build` succeeds before touching anything.
2. **Resolve Tailwind (§1.2).** Confirm the build still succeeds and the site is visually unchanged.
3. **Apply the brand and design system (§2).** Confirm build succeeds.
4. **Fold in Build B (§1.3).**
5. **Rewrite all strings (§1.4).**
6. **Add new pages (§8).**
7. **Add redirects (§4).**
8. **Verification (§11).**

### 1.2 Tailwind version conflict — resolve first

Build A (`spec.md` §4) uses `@astrojs/tailwind`, the deprecated v3 integration with a `tailwind.config.mjs`. Build B (`taskbee-zoom-spec.md` §2.1) uses Tailwind v4 via `@tailwindcss/vite`. These cannot coexist.

**Standardise on v4.** In the admoran build:

- Remove `@astrojs/tailwind` and `tailwind.config.mjs`.
- Add `@tailwindcss/vite`, wired through `vite.plugins` in `astro.config.mjs`.
- Convert every token from Build A's `tailwind.config.mjs` into a CSS `@theme` block in `src/styles/global.css`, using the **new** palette from §2.2, not the old one.
- Audit every Tailwind class in Build A's templates for v3→v4 breakage. The usual offenders: opacity shorthands, `space-x`/`space-y` behaviour, custom colour class names that no longer resolve, and arbitrary-value syntax.

Do not proceed to §1.3 until `npm run build` succeeds and the existing 7 pages render correctly on the new palette.

### 1.3 What moves from Build B

**Move these, unchanged in behaviour:**

```
src/content/guides/**            15 .md files
src/content/_zoom.yaml           site config (frames, zoom levels, thresholds)
src/content.config.ts            MERGE into A's config — add the guides collection,
                                 do not overwrite A's existing collections
src/lib/graph.ts
src/lib/zoom.ts
src/layouts/Guide.astro
src/components/ParentBlock.astro
src/components/ChildrenBlock.astro
src/components/FrameBlock.astro
src/components/ByConcern.astro
src/components/TableOfContents.astro     (from Change Order 01)
src/components/StickyToc.astro           (from Change Order 02)
src/components/ThreeLayers.astro         (from Change Order 02)
src/pages/guides/[slug].astro
src/pages/map.astro
scripts/validate.mjs
scripts/report.mjs
```

**Do not move:**

- Build B's `src/pages/index.astro` (it redirects to `/guides/seo-in-kenya`). **Delete it.** Build A's homepage wins.
- Build B's `public/robots.txt` (it disallows everything). Build A's wins, amended per §5.
- Build B's layout, global styles, fonts, or any colour token. `Guide.astro` must be rewritten to wrap Build A's `Layout.astro` and use the §2.2 palette.

**Preconditions.** Change Orders 01 and 02 must already be applied to Build B and verified. If they are not, apply and verify them in the Build B repo *before* moving anything. Merging a half-patched build makes the `shape.json` check in §11 meaningless, and that check is what protects the loop-count experiment.

**Record `dist/_reports/shape.json` from Build B before the move.** Nothing in this merge touches the link graph. The numbers must be byte-identical after. If they change, a component or content file was altered during the move — investigate before continuing.

### 1.4 String rewrites

Global. Grep for each and fix every occurrence, including inside JSON-LD, meta descriptions, and prose.

| Find | Replace |
|---|---|
| `taskbee.co.ke` | `admoran.com` |
| `https://taskbee.co.ke` | `https://admoran.com` |
| `Task Bee` / `TaskBee` / `taskbee` | `Admoran` |
| `vincent@taskbee.co.ke` | *(see §10 — Vincent supplies)* |
| PageSpeed link on `/about/` | `https://pagespeed.web.dev/analysis?url=https://admoran.com` |

Also update:

- `astro.config.mjs` → `site: 'https://admoran.com'`
- `public/robots.txt` → sitemap line points to `https://admoran.com/sitemap-index.xml`
- All `ProfessionalService` / `Person` JSON-LD: `name`, `url`, `sameAs`
- Every title tag suffix: `| Task Bee` → `| Admoran`

**The `spec.md` §3 wordmark instruction is void.** It specified building a "Task Bee" Fraunces wordmark. Admoran has a real logo. See §2.1.

---

## 2. Brand and design system

**This section supersedes `spec.md` §5 and `changes.md` §6 in full.**

### 2.1 Why this changes

Build A's design system — background `#FAF7F2`, Fraunces display serif, terracotta accent `#D4622A` — is, precisely, the most common AI-generated design signature currently in circulation: warm cream, high-contrast serif, warm-clay accent. For a site whose entire argument is *"you found this through search, and this is what I build,"* looking machine-generated is a real cost. Admoran has brand colours that are better than the defaults and carry existing recognition through the GBP and 60 backlinks. Use them.

### 2.2 Palette

```css
@theme {
  --color-paper:  #F4F6F9;  /* page background — cool off-white */
  --color-panel:  #FFFFFF;  /* cards, product sections */
  --color-tint:   #E3F0F9;  /* single emphasis block per page */
  --color-ink:    #1A3156;  /* text primary, CTAs — from logo */
  --color-muted:  #5A6B85;  /* secondary text */
  --color-accent: #2E9ED7;  /* from logo — LARGE ELEMENTS ONLY, see below */
  --color-deep:   #0F1E36;  /* inverted sections, footer */
  --color-line:   #DDE3EC;  /* hairlines, borders */
}
```

**Hard constraint on `--color-accent`.** `#2E9ED7` on `--color-paper` is 2.85:1. White on `#2E9ED7` is 3.03:1. Both fail WCAG AA for normal-size text.

- **Allowed:** large decorative fills, rules and underlines, icon strokes, chart and diagram elements, section dividers, hover states on navy surfaces, headings at 24px+ bold (which clears the 3:1 large-text threshold).
- **Forbidden:** body text, link text, button labels, form labels, any text below 24px.

**CTAs are navy.** `--color-ink` fill, white label — 12.2:1, comfortably AA. Do not introduce a third hue to make buttons pop; the navy is strong enough, and a third hue is how this drifts back toward template.

### 2.3 Typography

Replace Fraunces. Self-host all three via `@fontsource`.

- **Display:** Bricolage Grotesque, 600. Headings only. Its variable width gives H1s real presence without the serif-on-cream tell.
- **Body:** Inter, 400/500. 16–17px base, 1.65 line-height. Keep — already wired, and it is a genuine workhorse.
- **Numerals:** IBM Plex Mono, 500. **This is the signature element.** Every price, every metric, every turnaround figure, every ranking number is set in mono. `KES 45,000` reads as a fact rather than a marketing number, which is exactly the argument the pricing strategy is making. Applies to: pricing tiers, the case study metrics, turnaround days, retainer terms.

Do not apply mono anywhere else. One signature, used consistently.

### 2.4 Logo

Use the ADMORAN wordmark. **Drop the swoosh mark** — it reads as 2015 agency template and fights everything else on the page. Wordmark in `--color-ink` at 140px wide in the nav, 180px in the footer. If Vincent wants the swoosh retained, that is his call, but ask rather than assume.

**Favicon:** letter A in `--color-paper` on `--color-ink`, as SVG.

### 2.5 Section rhythm

Supersedes `changes.md` §6. Three surfaces, in rotation:

- `paper` — hero, prose sections, About
- `panel` — pricing, service detail, FAQ, comparison tables
- `tint` — exactly once per page, on the single highest-emphasis block
- `deep` — footer only, plus at most one full-bleed inverted section on the homepage

No gradients. No borders between sections — the background change is the separation.

### 2.6 Imagery

`spec.md` §5's rules stand and are now load-bearing, because this build has a portfolio. **No stock illustration.** The current admoran homepage is built on exactly the "person with laptop next to a rocket" library that spec.md bans; none of it survives the migration.

Portfolio screenshots are the only decorative imagery on the site. Shoot all 19 at identical viewport and treatment. `<Image />` with WebP, explicit width/height, lazy below the fold.

---

## 3. Sitemap

```
/                                          Home
/about/                                    Vincent, personal-brand-forward
/contact/
/pricing/                                  all prices, both service lines

/seo-services/                             hub + "SEO services Kenya"
/seo-services/seo-audit/                   KES 35,000
/seo-services/local-seo/                   KES 25,000 GBP Rescue + local SEO
/seo-services/seo-retainer/                KES 45,000 / 75,000 per month

/web-design/                               hub AND service page
/web-design/website-redesign/              SEO-foundation angle
/web-design/ecommerce/                     gated, KES 150,000+

/work/                                     portfolio index, all 19
/work/decl/                                full case study
/work/{slug}/                              18 further project pages

/industries/dental-website-design-kenya/
/industries/ngo-website-design-kenya/
/industries/school-website-design-kenya/

/guides/                                   index (new — see §8.9)
/guides/{slug}/                            15 guides
/map/                                      zoom map visualisation

/privacy/  /terms/  /404/
```

### 3.1 URL decisions, recorded

- **`/seo-services/` not `/services/`.** Two head terms — "SEO services Kenya" and "web design Kenya" — need two hubs. A shared `/services/` parent can rank for neither. This supersedes `changes.md` §1.
- **`/web-design/` matches the legacy WordPress URL exactly.** Whatever equity that page holds is preserved without a redirect hop. Do not rename it.
- **Guides stay flat at `/guides/{slug}`.** `taskbee-zoom-spec.md` §2.2 is binding — no zoom in the path, no frame in the path. Slugs are unchanged from Build B.
- **`/work/{slug}` not `/portfolio/{slug}`.** The H1 on `/work/` carries the word "portfolio"; the URL stays short.

### 3.2 Navigation

```
[ADMORAN]   SEO ▾   Web Design ▾   Work   Guides   Pricing   About   [WhatsApp]
```

`SEO ▾` → the three SEO service pages. `Web Design ▾` → the three web pages. Both dropdowns are CSS-only, no JS. Mobile: hamburger, full-height panel, the existing ~10-line vanilla toggle from Build A.

Contact is not in the nav — the WhatsApp button is the contact CTA, and `/contact/` lives in the footer. Industries are not in the nav; they are reached from `/web-design/` and `/work/`.

---

## 4. Redirect map

Extracted from `admoranmarketing_WordPress_2026-08-08.xml`. This is the complete set of published URLs on the live site — 11 pages, 3 posts, 2 projects.

Implement as a Cloudflare Pages `_redirects` file in `public/`. All 301 unless noted.

```
/about-us/                                              /about/                        301
/contact-us/                                            /contact/                      301
/seo/                                                   /seo-services/                 301
/content-marketing/                                     /seo-services/seo-retainer/    301
/blog/                                                  /guides/                       301
/resources-2/                                           /guides/                       301
/case-studies/                                          /work/                         301
/our-work/                                              /work/                         301
/project/decl-website/                                  /work/decl/                    301
/project/smile-dent/                                    /work/smile-dent/              301
/the-art-of-seo-driving-organic-growth-for-your-business/   /guides/seo-in-kenya/      301
/hello-world/                                           /guides/seo-in-kenya/          301
/social-media-mastery-your-agencys-secret-weapon/       /guides/seo-in-kenya/          301
```

**`/web-design/` is not redirected.** It is the same URL in the new build.

**Three URLs need a decision before launch — flag to Vincent, do not guess:**

```
/social-media-marketing/     1,328 words — service discontinued
/email-marketing/            1,530 words — service discontinued
/marketing-automation/       1,437 words — service discontinued
```

There is no equivalent page. A 301 to an unrelated page is treated as a soft 404 and passes nothing. **Check each in GSC and any backlink tool first.** If a URL has referring domains, 301 it to `/seo-services/`. If it has none, return **410 Gone** — it is cleaner than a soft 404 and tells Google the removal was intentional.

### 4.1 Content to salvage before the WordPress site comes down

The export contains real, usable prose. Mine it rather than rewriting from nothing:

| Source | Words | Use |
|---|---|---|
| `/project/decl-website/` | 600 | Raw material for the `/work/decl/` case study (§8.7) |
| `/project/smile-dent/` | 582 | Second case study, week 2 — already written, needs metrics |
| `/web-design/` | 1,788 | Raw material for `/web-design/` — rewrite in first person |
| `/seo/` | 2,153 | Cross-check against Build A's SEO pages for anything worth keeping |
| `/the-art-of-seo…/` | 1,859 | Check for salvageable sections; likely superseded by the guides |

All of it is currently in agency "we" voice. Rewrite to first person per §6.

### 4.2 DNS and mail

Before pointing admoran.com at Cloudflare Pages, **export the existing MX records**. If mail runs on the current host and MX is not carried across, email dies silently and without an error anywhere. Verify mail delivery after the cutover, not before.

Do not delete the WordPress installation until the new site has been live and indexed for 30 days.

---

## 5. Staged publishing

The full build is larger than the publishable set. Handle this with content status, not by deleting pages.

- Keep `NOINDEX` in `src/consts.ts` as the single global switch. It stays `true` for the whole full-build phase.
- Add a per-page `draft` frontmatter flag / prop. Any page with `draft: true` emits `<meta name="robots" content="noindex, nofollow">` and is excluded from the sitemap, regardless of the global switch.
- At publish time: set `NOINDEX = false`, then set `draft: false` only on the pages being published. Everything else stays built, visible at its URL, and invisible to search.
- **`robots.txt` must not disallow anything at launch.** Build B's blanket-disallow file is a test artefact. Delete it. Indexing control is via per-page robots meta only — a `Disallow` prevents crawling, which prevents Google from ever seeing the `noindex`.

**Suggested publish-first set:** `/`, `/about/`, `/contact/`, the four SEO pages, `/web-design/`, `/work/`, `/work/decl/`, and the 15 guides. Hold `/pricing/`, the two web-design children, the three industry pages, and the 18 thin project pages until they have real content.

---

## 6. Voice

First person, singular. "I", never "we".

This is a change from every word currently on admoran.com, which speaks as an agency with a team. It is also a change from the two project pages in the export ("Admoran Marketing approached…", "We delivered…"). Rewrite all of it.

Admoran is the trading name; Vincent is the practitioner. The existing GBP reviews referencing "Vincent and his Admoran team" are historical and do not contradict this — they are testimony about past work, not a claim on the current page.

`spec.md` §13's banned-words list stands in full. Add: **never describe the practice as an agency** in first-party copy.

---

## 7. Keyword assignment

### 7.1 A warning that must be respected

Two keyword sources exist for this build:

- **Verified** — the Google Keyword Planner pull behind `changes.md` §3, Kenya geo, SEO terms. Trustworthy.
- **Unverified** — the 100-term Kenyan web design list. It cites blog posts and hosting-company pages rather than Keyword Planner, its volumes are implausibly round, and it contains obvious synthesis artefacts. **It has not been verified.**

The unverified list is genuinely useful for **intent discovery and relative ordering** — it surfaces real query shapes (pricing anxiety, freelancer-vs-agency, M-Pesa integration, industry modifiers) that match the portfolio. Use it for that.

**Do not put an unverified volume figure into any planning artefact, and do not select a page or write a title tag on the strength of one.** `spec.md` §11.2 and `taskbee-zoom-spec.md` §11.2 both prohibit inventing data; this is that rule. Vincent verifies the top 20 web design terms in Keyword Planner before title tags are finalised. Until then, mark every web-design volume in any generated file as `unverified`.

The separate 782-row CSV pull is not usable for this either — it contains zero Kenya-modified terms and buckets at 5000/500/50/0, which is ordinal, not cardinal.

### 7.2 Assignment table

SEO-side assignments are unchanged from `changes.md` §3. Web-side primaries are the query shapes to target; volumes pending verification.

| Page | Primary | Secondary |
|---|---|---|
| `/` | SEO services in Kenya | web design Kenya, SEO consultant Nairobi |
| `/seo-services/` | SEO services Kenya | SEO packages Kenya, SEO pricing Kenya |
| `/seo-services/seo-audit/` | SEO audit services Kenya | professional SEO audit Nairobi |
| `/seo-services/local-seo/` | local SEO services Kenya | Google Business Profile optimization Kenya |
| `/seo-services/seo-retainer/` | SEO packages Kenya | monthly SEO Kenya, SEO services in Nairobi |
| `/web-design/` | web design Kenya | web design Nairobi, website design Kenya, freelance web designer Kenya |
| `/web-design/website-redesign/` | website redesign services Nairobi | website redesign SEO, SEO friendly web design |
| `/web-design/ecommerce/` | ecommerce website design Kenya | M-Pesa integration web design, online shop designer Nairobi |
| `/pricing/` | website design cost in Kenya | web design price in Kenya, SEO pricing Kenya, web design packages Kenya |
| `/work/` | web design portfolio Kenya | — |
| `/industries/dental-website-design-kenya/` | dental website design Kenya | dentist website Nairobi |
| `/industries/ngo-website-design-kenya/` | NGO website design Kenya | church website design Kenya |
| `/industries/school-website-design-kenya/` | school website design Kenya | — |
| `/about/` | SEO consultant Kenya | web designer Nairobi, freelance web designer Kenya |
| `/guides/{slug}` | per `taskbee-zoom-spec.md` §6.3 | unchanged |

**Deliberately not targeted:** education and jobs queries ("web design courses in Nairobi", "web design jobs in Nairobi"), and DIY queries ("how to build a website in Kenya", "best website builders in Kenya"). High volume, wrong audience — students and self-builders, not buyers. They would attract traffic that never converts and would dilute the commercial signal on the whole domain.

---

## 8. Page briefs — new pages only

The seven pages from Build A and the 15 guides from Build B are already specified. What follows covers what does not yet exist.

### 8.1 `/web-design/` — hub and service page (~1,300 words)

This page does double duty: it ranks for the head term and it sells the KES 50,000+ build.

**H1:** `Web design in Kenya, built on an SEO foundation.`

**Sections:**

1. **Hero** — H1, sub-headline naming the wedge: most Kenyan websites are built by designers who hand over something that looks fine and cannot be found. Price entry point and typical turnaround in mono. WhatsApp CTA.
2. **The argument** (~200 words) — a website that ranks and a website that looks good are not the same project, and the second one is what most buyers get. Structure, speed, schema, and URL design are decided at build time and are expensive to retrofit. Reference `/web-design/website-redesign/` as what happens when they were not.
3. **What you get** (~250 words) — concrete deliverables: page count, responsive, hosting setup, SSL, GBP connection, Analytics and Search Console configured, schema, sitemap, page speed target. Each with a line of context, not a bare label.
4. **How I build** (~200 words) — the actual process with day ranges. Mono for the numbers.
5. **Stack, honestly** (~150 words) — Astro for most builds, WordPress when the client genuinely needs to edit their own content. Explain the tradeoff plainly rather than evangelising. This intercepts "wordpress web design Kenya" honestly.
6. **Recent work** — six portfolio cards pulled from `src/data/projects.ts`, linking to `/work/`.
7. **Industry links** — inline, to the three `/industries/` pages.
8. **Price** (~120 words) — from KES 50,000, what moves the number, what is out of scope. Link to `/pricing/`.
9. **FAQ** (6 questions) — how much does a website cost in Kenya · how long does it take · do I own the site and domain · what about hosting and maintenance · can I update it myself · do you do logos and branding *(answer: no — say so plainly)*.
10. **Cross-links + CTA** — to redesign, to ecommerce, to `/seo-services/`.

**JSON-LD:** `Service`, `serviceType: Web Design`, `areaServed: Kenya`, `offers.price` from 50000 KES.

### 8.2 `/web-design/website-redesign/` (~900 words)

**H1:** `Website redesign that fixes what search can see.`

The buyer here has a site and knows it is not working. The distinctive angle — and the one that connects both service lines — is that a redesign is the cheapest moment to fix structural SEO, and the most common moment to destroy it.

Cover: when a redesign is worth it and when a rebuild is cheaper; what breaks during a redesign (URL changes without redirects, lost internal links, content cut for visual cleanliness, schema dropped); the pre-redesign inventory; the migration checklist. Price and turnaround in mono. FAQ: will I lose my rankings · can you redesign without changing my URLs · what happens to my old content · do I need to move hosting.

Cross-link to `/seo-services/seo-audit/` as the honest first step when the buyer is unsure whether a redesign is the actual problem.

### 8.3 `/web-design/ecommerce/` (~800 words)

**H1:** `Ecommerce website design in Kenya.`

Deliberately gated. From KES 150,000, stated in the first screen. The page's job is as much to filter as to sell.

Cover: what an ecommerce build actually involves versus a brochure site; payment integration including M-Pesa (this is a genuine local query shape); product data and catalogue management as ongoing client work, not a one-off; platform options and the honest tradeoffs; what is explicitly not included (photography, copywriting, catalogue entry, ongoing stock management). Portfolio cards for the ecommerce projects.

FAQ: how much does an ecommerce site cost in Kenya · can you integrate M-Pesa · Shopify or WooCommerce · who manages products after launch · do you handle product photography.

### 8.4 `/work/` — portfolio index (~500 words plus cards)

**H1:** `Web design portfolio — 19 sites built in Kenya.`

Filterable by industry, CSS-only via a `:has()` or checkbox-hack pattern, no JS. Cards render from `src/data/projects.ts` (§9.1): screenshot, name, industry tag, one-line description, live link.

Cards for projects flagged `hasPage: true` link to their `/work/{slug}/` page. The rest link out to the live site only. This is intentional — see §8.6.

Label `weyntech.com`, `kongokega.com` and `dobatron.com` as own products, not client work. `dobatron.com` is excluded entirely until it ships.

### 8.5 `/work/decl/` — the case study

**This is the only full case study in the build**, and it carries the credibility of the whole portfolio. Build it properly.

Source material: the 600-word `/project/decl-website/` page in the WordPress export. Rewrite entirely — the existing version is agency-voice, has no metrics, and buries the result.

**Structure:**

1. **Header** — client, sector, what was built, live link to decl.co.ke. Screenshot.
2. **Result, first** (~100 words) — the numbers, in mono, above everything else. Do not make the reader scroll to the outcome.
3. **The situation** (~150 words) — DECL is an environmental consultancy specialising in ESIA and Environmental Audit. Founder Godfrey Njugi had no online presence and no organic lead channel. ESIA and EA are high-consideration, search-led purchases — a procurement officer or developer searching for a licensed consultant is exactly the buyer who converts from organic.
4. **What I did** (~250 words) — design, structure, keyword targeting, technical setup, Analytics and Search Console. Specific, not a bulleted list of nouns.
5. **What happened** (~200 words) — rankings and lead attribution, with sourcing per the rule below.
6. **What I would do differently** (~100 words) — include this. A case study with no self-criticism reads as marketing; one with a genuine limitation reads as a practitioner's account, and it is the section that will be believed.
7. **CTA** — to `/web-design/` and WhatsApp.

**Evidence rules — binding.**

Two claims exist for this case study, and they have different evidential status:

- *"Ranks top 3 for most keywords on environmental audit and impact assessment"* — **verifiable.** Before publish, Vincent must produce a dated GSC screenshot or ranking export listing the specific queries and positions. The page then names those queries explicitly. A vague "ranks for most keywords" is unverifiable by the reader and reads as a claim rather than a result.
- *"70% of leads come from the website"* — **owner-reported, not measured.** It must be attributed as such in the copy: *"Godfrey estimates that around 70% of the firm's enquiries now come through the site."* Do not present it as an analytics figure, do not put it in a metric card next to measured numbers, and do not put it in the meta description.

If the ranking evidence cannot be produced, the page ships without the ranking claim. `spec.md` §11.2 — never invent — applies with more force here than anywhere else on the site, because this is the page that asks to be trusted.

**JSON-LD:** `Article` with `about` referencing the `Service`. Not `Review` — Vincent is not a third party reviewing his own work.

### 8.6 `/work/{slug}/` — the other 18

Short pages, 250–400 words each: what the client does, what was built, what was distinctive about the project, screenshot, live link. No invented metrics — most of these have none, and saying so is fine.

**Thin-content warning.** Eighteen near-identical short pages in one directory is a quality signal Google reads across the whole folder. Two mitigations, both required:

1. Only give a page to projects with something genuinely specific to say. In `src/data/projects.ts`, `hasPage: false` means the project renders as a card on `/work/` and nothing more. Start with `hasPage: true` on six to eight and add as content is written.
2. Every project page links to its relevant `/industries/` page and to the service that produced it. A page that is a leaf with no outbound relevance is what gets classified as thin.

Pages with `hasPage: true` but no written body must ship with `draft: true` (§5).

### 8.7 `/industries/{slug}/` — three pages (~700 words each)

Same structure, different evidence:

- **Dental** — four clinics built: Arrow Dental, Jamii Smiles, Smile Dent, Enamel Elegance. The strongest vertical on the site by a distance, and no competitor in that SERP has four clinics to show. Cover what dental clinics specifically need: appointment booking, service pages that match how patients search, multi-branch GBP handling, SHA coverage content, and local Maps ranking. Links to the four project pages and to `/seo-services/local-seo/`.
- **NGO and nonprofit** — the three `.org` builds. Different buyer entirely: boards, grant reporting, donor trust signals, and often a fixed budget with a deadline attached to a funding cycle.
- **Schools and institutions** — the education builds. Admissions-driven, seasonal search patterns, parent as the searcher.

Each: H1 with the industry query shape, the argument for why the vertical is different, the portfolio evidence, what is included, price entry, three to four FAQs, CTA.

**Vincent must confirm the industry classification of all 19 projects before these are written.** Only Smile Dent and DECL are confirmed from the export; the rest are inferred from domain names and are not reliable enough to publish.

### 8.8 `/pricing/` (~900 words)

Every price on the site, in one place, in mono. Targets "website design cost in Kenya" and "web design price in Kenya", which are among the highest-intent Kenyan queries in the entire set and which almost every competitor refuses to answer.

Three blocks — SEO, web design, ecommerce — each with what is included at that price, what moves it up, and what is out of scope. Then a section on what the Kenyan market actually charges and why the cheap tier is cheap. That section is the reason someone links to this page.

Cross-link to `/guides/seo-cost-kenya` for the informational treatment. This page is commercial; that guide is not. See §7.3 below.

### 8.9 `/guides/` — index page (new)

Build B has no `/guides/` index — its `index.astro` redirected to the pillar. With `/blog/` and `/resources-2/` both redirecting here, the URL must resolve to something real.

Make it the map's front door, not a blog roll: the pillar prominently, then the four zoom-2 categories with their children grouped beneath, then the by-concern index. Reuse `ChildrenBlock` and `ByConcern` rather than writing new components. `Article`/`CollectionPage` schema.

---

## 9. Intent split — guides versus services

The merge creates direct collisions: `/guides/seo-audit` against `/seo-services/seo-audit/`, `/guides/google-business-profile` against `/seo-services/local-seo/`, `/guides/seo-cost-kenya` against `/pricing/`. Unmanaged, these cannibalise each other.

### 9.1 Reversal of Change Order 02 §9

Change Order 02 §9 states that *"commercial surfaces belong on `hiring-an-seo`, `seo-cost-kenya` and `seo-audit`."* That was correct in a build with no service pages. **It is now wrong and is reversed.** Those three guides are informational pages that route to commercial pages. They do not carry pricing tables, tier comparisons, or booking CTAs.

This does not alter the link graph — the frame block and by-concern index are unchanged, and the guide-to-service links are new outbound links to pages outside the collection, which `graph.ts` does not count. `shape.json` must still be identical (§11).

### 9.2 Enforcement

**Title and H1 modifiers.** Informational pages take *how, what, guide, checklist, cost breakdown*. Commercial pages take *services, hire, pricing, packages, Nairobi/Kenya + service noun*. No two pages on the domain share a primary keyword.

| Guide | Service |
|---|---|
| `/guides/seo-audit` → "How to run an SEO audit on a Kenyan website" | `/seo-services/seo-audit/` → "SEO Audit Services in Kenya — KES 35,000" |
| `/guides/google-business-profile` → "How to set up and optimise a Google Business Profile in Kenya" | `/seo-services/local-seo/` → "Local SEO Services in Kenya" |
| `/guides/seo-cost-kenya` → "How much does SEO cost in Kenya? A price breakdown" | `/pricing/` → "Pricing — SEO and Web Design" |

**Linking.** Guides link down to services with commercial anchor text, once mid-body and once at the end. Services link back to guides with informational anchor text, from the FAQ or process section only — not from the hero, which must stay commercial.

**Schema.** Guides emit `Article` or `HowTo`. Service pages emit `Service` or `ProfessionalService` with `provider`, `areaServed`, and `offers`. No page emits both.

**Layout.** Guides lead with the answer, then the table of contents, then the body. Service pages lead with the offer, the price, and the CTA. The layouts must be visibly different — the difference is a signal in itself.

---

## 10. Data files

Create in `src/data/`:

### 10.1 `projects.ts`

```ts
export interface Project {
  slug: string;
  name: string;
  url: string;              // live site
  industry: string;         // drives /work/ filter + industry pages
  kind: 'client' | 'own';
  services: ('web-design' | 'redesign' | 'ecommerce' | 'seo')[];
  year: number;
  blurb: string;            // one line for the card
  screenshot: string;
  hasPage: boolean;         // false = card only, no /work/{slug}/
  featured: boolean;        // surfaces on / and /web-design/
}
```

Nineteen entries. Confirmed from the WordPress export: `smiledent.co.ke` is a Nakuru dental clinic; `decl.co.ke` is an environmental consultancy. **Every other `industry` value is unconfirmed** — leave it as `'UNCONFIRMED'` and let the build fail validation rather than guessing. Vincent fills them in.

`dobatron.com` is omitted from this file until it ships.

### 10.2 `faqs.ts`

Extend the existing file with `webDesignFaqs`, `redesignFaqs`, `ecommerceFaqs`, `pricingFaqs`, and one export per industry page. Existing exports unchanged.

### 10.3 `pricing.ts`

Single source of truth for every price on the site. Every price displayed anywhere reads from here. Nothing is hard-coded into a template — a price that appears in three places and is edited in one is the most likely correctness bug in this build.

---

## 11. Verification

1. `npm run build` succeeds. `validate.mjs` reports zero FAILs.
2. **`dist/_reports/shape.json` graph numbers are identical to the pre-merge Build B baseline.** No edge moved. If they changed, a guide's body lost an inline link during the move, or `graph.ts` was touched. Investigate before continuing — this is the loop-count experiment and it is the primary research output of Build B.
3. All six frames still satisfy the two-zoom-level invariant (`invariants.json`).
4. Zero occurrences of `taskbee`, `Task Bee`, or `taskbee.co.ke` anywhere in `dist/` — including inside JSON-LD.
5. Zero occurrences of `#FAF7F2`, `#D4622A`, or `Fraunces` in the built CSS.
6. `robots.txt` disallows nothing.
7. Every page with `draft: true` emits `noindex` and is absent from `sitemap-index.xml`. Every page with `draft: false` is present.
8. Every redirect in §4 resolves in one hop to a 200. No chains, no loops.
9. Contrast audit: no text below 24px is rendered in `#2E9ED7` anywhere.
10. Lighthouse mobile on `/`, `/web-design/`, `/work/`, `/work/decl/`, and one guide: Performance 100, SEO 100, Accessibility ≥95, Best Practices 100.
11. Every price on the site traces back to `src/data/pricing.ts`.
12. WhatsApp CTA tested on a real device, with the pre-filled message.
13. Mail delivery to the admoran.com domain confirmed working after DNS cutover.

---

## 12. Report back

- Confirmation that `shape.json` is unchanged, with the before and after numbers.
- The Tailwind v3→v4 conversion: which classes broke and what they became. This is the highest-risk mechanical step and the record is worth having.
- Any page where the guides-versus-services intent split still feels forced after building it — where the guide wants to sell, or the service page has nothing to link down to. That is a structural finding, not a copy problem.
- Whether the two-column zoom-1 pillar layout survived contact with Build A's `Layout.astro` or needed restructuring.
- The complete list of unconfirmed `industry` values Vincent still needs to fill.

---

## 13. Open decisions for Vincent

Blocking:

- [ ] Industry classification for 17 of 19 projects (§10.1)
- [ ] Ranking evidence for the DECL case study — dated GSC export with named queries (§8.5)
- [ ] Backlink check on the three discontinued service URLs → 301 or 410 (§4)
- [ ] Contact email on the admoran.com domain
- [ ] Swoosh: dropped or retained (§2.4)

Before publish:

- [ ] Keyword Planner verification of the top 20 web design terms (§7.1)
- [ ] Client consent for logo and screenshot use
- [ ] Headshot, LinkedIn URL for `sameAs`
- [ ] Which pages go in the publish-first set (§5)

---

## 14. Explicitly not in this build

Recorded so they do not arrive later by drift:

- **No location pages.** No `/seo-services-nairobi/`. The homepage, the GBP, and schema carry Nairobi. A separate Nairobi page cannibalises the hubs.
- **No separate `/case-studies/` section.** One `/work/` collection; case studies are the members of it that have metrics.
- **No blog separate from `/guides/`.** The zoom map is the content system. A parallel blog would fork it and recreate the cannibalisation the framework exists to prevent.
- **No web-design pillar in the zoom map yet.** A second zoom-1 root is a genuine v0.2 stress test — whether `graph.ts`, `map.astro` and `ByConcern` survive multiple roots is unknown. Worth running deliberately, as its own experiment, not as a side effect of a site build.
- **No indexed blog category or tag pages.**
- **No dobatron.com in the portfolio** until it ships.
