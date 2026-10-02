---
title: "Structured Data: What It Is and What It Does"
slug: structured-data-basics
zoom: 4
parents: [technical-seo, ai-search-visibility]
primary_parent: technical-seo
status: published
frames: [diy, proof]
summary: "What schema markup is, what it can and cannot do for visibility, and the handful of types most Kenyan businesses actually need."
description: "What structured data is, what it does and doesn't do for search visibility, and the schema types most Kenyan businesses actually need."
targets: ["structured data seo", "google rich results", "entity seo", "semantic seo"]
---

Structured data is a set of machine-readable statements about what a page contains, written in a standard format search engines can parse directly rather than infer from ordinary text.

## What it does, and what it does not do

What it does: makes a page eligible for rich results — star ratings, FAQ dropdowns, event details shown directly in search — and gives search engines clearer signals about the entities on a page and how they relate to each other, such as a business, its location, and the services it offers.

What it does not do: it is not a ranking factor on its own, and marking a page up with structured data does not make the underlying claims true. A business can mark itself up as offering five-star service; that markup states the claim, it does not verify it.

## The types most Kenyan businesses need

| Type | Use for |
|---|---|
| `LocalBusiness` | Any business with a physical location or service area |
| `Organization` | The business as an entity, independent of any one location |
| `Service` | A specific service offered, described on its own page |
| `FAQPage` | A page that answers several distinct questions in Q&A form |
| `Article` | A guide or blog-style page like this one |

Most Kenyan SME sites need no more than these five to cover the whole site.

## How to check it

Google's Rich Results Test checks a specific URL and reports whether it is eligible for any rich result types, and flags markup errors directly. Search Console's enhancement reports do the same across the whole site over time, and will show a drop in valid items if a template change accidentally breaks the markup somewhere.

<!-- frame:diy -->
## Can I just do this myself?

Plugin-generated structured data — common on WordPress sites — covers the basics correctly for standard page types but falls short on anything specific to the business: a plugin cannot know which of five service types a particular page describes, or what a specific FAQ actually says, without configuration.

Hand-written markup, added directly to the page template or through a tag manager, takes more setup but matches the actual content precisely and is easier to debug when the Rich Results Test flags an error, because there is one clear source instead of a plugin's generated output to trace back through.
<!-- /frame -->

<!-- frame:proof -->
## Does this actually work?

Verification here is direct and immediate, unusually so for SEO work: paste the URL into the Rich Results Test and get a pass or fail with the specific error named, in seconds. This is a rare case in SEO where cause and effect can be checked directly rather than inferred from a trend over weeks.

What structured data cannot verify is the underlying claim. Marking a business up as a `LocalBusiness` with a five-star aggregate rating is a claim about itself, not corroboration from anyone else, and it does not by itself place a business in a knowledge graph or guarantee any AI system treats it as an established fact.
<!-- /frame -->
