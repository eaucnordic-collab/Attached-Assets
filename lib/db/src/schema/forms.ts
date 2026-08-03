import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const formsTable = pgTable("forms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  fields: jsonb("fields").notNull().default([]),
  submitButtonLabel: text("submit_button_label").notNull().default("Submit"),
  successMessage: text("success_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const submissionsTable = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  formId: integer("form_id").notNull(),
  formName: text("form_name").notNull().default(""),
  data: jsonb("data").notNull().default({}),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Form = typeof formsTable.$inferSelect;
export type FormSubmission = typeof submissionsTable.$inferSelect;
