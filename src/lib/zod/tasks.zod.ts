import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tasks } from "@/database/schema/tasks.schema";
import { z } from "zod";

export const selectTaskSchema = createSelectSchema(tasks).extend({
  createdAt: z.date().transform((date) => date && date.toISOString()),
  updatedAt: z
    .date()
    .transform((date) => date && date.toISOString())
    .nullable()
});

export const insertTaskSchema = createInsertSchema(tasks, {
  name: (val) => val.min(1).max(500)
})
  .required({
    done: true
  })
  .omit({
    createdAt: true,
    updatedAt: true
  });

export const updateTaskSchema = createInsertSchema(tasks)
  .omit({
    createdAt: true,
    updatedAt: true
  })
  .partial();

// Type Definitions
export type Task = z.infer<typeof selectTaskSchema>;

export type InsertTask = z.infer<typeof insertTaskSchema>;

export type UpdateTask = z.infer<typeof updateTaskSchema>;
