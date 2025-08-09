import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import TourPackage from "@/lib/models/TourPackage";
import { isValidObjectId } from "mongoose";

/**
 * GET /api/packages/[id] - Get a specific tour package
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID is required",
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID format",
        },
        { status: 400 }
      );
    }

    // Find the package by ID
    const tourPackage = await TourPackage.findById(id).lean();

    if (!tourPackage) {
      return NextResponse.json(
        {
          success: false,
          error: "Tour package not found",
        },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedPackage = {
      ...tourPackage,
      id: tourPackage._id.toString(),
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedPackage,
    });
  } catch (error) {
    console.error("Error fetching tour package:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tour package",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/packages/[id] - Update a specific tour package
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID is required",
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID format",
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

    // Find and update the package
    const updatedPackage = await TourPackage.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedPackage) {
      return NextResponse.json(
        {
          success: false,
          error: "Tour package not found",
        },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedPackage = {
      ...updatedPackage,
      id: updatedPackage._id.toString(),
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedPackage,
      message: "Tour package updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating tour package:", error);

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

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update tour package",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/packages/[id] - Delete a specific tour package
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID is required",
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID format",
        },
        { status: 400 }
      );
    }

    // Find and delete the package
    const deletedPackage = await TourPackage.findByIdAndDelete(id).lean();

    if (!deletedPackage) {
      return NextResponse.json(
        {
          success: false,
          error: "Tour package not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tour package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tour package:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete tour package",
      },
      { status: 500 }
    );
  }
}
