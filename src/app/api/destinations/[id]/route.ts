import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import Destination from "@/lib/models/Destination";
import { isValidObjectId } from "mongoose";

/**
 * GET /api/destinations/[id] - Get a specific destination
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
          error: "Destination ID is required",
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid destination ID format",
        },
        { status: 400 }
      );
    }

    // Find the destination by ID
    const destination = await Destination.findById(id).lean();

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          error: "Destination not found",
        },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedDestination = {
      ...destination,
      id: destination._id.toString(),
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedDestination,
    });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch destination",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/destinations/[id] - Update a specific destination
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
          error: "Destination ID is required",
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid destination ID format",
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

    // Find and update the destination
    const updatedDestination = await Destination.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedDestination) {
      return NextResponse.json(
        {
          success: false,
          error: "Destination not found",
        },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedDestination = {
      ...updatedDestination,
      id: updatedDestination._id.toString(),
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedDestination,
      message: "Destination updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating destination:", error);

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
        error: "Failed to update destination",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/destinations/[id] - Delete a specific destination
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
          error: "Destination ID is required",
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid destination ID format",
        },
        { status: 400 }
      );
    }

    // Find and delete the destination
    const deletedDestination = await Destination.findByIdAndDelete(id).lean();

    if (!deletedDestination) {
      return NextResponse.json(
        {
          success: false,
          error: "Destination not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Destination deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete destination",
      },
      { status: 500 }
    );
  }
}
