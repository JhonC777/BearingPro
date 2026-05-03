import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { products, categories } from "@db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

const listInput = z.object({
  query: z.string().optional(),
  categoryId: z.number().optional(),
  brand: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
  sortBy: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(12),
});

export const productsRouter = createRouter({
  list: publicQuery
    .input(listInput)
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input.query) {
        const q = `%${input.query.toLowerCase()}%`;
        conditions.push(sql`LOWER(${products.name}) LIKE ${q} OR LOWER(${products.sku}) LIKE ${q} OR LOWER(${products.brand}) LIKE ${q}`);
      }
      if (input.categoryId) {
        conditions.push(eq(products.categoryId, input.categoryId));
      }
      if (input.brand) {
        conditions.push(eq(products.brand, input.brand));
      }
      if (input.minPrice !== undefined) {
        conditions.push(gte(products.price, input.minPrice.toString()));
      }
      if (input.maxPrice !== undefined) {
        conditions.push(lte(products.price, input.maxPrice.toString()));
      }
      if (input.inStock) {
        conditions.push(gte(products.stock, 1));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const allProducts = await db.select().from(products).where(where);

      let result = allProducts.map((p) => ({
        ...p,
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        rating: Number(p.rating),
        specs: p.specs ? JSON.parse(p.specs) : {},
        tags: p.tags ? p.tags.split(",") : [],
        bestSeller: !!p.bestSeller,
      }));

      switch (input.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
      }

      const total = result.length;
      const start = (input.page - 1) * input.limit;
      const paginated = result.slice(start, start + input.limit);

      return { products: paginated, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(products).where(eq(products.slug, input.slug)).limit(1);
      if (!rows[0]) return null;
      const p = rows[0];
      return {
        ...p,
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        rating: Number(p.rating),
        specs: p.specs ? JSON.parse(p.specs) : {},
        tags: p.tags ? p.tags.split(",") : [],
        bestSeller: !!p.bestSeller,
      };
    }),

  categories: publicQuery.query(async () => {
    const db = getDb();
    const cats = await db.select().from(categories);
    return cats;
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      if (!rows[0]) return null;
      const p = rows[0];
      return {
        ...p,
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        rating: Number(p.rating),
        specs: p.specs ? JSON.parse(p.specs) : {},
        tags: p.tags ? p.tags.split(",") : [],
        bestSeller: !!p.bestSeller,
      };
    }),
});
