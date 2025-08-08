import { connectWithMongoose, closeDatabaseConnection } from "../lib/mongodb";
import TourPackage from "../lib/models/TourPackage";
import Destination from "../lib/models/Destination";
import BlogPost from "../lib/models/BlogPost";

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

// Sample blog posts data for MongoDB
const sampleBlogPosts = [
  {
    title: "Top 10 Hidden Gems in Southeast Asia",
    slug: "hidden-gems-southeast-asia",
    excerpt:
      "Discover the most beautiful and lesser-known destinations in Southeast Asia that will take your breath away.",
    content: `
      <h2>Discover Southeast Asia's Best Kept Secrets</h2>
      <p>Southeast Asia is renowned for its popular destinations like Bali, Thailand's beaches, and Singapore's urban attractions. However, the region holds countless hidden gems waiting to be explored by adventurous travelers.</p>

      <h3>1. Kampot, Cambodia</h3>
      <p>This charming riverside town offers French colonial architecture, famous pepper farms, and stunning sunset views along the Kampot River. It's the perfect place to slow down and experience authentic Cambodian culture.</p>

      <h3>2. Hsipaw, Myanmar</h3>
      <p>A small town in Shan State offering incredible trekking opportunities through rice terraces and ethnic minority villages. The overnight train journey from Mandalay is an adventure in itself.</p>

      <h3>3. Nusa Penida, Indonesia</h3>
      <p>While Bali gets all the attention, this nearby island offers dramatic clifftop views, pristine beaches, and excellent diving spots without the crowds.</p>

      <h3>4. Con Dao Islands, Vietnam</h3>
      <p>A former prison island turned national park, featuring pristine beaches, historical sites, and some of the best diving in Vietnam.</p>

      <h3>5. Kep, Cambodia</h3>
      <p>Famous for its crab market and abandoned French villas, this coastal town offers a glimpse into Cambodia's colonial past and excellent seafood.</p>
    `,
    author: {
      name: "Sarah Johnson",
      avatar: "/images/authors/sarah.jpg",
      bio: "Travel writer and photographer with 10+ years of experience exploring Southeast Asia.",
    },
    publishedAt: new Date("2025-01-15"),
    readTime: 8,
    category: "Destinations",
    tags: [
      "southeast asia",
      "hidden gems",
      "travel tips",
      "adventure",
      "culture",
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1528181304800-259b08848526",
    images: [
      "https://images.unsplash.com/photo-1540611025311-01df3cef54b5",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    ],
    seo: {
      metaTitle: "Top 10 Hidden Gems in Southeast Asia - Travel Guide",
      metaDescription:
        "Explore the most beautiful hidden destinations in Southeast Asia with our comprehensive travel guide.",
      keywords: [
        "southeast asia",
        "hidden gems",
        "travel",
        "destinations",
        "adventure",
      ],
    },
    featured: true,
    isActive: true,
    viewCount: 1250,
    likesCount: 89,
  },
  {
    title: "Essential Travel Photography Tips for Beginners",
    slug: "travel-photography-tips-beginners",
    excerpt:
      "Capture stunning memories of your travels with these professional photography tips and techniques.",
    content: `
      <h2>Introduction to Travel Photography</h2>
      <p>Travel photography is one of the most rewarding forms of photography, allowing you to capture memories and share the beauty of the world with others.</p>

      <h3>1. Plan Your Shots</h3>
      <p>Research your destination before you arrive. Look up iconic viewpoints, local customs, and the best times for photography. Golden hour provides the most flattering light.</p>

      <h3>2. Master the Rule of Thirds</h3>
      <p>Divide your frame into nine equal sections. Place important elements along these lines or at their intersections for more balanced compositions.</p>

      <h3>3. Include People in Your Shots</h3>
      <p>Adding people to landscape photos provides scale and human interest. Always ask permission when photographing locals.</p>

      <h3>4. Pack Light but Smart</h3>
      <p>Bring versatile lenses. A 24-70mm lens handles most travel scenarios, while a 50mm prime is excellent for street photography.</p>

      <h3>5. Backup Your Photos</h3>
      <p>Always have a backup plan. Use cloud storage, multiple memory cards, or portable hard drives to protect your memories.</p>
    `,
    author: {
      name: "Mike Chen",
      avatar: "/images/authors/mike.jpg",
      bio: "Professional travel photographer and content creator with over 8 years of experience.",
    },
    publishedAt: new Date("2025-01-12"),
    readTime: 6,
    category: "Photography",
    tags: [
      "photography",
      "travel tips",
      "beginner guide",
      "camera",
      "techniques",
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
    images: [
      "https://images.unsplash.com/photo-1471731921163-25c01da1b8fd",
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552",
    ],
    seo: {
      metaTitle: "Travel Photography Tips for Beginners - Complete Guide",
      metaDescription:
        "Learn professional travel photography techniques to capture amazing photos during your trips.",
      keywords: [
        "travel photography",
        "photography tips",
        "beginner guide",
        "camera techniques",
      ],
    },
    featured: false,
    isActive: true,
    viewCount: 892,
    likesCount: 56,
  },
  {
    title: "Budget Travel: How to See the World for Less",
    slug: "budget-travel-guide",
    excerpt:
      "Discover proven strategies to travel the world on a budget without compromising on experiences.",
    content: `
      <h2>Travel More, Spend Less</h2>
      <p>Traveling on a budget doesn't mean sacrificing quality experiences. With careful planning and smart strategies, you can explore amazing destinations without breaking the bank.</p>

      <h3>1. Use Budget Airlines and Be Flexible</h3>
      <p>Book flights during off-peak seasons and be flexible with your dates. Use comparison sites like Skyscanner to find the best deals.</p>

      <h3>2. Stay in Alternative Accommodations</h3>
      <p>Hostels, Airbnb, and homestays often provide better value than hotels. Many hostels now offer private rooms with authentic local experiences.</p>

      <h3>3. Eat Like a Local</h3>
      <p>Street food and local markets offer delicious meals at a fraction of restaurant prices. Cook your own meals when possible.</p>

      <h3>4. Use Public Transportation</h3>
      <p>Public transport is usually much cheaper than taxis. Many cities offer tourist passes with unlimited transport and attraction discounts.</p>

      <h3>5. Free Activities and Attractions</h3>
      <p>Research free walking tours, museums with free days, parks, beaches, and hiking trails. Many cities offer incredible free experiences.</p>
    `,
    author: {
      name: "Lisa Rodriguez",
      avatar: "/images/authors/lisa.jpg",
      bio: "Budget travel expert and digital nomad who has visited 50+ countries on a shoestring budget.",
    },
    publishedAt: new Date("2025-01-10"),
    readTime: 10,
    category: "Budget Travel",
    tags: [
      "budget travel",
      "money saving",
      "travel hacks",
      "backpacking",
      "tips",
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
    images: ["https://images.unsplash.com/photo-1531973576160-7125cd663d86"],
    seo: {
      metaTitle: "Budget Travel Guide - See the World for Less",
      metaDescription:
        "Learn how to travel on a budget with expert tips and money-saving strategies.",
      keywords: [
        "budget travel",
        "cheap travel",
        "travel tips",
        "backpacking",
        "money saving",
      ],
    },
    featured: false,
    isActive: true,
    viewCount: 1456,
    likesCount: 134,
  },
  {
    title: "The Ultimate Packing Checklist for International Travel",
    slug: "international-travel-packing-checklist",
    excerpt:
      "Never forget anything important again with our comprehensive international travel packing guide.",
    content: `
      <h2>Master the Art of Packing</h2>
      <p>Packing efficiently for international travel can make or break your trip. Here's your ultimate checklist to ensure you're prepared for any adventure.</p>

      <h3>Essential Documents</h3>
      <ul>
        <li>Passport (valid for at least 6 months)</li>
        <li>Visa (if required)</li>
        <li>Travel insurance documents</li>
        <li>Flight tickets and hotel confirmations</li>
        <li>Driver's license (international if needed)</li>
      </ul>

      <h3>Electronics and Gadgets</h3>
      <ul>
        <li>Smartphone and charger</li>
        <li>Universal power adapter</li>
        <li>Portable power bank</li>
        <li>Camera and extra batteries</li>
        <li>Headphones</li>
      </ul>

      <h3>Clothing Essentials</h3>
      <ul>
        <li>Weather-appropriate clothing</li>
        <li>Comfortable walking shoes</li>
        <li>Formal outfit for special occasions</li>
        <li>Underwear and socks (pack extra)</li>
        <li>Swimwear and sun hat</li>
      </ul>

      <h3>Health and Safety</h3>
      <ul>
        <li>Prescription medications</li>
        <li>First aid kit basics</li>
        <li>Sunscreen and insect repellent</li>
        <li>Hand sanitizer</li>
        <li>Travel-sized toiletries</li>
      </ul>
    `,
    author: {
      name: "David Park",
      avatar: "/images/authors/david.jpg",
      bio: "Professional travel consultant with expertise in international travel logistics.",
    },
    publishedAt: new Date("2025-01-08"),
    readTime: 7,
    category: "Travel Tips",
    tags: [
      "packing",
      "travel tips",
      "international travel",
      "checklist",
      "preparation",
    ],
    featuredImage: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"],
    seo: {
      metaTitle: "International Travel Packing Checklist - Complete Guide",
      metaDescription:
        "Complete packing checklist for international travel with essential items and tips.",
      keywords: [
        "packing checklist",
        "travel packing",
        "international travel",
        "travel tips",
      ],
    },
    featured: false,
    isActive: true,
    viewCount: 743,
    likesCount: 42,
  },
  {
    title: "Best Street Food Destinations Around the World",
    slug: "best-street-food-destinations",
    excerpt:
      "Embark on a culinary journey through the world's most incredible street food scenes.",
    content: `
      <h2>A Culinary Adventure Awaits</h2>
      <p>Street food offers the most authentic taste of local culture. Here are the world's best destinations for food lovers seeking authentic flavors.</p>

      <h3>Bangkok, Thailand</h3>
      <p>From pad thai to mango sticky rice, Bangkok's street food scene is legendary. Visit Chatuchak Weekend Market for the best variety.</p>

      <h3>Istanbul, Turkey</h3>
      <p>Turkish street food combines European and Asian influences. Don't miss the döner kebab, börek, and Turkish delight.</p>

      <h3>Mexico City, Mexico</h3>
      <p>Tacos, quesadillas, and elote (grilled corn) are just the beginning. The city's street food culture is rich and diverse.</p>

      <h3>Mumbai, India</h3>
      <p>From vada pav to pani puri, Mumbai's street food is flavorful and affordable. Be sure to eat at busy stalls for freshness.</p>

      <h3>Tokyo, Japan</h3>
      <p>While expensive, Tokyo's street food offers incredible quality. Try takoyaki, taiyaki, and yakitori from local vendors.</p>
    `,
    author: {
      name: "Maria Santos",
      avatar: "/images/authors/maria.jpg",
      bio: "Food blogger and culinary travel enthusiast who has tasted street food in over 40 countries.",
    },
    publishedAt: new Date("2025-01-05"),
    readTime: 9,
    category: "Food",
    tags: [
      "street food",
      "food travel",
      "culture",
      "local cuisine",
      "destinations",
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
    ],
    seo: {
      metaTitle: "Best Street Food Destinations Around the World",
      metaDescription:
        "Discover the world's best street food destinations and must-try dishes for food lovers.",
      keywords: [
        "street food",
        "food travel",
        "destinations",
        "local cuisine",
        "food guide",
      ],
    },
    featured: false,
    isActive: true,
    viewCount: 634,
    likesCount: 28,
  },
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to MongoDB
    await connectWithMongoose();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      TourPackage.deleteMany({}),
      Destination.deleteMany({}),
      BlogPost.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Insert destinations
    const insertedDestinations = await Destination.insertMany(
      sampleDestinations
    );
    console.log(`✅ Inserted ${insertedDestinations.length} destinations`);

    // Insert tour packages
    const insertedPackages = await TourPackage.insertMany(samplePackages);
    console.log(`✅ Inserted ${insertedPackages.length} tour packages`);

    // Insert blog posts
    const insertedBlogPosts = await BlogPost.insertMany(sampleBlogPosts);
    console.log(`✅ Inserted ${insertedBlogPosts.length} blog posts`);

    // Create indexes for better performance
    await Promise.all([
      TourPackage.createIndexes(),
      Destination.createIndexes(),
      BlogPost.createIndexes(),
    ]);
    console.log("✅ Created database indexes");

    console.log("🎉 Database seeding completed successfully!");

    // Summary
    console.log("\n📊 Seeding Summary:");
    console.log(`   • ${insertedDestinations.length} destinations`);
    console.log(`   • ${insertedPackages.length} tour packages`);
    console.log(`   • ${insertedBlogPosts.length} blog posts`);
    console.log(`   • All with proper indexing for optimal performance\n`);

    console.log("🚀 Your application is ready to use!");
    console.log("   • Visit /packages to see tour packages");
    console.log("   • Visit /destinations to see destinations");
    console.log("   • Visit /blog to see blog posts");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    // Close database connection
    await closeDatabaseConnection();
    console.log("🔌 Database connection closed");
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}
