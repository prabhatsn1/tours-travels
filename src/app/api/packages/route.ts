import { NextRequest, NextResponse } from "next/server";
import { connectWithMongoose } from "@/lib/mongodb";
import TourPackage from "@/lib/models/TourPackage";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    const packageData = await request.json();

    // Create the new package with the TourPackage model
    const newPackage = new TourPackage({
      ...packageData,
      rating: 0,
      reviewCount: 0,
      featured: packageData.featured || false,
    });

    // Save to database
    const savedPackage = await newPackage.save();

    // Transform the response to match the expected format
    const transformedPackage = {
      ...savedPackage.toObject(),
      id: savedPackage._id?.toString(),
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: transformedPackage,
        message: "Package created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating package:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create package",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await connectWithMongoose();

    // Fetch all packages from database
    const packages = await TourPackage.find({}).lean();

    // Transform the response to match the expected format
    const transformedPackages = packages.map((pkg) => ({
      ...pkg,
      id: pkg._id?.toString(),
      _id: undefined,
      __v: undefined,
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedPackages,
        message: "Packages retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch packages",
      },
      { status: 500 }
    );
  }
}
