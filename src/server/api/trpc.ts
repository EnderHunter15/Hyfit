import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createTRPCContext = (_opts: FetchCreateContextFnOptions) => {
  return _opts;
};

const t = initTRPC.create();
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
