"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordSchemaT } from "../schemas";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();

  const form = useForm<ForgotPasswordSchemaT>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const handleForgotPassword = async (values: ForgotPasswordSchemaT) => {
    try {
      toast.loading("Requesting Password Reset...", { id: toastId });

      await authClient.forgetPassword({
        email: values.email,
        redirectTo: "/reset-password"
      });

      toast.success("Password reset link sent!", {
        id: toastId,
        description: "Check your email inbox for the link"
      });

      router.push("/signin");
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading font-bold">
            Reset Password
          </CardTitle>
          <CardDescription>
            Request a password reset link to be sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleForgotPassword)}>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6">
                  <Button
                    type="submit"
                    className="w-full"
                    loading={form.formState.isSubmitting}
                    icon={form.formState.isSubmitSuccessful && <CheckIcon />}
                  >
                    Request Link
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {`Don't have an account?`}
                  {` `}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
