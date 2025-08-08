// Base interfaces for the travel agency website

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  images: string[];
  highlights: string[];
  bestTimeToVisit: string;
  averageRating: number;
  reviewCount: number;
  startingPrice: number;
  currency: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  difficulty: "Easy" | "Moderate" | "Challenging";
  groupSize: {
    min: number;
    max: number;
  };
  departureDate: string;
  availableDates: string[];
  category:
    | "Adventure"
    | "Cultural"
    | "Relaxation"
    | "Wildlife"
    | "Honeymoon"
    | "Family"
    | "Luxury";
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featuredImage: string;
  images: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerImage?: string;
  location: string;
  rating: number;
  review: string;
  tourTitle: string;
  travelDate: string;
  verified: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  businessHours: {
    weekdays: string;
    weekends: string;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "Booking" | "Payment" | "Travel" | "Cancellation" | "General";
  order: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bookings: Booking[];
  preferences: {
    destinations: string[];
    budget: {
      min: number;
      max: number;
    };
    travelStyle: string[];
  };
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  travelers: Traveler[];
  totalAmount: number;
  paidAmount: number;
  currency: string;
  bookingDate: string;
  travelDate: string;
  specialRequests?: string;
  paymentHistory: Payment[];
}

export interface Traveler {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber?: string;
  nationality: string;
  email: string;
  phone: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: "Credit Card" | "Bank Transfer" | "PayPal" | "Cash";
  status: "Pending" | "Completed" | "Failed" | "Refunded";
  transactionId: string;
  date: string;
}

export interface SearchFilters {
  destination?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  budget?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
  category?: string[];
  difficulty?: string[];
  groupSize?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  startingPrice?: number;
  currency?: string;
}

// Form interfaces
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: "email" | "phone" | "whatsapp";
}

export interface BookingFormData {
  packageId: string;
  travelers: Traveler[];
  travelDate: string;
  specialRequests?: string;
  contactInfo: {
    email: string;
    phone: string;
  };
}

export interface NewsletterFormData {
  email: string;
  preferences: string[];
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
