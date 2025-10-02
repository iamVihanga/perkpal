import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  url: string;
};

export function ImagePreview({ url }: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"ghost"}
          size="icon"
          className="size-8 text-foreground/60"
        >
          <EyeIcon className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[80vh]">
        <DialogTitle>Image Preview</DialogTitle>
        <div className="relative w-full">
          <Image
            src={url}
            alt="Preview"
            layout="responsive"
            width={600}
            height={300}
            className="object-contain w-full h-full rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
