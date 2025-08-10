"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Article as ArticleIcon,
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { BlogPost } from "@/types";

// Form data interface
interface BlogFormData {
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
  featured: boolean;
  isActive: boolean;
}

// Validation schema
const blogSchema: yup.ObjectSchema<BlogFormData> = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  slug: yup
    .string()
    .required("Slug is required")
    .max(100, "Slug cannot exceed 100 characters")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),
  excerpt: yup
    .string()
    .required("Excerpt is required")
    .max(500, "Excerpt cannot exceed 500 characters"),
  content: yup.string().required("Content is required"),
  author: yup
    .object({
      name: yup
        .string()
        .required("Author name is required")
        .max(100, "Author name cannot exceed 100 characters"),
      avatar: yup
        .string()
        .url("Must be a valid URL")
        .required("Author avatar is required"),
      bio: yup
        .string()
        .required("Author bio is required")
        .max(500, "Author bio cannot exceed 500 characters"),
    })
    .required(),
  publishedAt: yup.string().required("Published date is required"),
  readTime: yup
    .number()
    .min(1, "Read time must be at least 1 minute")
    .max(180, "Read time cannot exceed 180 minutes")
    .required("Read time is required"),
  category: yup.string().required("Category is required"),
  tags: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one tag is required")
    .max(20, "Cannot have more than 20 tags")
    .required(),
  featuredImage: yup
    .string()
    .url("Must be a valid URL")
    .required("Featured image is required"),
  images: yup
    .array()
    .of(yup.string().url("Must be a valid URL").required())
    .required(),
  seo: yup
    .object({
      metaTitle: yup
        .string()
        .required("Meta title is required")
        .max(60, "Meta title cannot exceed 60 characters"),
      metaDescription: yup
        .string()
        .required("Meta description is required")
        .max(160, "Meta description cannot exceed 160 characters"),
      keywords: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one SEO keyword is required")
        .max(20, "Cannot have more than 20 SEO keywords")
        .required(),
    })
    .required(),
  featured: yup.boolean().required(),
  isActive: yup.boolean().required(),
});

// Constants
const categories = [
  "Destinations",
  "Travel Tips",
  "Photography",
  "Budget Travel",
  "Adventure",
  "Culture",
  "Food",
  "Accommodation",
  "Transportation",
  "Safety",
];

const commonTags = [
  "travel",
  "backpacking",
  "luxury",
  "budget",
  "solo-travel",
  "family-travel",
  "adventure",
  "beach",
  "mountains",
  "city-break",
  "culture",
  "food",
  "photography",
  "tips",
  "guide",
  "itinerary",
  "packing",
  "safety",
  "visa",
  "flights",
];

const AddBlogPage: React.FC = () => {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // State for dynamic arrays
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: yupResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: {
        name: "",
        avatar: "",
        bio: "",
      },
      publishedAt: new Date().toISOString().split("T")[0],
      readTime: 5,
      category: "",
      tags: [],
      featuredImage: "",
      images: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
      featured: false,
      isActive: true,
    },
  });

  const watchedTags = watch("tags");
  const watchedImages = watch("images");
  const watchedKeywords = watch("seo.keywords");
  const watchedTitle = watch("title");

  // Auto-generate slug from title
  React.useEffect(() => {
    if (watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [watchedTitle, setValue]);

  const addItem = (
    field: "tags" | "images" | "seo.keywords",
    value: string,
    currentValues: string[]
  ) => {
    if (value.trim() && !currentValues.includes(value.trim())) {
      setValue(field, [...currentValues, value.trim()]);
    }
  };

  const removeItem = (
    field: "tags" | "images" | "seo.keywords",
    index: number,
    currentValues: string[]
  ) => {
    const newValues = currentValues.filter((_, i) => i !== index);
    setValue(field, newValues);
  };

  const addTagFromPreset = (tag: string) => {
    if (!watchedTags.includes(tag)) {
      setValue("tags", [...watchedTags, tag]);
    }
  };

  const onSubmit: SubmitHandler<BlogFormData> = async (data) => {
    try {
      setSubmitStatus({ type: null, message: "" });

      // Create new blog post object
      const newBlogPost: Omit<BlogPost, "id"> = {
        ...data,
        viewCount: 0,
        likesCount: 0,
      };

      // Call API to save the blog post
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlogPost),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: "success",
          message: "Blog post created successfully!",
        });

        // Redirect to public blog list after successful creation
        setTimeout(() => {
          router.push("/blog");
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to create blog post");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create blog post. Please try again.",
      });
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                <ArticleIcon sx={{ mr: 2, verticalAlign: "middle" }} />
                Add New Blog Post
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create a new blog post with rich content and SEO optimization.
              </Typography>
            </Box>
          </Stack>

          {submitStatus.type && (
            <Alert severity={submitStatus.type} sx={{ mb: 3 }}>
              {submitStatus.message}
            </Alert>
          )}

          <Paper elevation={2} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                {/* Basic Information */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Blog Post Title"
                          error={!!errors.title}
                          helperText={errors.title?.message}
                        />
                      )}
                    />

                    <Controller
                      name="slug"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="URL Slug"
                          helperText={
                            errors.slug?.message ||
                            "Auto-generated from title, but you can customize it"
                          }
                          error={!!errors.slug}
                        />
                      )}
                    />

                    <Controller
                      name="excerpt"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Excerpt"
                          multiline
                          rows={3}
                          error={!!errors.excerpt}
                          helperText={
                            errors.excerpt?.message ||
                            "Brief description shown in listings"
                          }
                        />
                      )}
                    />

                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Content"
                          multiline
                          rows={8}
                          error={!!errors.content}
                          helperText={
                            errors.content?.message ||
                            "Main blog post content (HTML supported)"
                          }
                        />
                      )}
                    />

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.category}>
                            <InputLabel>Category</InputLabel>
                            <Select {...field} label="Category">
                              {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                  {category}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.category && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, ml: 2 }}
                              >
                                {errors.category.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="readTime"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Read Time (minutes)"
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <ScheduleIcon
                                  sx={{ mr: 1, color: "action.active" }}
                                />
                              ),
                            }}
                            error={!!errors.readTime}
                            helperText={errors.readTime?.message}
                          />
                        )}
                      />

                      <Controller
                        name="publishedAt"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Published Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.publishedAt}
                            helperText={errors.publishedAt?.message}
                          />
                        )}
                      />
                    </Stack>
                  </Stack>
                </Box>

                {/* Author Information */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Author Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <Controller
                        name="author.name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Author Name"
                            error={!!errors.author?.name}
                            helperText={errors.author?.name?.message}
                          />
                        )}
                      />

                      <Controller
                        name="author.avatar"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Author Avatar URL"
                            error={!!errors.author?.avatar}
                            helperText={errors.author?.avatar?.message}
                          />
                        )}
                      />
                    </Stack>

                    <Controller
                      name="author.bio"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Author Bio"
                          multiline
                          rows={3}
                          error={!!errors.author?.bio}
                          helperText={errors.author?.bio?.message}
                        />
                      )}
                    />
                  </Stack>
                </Box>

                {/* Images */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Images
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    <Controller
                      name="featuredImage"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Featured Image URL"
                          error={!!errors.featuredImage}
                          helperText={
                            errors.featuredImage?.message ||
                            "Main image for the blog post"
                          }
                        />
                      )}
                    />

                    {/* Additional Images */}
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Additional Images
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Add Image URL"
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addItem("images", newImage, watchedImages);
                              setNewImage("");
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          onClick={() => {
                            addItem("images", newImage, watchedImages);
                            setNewImage("");
                          }}
                        >
                          Add
                        </Button>
                      </Stack>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {watchedImages?.map((image, index) => (
                          <Chip
                            key={index}
                            label={`Image ${index + 1}`}
                            onDelete={() =>
                              removeItem("images", index, watchedImages)
                            }
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                {/* Tags */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    {/* Custom tag input */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Add Custom Tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addItem("tags", newTag, watchedTags);
                            setNewTag("");
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          addItem("tags", newTag, watchedTags);
                          setNewTag("");
                        }}
                      >
                        Add
                      </Button>
                    </Stack>

                    {/* Preset tags */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Or choose from common tags:
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      {commonTags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onClick={() => addTagFromPreset(tag)}
                          color={
                            watchedTags.includes(tag) ? "primary" : "default"
                          }
                          variant={
                            watchedTags.includes(tag) ? "filled" : "outlined"
                          }
                          size="small"
                          sx={{ cursor: "pointer" }}
                        />
                      ))}
                    </Box>

                    {/* Selected tags */}
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, fontWeight: "medium" }}
                    >
                      Selected tags:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {watchedTags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() =>
                            removeItem("tags", index, watchedTags)
                          }
                          color="info"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {errors.tags && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1 }}
                      >
                        {errors.tags.message}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* SEO Information */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    SEO Settings
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    <Controller
                      name="seo.metaTitle"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Meta Title"
                          error={!!errors.seo?.metaTitle}
                          helperText={
                            errors.seo?.metaTitle?.message ||
                            "Title for search engines (max 60 chars)"
                          }
                        />
                      )}
                    />

                    <Controller
                      name="seo.metaDescription"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Meta Description"
                          multiline
                          rows={3}
                          error={!!errors.seo?.metaDescription}
                          helperText={
                            errors.seo?.metaDescription?.message ||
                            "Description for search engines (max 160 chars)"
                          }
                        />
                      )}
                    />

                    {/* SEO Keywords */}
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        SEO Keywords
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Add SEO Keyword"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addItem(
                                "seo.keywords",
                                newKeyword,
                                watchedKeywords
                              );
                              setNewKeyword("");
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            addItem(
                              "seo.keywords",
                              newKeyword,
                              watchedKeywords
                            );
                            setNewKeyword("");
                          }}
                        >
                          Add
                        </Button>
                      </Stack>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {watchedKeywords?.map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            onDelete={() =>
                              removeItem("seo.keywords", index, watchedKeywords)
                            }
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                      {errors.seo?.keywords && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.seo.keywords.message}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>

                {/* Publishing Options */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Publishing Options
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack direction="row" spacing={4}>
                    <Controller
                      name="featured"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                              color="primary"
                            />
                          }
                          label="Featured Post"
                        />
                      )}
                    />

                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                              color="success"
                            />
                          }
                          label="Publish Immediately"
                        />
                      )}
                    />
                  </Stack>
                </Box>

                {/* Submit Button */}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      sx={{ minWidth: 200 }}
                      startIcon={<VisibilityIcon />}
                    >
                      {isSubmitting ? "Creating Post..." : "Create Blog Post"}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default AddBlogPage;
