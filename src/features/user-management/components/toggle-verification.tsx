"use client";

import React, { useEffect, useState } from "react";

import type { User } from "./users-table/columns";
import { Badge } from "@/components/ui/badge";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useVerifyUser } from "../queries/use-verify-user";

type Props = {
  user: User;
};

export function ToggleVerification({ user }: Props) {
  const [enabled, setEnabled] = useState(user.emailVerified ?? false);
  const { mutate, isPending } = useVerifyUser();

  useEffect(() => {
    mutate({ userId: user.id, emailVerified: enabled });
  }, [enabled, user.emailVerified, mutate, user.id]);

  const handleToggle = () => {
    setEnabled(!enabled);
  };

  return (
    <div className="flex items-center gap-2">
      <RadioGroup
        defaultValue={user.emailVerified ? "verified" : "not-verified"}
        value={enabled ? "verified" : "not-verified"}
      >
        <RadioGroupItem
          value="verified"
          onClick={handleToggle}
          disabled={isPending}
          className="cursor-pointer"
        />
      </RadioGroup>

      <Badge
        className={
          user.emailVerified
            ? "bg-green-500 text-white"
            : "bg-destructive text-destructive-foreground"
        }
      >
        {user.emailVerified ? "Verified" : "Not Verified"}
      </Badge>
    </div>
  );
}
