import mongoose, { Document, Model, Schema } from "mongoose";

// BlogPost interface
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: Date;
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
  featured: boolean;
  isActive: boolean;
  viewCount: number;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// BlogPost schema
const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, "Blog post title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [100, "Slug cannot exceed 100 characters"],
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers and hyphens",
      ],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    author: {
      name: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
        maxlength: [100, "Author name cannot exceed 100 characters"],
      },
      avatar: {
        type: String,
        required: [true, "Author avatar is required"],
        validate: {
          validator: function (url: string) {
            return /^(https?:\/\/|\/images\/)/.test(url);
          },
          message: "Author avatar must be a valid URL or local path",
        },
      },
      bio: {
        type: String,
        required: [true, "Author bio is required"],
        trim: true,
        maxlength: [500, "Author bio cannot exceed 500 characters"],
      },
    },
    publishedAt: {
      type: Date,
      required: [true, "Published date is required"],
      default: Date.now,
    },
    readTime: {
      type: Number,
      required: [true, "Read time is required"],
      min: [1, "Read time must be at least 1 minute"],
      max: [120, "Read time cannot exceed 120 minutes"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Destinations",
          "Travel Tips",
          "Photography",
          "Budget Travel",
          "Adventure",
          "Culture",
          "Food",
        ],
        message:
          "Category must be one of: Destinations, Travel Tips, Photography, Budget Travel, Adventure, Culture, Food",
      },
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "At least one tag is required"],
      validate: {
        validator: function (tags: string[]) {
          return tags.length > 0 && tags.length <= 10;
        },
        message: "Must have between 1 and 10 tags",
      },
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image is required"],
      validate: {
        validator: function (url: string) {
          return /^(https?:\/\/|\/images\/)/.test(url);
        },
        message: "Featured image must be a valid URL or local path",
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.every((url: string) =>
            /^(https?:\/\/|\/images\/)/.test(url)
          );
        },
        message: "All images must be valid URLs or local paths",
      },
    },
    seo: {
      metaTitle: {
        type: String,
        required: [true, "SEO meta title is required"],
        trim: true,
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        required: [true, "SEO meta description is required"],
        trim: true,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: {
        type: [String],
        required: [true, "SEO keywords are required"],
        validate: {
          validator: function (keywords: string[]) {
            return keywords.length > 0 && keywords.length <= 20;
          },
          message: "Must have between 1 and 20 SEO keywords",
        },
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
    viewCount: {
      type: Number,
      default: 0,
      min: [0, "View count cannot be negative"],
    },
    likesCount: {
      type: Number,
      default: 0,
      min: [0, "Likes count cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
BlogPostSchema.index({ category: 1, featured: -1, publishedAt: -1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ featured: -1, publishedAt: -1 });
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ isActive: 1, publishedAt: -1 });
BlogPostSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
  "author.name": "text",
});

// Add virtual for formatted published date
BlogPostSchema.virtual("formattedPublishedAt").get(function (this: IBlogPost) {
  return this.publishedAt.toLocaleDateString();
});

// Pre-save middleware for validation
BlogPostSchema.pre("save", function (this: IBlogPost, next) {
  // Ensure tags are trimmed and lowercase
  this.tags = this.tags.map((tag) => tag.trim().toLowerCase());

  // Generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  next();
});

// Static method to find featured posts
BlogPostSchema.statics.findFeatured = function () {
  return this.find({ featured: true, isActive: true }).sort({
    publishedAt: -1,
  });
};

// Static method to find posts by category
BlogPostSchema.statics.findByCategory = function (category: string) {
  return this.find({ category, isActive: true }).sort({ publishedAt: -1 });
};

// Static method to search posts
BlogPostSchema.statics.searchPosts = function (searchTerm: string) {
  return this.find(
    {
      $text: { $search: searchTerm },
      isActive: true,
    },
    {
      score: { $meta: "textScore" },
    }
  ).sort({
    score: { $meta: "textScore" },
    publishedAt: -1,
  });
};

// Instance method to increment view count
BlogPostSchema.methods.incrementViews = function () {
  this.viewCount += 1;
  return this.save();
};

// Instance method to increment likes
BlogPostSchema.methods.incrementLikes = function () {
  this.likesCount += 1;
  return this.save();
};

// Create and export the model
const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
