import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    audio: z.boolean().optional(),
    poem_type: z.enum(["ci", "shi", "guti"]).optional(),
    cipai: z.string().optional(),
    period: z.enum(["早期", "革命时期", "建国后"]).optional(),
  }),
});

export const collections = { articles };
