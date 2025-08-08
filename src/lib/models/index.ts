import mongoose, { Schema, Document } from "mongoose";

// User interface for authentication and user management
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  isActive: boolean;
  preferences: {
    destinations: string[];
    budget: {
      min: number;
      max: number;
    };
    travelStyle: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      destinations: [String],
      budget: {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 10000,
        },
      },
      travelStyle: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Booking interface for managing tour bookings
export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  travelers: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    passportNumber?: string;
    nationality: string;
    email: string;
    phone: string;
  }[];
  totalAmount: number;
  paidAmount: number;
  currency: string;
  bookingDate: Date;
  travelDate: Date;
  specialRequests?: string;
  paymentHistory: {
    amount: number;
    currency: string;
    method: "credit-card" | "bank-transfer" | "paypal" | "cash";
    status: "pending" | "completed" | "failed" | "refunded";
    transactionId: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "TourPackage",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    travelers: [
      {
        firstName: {
          type: String,
          required: true,
          trim: true,
        },
        lastName: {
          type: String,
          required: true,
          trim: true,
        },
        dateOfBirth: {
          type: Date,
          required: true,
        },
        passportNumber: String,
        nationality: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          lowercase: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    specialRequests: String,
    paymentHistory: [
      {
        amount: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          required: true,
        },
        method: {
          type: String,
          enum: ["credit-card", "bank-transfer", "paypal", "cash"],
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "failed", "refunded"],
          required: true,
        },
        transactionId: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Review interface for package and destination reviews
export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  packageId?: mongoose.Types.ObjectId;
  destinationId?: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "TourPackage",
    },
    destinationId: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    images: [String],
    helpful: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Inquiry interface for customer inquiries
export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  packageInterest?: mongoose.Types.ObjectId;
  destinationInterest?: mongoose.Types.ObjectId;
  status: "new" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  assignedTo?: mongoose.Types.ObjectId;
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    packageInterest: {
      type: Schema.Types.ObjectId,
      ref: "TourPackage",
    },
    destinationInterest: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    response: String,
  },
  {
    timestamps: true,
  }
);

// Create and export models
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export const Inquiry =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

// Export the Destination model from its own file
export { default as Destination } from "./Destination";
export type { IDestination } from "./Destination";
