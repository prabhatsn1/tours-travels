import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for TypeScript
export interface ITourPackage extends Document {
  title: string;
  destination: string;
  duration: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
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
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }>;
  images: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema
const TourPackageSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
      maxlength: [100, "Destination cannot exceed 100 characters"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    highlights: [
      {
        type: String,
        trim: true,
        maxlength: [200, "Highlight cannot exceed 200 characters"],
      },
    ],
    inclusions: [
      {
        type: String,
        trim: true,
        maxlength: [200, "Inclusion cannot exceed 200 characters"],
      },
    ],
    exclusions: [
      {
        type: String,
        trim: true,
        maxlength: [200, "Exclusion cannot exceed 200 characters"],
      },
    ],
    difficulty: {
      type: String,
      required: [true, "Difficulty level is required"],
      enum: ["Easy", "Moderate", "Challenging"],
    },
    groupSize: {
      min: {
        type: Number,
        required: [true, "Minimum group size is required"],
        min: [1, "Minimum group size must be at least 1"],
      },
      max: {
        type: Number,
        required: [true, "Maximum group size is required"],
        min: [1, "Maximum group size must be at least 1"],
      },
    },
    departureDate: {
      type: String,
      required: [true, "Departure date is required"],
    },
    availableDates: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Adventure",
        "Cultural",
        "Relaxation",
        "Wildlife",
        "Honeymoon",
        "Family",
        "Luxury",
      ],
    },
    itinerary: [
      {
        day: {
          type: Number,
          required: true,
          min: 1,
        },
        title: {
          type: String,
          required: [true, "Day title is required"],
          trim: true,
          maxlength: [200, "Day title cannot exceed 200 characters"],
        },
        description: {
          type: String,
          required: [true, "Day description is required"],
          trim: true,
          maxlength: [1000, "Day description cannot exceed 1000 characters"],
        },
        activities: [
          {
            type: String,
            trim: true,
            maxlength: [100, "Activity cannot exceed 100 characters"],
          },
        ],
        meals: [
          {
            type: String,
            enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
          },
        ],
        accommodation: {
          type: String,
          trim: true,
          maxlength: [200, "Accommodation cannot exceed 200 characters"],
        },
      },
    ],
    images: [
      {
        type: String,
        validate: {
          validator: function (url: string) {
            return /^https?:\/\/.+/.test(url);
          },
          message: "Image must be a valid URL",
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
TourPackageSchema.index({ category: 1, featured: -1 });
TourPackageSchema.index({ price: 1 });
TourPackageSchema.index({ rating: -1 });
TourPackageSchema.index({
  destination: "text",
  title: "text",
  description: "text",
});

// Add virtual for discounted price calculation
TourPackageSchema.virtual("discountPercentage").get(function (
  this: ITourPackage
) {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Add virtual for average rating display
TourPackageSchema.virtual("averageRating").get(function (this: ITourPackage) {
  return this.reviewCount > 0
    ? (this.rating / this.reviewCount).toFixed(1)
    : "0.0";
});

// Pre-save middleware to validate group size
TourPackageSchema.pre("save", function (this: ITourPackage, next) {
  if (this.groupSize.min > this.groupSize.max) {
    next(
      new Error("Minimum group size cannot be greater than maximum group size")
    );
  } else {
    next();
  }
});

// Static method to find featured packages
TourPackageSchema.statics.findFeatured = function () {
  return this.find({ featured: true }).sort({ rating: -1, createdAt: -1 });
};

// Static method to find packages by category
TourPackageSchema.statics.findByCategory = function (category: string) {
  return this.find({ category }).sort({ rating: -1, createdAt: -1 });
};

// Static method to search packages
TourPackageSchema.statics.searchPackages = function (searchTerm: string) {
  return this.find(
    {
      $text: { $search: searchTerm },
    },
    {
      score: { $meta: "textScore" },
    }
  ).sort({
    score: { $meta: "textScore" },
  });
};

// Instance method to add review
TourPackageSchema.methods.addReview = function (rating: number) {
  this.rating =
    (this.rating * this.reviewCount + rating) / (this.reviewCount + 1);
  this.reviewCount += 1;
  return this.save();
};

// Create and export the model
const TourPackage: Model<ITourPackage> =
  mongoose.models.TourPackage ||
  mongoose.model<ITourPackage>("TourPackage", TourPackageSchema);

export default TourPackage;
