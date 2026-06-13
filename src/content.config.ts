import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.union([z.string(), z.date()]).optional(),
    draft: z.boolean().default(false),
    slug: z.string().optional(),
  }),
});

export const collections = { blog };
