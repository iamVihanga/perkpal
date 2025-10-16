"use client";
import { Calendar } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { SelectLeadSchema } from "@/lib/zod/leads.zod";

interface ViewLeadProps {
  data: SelectLeadSchema;
  children: React.ReactNode;
}

export function ViewLead({ data, children }: ViewLeadProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-sm text-secondary-foreground">
              <Calendar className="size-3" />
              {new Date(data.createdAt!).toLocaleDateString("en-US")}
            </DialogDescription>
          </DialogHeader>

          <div className="my-3">
            <div className="overflow-hidden border border-secondary rounded-md">
              <Table>
                <TableHeader className="bg-secondary/60">
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Answer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(data.data).map(([key, value], index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
