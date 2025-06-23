"use client";
import { formatDistanceToNow } from "date-fns";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useId, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import { deleteTask } from "../actions/delete-task.action";
import { markAsCompleted } from "../actions/mark-as-completed.action";

import type { Task } from "@/lib/zod/tasks.zod";

type Props = {
  task: Task;
};

export function TaskCard({ task }: Props) {
  const toastId = useId();
  const [isPending, startTransition] = useTransition();

  const handleStateChange = (e: boolean) => {
    startTransition(async () => {
      try {
        toast.loading("Updating task status...", { id: toastId });

        await markAsCompleted(task.id, { done: e });

        toast.success("Task status updated", { id: toastId });
      } catch (error) {
        console.log(error);
        toast.error("Failed to update task status. Please try again.", {
          id: toastId
        });
      }
    });
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
  };

  return (
    <Card key={task.id} className={"p-0 flex flex-col gap-y-3"}>
      <CardHeader className="pt-4 pb-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={`${task.done && "line-through"}`}>
            {task.name}
          </CardTitle>
          <Badge>{task.done ? "Completed" : "Not Completed"}</Badge>
        </div>
        <CardDescription className="p-0">
          Created {formatDistanceToNow(task.createdAt)} ago
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 h-6">
          <Button
            size="sm"
            icon={<TrashIcon />}
            variant={"ghost"}
            onClick={handleDelete}
          >
            Delete
          </Button>

          <Separator orientation="vertical" />

          <Button size="sm" icon={<PencilIcon />} variant={"ghost"}>
            Edit Task
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.done}
            className="border border-primary"
            onCheckedChange={handleStateChange}
            disabled={isPending}
          />

          <Label
            htmlFor={`task-${task.id}`}
            className="text-sm text-muted-foreground"
          >
            {task.done ? "Completed" : "Mark as Completed"}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
