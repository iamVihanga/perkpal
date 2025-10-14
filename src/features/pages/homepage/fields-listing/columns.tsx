"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ContentFieldsSelectT } from "@/lib/zod/pages.zod";
import { FieldValueInput } from "../../components/field-value-input";

export const createColumns = (): ColumnDef<ContentFieldsSelectT>[] => [
  {
    accessorKey: "key",
    header: "Field Name"
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      return <FieldValueInput contentField={row.original} />;
    }
  }
];
