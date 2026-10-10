import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const resources = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/resources' }),
  schema: z.object({
    name: z.string(),
    enName: z.string().optional(),
    url: z.string().url(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    pricing: z.string(),
    pricingType: z.enum(['free', 'freemium', 'open-source', 'paid']),
    platforms: z.string().optional(),
    summary: z.string(),
    featured: z.boolean().default(false),
    added: z.coerce.date(),
    verifiedDate: z.coerce.date(),
  }),
});

const collectionsCol = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/collections' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().default('📦'),
    featured: z.boolean().default(false),
    resources: z.array(z.string()),
  }),
});

export const collections = { resources, collections: collectionsCol };
