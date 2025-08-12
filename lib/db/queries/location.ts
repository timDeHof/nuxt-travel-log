import { and, eq, like } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { InsertLocation } from "~/lib/db/schema";

import db from "~/lib/db";
import { location } from "~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export async function findLocation(slug: string, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.slug, slug),
      eq(location.userId, userId),
    ),
    with: {
      locationLogs: true,
    },
  });
}

export async function findLocations(userId: number) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}
export async function findLocationByName(existing: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.name, existing.name),
      eq(location.userId, userId),
    ),
  });
}

export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}
// Ensure the slug is unique
// TODO: This could be optimized to avoid multiple queries
// but for now, this is simple and works.
export async function findUniqueSlug(slug: string) {
  // Get all existing slugs with the same prefix in one query
  const existingSlugs = await db.query.location.findMany({
    where: like(location.slug, `${slug}%`),
    columns: { slug: true },
  }).then(results => new Set(results.map(r => r.slug)));

  if (!existingSlugs.has(slug)) {
    return slug;
  }

  // Generate unique suffix
  let attempts = 0;
  while (attempts < 100) { // Prevent infinite loop
    const id = nanoid();
    const candidate = `${slug}-${id}`;
    if (!existingSlugs.has(candidate)) {
      return candidate;
    }
    attempts++;
  }

  throw new Error("Unable to generate unique slug");
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number) {
  const [created] = await db.insert(location).values({
    ...insertable,
    userId,
    slug,
  }).returning();
  return created;
}

export async function updateLocationBySlug(updates: InsertLocation, slug: string, userId: number) {
  const [updated] = await db.update(location).set(updates).where(and(
    eq(location.slug, slug),
    eq(location.userId, userId),
  )).returning();
  return updated;
}
