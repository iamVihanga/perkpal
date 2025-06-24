"use client";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { resetPasswordSchema, type ResetPasswordSchemaT } from "../schemas";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const form = useForm<ResetPasswordSchemaT>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });

  const handleResetPassword = async (values: ResetPasswordSchemaT) => {
    try {
      if (!token) {
        toast.error("Invalid or expired token", { id: toastId });
        return;
      }

      toast.loading("Updating Password...", { id: toastId });

      const result = await authClient.resetPassword({
        newPassword: values.newPassword,
        token
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success("Password updated successfully!", { id: toastId });
      router.push("/dashboard");
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
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token && (
            <Alert className="mb-6">
              <AlertTitle>{`Invalid or expired token`}</AlertTitle>
              <AlertDescription>
                {`Please request a new password reset link or validate token is correct.`}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleResetPassword)}>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting || !token}
                    loading={form.formState.isSubmitting}
                    icon={form.formState.isSubmitSuccessful && <CheckIcon />}
                  >
                    Update Password
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
