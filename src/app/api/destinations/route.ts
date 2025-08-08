/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import Destination from "@/lib/models/Destination";

/**
 * GET /api/destinations - Get all destinations with filtering, search, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const search = searchParams.get("search") || "";
    const region = searchParams.get("region") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const tags = searchParams.get("tags");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build filter object
    const filter: any = { isActive: true };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Region filter
    if (region && region !== "All") {
      filter.region = region;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.startingPrice = {};
      if (minPrice) filter.startingPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.startingPrice.$lte = parseFloat(maxPrice);
    }

    // Featured filter
    if (featured === "true") {
      filter.featured = true;
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
      filter.tags = { $in: tagArray };
    }

    // Build sort object
    const sort: any = {};
    switch (sortBy) {
      case "price":
        sort.startingPrice = sortOrder === "desc" ? -1 : 1;
        break;
      case "rating":
        sort.averageRating = sortOrder === "desc" ? -1 : 1;
        break;
      case "reviews":
        sort.reviewCount = sortOrder === "desc" ? -1 : 1;
        break;
      case "name":
      default:
        sort.name = sortOrder === "desc" ? -1 : 1;
        break;
    }

    // If text search is used, sort by relevance score first
    if (search) {
      sort.score = { $meta: "textScore" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with aggregation for better performance
    const [destinations, totalCount] = await Promise.all([
      Destination.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Destination.countDocuments(filter),
    ]);

    // Transform the response
    const transformedDestinations = destinations.map((dest) => ({
      ...dest,
      id: dest._id.toString(),
      _id: undefined,
      __v: undefined,
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: transformedDestinations,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch destinations",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/destinations - Create a new destination
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "country",
      "region",
      "description",
      "images",
      "highlights",
      "bestTimeToVisit",
      "startingPrice",
      "tags",
      "coordinates",
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

    // Create new destination
    const destination = new Destination(body) as typeof Destination.prototype;
    await destination.save();

    // Transform the response
    const transformedDestination = {
      ...destination.toObject(),
      id: destination._id.toString(),
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: transformedDestination,
        message: "Destination created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating destination:", error);

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
        error: "Failed to create destination",
      },
      { status: 500 }
    );
  }
}
