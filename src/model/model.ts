import { z } from 'zod';

const linkSchema = z.object({
  href: z.string(),
});

export const petRequestSchema = z.object({
  name: z.string(),
  tag: z.string().nullish(),
  vaccinations: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional(),
});

export type PetRequest = z.infer<typeof petRequestSchema>;

export const petResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullish(),
  ...petRequestSchema.shape,
  _links: z
    .object({
      read: linkSchema.optional(),
      update: linkSchema.optional(),
      delete: linkSchema.optional(),
    })
    .optional(),
});

export type PetResponse = z.infer<typeof petResponseSchema>;

export const petFiltersSchema = z.object({
  name: z.string().optional(),
});

export type PetFilters = z.infer<typeof petFiltersSchema>;

export const petListSchema = z.object({
  offset: z.number(),
  limit: z.number(),
  count: z.number(),
  items: z.array(petResponseSchema),
  _links: z
    .object({
      create: linkSchema.optional(),
    })
    .optional(),
});

export type PetList = z.infer<typeof petListSchema>;
