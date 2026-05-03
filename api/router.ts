import { authRouter } from "./auth-router";
import { productsRouter } from "./routers/products";
import { ordersRouter } from "./routers/orders";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  products: productsRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
