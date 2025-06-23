"use client";
import { PlusCircleIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { insertTaskSchema, type InsertTask } from "@/lib/zod/tasks.zod";

import { addTask } from "../actions/add-task.action";

export function AddNewTask() {
  const [open, setOpen] = useState<boolean>(false);
  const toastId = useId();

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      name: "",
      done: false
    }
  });

  const handleSubmit = async (values: InsertTask) => {
    try {
      toast.loading("Creating new task...", { id: toastId });

      await addTask(values);

      toast.success("Task created successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to create task. Please try again.", {
        id: toastId
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={<PlusCircleIcon />}>Add new Task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Create new Task</DialogTitle>
              <DialogDescription>
                Create a new task by filling out the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Task to do..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" loading={form.formState.isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
