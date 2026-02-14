import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import TourPackage from "@/lib/models/TourPackage";
import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

// Type definitions for better type safety
interface MongoDocument {
  _id: Types.ObjectId;
  __v?: number;
  [key: string]: unknown;
}

interface TransformedDocument {
  id: string;
  [key: string]: unknown;
}

// Validation schemas
const updatePackageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  destination: z.string().min(1).max(100).optional(),
  duration: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  originalPrice: z.number().min(0).optional(),
  currency: z.enum(["USD", "EUR", "GBP", "JPY", "AUD", "CAD"]).optional(),
  description: z.string().min(1).max(2000).optional(),
  highlights: z.array(z.string().max(200)).optional(),
  inclusions: z.array(z.string().max(200)).optional(),
  exclusions: z.array(z.string().max(200)).optional(),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]).optional(),
  groupSize: z
    .object({
      min: z.number().min(1),
      max: z.number().min(1),
    })
    .refine((data) => data.min <= data.max, {
      message: "Minimum group size cannot be greater than maximum group size",
    })
    .optional(),
  departureDate: z.string().optional(),
  availableDates: z.array(z.string()).optional(),
  category: z
    .enum([
      "Adventure",
      "Cultural",
      "Relaxation",
      "Wildlife",
      "Honeymoon",
      "Family",
      "Luxury",
    ])
    .optional(),
  itinerary: z
    .array(
      z.object({
        day: z.number().min(1),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(1000),
        activities: z.array(z.string().max(100)),
        meals: z.array(z.enum(["Breakfast", "Lunch", "Dinner", "Snacks"])),
        accommodation: z.string().max(200).optional(),
      })
    )
    .optional(),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
});

// Helper function to transform MongoDB document
const transformPackage = (
  pkg: MongoDocument | null
): TransformedDocument | null => {
  if (!pkg) return null;

  const { _id, ...rest } = pkg;

  return {
    ...rest,
    id: _id.toString(),
  };
};

// Helper function to validate and parse query parameters
const parseQueryParams = (searchParams: URLSearchParams) => {
  const fields = searchParams.get("fields");
  const includeVirtuals = searchParams.get("includeVirtuals") === "true";

  return { fields, includeVirtuals };
};

// Helper function to log requests
const logRequest = (method: string, id: string, userAgent?: string) => {
  console.log(`[${new Date().toISOString()}] ${method} /api/packages/${id}`, {
    userAgent,
    timestamp: new Date().toISOString(),
  });
};

/**
 * GET /api/packages/[id] - Get a specific tour package
 * Query parameters:
 * - fields: comma-separated list of fields to include (e.g., "title,price,description")
 * - includeVirtuals: whether to include virtual fields like discountPercentage
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userAgent = request.headers.get("user-agent") || undefined;

    logRequest("GET", id, userAgent);

    // Validate package ID
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID is required",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID format",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectWithMongoose();

    // Parse query parameters
    const { fields, includeVirtuals } = parseQueryParams(searchParams);

    // Build query with optional field selection
    let tourPackage: MongoDocument | null;

    if (fields) {
      const fieldList = fields
        .split(",")
        .map((f) => f.trim())
        .join(" ");
      tourPackage = (await TourPackage.findById(id)
        .select(fieldList)
        .lean()) as MongoDocument | null;
    } else {
      tourPackage = (await TourPackage.findById(
        id
      ).lean()) as MongoDocument | null;
    }

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
    const transformedPackage = transformPackage(tourPackage);

    // Add virtual fields if requested
    if (includeVirtuals && !fields && transformedPackage) {
      const packageWithVirtuals = await TourPackage.findById(id);
      if (packageWithVirtuals) {
        (transformedPackage as Record<string, unknown>).discountPercentage =
          packageWithVirtuals.get("discountPercentage");
        (transformedPackage as Record<string, unknown>).averageRating =
          packageWithVirtuals.get("averageRating");
      }
    }

    // Set cache headers for GET requests
    const response = NextResponse.json({
      success: true,
      data: transformedPackage,
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching tour package:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tour package",
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : String(error),
        }),
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
    const { id } = await params;
    const userAgent = request.headers.get("user-agent") || undefined;

    logRequest("PUT", id, userAgent);

    // Validate package ID
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID is required",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID format",
        },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let updateData;
    try {
      updateData = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    // Validate update data with Zod
    const validationResult = updatePackageSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Connect to MongoDB
    await connectWithMongoose();

    // Check if package exists first
    const existingPackage = await TourPackage.findById(id);
    if (!existingPackage) {
      return NextResponse.json(
        {
          success: false,
          error: "Tour package not found",
        },
        { status: 404 }
      );
    }

    // Update the package
    const updatedPackage = await TourPackage.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    // Transform the response
    const transformedPackage = transformPackage(
      updatedPackage as MongoDocument | null
    );

    return NextResponse.json({
      success: true,
      data: transformedPackage,
      message: "Tour package updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating tour package:", error);

    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
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

      if (error.name === "CastError") {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid data type in request",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update tour package",
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : String(error),
        }),
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
    const { id } = await params;
    const userAgent = request.headers.get("user-agent") || undefined;

    logRequest("DELETE", id, userAgent);

    // Validate package ID
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Package ID is required",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package ID format",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectWithMongoose();

    // Check if package exists and get it before deletion
    const existingPackage = await TourPackage.findById(id).lean();
    if (!existingPackage) {
      return NextResponse.json(
        {
          success: false,
          error: "Tour package not found",
        },
        { status: 404 }
      );
    }

    // Delete the package
    await TourPackage.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Tour package deleted successfully",
      data: {
        deletedId: id,
        deletedTitle: existingPackage.title,
      },
    });
  } catch (error) {
    console.error("Error deleting tour package:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete tour package",
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : String(error),
        }),
      },
      { status: 500 }
    );
  }
}
