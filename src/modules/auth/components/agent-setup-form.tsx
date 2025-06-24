"use client";
import { CheckIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

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
import { PhoneInput } from "@/components/ui/phone-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { authClient } from "@/lib/auth-client";
import { toKebabCase } from "@/lib/helpers";
import { setupOrgSchema, type SetupOrgSchemaT } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function AgentSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const toastId = useId();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setLogoFile(file);
    }
  };

  const form = useForm<SetupOrgSchemaT>({
    resolver: zodResolver(setupOrgSchema),
    defaultValues: {
      name: "",
      company: "",
      logo: "",
      phoneNumber: "",
      website: ""
    }
  });

  const handleSetup = async (values: SetupOrgSchemaT) => {
    try {
      toast.loading("Setting up your profile...", { id: toastId });

      /**
       * TODO: Handle upload image and set url to form data
       */

      /**
       * 1. Update User Profile with Name
       */
      const updatedUser = await authClient.updateUser({
        name: values.name
      });

      if (updatedUser.error) throw new Error(updatedUser.error.message);

      /**
       * 2. Convert name to kebab case
       */
      const slug = toKebabCase(values.name);

      /**
       * 3. Create Agent Profile (akd. Organization) with the provided details
       */
      const agentProfile = await authClient.organization.create({
        name: values.name,
        slug,
        logo: values.logo,
        metadata: {
          company: values.company,
          phoneNumber: values.phoneNumber,
          website: values.website
        }
      });

      if (agentProfile.error) throw new Error(agentProfile.error.message);

      toast.success("Agent profile successfully prepared !", { id: toastId });

      router.push("/dashboard");
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed: ${error.message}`, {
        id: toastId
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading font-bold">
            Agent Profile
          </CardTitle>
          <CardDescription>
            Complete your agent profile to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSetup)}>
              <div className="grid gap-6">
                <div className="w-full flex items-center justify-center">
                  {/* Logo Field */}
                  <input
                    className="hidden"
                    type="file"
                    accept=".jpg, .png, .jpeg, .svg"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({}) => (
                      <FormItem>
                        <FormControl>
                          <Avatar
                            className="size-[72px]"
                            onClick={() => {
                              if (!imageInputRef.current?.value) {
                                imageInputRef?.current?.click();
                              } else {
                                setLogoFile(null);
                                imageInputRef.current.value = "";
                              }
                            }}
                          >
                            {/* TODO: Uncomment after Image Module installed */}
                            {/* {field.state.value && (
                            <AvatarImage src={field.state.value} alt="logo" />
                            )} */}

                            <div className="relative group cursor-pointer hover:shadow-md">
                              <div
                                className={cn(
                                  "absolute z-20 w-full h-full top-0 left-0 inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold",
                                  logoFile ? "hidden" : "group-hover:flex"
                                )}
                              ></div>
                              <AvatarImage
                                src={
                                  logoFile ? URL.createObjectURL(logoFile) : ""
                                }
                                alt="logo"
                                width={300}
                                height={300}
                                className="object-cover "
                              />
                            </div>

                            <AvatarFallback>
                              <ImageIcon className="size-7 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Abc Real Estate." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Abc Real Estate." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* -------- */}

                <div className="grid gap-6">
                  <Button
                    type="submit"
                    className="w-full"
                    loading={form.formState.isSubmitting}
                    icon={form.formState.isSubmitting && <CheckIcon />}
                  >
                    Complete Profile
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
