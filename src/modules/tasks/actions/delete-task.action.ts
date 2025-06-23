"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: number) {
  const client = await getClient();

  const res = await client.api.tasks[":id"].$delete({
    param: { id }
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Failed to delete task:", errorData);
    throw new Error(errorData.message || "Failed to delete task");
  }

  // Revalidate the page to show the new task
  revalidatePath("/");
}
