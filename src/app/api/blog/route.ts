/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";

/**
 * GET /api/blog - Get all blog posts with filtering, search, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured");
    const tags = searchParams.get("tags");
    const sortBy = searchParams.get("sortBy") || "publishedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build filter object
    const filter: any = { isActive: true };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Featured filter
    if (featured === "true") {
      filter.featured = true;
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    // Build sort object
    const sort: any = {};
    if (search) {
      sort.score = { $meta: "textScore" };
    }
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [posts, totalCount] = await Promise.all([
      BlogPost.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      BlogPost.countDocuments(filter),
    ]);

    // Transform the response
    const transformedPosts = posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      publishedAt: post.publishedAt.toISOString().split("T")[0],
      _id: undefined,
      __v: undefined,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: transformedPosts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog posts",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog - Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "excerpt",
      "content",
      "author",
      "readTime",
      "category",
      "tags",
      "featuredImage",
      "seo",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Create new blog post
    const blogPost = new BlogPost(body) as typeof BlogPost.prototype;
    await blogPost.save();

    // Transform the response
    const transformedPost = {
      ...blogPost.toObject(),
      id: blogPost._id.toString(),
      publishedAt: blogPost.publishedAt.toISOString().split("T")[0],
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: transformedPost,
        message: "Blog post created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating blog post:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      const mongooseError = error as any;
      const validationErrors = Object.values(mongooseError.errors || {})
        .filter(
          (err): err is { message: string } =>
            typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof (err as any).message === "string"
        )
        .map((err) => err.message);

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key error (slug already exists)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as any).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "A blog post with this slug already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create blog post",
      },
      { status: 500 }
    );
  }
}
