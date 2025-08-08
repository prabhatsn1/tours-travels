import { NextRequest, NextResponse } from "next/server";
import { TourPackage } from "@/types";

// This is a mock database - in a real application, you would use a proper database
export const packagesDB: TourPackage[] = [
  {
    id: "1",
    title: "Magical Bali Adventure",
    destination: "Bali, Indonesia",
    duration: "7 Days / 6 Nights",
    price: 899,
    originalPrice: 1199,
    currency: "USD",
    images: [
      "/images/packages/bali-package-1.jpg",
      "/images/packages/bali-package-2.jpg",
    ],
    description:
      "Experience the magic of Bali with our comprehensive tour package including cultural tours, beach activities, and temple visits.",
    highlights: [
      "Ubud Rice Terraces",
      "Temple Tours",
      "Beach Activities",
      "Cultural Shows",
    ],
    inclusions: [
      "Accommodation",
      "Daily Breakfast",
      "Airport Transfers",
      "Guided Tours",
    ],
    exclusions: [
      "International Flights",
      "Personal Expenses",
      "Travel Insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali",
        description: "Airport pickup and hotel check-in",
        activities: ["Airport transfer", "Hotel check-in", "Welcome dinner"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Ubud Cultural Tour",
        description: "Explore the cultural heart of Bali",
        activities: [
          "Rice terrace visit",
          "Temple tour",
          "Art market shopping",
        ],
        meals: ["Breakfast", "Lunch"],
        accommodation: "Ubud Resort",
      },
    ],
    difficulty: "Easy",
    groupSize: { min: 2, max: 15 },
    departureDate: "2025-03-15",
    availableDates: ["2025-03-15", "2025-04-01", "2025-04-15"],
    category: "Cultural",
    rating: 4.8,
    reviewCount: 156,
    featured: true,
  },
  {
    id: "2",
    title: "Santorini Romantic Getaway",
    destination: "Santorini, Greece",
    duration: "5 Days / 4 Nights",
    price: 1299,
    currency: "USD",
    images: ["/images/packages/santorini-package-1.jpg"],
    description:
      "Perfect romantic escape to the beautiful island of Santorini with stunning sunsets and luxury accommodation.",
    highlights: [
      "Sunset viewing",
      "Wine tasting",
      "Private tours",
      "Luxury accommodation",
    ],
    inclusions: [
      "5-star accommodation",
      "Daily breakfast",
      "Wine tours",
      "Sunset cruise",
    ],
    exclusions: [
      "International flights",
      "Lunches and dinners",
      "Personal expenses",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival and Oia Exploration",
        description: "Arrive and explore the famous Oia village",
        activities: ["Airport transfer", "Oia village tour", "Sunset viewing"],
        meals: ["Welcome drink"],
      },
    ],
    difficulty: "Easy",
    groupSize: { min: 2, max: 8 },
    departureDate: "2025-05-01",
    availableDates: ["2025-05-01", "2025-06-01", "2025-07-01"],
    category: "Honeymoon",
    rating: 4.9,
    reviewCount: 89,
    featured: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const packageData = await request.json();

    // Generate a unique ID for the new package
    const newId = (
      Math.max(...packagesDB.map((p) => parseInt(p.id)), 0) + 1
    ).toString();

    // Create the new package with default values
    const newPackage: TourPackage = {
      ...packageData,
      id: newId,
      currency: "USD",
      rating: 0,
      reviewCount: 0,
      featured: packageData.featured || false,
    };

    // Add to mock database
    packagesDB.push(newPackage);

    return NextResponse.json(
      {
        success: true,
        data: newPackage,
        message: "Package created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating package:", error);
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
    return NextResponse.json(
      {
        success: true,
        data: packagesDB,
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
