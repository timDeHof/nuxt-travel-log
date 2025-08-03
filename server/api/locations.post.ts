import type { DrizzleError } from "drizzle-orm";

import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import SendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    return SendZodError(event, result.error);
  }
  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists. Please choose a different name.",
    }));
  }
  // Generate a slug from the names
  const slug = await findUniqueSlug(slugify(result.data.name));
  if (!slug) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Could not generate a unique slug for the location.",
    }));
  }

  try {
    return insertLocation(result.data, slug, event.context.user.id);
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message.includes("Failed query")) {
      return sendError(event, createError({
        statusCode: 409,

        statusMessage: "Could not generate a unique slug for the location.",
      }));
    }
    throw error;
  }
});
