import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { orders, orderItems } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const ordersRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            sku: z.string(),
            name: z.string(),
            price: z.number(),
            qty: z.number(),
            brand: z.string(),
          })
        ),
        total: z.number(),
        shipping: z.number(),
        tax: z.number(),
        email: z.string().email(),
        name: z.string(),
        surname: z.string(),
        company: z.string().optional(),
        address: z.string(),
        postalCode: z.string(),
        city: z.string(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;
      const orderNumber = `BP-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

      const inserted = await db.insert(orders).values({
        userId,
        orderNumber,
        total: input.total.toString(),
        shipping: input.shipping.toString(),
        tax: input.tax.toString(),
        email: input.email,
        name: input.name,
        surname: input.surname,
        company: input.company || null,
        address: input.address,
        postalCode: input.postalCode,
        city: input.city,
        phone: input.phone || null,
        status: "confirmed",
      }).$returningId();

      const orderId = inserted[0].id;

      await db.insert(orderItems).values(
        input.items.map((item) => ({
          orderId,
          productId: item.productId,
          sku: item.sku,
          name: item.name,
          price: item.price.toString(),
          qty: item.qty,
          brand: item.brand,
        }))
      );

      return { orderId, orderNumber };
    }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt));

    const result = [];
    for (const order of userOrders) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      result.push({
        ...order,
        total: Number(order.total),
        shipping: Number(order.shipping),
        tax: Number(order.tax),
        items: items.map((i) => ({
          ...i,
          price: Number(i.price),
        })),
      });
    }

    return result;
  }),

  byId: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (!rows[0] || rows[0].userId !== ctx.user.id) return null;

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, rows[0].id));

      return {
        ...rows[0],
        total: Number(rows[0].total),
        shipping: Number(rows[0].shipping),
        tax: Number(rows[0].tax),
        items: items.map((i) => ({
          ...i,
          price: Number(i.price),
        })),
      };
    }),
});
