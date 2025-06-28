import { getClient } from "@/lib/rpc/client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { s3Client, s3Config } from "@/modules/media/config";
import type {
  Media,
  MediaUploadType,
  QueryParamsSchema,
  UploadParams
} from "@/modules/media/types";
import {
  generatePresignedUrl,
  generateUniqueFileName,
  getMediaType
} from "@/modules/media/utils";

export class MediaService {
  private static instance: MediaService;

  private constructor() {}

  static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }

    return MediaService.instance;
  }

  async uploadFile({
    file,
    path = "",
    seoDescription,
    seoKeywords,
    seoTitle,
    onProgress
  }: UploadParams): Promise<Media> {
    // Step 1: Upload file to S3
    const filename = generateUniqueFileName(file.name);
    const key = path ? `${path}/${filename}` : filename;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: s3Config.bucket,
        Key: key,
        Body: file,
        ContentType: file.type,
        ACL: "public-read", // This makes the object publicly readable
        CacheControl: "max-age=31536000" // Optional: 1 year cache
      }
    });

    // Track upload progress
    upload.on("httpUploadProgress", (progress) => {
      console.log("Upload progress:", progress);
      if (!progress.loaded || !progress.total) return;

      const percentCompleted = Math.round(
        (progress.loaded / progress.total) * 100
      );

      if (onProgress) {
        onProgress({
          loaded: progress.loaded,
          total: progress.total,
          percentage: percentCompleted,
          key: progress.Key!
        });
      }
    });

    try {
      const result = await upload.done();

      // Step 2: Create media file metadata
      const mediaData: MediaUploadType = {
        url: `${s3Config.baseUrl}${result.Key}`,
        type: getMediaType(file.type),
        filename: filename,
        size: file.size,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null
      };

      // Step 3: Save media metadata to database via API
      const rpcClient = await getClient();

      const createdRes = await rpcClient.api.media.$post({
        json: mediaData
      });

      if (!createdRes.ok) {
        const { message } = await createdRes.json();
        console.log({ message });
        throw new Error(message);
      }

      const createdMedia = await createdRes.json();

      return {
        ...createdMedia,
        createdAt: new Date(createdMedia.createdAt),
        updatedAt: createdMedia?.updatedAt
          ? new Date(createdMedia.updatedAt)
          : null
      };
    } catch (error) {
      console.log(error);

      // If database save fails, try to clean up the S3 file to avoid orphaned files
      try {
        await this.deleteS3File(key);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up S3 file after database save error:",
          cleanupError
        );
      }

      throw new Error(
        `Failed to save media metadata to database: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async deleteFile(id: string) {
    // Step 1: Get media details to know the S3 key
    const rpcClient = await getClient();

    const media = await rpcClient.api.media[":id"].$get({
      param: { id }
    });

    // Step 2: Delete from S3
    const key = this.extractKeyFromUrl(media.url);
    await this.deleteS3File(key);

    // Step 3: Delete from database
    const deleteRes = await rpcClient.api.media[":id"].$delete({
      param: { id }
    });

    if (!deleteRes.ok) {
      const { message } = await deleteRes.json();
      throw new Error(message);
    }

    return await deleteRes.json();
  }

  private async deleteS3File(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key
      })
    );
  }

  private extractKeyFromUrl(url: string): string {
    // Extract the key from the S3 URL
    const baseUrlWithoutProtocol = s3Config.baseUrl.replace(/^https?:\/\//, "");
    return url
      .replace(/^https?:\/\//, "")
      .replace(baseUrlWithoutProtocol + "/", "");
  }

  async getPresignedUrl(filename: string, path = ""): Promise<string> {
    const key = path ? `${path}/${filename}` : filename;
    return await generatePresignedUrl(key);
  }

  async getAllMedia(query: QueryParamsSchema) {
    const rpcClient = await getClient();

    const mediaRes = await rpcClient.api.media.$get({
      query: query
    });

    if (!mediaRes.ok) {
      const { message } = await mediaRes.json();
      throw new Error(message);
    }

    return await mediaRes.json();
  }

  async getMediaById(id: string) {
    const rpcClient = await getClient();

    const mediaRes = await rpcClient.api.media[":id"].$get({
      param: { id }
    });

    if (!mediaRes.ok) {
      const { message } = await mediaRes.json();
      throw new Error(message);
    }

    return await mediaRes.json();
  }

  async updateMediaDetails(id: string, body: MediaUploadType) {
    const rpcClient = await getClient();
    const updateRes = await rpcClient.api.media[":id"].$patch({
      param: { id },
      json: body
    });

    if (!updateRes.ok) {
      const { message } = await updateRes.json();
      throw new Error(message);
    }

    const updatedMedia = await updateRes.json();
    return updatedMedia;
  }
}
