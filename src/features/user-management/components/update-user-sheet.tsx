import React, { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useUpdateUser } from "../queries";
import {
  updateUserSchema,
  type UpdateUserSchema
} from "../schemas/update-user";
import { useGetUser } from "../queries/use-get-user";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RoleTypes } from "@/lib/helpers";

interface UpdateUserSheetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserId: string;
}

export function UpdateUserSheet({
  open,
  setOpen,
  updateUserId
}: UpdateUserSheetProps) {
  const {
    data: currentUser,
    error: currentUserErr,
    isPending: isFetching
  } = useGetUser({ userId: updateUserId });

  const { mutate, isPending } = useUpdateUser();

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      userId: updateUserId,
      role: ""
    }
  });

  useEffect(() => {
    if (currentUserErr) {
      toast.error("Failed to fetch user details", {
        description: currentUserErr.message
      });
    }

    if (currentUser) {
      if (currentUser?.role)
        form.setValue("role", currentUser.role as RoleTypes);
    }
  }, [form, currentUserErr, currentUser]);

  const onSubmit = (values: UpdateUserSchema) => {
    mutate(values, {
      onSuccess() {
        form.reset();
        setOpen(false);
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update User</SheetTitle>
          <SheetDescription>
            In here, You can update or assign roles of users
          </SheetDescription>
        </SheetHeader>

        {/* Update Form */}
        {isFetching ? (
          <div className="grid gap-6 py-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : (
          currentUser && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-5 px-4">
                  <div className="space-y-2">
                    <Label>User name</Label>
                    <Input
                      disabled
                      value={currentUser.name}
                      placeholder="User name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      disabled
                      value={currentUser.email}
                      placeholder="User email"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class name</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select role for selected user" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="admin">
                              {`Admin (System Admin)`}
                            </SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="contentEditor">
                              Content Editor
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                <SheetFooter className="mt-6">
                  <SheetClose asChild>
                    <Button type="submit" loading={isPending}>
                      Save changes
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
