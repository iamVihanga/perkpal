"use client";

import React, { useState } from "react";
import { TableConfig, Plus, Trash2, GripVertical } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";

import { LeadFormConfigT, FieldTypeT } from "@/lib/zod/perks.zod";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define a flexible input type that can handle form data with optional booleans
type LeadFormConfigInput = {
  fields?: Array<{
    id: string;
    type: FieldTypeT;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    validation?: {
      pattern?: string;
      minLength?: number;
      maxLength?: number;
      errorMessage?: string;
    };
    helpText?: string;
  }>;
  thankYou?: {
    title: string;
    message: string;
    showPerkDetails?: boolean;
  };
  redirect?: {
    enabled?: boolean;
    url?: string;
    delay?: number;
  };
  notification?: {
    enabled?: boolean;
    partnerEmail?: string;
    sendImmediately?: boolean;
  };
  consent?: {
    required?: boolean;
    text: string;
  };
};

type Props = {
  value: LeadFormConfigInput | null | undefined;
  onChange: (value: LeadFormConfigT | null) => void;
};

const FIELD_TYPES: { value: FieldTypeT; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" }
];

export function LeadFormConfigure({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  // Normalize incoming value to ensure all boolean fields have proper defaults
  const normalizeValue = (
    val: LeadFormConfigInput | null | undefined
  ): LeadFormConfigT | null => {
    if (!val) return null;

    return {
      ...val,
      fields:
        val.fields?.map((field) => ({
          ...field,
          required: field.required ?? false
        })) || [],
      thankYou: val.thankYou
        ? {
            ...val.thankYou,
            showPerkDetails: val.thankYou.showPerkDetails ?? true
          }
        : {
            title: "Thank you!",
            message:
              "We've received your information and will contact you soon.",
            showPerkDetails: true
          },
      consent: val.consent
        ? {
            ...val.consent,
            required: val.consent.required ?? true
          }
        : {
            required: true,
            text: "I agree to share my information with the partner for this perk."
          },
      redirect: val.redirect
        ? {
            enabled: val.redirect.enabled ?? false,
            url: val.redirect.url,
            delay: val.redirect.delay ?? 3000
          }
        : undefined,
      notification: val.notification
        ? {
            enabled: val.notification.enabled ?? false,
            partnerEmail: val.notification.partnerEmail,
            sendImmediately: val.notification.sendImmediately ?? true
          }
        : undefined
    };
  };

  const normalizedValue = normalizeValue(value);

  const defaultValues: LeadFormConfigT = normalizedValue || {
    fields: [
      {
        id: crypto.randomUUID(),
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true
      },
      {
        id: crypto.randomUUID(),
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true
      }
    ],
    thankYou: {
      title: "Thank you!",
      message: "We've received your information and will contact you soon.",
      showPerkDetails: true
    },
    consent: {
      required: true,
      text: "I agree to share my information with the partner for this perk."
    }
  };

  const form = useForm<LeadFormConfigT>({
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields"
  });

  const addField = () => {
    append({
      id: crypto.randomUUID(),
      type: "text",
      label: "",
      placeholder: "",
      required: false
    });
  };

  const onSubmit = (data: LeadFormConfigT) => {
    // Validate the data manually
    if (!data.fields || data.fields.length === 0) {
      alert("At least one field is required");
      return;
    }

    // Check for empty labels
    const hasEmptyLabels = data.fields.some((field) => !field.label.trim());
    if (hasEmptyLabels) {
      alert("All fields must have labels");
      return;
    }

    // Check thankYou fields
    if (!data.thankYou.title.trim() || !data.thankYou.message.trim()) {
      alert("Thank you title and message are required");
      return;
    }

    // Check consent text
    if (!data.consent.text.trim()) {
      alert("Consent text is required");
      return;
    }

    // Check redirect validation
    if (data.redirect?.enabled && !data.redirect.url) {
      alert("Redirect URL is required when redirect is enabled");
      return;
    }

    // Check notification validation
    if (data.notification?.enabled && !data.notification.partnerEmail) {
      alert("Partner email is required when notifications are enabled");
      return;
    }

    // Ensure all boolean fields have proper values
    const normalizedData: LeadFormConfigT = {
      ...data,
      fields: data.fields.map((field) => ({
        ...field,
        required: field.required ?? false
      })),
      thankYou: {
        ...data.thankYou,
        showPerkDetails: data.thankYou.showPerkDetails ?? true
      },
      consent: {
        ...data.consent,
        required: data.consent.required ?? true
      },
      redirect: data.redirect
        ? {
            ...data.redirect,
            enabled: data.redirect.enabled ?? false
          }
        : undefined,
      notification: data.notification
        ? {
            ...data.notification,
            enabled: data.notification.enabled ?? false
          }
        : undefined
    };

    console.log("Lead Form Config:", normalizedData);
    onChange(normalizedData);
    setOpen(false);
  };

  const hasConfiguredFields =
    normalizedValue &&
    normalizedValue.fields &&
    normalizedValue.fields.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="default" icon={<TableConfig />}>
          {hasConfiguredFields ? "Edit Lead Form" : "Config Lead Form"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Lead Form Configuration</DialogTitle>
            <DialogDescription>
              Configure the form fields and behavior for lead collection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Form Fields Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Form Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 p-4 border rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">Field {index + 1}</Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`field-type-${index}`}>
                          Field Type
                        </Label>
                        <Select
                          value={form.watch(`fields.${index}.type`)}
                          onValueChange={(value) =>
                            form.setValue(
                              `fields.${index}.type`,
                              value as FieldTypeT
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`field-label-${index}`}>Label</Label>
                        <Input
                          placeholder="Field label"
                          {...form.register(`fields.${index}.label`)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`field-placeholder-${index}`}>
                          Placeholder
                        </Label>
                        <Input
                          placeholder="Field placeholder"
                          {...form.register(`fields.${index}.placeholder`)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`field-help-${index}`}>Help Text</Label>
                        <Input
                          placeholder="Optional help text"
                          {...form.register(`fields.${index}.helpText`)}
                        />
                      </div>
                    </div>

                    {/* Options for select fields */}
                    {form.watch(`fields.${index}.type`) === "select" && (
                      <div className="space-y-2">
                        <Label>Options (comma-separated)</Label>
                        <Input
                          placeholder="Option 1, Option 2, Option 3"
                          value={
                            form.watch(`fields.${index}.options`)?.join(", ") ||
                            ""
                          }
                          onChange={(e) =>
                            form.setValue(
                              `fields.${index}.options`,
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={form.watch(`fields.${index}.required`)}
                        onCheckedChange={(checked) =>
                          form.setValue(`fields.${index}.required`, checked)
                        }
                      />
                      <Label className="text-sm">Required field</Label>
                    </div>

                    {/* Validation section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Validation Rules
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          placeholder="Min length"
                          value={
                            form.watch(
                              `fields.${index}.validation.minLength`
                            ) || ""
                          }
                          onChange={(e) =>
                            form.setValue(
                              `fields.${index}.validation.minLength`,
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Max length"
                          value={
                            form.watch(
                              `fields.${index}.validation.maxLength`
                            ) || ""
                          }
                          onChange={(e) =>
                            form.setValue(
                              `fields.${index}.validation.maxLength`,
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addField}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </CardContent>
            </Card>

            {/* Thank You Page Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thank You Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Thank You Title</Label>
                  <Input
                    placeholder="Thank you!"
                    {...form.register("thankYou.title")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thank You Message</Label>
                  <Textarea
                    placeholder="We've received your information and will contact you soon."
                    rows={3}
                    {...form.register("thankYou.message")}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={form.watch("thankYou.showPerkDetails")}
                    onCheckedChange={(checked) =>
                      form.setValue("thankYou.showPerkDetails", checked)
                    }
                  />
                  <Label>Show perk details on thank you page</Label>
                </div>
              </CardContent>
            </Card>

            {/* Redirect Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Redirect Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={form.watch("redirect.enabled")}
                    onCheckedChange={(checked) =>
                      form.setValue("redirect.enabled", checked)
                    }
                  />
                  <Label>Enable redirect after form submission</Label>
                </div>

                {form.watch("redirect.enabled") && (
                  <div className="space-y-4 pl-6 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label>Redirect URL</Label>
                      <Input
                        placeholder="https://example.com/success"
                        {...form.register("redirect.url")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Delay (milliseconds)</Label>
                      <Input
                        type="number"
                        placeholder="3000"
                        value={form.watch("redirect.delay") || 3000}
                        onChange={(e) =>
                          form.setValue(
                            "redirect.delay",
                            parseInt(e.target.value) || 3000
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={form.watch("notification.enabled")}
                    onCheckedChange={(checked) =>
                      form.setValue("notification.enabled", checked)
                    }
                  />
                  <Label>Send notifications to partner</Label>
                </div>

                {form.watch("notification.enabled") && (
                  <div className="space-y-4 pl-6 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label>Partner Email</Label>
                      <Input
                        type="email"
                        placeholder="partner@example.com"
                        {...form.register("notification.partnerEmail")}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={form.watch("notification.sendImmediately")}
                        onCheckedChange={(checked) =>
                          form.setValue("notification.sendImmediately", checked)
                        }
                      />
                      <Label>Send notifications immediately</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Consent Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consent Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={form.watch("consent.required")}
                    onCheckedChange={(checked) =>
                      form.setValue("consent.required", checked)
                    }
                  />
                  <Label>Require consent checkbox</Label>
                </div>

                <div className="space-y-2">
                  <Label>Consent Text</Label>
                  <Textarea
                    placeholder="I agree to share my information with the partner for this perk."
                    rows={3}
                    {...form.register("consent.text")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Configuration</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
