import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { isValidObjectId } from "mongoose";

/**
 * GET /api/blog/[slug] - Get a specific blog post by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug is required",
        },
        { status: 400 }
      );
    }

    // Find blog post by slug or ID
    let blogPost;
    if (isValidObjectId(slug)) {
      // If slug is a valid ObjectId, search by ID
      blogPost = await BlogPost.findById(slug).lean();
    } else {
      // Otherwise, search by slug
      blogPost = await BlogPost.findOne({ slug, isActive: true }).lean();
    }

    if (!blogPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 }
      );
    }

    // Increment view count (fire and forget)
    BlogPost.findByIdAndUpdate(blogPost._id, { $inc: { viewCount: 1 } }).exec();

    // Transform the response
    const transformedPost = {
      ...blogPost,
      id: blogPost._id.toString(),
      publishedAt: blogPost.publishedAt.toISOString().split("T")[0],
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedPost,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog post",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/[slug] - Update a specific blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug is required",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const updateData = await request.json();

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.viewCount;
    delete updateData.likesCount;

    // Find and update blog post
    let updatedPost;
    if (isValidObjectId(slug)) {
      updatedPost = await BlogPost.findByIdAndUpdate(slug, updateData, {
        new: true,
        runValidators: true,
      }).lean();
    } else {
      updatedPost = await BlogPost.findOneAndUpdate(
        { slug, isActive: true },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).lean();
    }

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedPost = {
      ...updatedPost,
      id: updatedPost._id.toString(),
      publishedAt: updatedPost.publishedAt.toISOString().split("T")[0],
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedPost,
      message: "Blog post updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating blog post:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      const mongoError = error as Error & {
        errors: Record<string, { message: string }>;
      };
      const validationErrors = Object.values(mongoError.errors).map(
        (err: { message: string }) => err.message
      );
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
      (error as { code: number }).code === 11000
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
        error: "Failed to update blog post",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/[slug] - Delete a specific blog post (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug is required",
        },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    let deletedPost;
    if (isValidObjectId(slug)) {
      deletedPost = await BlogPost.findByIdAndUpdate(
        slug,
        { isActive: false },
        { new: true }
      ).lean();
    } else {
      deletedPost = await BlogPost.findOneAndUpdate(
        { slug, isActive: true },
        { isActive: false },
        { new: true }
      ).lean();
    }

    if (!deletedPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete blog post",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/blog/[slug]/like - Increment likes for a blog post
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug is required",
        },
        { status: 400 }
      );
    }

    // Increment likes
    let updatedPost;
    if (isValidObjectId(slug)) {
      updatedPost = await BlogPost.findByIdAndUpdate(
        slug,
        { $inc: { likesCount: 1 } },
        { new: true }
      ).lean();
    } else {
      updatedPost = await BlogPost.findOneAndUpdate(
        { slug, isActive: true },
        { $inc: { likesCount: 1 } },
        { new: true }
      ).lean();
    }

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { likesCount: updatedPost.likesCount },
      message: "Blog post liked successfully",
    });
  } catch (error) {
    console.error("Error liking blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to like blog post",
      },
      { status: 500 }
    );
  }
}
