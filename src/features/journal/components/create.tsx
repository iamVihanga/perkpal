/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import slug from "slug";
import { ImageIcon, Loader2, User, Upload, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/modules/rich-text/editor";
import { MediaUploadWidget } from "@/modules/media/components/upload-widget";
import { IDImageViewer } from "@/modules/media/components/viewer-by-id";
import { useSaveMedia } from "@/modules/media/queries/use-save-media";

import { createPostSchema, CreatePostT } from "@/lib/zod/journal.zod";
import { useCreatePost } from "../queries/use-create-post";

type Props = {
  className?: string;
};

export function CreatePost({ className }: Props) {
  const router = useRouter();
  const { mutate: saveMedia } = useSaveMedia();
  const { mutate: createPost, isPending: creatingPost } = useCreatePost();

  const form = useForm<CreatePostT>({
    resolver: zodResolver(createPostSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      shortExcerpt: null,
      featuredImageId: null,
      tags: null,
      authorName: null,
      authorLogoId: null,
      seoTitle: null,
      seoDescription: null,
      ogImageId: null
    }
  });

  const [tagInput, setTagInput] = useState("");

  // Watch form "title" field and update "slug" field accordingly
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title) {
        form.setValue("slug", slug(value.title));
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: CreatePostT) => {
    createPost(data, {
      onSuccess: () => {
        router.push("/dashboard/journal");
      }
    });
  };

  // Handle adding tags
  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      const newTags = [...currentTags, tagInput.trim()];
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  // Handle removing tags
  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    const newTags = currentTags.filter((_, i) => i !== index);
    form.setValue("tags", newTags.length > 0 ? newTags : null);
  };

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={className}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    {...form.register("title")}
                    className={
                      form.formState.errors.title ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="post-slug"
                    {...form.register("slug")}
                    className={
                      form.formState.errors.slug ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortExcerpt">Short Excerpt</Label>
                  <Textarea
                    id="shortExcerpt"
                    placeholder="Brief description of the post..."
                    rows={3}
                    {...form.register("shortExcerpt")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content *</Label>
                  <RichTextEditor
                    content={form.watch("content")}
                    onChange={(value: string) =>
                      form.setValue("content", value)
                    }
                    placeholder="Write your post content here..."
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(form.watch("tags") || []).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    loading={creatingPost}
                    className="flex-1"
                  >
                    {creatingPost ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Post"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("featuredImageId") ? (
                  <div className="space-y-2">
                    <IDImageViewer
                      id={form.watch("featuredImageId")!}
                      className="w-full h-32 object-cover rounded-md"
                      width={300}
                      height={200}
                      alt="Featured image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.setValue("featuredImageId", null)}
                      className="w-full"
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <MediaUploadWidget
                    widgetProps={{
                      onSuccess: (result: unknown) => {
                        const {
                          public_id,
                          secure_url,
                          original_filename,
                          bytes
                        } = (result as any).info;
                        saveMedia(
                          {
                            publicId: public_id,
                            url: secure_url,
                            filename: original_filename,
                            size: bytes,
                            seoTitle: null,
                            seoDescription: null,
                            seoKeywords: null
                          },
                          {
                            onSuccess: (savedMedia) => {
                              form.setValue("featuredImageId", savedMedia.id);
                            }
                          }
                        );
                      }
                    }}
                  >
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload featured image
                      </p>
                    </div>
                  </MediaUploadWidget>
                )}
              </CardContent>
            </Card>

            {/* Author Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Author
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    placeholder="Enter author name"
                    {...form.register("authorName")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Author Logo</Label>
                  {form.watch("authorLogoId") ? (
                    <div className="space-y-2">
                      <IDImageViewer
                        id={form.watch("authorLogoId")!}
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                        alt="Author logo"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue("authorLogoId", null)}
                        className="w-full"
                      >
                        Remove Logo
                      </Button>
                    </div>
                  ) : (
                    <MediaUploadWidget
                      widgetProps={{
                        onSuccess: (result: any) => {
                          const {
                            public_id,
                            secure_url,
                            original_filename,
                            bytes
                          } = result.info;
                          saveMedia(
                            {
                              publicId: public_id,
                              url: secure_url,
                              filename: original_filename,
                              size: bytes,
                              seoTitle: null,
                              seoDescription: null,
                              seoKeywords: null
                            },
                            {
                              onSuccess: (savedMedia) => {
                                form.setValue("authorLogoId", savedMedia.id);
                              }
                            }
                          );
                        }
                      }}
                    >
                      <div className="border border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Upload logo
                        </p>
                      </div>
                    </MediaUploadWidget>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    placeholder="SEO optimized title"
                    {...form.register("seoTitle")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="Meta description for search engines"
                    rows={3}
                    {...form.register("seoDescription")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>OG Image</Label>
                  {form.watch("ogImageId") ? (
                    <div className="space-y-2">
                      <IDImageViewer
                        id={form.watch("ogImageId")!}
                        className="w-full h-24 object-cover rounded-md"
                        width={300}
                        height={150}
                        alt="OG image"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue("ogImageId", null)}
                        className="w-full"
                      >
                        Remove OG Image
                      </Button>
                    </div>
                  ) : (
                    <MediaUploadWidget
                      widgetProps={{
                        onSuccess: (result: any) => {
                          const {
                            public_id,
                            secure_url,
                            original_filename,
                            bytes
                          } = result.info;
                          saveMedia(
                            {
                              publicId: public_id,
                              url: secure_url,
                              filename: original_filename,
                              size: bytes,
                              seoTitle: null,
                              seoDescription: null,
                              seoKeywords: null
                            },
                            {
                              onSuccess: (savedMedia) => {
                                form.setValue("ogImageId", savedMedia.id);
                              }
                            }
                          );
                        }
                      }}
                    >
                      <div className="border border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Upload OG image
                        </p>
                      </div>
                    </MediaUploadWidget>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
