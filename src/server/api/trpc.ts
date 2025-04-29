import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/server/db";

/**
 * 1. CONTEXT
 * This function builds the context used in all tRPC procedures.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { userId } = await auth(); // Clerk auth
  return {
    db,
    userId,
    ...opts,
  };
};

/**
 * 2. INITIALIZE tRPC
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER / PROCEDURE FACTORIES
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * 4. Timing Middleware (optional dev feature)
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (process.env.NODE_ENV === "development") {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();
  const end = Date.now();

  console.log(`[tRPC] ${path} took ${end - start}ms`);

  return result;
});

/**
 * 5. Authentication Middleware
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }
  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});

/**
 * 6. Protected procedure
 */
export const protectedProcedure = t.procedure
  .use(isAuthed)
  .use(timingMiddleware);

/**
 * 7. Caller Factory (for SSR or server-side tRPC calls)
 */
export const createCallerFactory = t.createCallerFactory;
