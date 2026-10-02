---
title: "Technical SEO: The Foundations Everything Else Sits On"
slug: technical-seo
zoom: 2
parents: [seo-in-kenya]
status: published
frames: [risk, diy]
child_order: [seo-audit, doing-seo-yourself, structured-data-basics]
summary: "Crawling, indexing, speed and structure — the layer that decides whether any of your other SEO work can register at all."
description: "What technical SEO covers, the failures most common on Kenyan SME sites, and which parts a business owner can fix without help."
targets: ["technical seo", "on page seo", "off page seo", "site structure for seo"]
---

Content and links cannot compensate for a site Google cannot crawl, render, or index. Technical SEO is the layer that decides whether the rest of the work has anywhere to register, and it is where most Kenyan SME sites carry unresolved problems.

## Technical, on-page, and off-page SEO — the actual difference

**Technical SEO** covers how a search engine accesses and processes the site itself: crawling, indexing, rendering, speed, structure. It has nothing to do with the words on the page.

**On-page SEO** covers what is on a given page and how it is described: titles, headings, body content, internal links. It is about relevance and clarity for a specific page.

**Off-page SEO** covers signals from outside the site: links from other sites, mentions, citations, reviews. It is about trust and prominence earned elsewhere.

The three layers are independent but not equal in sequence. Off-page and on-page work spent on a site with unresolved technical problems is spent on a site that may not be indexed to receive the benefit.

## Crawling and indexing: the gate

A page has to be crawled before it can be indexed, and indexed before it can rank. If a page is not indexed, nothing downstream — content quality, keyword targeting, link building — has anything to act on. Checking indexation status in Search Console is the first diagnostic step for any site that "isn't showing up," and it usually answers the question in minutes.

## The common failure list for small Kenyan sites

A short list, roughly in order of how often these turn up on small business sites:

- Pages blocked in `robots.txt`, sometimes left over from a staging environment that never got un-blocked
- No sitemap submitted to Search Console, so Google has to discover pages by crawling links alone
- Duplicate content served at both `www` and non-`www`, or both `http` and `https`, with no canonical or redirect resolving it
- Heavy, uncompressed images loading on mobile connections that are frequently slower and less reliable than the developer's own connection
- Content rendered entirely by JavaScript that never resolves for a crawler, so the page looks empty even though a visitor sees content

Each of these is checkable directly: a `robots.txt` file is public, a sitemap's presence is visible in Search Console, duplicate URLs show up in a crawl, and Search Console's URL inspection tool renders a page the way Google sees it.

<!-- frame:risk -->
## Could this damage my site or waste my money?

Technical work done carelessly breaks things, and the failures are specific enough to name.

A botched redirect — redirecting every old URL to the homepage instead of its actual new equivalent — tells Google the whole site changed and can cost the accumulated trust of every individual page. An accidental `noindex` tag left on a page after launch, or copied across a template, silently removes that page from search results with no warning. A canonical loop, where page A points to page B as canonical and page B points back to page A, confuses which version should be indexed and can leave both out.

None of these are exotic. They are the ordinary result of a redirect map built in a hurry, a staging configuration pushed to production, or a template edited without checking what it controls elsewhere on the site.
<!-- /frame -->

<!-- frame:diy -->
## Can I just do this myself?

Some of this is genuinely doable without specialist help. Submitting a sitemap, checking `robots.txt` for accidental blocks, compressing images before upload, and fixing an obvious `www`/non-`www` duplication are within reach of a competent business owner with an afternoon and a Search Console account.

Diagnosing a crawl problem is a different task. Reading a full site crawl, telling a real indexing problem apart from a false alarm, and prioritising fixes by actual impact takes someone who does this regularly — the risk of an untrained fix making things worse, covered above, is highest exactly here. [Doing SEO yourself](/guides/doing-seo-yourself) sets out the fuller split between the two.
<!-- /frame -->
