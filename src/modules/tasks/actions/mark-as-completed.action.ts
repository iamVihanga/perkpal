"use server";

import { revalidatePath } from "next/cache";
import { getClient } from "@/lib/rpc/server";
import { type UpdateTask } from "@/lib/zod/tasks.zod";

export async function markAsCompleted(id: number, data: UpdateTask) {
  const client = await getClient();

  const response = await client.api.tasks[":id"].$patch({
    json: { done: data.done || false },
    param: { id }
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to mark task as completed:", errorData);
    throw new Error(errorData.message || "Failed to mark task as completed");
  }

  // Revalidate the page to show the new task
  revalidatePath("/");
}
