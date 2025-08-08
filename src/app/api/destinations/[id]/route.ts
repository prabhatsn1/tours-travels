/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import Destination from "@/lib/models/Destination";
import { isValidObjectId } from "mongoose";

/**
 * GET /api/destinations/[id] - Get a specific destination by ID
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
          error: "Invalid destination ID format",
        },
        { status: 400 }
      );
    }

    // Find destination by ID
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
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { id } = params;
    const body = await request.json();

    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid destination ID format",
        },
        { status: 400 }
      );
    }

    // Update destination
    const destination = await Destination.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

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
      message: "Destination updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating destination:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
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
 * DELETE /api/destinations/[id] - Delete a specific destination (soft delete)
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
          error: "Invalid destination ID format",
        },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const destination = await Destination.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();

    if (!destination) {
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
