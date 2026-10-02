import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { FRAMES } from './lib/frames.generated.ts';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    zoom: z.number().int().min(1).max(4),
    parents: z.array(z.string()).default([]),
    status: z.enum(['stub', 'draft', 'published']),
    primary_parent: z.string().optional(),
    frames: z.array(z.enum(FRAMES)).max(2).default([]),
    related: z.array(z.string()).default([]),
    child_order: z.array(z.string()).default([]),
    summary: z.string().optional(),
    description: z.string().optional(),
    targets: z.array(z.string()).default([]),
  }),
});

export const collections = { guides };
