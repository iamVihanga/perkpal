import { getClient } from "@/lib/rpc/server";
import { Card, CardContent } from "@/components/ui/card";

import { AddNewTask } from "@/modules/tasks/components/add-new-task";
import { TaskCard } from "@/modules/tasks/components/task-card";

export default async function Home() {
  const client = await getClient();

  const res = await client.api.tasks.$get();
  const tasks = await res.json();

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Manager</h1>

        <AddNewTask />
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 flex justify-center">
            <p className="text-muted-foreground">
              No tasks found. Create one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
