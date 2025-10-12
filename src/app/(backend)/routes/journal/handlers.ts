import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { posts } from "@/database/schema";
import type {
  ListPostsRoute,
  GetOnePostRoute,
  CreatePostRoute,
  UpdatePostRoute,
  DeletePostRoute
} from "./routes";

// List posts route handler
export const list: AppRouteHandler<ListPostsRoute> = async (c) => {
  try {
    const { page = "1", limit = "10", search } = c.req.valid("query");

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    // Build search condition for query
    const searchCondition = search
      ? or(
          ilike(posts.title, `%${search}%`),
          ilike(posts.content, `%${search}%`),
          ilike(posts.shortExcerpt, `%${search}%`)
        )
      : undefined;

    // Build query with conditions
    const query = db.query.posts.findMany({
      limit: limitNum,
      offset,
      orderBy: (fields) => [desc(fields.createdAt)],
      where: searchCondition,
      with: {
        featuredImage: true,
        authorLogo: true,
        ogImage: true
      }
    });

    // Get total count for pagination
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(searchCondition);

    const [data, countResult] = await Promise.all([query, countQuery]);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data,
        meta: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum
        }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error listing posts:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Get single post route handler
export const getOne: AppRouteHandler<GetOnePostRoute> = async (c) => {
  try {
    const { id, slug } = c.req.valid("query");

    if (!id && !slug) {
      return c.json(
        { message: "Either id or slug must be provided" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Build where condition based on provided parameter
    const whereCondition = id ? eq(posts.id, id) : eq(posts.slug, slug!);

    const post = await db.query.posts.findFirst({
      where: whereCondition,
      with: {
        featuredImage: true,
        authorLogo: true,
        ogImage: true
      }
    });

    if (!post) {
      return c.json(
        { message: "Blog post not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(post, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error getting post:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Create post handler
export const create: AppRouteHandler<CreatePostRoute> = async (c) => {
  try {
    const body = c.req.valid("json");

    // Insert new post
    const newPost = await db.insert(posts).values(body).returning();

    if (!newPost[0]) {
      return c.json(
        { message: "Failed to create blog post" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Fetch the created post with populated fields
    const createdPost = await db.query.posts.findFirst({
      where: eq(posts.id, newPost[0].id),
      with: {
        featuredImage: true,
        authorLogo: true,
        ogImage: true
      }
    });

    return c.json(createdPost, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Update post handler
export const update: AppRouteHandler<UpdatePostRoute> = async (c) => {
  try {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    // Check if post exists
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.id, id)
    });

    if (!existingPost) {
      return c.json(
        { message: "Blog post not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Update post
    const updatedPost = await db
      .update(posts)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();

    if (!updatedPost[0]) {
      return c.json(
        { message: "Failed to update blog post" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Fetch the updated post with populated fields
    const result = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        featuredImage: true,
        authorLogo: true,
        ogImage: true
      }
    });

    return c.json(result, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error updating post:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Delete post handler
export const remove: AppRouteHandler<DeletePostRoute> = async (c) => {
  try {
    const { id } = c.req.valid("param");

    // Check if post exists
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.id, id)
    });

    if (!existingPost) {
      return c.json(
        { message: "Blog post not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Delete the post
    await db.delete(posts).where(eq(posts.id, id));

    return c.json(
      { message: "Blog post deleted successfully" },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
