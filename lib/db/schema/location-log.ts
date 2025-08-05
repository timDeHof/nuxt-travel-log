import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { location } from "./location";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  started_at: int().notNull(),
  ended_at: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int().notNull().references(() => location.id),
  userId: int().notNull().references(() => user.id),
  created_at: int().notNull().$default(() => Date.now()),
  updated_at: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogRelation = relations(locationLog, ({ one }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
}));

export type SelectLocationLog = typeof locationLog.$inferSelect;
