import {
  Destination,
  TourPackage,
  BlogPost,
  Testimonial,
  FAQ,
  Service,
  ContactInfo,
} from "@/types";

// Sample destinations data
export const destinations: Destination[] = [
  {
    id: "1",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    description:
      "Tropical paradise with stunning beaches, ancient temples, and vibrant culture.",
    images: [
      "/images/destinations/bali-1.jpg",
      "/images/destinations/bali-2.jpg",
    ],
    highlights: [
      "Beautiful beaches",
      "Ancient temples",
      "Rice terraces",
      "Vibrant nightlife",
    ],
    bestTimeToVisit: "April to October",
    averageRating: 4.8,
    reviewCount: 1250,
    startingPrice: 899,
    currency: "USD",
    tags: ["Beach", "Culture", "Adventure", "Tropical"],
    coordinates: { lat: -8.3405, lng: 115.092 },
  },
  {
    id: "2",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    description:
      "Iconic Greek island with whitewashed buildings and breathtaking sunsets.",
    images: [
      "/images/destinations/santorini-1.jpg",
      "/images/destinations/santorini-2.jpg",
    ],
    highlights: [
      "Stunning sunsets",
      "White architecture",
      "Wine tasting",
      "Volcanic beaches",
    ],
    bestTimeToVisit: "May to September",
    averageRating: 4.9,
    reviewCount: 980,
    startingPrice: 1299,
    currency: "USD",
    tags: ["Romance", "Island", "Culture", "Photography"],
    coordinates: { lat: 36.3932, lng: 25.4615 },
  },
  {
    id: "3",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    description:
      "Modern metropolis blending traditional culture with cutting-edge technology.",
    images: [
      "/images/destinations/tokyo-1.jpg",
      "/images/destinations/tokyo-2.jpg",
    ],
    highlights: [
      "Cherry blossoms",
      "Modern architecture",
      "Traditional temples",
      "Amazing food",
    ],
    bestTimeToVisit: "March to May, September to November",
    averageRating: 4.7,
    reviewCount: 2100,
    startingPrice: 1199,
    currency: "USD",
    tags: ["City", "Culture", "Food", "Technology"],
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
];

// Sample tour packages data
export const tourPackages: TourPackage[] = [
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
      "Experience the magic of Bali with our comprehensive tour package.",
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
      "Perfect romantic escape to the beautiful island of Santorini.",
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

// Sample blog posts
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 10 Hidden Gems in Southeast Asia",
    slug: "hidden-gems-southeast-asia",
    excerpt:
      "Discover the most beautiful and lesser-known destinations in Southeast Asia.",
    content: "Full blog content here...",
    author: {
      name: "Sarah Johnson",
      avatar: "/images/authors/sarah.jpg",
      bio: "Travel writer and photographer with 10+ years of experience.",
    },
    publishedAt: "2025-01-15",
    readTime: 8,
    category: "Destinations",
    tags: ["Southeast Asia", "Hidden Gems", "Travel Tips"],
    featuredImage: "/images/blog/hidden-gems.jpg",
    images: ["/images/blog/hidden-gems-1.jpg"],
    seo: {
      metaTitle: "Top 10 Hidden Gems in Southeast Asia - Travel Guide",
      metaDescription:
        "Explore the most beautiful hidden destinations in Southeast Asia.",
      keywords: ["Southeast Asia", "hidden gems", "travel", "destinations"],
    },
  },
];

// Sample testimonials
export const testimonials: Testimonial[] = [
  {
    id: "1",
    customerName: "John & Emily Smith",
    customerImage: "/images/customers/john-emily.jpg",
    location: "New York, USA",
    rating: 5,
    review:
      "Our honeymoon in Bali was absolutely magical! The team organized everything perfectly.",
    tourTitle: "Magical Bali Adventure",
    travelDate: "2024-12-01",
    verified: true,
  },
  {
    id: "2",
    customerName: "Maria Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    review:
      "Santorini exceeded all expectations. The sunset views were breathtaking!",
    tourTitle: "Santorini Romantic Getaway",
    travelDate: "2024-11-15",
    verified: true,
  },
];

// Sample FAQs
export const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I make a booking?",
    answer:
      "You can make a booking through our website, by calling us, or visiting our office.",
    category: "Booking",
    order: 1,
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer: "We accept credit cards, bank transfers, and PayPal payments.",
    category: "Payment",
    order: 2,
  },
  {
    id: "3",
    question: "Can I cancel my booking?",
    answer:
      "Yes, cancellations are allowed according to our cancellation policy.",
    category: "Cancellation",
    order: 3,
  },
];

// Sample services
export const services: Service[] = [
  {
    id: "1",
    name: "Visa Assistance",
    description: "Complete visa application support and documentation",
    icon: "DocumentText",
    features: [
      "Document verification",
      "Application submission",
      "Status tracking",
    ],
    startingPrice: 50,
    currency: "USD",
  },
  {
    id: "2",
    name: "Travel Insurance",
    description: "Comprehensive travel insurance coverage",
    icon: "Shield",
    features: ["Medical coverage", "Trip cancellation", "24/7 support"],
    startingPrice: 25,
    currency: "USD",
  },
  {
    id: "3",
    name: "Flight Booking",
    description: "Best deals on international and domestic flights",
    icon: "Airplane",
    features: ["Price comparison", "Flexible dates", "Seat selection"],
  },
  {
    id: "4",
    name: "Hotel Booking",
    description: "Accommodation booking worldwide",
    icon: "Building",
    features: ["Best rates", "Free cancellation", "Quality assurance"],
  },
];

// Contact information
export const contactInfo: ContactInfo = {
  email: "info@wanderlusttravel.com",
  phone: "+1 (555) 123-4567",
  whatsapp: "+1 (555) 123-4567",
  address: {
    street: "123 Travel Street",
    city: "New York",
    state: "NY",
    country: "USA",
    zipCode: "10001",
  },
  socialMedia: {
    facebook: "https://facebook.com/wanderlusttravel",
    instagram: "https://instagram.com/wanderlusttravel",
    twitter: "https://twitter.com/wanderlusttravel",
    youtube: "https://youtube.com/wanderlusttravel",
  },
  businessHours: {
    weekdays: "9:00 AM - 6:00 PM",
    weekends: "10:00 AM - 4:00 PM",
  },
};
