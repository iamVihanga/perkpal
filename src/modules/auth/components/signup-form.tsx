"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { CiFacebook } from "react-icons/ci";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
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
import { signupSchema, type SignupSchema } from "../schemas";
import { PasswordInput } from "@/components/ui/password-input";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleSignup = async (values: SignupSchema) => {
    try {
      toast.loading("Registering new user...", { id: toastId });

      const result = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: ""
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }

      toast.success("User registered successfully!", { id: toastId });
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
            Get Started
          </CardTitle>
          <CardDescription>
            Signup with your Email or Facebook account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full">
                    <CiFacebook className="size-5" />
                    Signup with Facebook
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
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
                        <PasswordInput
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
                    loading={form.formState.isSubmitting}
                    icon={form.formState.isSubmitSuccessful && <CheckIcon />}
                  >
                    Sign Up
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {`Already have an account? `}
                  <Link href="/signin" className="underline underline-offset-4">
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
