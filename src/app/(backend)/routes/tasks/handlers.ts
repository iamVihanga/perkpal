import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { tasks } from "@/database/schema";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute
} from "./routes";

// List tasks route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.tasks.findMany({
    orderBy(fields) {
      return desc(fields.createdAt);
    }
  });

  return c.json(tasks);
};

// Create new task route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db.insert(tasks).values(task).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single task route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id)
  });

  if (!task)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(task, HttpStatusCodes.OK);
};

// Update task route handler
export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Checs at least one field is present in the request body
  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        message: "At least one field must be provided for update."
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const [task] = await db
    .update(tasks)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(task, HttpStatusCodes.OK);
};

// Remove task route handler
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const result = await db.delete(tasks).where(eq(tasks.id, id));

  if (result.rows.length === 0) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
