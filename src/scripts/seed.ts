import { connectWithMongoose, closeDatabaseConnection } from "../lib/mongodb";
import TourPackage from "../lib/models/TourPackage";
import Destination from "../lib/models/Destination";

// Sample destinations data for MongoDB
const sampleDestinations = [
  {
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    description:
      "Tropical paradise with stunning beaches, ancient temples, and vibrant culture. Experience the perfect blend of relaxation and adventure in this Indonesian gem.",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
    ],
    highlights: [
      "Beautiful beaches",
      "Ancient temples",
      "Rice terraces",
      "Vibrant nightlife",
      "Traditional arts",
    ],
    bestTimeToVisit: "April to October",
    averageRating: 4.8,
    reviewCount: 1250,
    startingPrice: 899,
    currency: "USD",
    tags: ["beach", "culture", "adventure", "tropical", "temples"],
    coordinates: { lat: -8.3405, lng: 115.092 },
    featured: true,
    isActive: true,
  },
  {
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    description:
      "Iconic Greek island with whitewashed buildings and breathtaking sunsets. Famous for its volcanic beaches, stunning architecture, and romantic atmosphere.",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    ],
    highlights: [
      "Stunning sunsets",
      "White architecture",
      "Wine tasting",
      "Volcanic beaches",
      "Luxury resorts",
    ],
    bestTimeToVisit: "May to September",
    averageRating: 4.9,
    reviewCount: 980,
    startingPrice: 1299,
    currency: "USD",
    tags: ["romance", "island", "culture", "photography", "wine"],
    coordinates: { lat: 36.3932, lng: 25.4615 },
    featured: true,
    isActive: true,
  },
  {
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    description:
      "Modern metropolis blending traditional culture with cutting-edge technology. Experience the perfect harmony of ancient traditions and futuristic innovation.",
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      "https://images.unsplash.com/photo-1513407030348-c983a97b98d8",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
    ],
    highlights: [
      "Cherry blossoms",
      "Modern architecture",
      "Traditional temples",
      "Amazing food",
      "Technology",
    ],
    bestTimeToVisit: "March to May, September to November",
    averageRating: 4.7,
    reviewCount: 2100,
    startingPrice: 1199,
    currency: "USD",
    tags: ["city", "culture", "food", "technology", "temples"],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    featured: true,
    isActive: true,
  },
  {
    name: "Paris",
    country: "France",
    region: "Europe",
    description:
      "The City of Light, famous for its art, fashion, gastronomy, and culture. Home to iconic landmarks like the Eiffel Tower and world-class museums.",
    images: [
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
      "https://images.unsplash.com/photo-1431274172761-fca41d930114",
      "https://images.unsplash.com/photo-1549144511-f099e773c147",
    ],
    highlights: [
      "Eiffel Tower",
      "Louvre Museum",
      "French cuisine",
      "Fashion capital",
      "Historic architecture",
    ],
    bestTimeToVisit: "April to June, September to November",
    averageRating: 4.6,
    reviewCount: 3200,
    startingPrice: 1599,
    currency: "USD",
    tags: ["culture", "art", "fashion", "romance", "history"],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    featured: false,
    isActive: true,
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    region: "South America",
    description:
      "Ancient Incan citadel set high in the Andes Mountains. One of the New Seven Wonders of the World and a UNESCO World Heritage Site.",
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
      "https://images.unsplash.com/photo-1526392060635-9d6019884377",
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4",
    ],
    highlights: [
      "Ancient ruins",
      "Mountain views",
      "Inca Trail",
      "Sacred Valley",
      "Alpaca encounters",
    ],
    bestTimeToVisit: "May to September",
    averageRating: 4.9,
    reviewCount: 1850,
    startingPrice: 899,
    currency: "USD",
    tags: ["adventure", "history", "mountains", "hiking", "culture"],
    coordinates: { lat: -13.1631, lng: -72.545 },
    featured: true,
    isActive: true,
  },
  {
    name: "Safari Kenya",
    country: "Kenya",
    region: "Africa",
    description:
      "Experience the ultimate African safari in Kenya's world-famous national parks. Witness the Great Migration and Big Five in their natural habitat.",
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801",
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0",
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44",
    ],
    highlights: [
      "Big Five animals",
      "Great Migration",
      "Masai culture",
      "Game drives",
      "Conservation",
    ],
    bestTimeToVisit: "July to October, January to March",
    averageRating: 4.8,
    reviewCount: 920,
    startingPrice: 2299,
    currency: "USD",
    tags: ["safari", "wildlife", "adventure", "nature", "photography"],
    coordinates: { lat: -1.2921, lng: 36.8219 },
    featured: false,
    isActive: true,
  },
];

// Sample tour packages data for MongoDB
const samplePackages = [
  {
    title: "Magical Bali Adventure",
    destination: "Bali, Indonesia",
    duration: "7 days, 6 nights",
    price: 1299,
    originalPrice: 1599,
    currency: "USD",
    description:
      "Discover the enchanting beauty of Bali with its pristine beaches, ancient temples, and vibrant culture. This comprehensive tour takes you through the best of what Bali has to offer.",
    highlights: [
      "Visit iconic Tanah Lot Temple",
      "Explore Ubud's rice terraces",
      "Traditional Balinese cooking class",
      "Snorkeling in crystal clear waters",
      "Sunrise hike at Mount Batur",
    ],
    inclusions: [
      "6 nights accommodation in 4-star hotels",
      "Daily breakfast and 3 dinners",
      "Private transportation with driver",
      "English-speaking guide",
      "All entrance fees",
      "Airport transfers",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Lunch (except specified)",
      "Tips and gratuities",
    ],
    difficulty: "Easy",
    groupSize: { min: 2, max: 12 },
    departureDate: "2025-03-15",
    availableDates: ["2025-03-15", "2025-04-10", "2025-05-12", "2025-06-08"],
    category: "Cultural",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Denpasar",
        description:
          "Welcome to Bali! Upon arrival at Ngurah Rai International Airport, you'll be greeted by our representative and transferred to your hotel in Ubud.",
        activities: ["Airport pickup", "Hotel check-in", "Welcome dinner"],
        meals: ["Dinner"],
        accommodation: "Ubud Resort & Spa",
      },
      {
        day: 2,
        title: "Ubud Cultural Tour",
        description:
          "Explore the cultural heart of Bali with visits to traditional villages, art markets, and the famous Monkey Forest Sanctuary.",
        activities: [
          "Tegallalang Rice Terraces",
          "Sacred Monkey Forest",
          "Ubud Art Market",
          "Traditional village visit",
        ],
        meals: ["Breakfast"],
        accommodation: "Ubud Resort & Spa",
      },
      {
        day: 3,
        title: "Temple Hopping & Cooking Class",
        description:
          "Visit some of Bali's most beautiful temples and learn to cook authentic Balinese cuisine.",
        activities: [
          "Tirta Empul Temple",
          "Gunung Kawi Temple",
          "Balinese cooking class",
        ],
        meals: ["Breakfast", "Lunch"],
        accommodation: "Ubud Resort & Spa",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62",
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 156,
  },
  {
    title: "Swiss Alps Adventure",
    destination: "Switzerland",
    duration: "10 days, 9 nights",
    price: 2899,
    originalPrice: 3299,
    currency: "USD",
    description:
      "Experience the breathtaking beauty of the Swiss Alps with scenic train rides, mountain hiking, and charming alpine villages.",
    highlights: [
      "Scenic train journey on Glacier Express",
      "Cable car ride to Jungfraujoch",
      "Lake cruise on Lake Geneva",
      "Visit to Matterhorn viewpoint",
      "Traditional Swiss cheese tasting",
    ],
    inclusions: [
      "9 nights in premium hotels",
      "Daily breakfast and 5 dinners",
      "All train tickets and cable car rides",
      "Professional tour guide",
      "Luggage handling",
      "Travel insurance",
    ],
    exclusions: [
      "International airfare",
      "Lunch meals",
      "Personal shopping",
      "Optional activities",
      "Beverages during meals",
    ],
    difficulty: "Moderate",
    groupSize: { min: 4, max: 16 },
    departureDate: "2025-06-20",
    availableDates: ["2025-06-20", "2025-07-15", "2025-08-10", "2025-09-05"],
    category: "Adventure",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Zurich",
        description:
          "Arrive in Zurich and transfer to your hotel. Evening at leisure to explore the old town.",
        activities: [
          "Airport transfer",
          "Hotel check-in",
          "Zurich old town walk",
        ],
        meals: ["Dinner"],
        accommodation: "Hotel Schweizerhof Zurich",
      },
      {
        day: 2,
        title: "Lucerne & Mount Pilatus",
        description:
          "Travel to Lucerne and take the cable car to Mount Pilatus for spectacular alpine views.",
        activities: [
          "Train to Lucerne",
          "Mount Pilatus cable car",
          "Lake Lucerne cruise",
        ],
        meals: ["Breakfast"],
        accommodation: "Hotel des Balances Lucerne",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "https://images.unsplash.com/photo-1527004760525-1a9a1c5dea85",
      "https://images.unsplash.com/photo-1506905668801-931ccb99ce85",
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 203,
  },
  {
    title: "Safari Adventure Kenya",
    destination: "Kenya",
    duration: "8 days, 7 nights",
    price: 2199,
    currency: "USD",
    description:
      "Embark on an unforgettable safari adventure through Kenya's most famous national parks and witness the Big Five in their natural habitat.",
    highlights: [
      "Game drives in Masai Mara",
      "Visit to Maasai village",
      "Amboseli National Park safari",
      "View of Mount Kilimanjaro",
      "Bird watching at Lake Nakuru",
    ],
    inclusions: [
      "7 nights safari lodge accommodation",
      "All meals during safari",
      "4WD safari vehicle with pop-up roof",
      "Professional safari guide",
      "Park entrance fees",
      "Airport transfers in Nairobi",
    ],
    exclusions: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Beverages and alcohol",
      "Personal expenses",
      "Optional balloon safari",
    ],
    difficulty: "Easy",
    groupSize: { min: 2, max: 8 },
    departureDate: "2025-08-15",
    availableDates: ["2025-08-15", "2025-09-12", "2025-10-08", "2025-11-05"],
    category: "Wildlife",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Nairobi",
        description:
          "Arrive at Jomo Kenyatta International Airport and transfer to your hotel in Nairobi.",
        activities: [
          "Airport pickup",
          "Hotel check-in",
          "Nairobi city briefing",
        ],
        meals: ["Dinner"],
        accommodation: "Nairobi Serena Hotel",
      },
      {
        day: 2,
        title: "Nairobi to Masai Mara",
        description:
          "Depart for Masai Mara National Reserve. Afternoon game drive to spot lions, elephants, and other wildlife.",
        activities: [
          "Drive to Masai Mara",
          "Afternoon game drive",
          "Sunset viewing",
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Mara Safari Lodge",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0",
    ],
    featured: true,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    title: "Romantic Paris Getaway",
    destination: "Paris, France",
    duration: "5 days, 4 nights",
    price: 1599,
    currency: "USD",
    description:
      "Fall in love with the City of Light on this romantic getaway featuring iconic landmarks, intimate dinners, and charming neighborhoods.",
    highlights: [
      "Seine river dinner cruise",
      "Private Eiffel Tower photo session",
      "Champagne tasting in Champagne region",
      "Louvre Museum skip-the-line access",
      "Romantic dinner at Michelin-starred restaurant",
    ],
    inclusions: [
      "4 nights in luxury hotel",
      "Daily breakfast",
      "Seine dinner cruise",
      "Private photography session",
      "Museum entrance fees",
      "Metro pass",
    ],
    exclusions: [
      "International flights",
      "Lunch meals",
      "Travel insurance",
      "Personal shopping",
      "Additional beverages",
    ],
    difficulty: "Easy",
    groupSize: { min: 2, max: 2 },
    departureDate: "2025-02-14",
    availableDates: ["2025-02-14", "2025-03-20", "2025-04-15", "2025-05-10"],
    category: "Honeymoon",
    itinerary: [
      {
        day: 1,
        title: "Arrival & Montmartre",
        description:
          "Arrive in Paris and explore the artistic neighborhood of Montmartre with its charming cobblestone streets.",
        activities: [
          "Airport transfer",
          "Montmartre walking tour",
          "Sacré-Cœur visit",
        ],
        meals: ["Breakfast"],
        accommodation: "Hotel Plaza Athénée",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
      "https://images.unsplash.com/photo-1508142723365-7ff83b31bb7a",
    ],
    featured: false,
    rating: 4.6,
    reviewCount: 124,
  },
  {
    title: "Japan Cultural Discovery",
    destination: "Japan",
    duration: "12 days, 11 nights",
    price: 3299,
    originalPrice: 3799,
    currency: "USD",
    description:
      "Immerse yourself in Japan's rich culture, from ancient temples to modern cities, experiencing traditional arts, cuisine, and hospitality.",
    highlights: [
      "Tokyo city highlights tour",
      "Traditional ryokan stay with kaiseki dinner",
      "Mount Fuji and Hakone region",
      "Kyoto temple and bamboo forest",
      "Traditional tea ceremony experience",
    ],
    inclusions: [
      "11 nights accommodation (mix of hotels and ryokans)",
      "Daily breakfast and 6 traditional dinners",
      "JR Pass for unlimited train travel",
      "English-speaking guides",
      "Cultural activities and workshops",
      "Airport transfers",
    ],
    exclusions: [
      "International flights",
      "Lunch meals",
      "Personal expenses",
      "Optional activities",
      "Travel insurance",
    ],
    difficulty: "Moderate",
    groupSize: { min: 6, max: 14 },
    departureDate: "2025-04-05",
    availableDates: ["2025-04-05", "2025-05-15", "2025-09-20", "2025-10-25"],
    category: "Cultural",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Tokyo",
        description:
          "Welcome to Japan! Arrive at Narita Airport and transfer to your hotel in central Tokyo.",
        activities: [
          "Airport transfer",
          "Hotel check-in",
          "Welcome orientation",
        ],
        meals: ["Dinner"],
        accommodation: "Hotel New Otani Tokyo",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      "https://images.unsplash.com/photo-1528164344705-47542687000d",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9",
    ],
    featured: false,
    rating: 4.8,
    reviewCount: 167,
  },
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to MongoDB
    await connectWithMongoose();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([TourPackage.deleteMany({}), Destination.deleteMany({})]);
    console.log("🗑️  Cleared existing data");

    // Insert destinations
    const insertedDestinations = await Destination.insertMany(
      sampleDestinations
    );
    console.log(`✅ Inserted ${insertedDestinations.length} destinations`);

    // Insert tour packages
    const insertedPackages = await TourPackage.insertMany(samplePackages);
    console.log(`✅ Inserted ${insertedPackages.length} tour packages`);

    // Create indexes for better performance
    await Promise.all([
      TourPackage.createIndexes(),
      Destination.createIndexes(),
    ]);
    console.log("✅ Created database indexes");

    console.log("🎉 Database seeding completed successfully!");

    // Summary
    console.log("\n📊 Seeding Summary:");
    console.log(`   • ${insertedDestinations.length} destinations`);
    console.log(`   • ${insertedPackages.length} tour packages`);
    console.log(`   • Database indexes created`);
    console.log(`   • All collections ready for use\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
