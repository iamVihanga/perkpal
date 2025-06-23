"use server";

import { revalidatePath } from "next/cache";
import { getClient } from "@/lib/rpc/server";
import type { InsertTask } from "@/lib/zod/tasks.zod";

export async function addTask(data: InsertTask) {
  if (!data.name) {
    throw new Error("Task name is required");
  }

  const client = await getClient();

  const res = await client.api.tasks.$post({
    json: {
      ...data,
      done: false
    }
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Failed to add task:", error);
    throw new Error(error.message || "Failed to add task");
  }

  const task = await res.json();

  // Revalidate the page to show the new task
  revalidatePath("/");
  return task;
}
