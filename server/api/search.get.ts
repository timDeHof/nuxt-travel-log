import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import SendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);

    if (!result.success) {
      return SendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "nuxt-travel-log | ttdehof@gmail.com",
        },
      });
      if (!response.ok) {
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: "Unable to reach search API.",
        }));
      }
      const results = await response.json() as NominatimResult[];
      return results;
    }
    catch (error) {
      return sendError(event, createError({
        statusCode: 504,
        statusMessage: `Unable to reach search API: ${error}`,
      }));
    }
  }, {
    maxAge: 60 * 60 * 24, // 24 hours
    name: "search-nomimatim",
    getKey: async (event) => {
      const query = await getQuery(event);
      return query.q?.toString() || "";
    },
  }),
);
