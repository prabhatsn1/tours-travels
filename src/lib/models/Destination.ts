import mongoose, { Document, Model, Schema } from "mongoose";

// Destination interface
export interface IDestination extends Document {
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
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Destination schema
const DestinationSchema = new Schema<IDestination>(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true,
      maxlength: [100, "Destination name cannot exceed 100 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      maxlength: [50, "Country name cannot exceed 50 characters"],
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      enum: [
        "Asia",
        "Europe",
        "North America",
        "South America",
        "Africa",
        "Oceania",
      ],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    images: {
      type: [String],
      validate: {
        validator: function (images: string[]) {
          return images.length > 0;
        },
        message: "At least one image is required",
      },
    },
    highlights: {
      type: [String],
      validate: {
        validator: function (highlights: string[]) {
          return highlights.length > 0;
        },
        message: "At least one highlight is required",
      },
    },
    bestTimeToVisit: {
      type: String,
      required: [true, "Best time to visit is required"],
      trim: true,
    },
    averageRating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: [0, "Review count cannot be negative"],
      default: 0,
    },
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "USD",
      enum: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"],
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags: string[]) {
          return tags.length > 0;
        },
        message: "At least one tag is required",
      },
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
        min: [-90, "Latitude must be between -90 and 90"],
        max: [90, "Latitude must be between -90 and 90"],
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
        min: [-180, "Longitude must be between -180 and 180"],
        max: [180, "Longitude must be between -180 and 180"],
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
DestinationSchema.index({ region: 1, featured: -1 });
DestinationSchema.index({ startingPrice: 1 });
DestinationSchema.index({ averageRating: -1 });
DestinationSchema.index({ country: 1, region: 1 });
DestinationSchema.index({ coordinates: "2dsphere" }); // For location-based queries
DestinationSchema.index({
  name: "text",
  country: "text",
  description: "text",
  tags: "text",
});

// Add virtual for formatted rating
DestinationSchema.virtual("formattedRating").get(function (this: IDestination) {
  return this.reviewCount > 0 ? this.averageRating.toFixed(1) : "0.0";
});

// Pre-save middleware for validation
DestinationSchema.pre("save", function (this: IDestination, next) {
  // Ensure tags are trimmed and lowercase
  this.tags = this.tags.map((tag) => tag.trim().toLowerCase());

  // Ensure highlights are trimmed
  this.highlights = this.highlights.map((highlight) => highlight.trim());

  next();
});

// Create and export the model
const Destination: Model<IDestination> =
  mongoose.models.Destination ||
  mongoose.model<IDestination>("Destination", DestinationSchema);

export default Destination;
