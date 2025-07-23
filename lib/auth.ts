import type { User } from "better-auth";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";

import env from "~/lib/env";

import db from "./db/index";

export type UserWithId = Omit<User, "id"> & {
  id: number;
};
export const auth = betterAuth({
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/get-session") {
        if (!ctx.context.session) {
          return ctx.json({
            session: null,
            user: null,
          });
        }
        return ctx.json(ctx.context.session);
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});
