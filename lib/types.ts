import type { User as BetterAuthUser } from "better-auth";

type User = Omit<BetterAuthUser, "id"> & { id: number };

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: User;
  }
}
