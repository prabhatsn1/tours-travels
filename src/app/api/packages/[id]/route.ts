import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import TourPackage from "@/lib/models/TourPackage";
import { isValidObjectId } from "mongoose";

/**
 * GET /api/packages/[id] - Get a specific tour package by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID format",
        },
        { status: 400 }
      );
    }

    // Find package by ID
    const packageDoc = await TourPackage.findById(id).lean();

    if (!packageDoc) {
      return NextResponse.json(
        {
          success: false,
          error: "Package not found",
        },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedPackage = {
      ...packageDoc,
      id: packageDoc._id.toString(),
      _id: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedPackage,
    });
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch package",
        details: error instanceof Error ? error.message : "Unknown error",
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
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { id } = params;

    // Validate MongoDB ObjectId
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

    // Update package
    const updatedPackage = await TourPackage.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run schema validation
    }).lean();

    if (!updatedPackage) {
      return NextResponse.json(
        {
          success: false,
          error: "Package not found",
        },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedPackage = {
      ...updatedPackage,
      id: updatedPackage._id.toString(),
      _id: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedPackage,
      message: "Package updated successfully",
    });
  } catch (error) {
    console.error("Error updating package:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update package",
        details: error instanceof Error ? error.message : "Unknown error",
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
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID format",
        },
        { status: 400 }
      );
    }

    // Delete package
    const deletedPackage = await TourPackage.findByIdAndDelete(id);

    if (!deletedPackage) {
      return NextResponse.json(
        {
          success: false,
          error: "Package not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete package",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
