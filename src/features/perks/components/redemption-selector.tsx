import React from "react";

import type { RedemptionMethodT } from "@/lib/zod/perks.zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  selected: RedemptionMethodT;
  onSelect: (value: RedemptionMethodT) => void;
};

export function RedemptionSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        size="lg"
        variant={selected === "affiliate_link" ? "default" : "outline"}
        className={cn("flex-1 shadow-none  bg-transparent", {
          "bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 border border-blue-500":
            selected === "affiliate_link"
        })}
        onClick={() => onSelect("affiliate_link")}
      >
        Affiliate Link
      </Button>
      <Button
        type="button"
        size="lg"
        variant={selected === "coupon_code" ? "default" : "outline"}
        className={cn("flex-1 shadow-none  bg-transparent", {
          "bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 border border-blue-500":
            selected === "coupon_code"
        })}
        onClick={() => onSelect("coupon_code")}
      >
        Coupon Code
      </Button>
      <Button
        type="button"
        size="lg"
        variant={selected === "form_submission" ? "default" : "outline"}
        className={cn("flex-1 shadow-none  bg-transparent", {
          "bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 border border-blue-500":
            selected === "form_submission"
        })}
        onClick={() => onSelect("form_submission")}
      >
        Form Submission
      </Button>
    </div>
  );
}
