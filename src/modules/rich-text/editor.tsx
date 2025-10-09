"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Start writing...",
  className,
  disabled = false
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline"
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg"
        }
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] max-w-none",
          "prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground",
          "prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground",
          "prose-blockquote:text-muted-foreground prose-blockquote:border-border",
          className
        )
      }
    }
  });

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      {showImageDialog}

      <div className={cn("border rounded-lg overflow-hidden", className)}>
        {/* Toolbar */}
        <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("h-8 px-2", editor.isActive("bold") && "bg-muted")}
            disabled={disabled}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("h-8 px-2", editor.isActive("italic") && "bg-muted")}
            disabled={disabled}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-8 px-2",
              editor.isActive("underline") && "bg-muted"
            )}
            disabled={disabled}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Text Alignment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={cn(
              "h-8 px-2",
              editor.isActive({ textAlign: "left" }) && "bg-muted"
            )}
            disabled={disabled}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={cn(
              "h-8 px-2",
              editor.isActive({ textAlign: "center" }) && "bg-muted"
            )}
            disabled={disabled}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={cn(
              "h-8 px-2",
              editor.isActive({ textAlign: "right" }) && "bg-muted"
            )}
            disabled={disabled}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Lists */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-8 px-2",
              editor.isActive("bulletList") && "bg-muted"
            )}
            disabled={disabled}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-8 px-2",
              editor.isActive("orderedList") && "bg-muted"
            )}
            disabled={disabled}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "h-8 px-2",
              editor.isActive("blockquote") && "bg-muted"
            )}
            disabled={disabled}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Links and Images */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkDialog(true)}
            className="h-8 px-2"
            disabled={disabled}
          >
            <Link2 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageDialog(true)}
            className="h-8 px-2"
            disabled={disabled}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Undo/Redo */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className="h-8 px-2"
            disabled={disabled || !editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className="h-8 px-2"
            disabled={disabled || !editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor */}
        <div className="p-4 min-h-[200px]">
          <EditorContent
            editor={editor}
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
          />
          {content === "" && !editor.isFocused && (
            <p className="text-muted-foreground absolute pointer-events-none">
              {placeholder}
            </p>
          )}
        </div>

        {/* Link Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowLinkDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={addLink}>Add Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
