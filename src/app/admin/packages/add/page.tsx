"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  IconButton,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Info as InfoIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "@/components/layout/Layout";
import { TourPackage } from "@/types";
import { packageAPI } from "@/lib/api";

// Define explicit types first
interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

interface PackageFormData {
  title: string;
  destination: string;
  duration: string;
  price: number;
  originalPrice?: number;
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
  category:
    | "Adventure"
    | "Cultural"
    | "Relaxation"
    | "Wildlife"
    | "Honeymoon"
    | "Family"
    | "Luxury";
  itinerary: ItineraryDay[];
  availableDates: string[];
  images: string[];
  featured: boolean;
}

// Validation schema
const packageSchema: yup.ObjectSchema<PackageFormData> = yup.object({
  title: yup.string().required("Package title is required"),
  destination: yup.string().required("Destination is required"),
  duration: yup.string().required("Duration is required"),
  price: yup
    .number()
    .min(1, "Price must be greater than 0")
    .required("Price is required"),
  originalPrice: yup
    .number()
    .min(0, "Original price must be positive")
    .optional(),
  description: yup.string().required("Description is required"),
  highlights: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one highlight is required")
    .required(),
  inclusions: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one inclusion is required")
    .required(),
  exclusions: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one exclusion is required")
    .required(),
  difficulty: yup
    .string()
    .oneOf(["Easy", "Moderate", "Challenging"])
    .required("Difficulty level is required") as yup.Schema<
    "Easy" | "Moderate" | "Challenging"
  >,
  groupSize: yup
    .object({
      min: yup
        .number()
        .min(1, "Minimum group size must be at least 1")
        .required(),
      max: yup
        .number()
        .min(1, "Maximum group size must be at least 1")
        .required(),
    })
    .required(),
  departureDate: yup.string().required("Departure date is required"),
  category: yup
    .string()
    .oneOf([
      "Adventure",
      "Cultural",
      "Relaxation",
      "Wildlife",
      "Honeymoon",
      "Family",
      "Luxury",
    ])
    .required("Category is required") as yup.Schema<
    | "Adventure"
    | "Cultural"
    | "Relaxation"
    | "Wildlife"
    | "Honeymoon"
    | "Family"
    | "Luxury"
  >,
  itinerary: yup
    .array()
    .of(
      yup
        .object({
          day: yup.number().required(),
          title: yup.string().required("Day title is required"),
          description: yup.string().required("Day description is required"),
          activities: yup
            .array()
            .of(yup.string().required())
            .min(1, "At least one activity is required")
            .required(),
          meals: yup.array().of(yup.string().required()).required(),
          accommodation: yup.string().optional(),
        })
        .required()
    )
    .min(1, "At least one itinerary day is required")
    .required(),
  availableDates: yup.array().of(yup.string().required()).required(),
  images: yup.array().of(yup.string().required()).required(),
  featured: yup.boolean().required(),
});

const categories = [
  "Adventure",
  "Cultural",
  "Relaxation",
  "Wildlife",
  "Honeymoon",
  "Family",
  "Luxury",
] as const;

const difficulties = ["Easy", "Moderate", "Challenging"] as const;
const mealOptions = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const validationHelpers = {
  price: {
    isValid: (price: number, originalPrice?: number) => {
      if (originalPrice && originalPrice <= price) {
        return "Original price should be higher than current price";
      }
      return null;
    },
  },
  groupSize: {
    isValid: (min: number, max: number) => {
      if (min > max) {
        return "Minimum group size cannot be greater than maximum";
      }
      return null;
    },
  },
  dates: {
    isValid: (departureDate: string, availableDates: string[]) => {
      if (!availableDates.includes(departureDate)) {
        return "Departure date should be included in available dates";
      }
      return null;
    },
  },
};

const steps = [
  "Basic Information",
  "Package Details",
  "Itinerary",
  "Media & SEO",
  "Review & Submit",
];

const AddPackagePage: React.FC = () => {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newAvailableDate, setNewAvailableDate] = useState("");
  const [newImage, setNewImage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormData>({
    resolver: yupResolver(packageSchema),
    defaultValues: {
      title: "",
      destination: "",
      duration: "",
      price: 0,
      originalPrice: 0, // Changed from undefined to 0
      description: "",
      highlights: [],
      inclusions: [],
      exclusions: [],
      difficulty: "Easy",
      groupSize: { min: 1, max: 10 },
      departureDate: "",
      availableDates: [],
      category: "Adventure",
      itinerary: [
        {
          day: 1,
          title: "",
          description: "",
          activities: [],
          meals: [],
          accommodation: "", // Changed from undefined to empty string
        },
      ],
      images: [],
      featured: false,
    },
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "itinerary",
  });

  const watchedHighlights = watch("highlights");
  const watchedInclusions = watch("inclusions");
  const watchedExclusions = watch("exclusions");
  const watchedAvailableDates = watch("availableDates");
  const watchedImages = watch("images");

  const addItem = (
    field:
      | "highlights"
      | "inclusions"
      | "exclusions"
      | "availableDates"
      | "images",
    value: string,
    currentValues: string[]
  ) => {
    if (value.trim() && !currentValues.includes(value.trim())) {
      setValue(field, [...currentValues, value.trim()]);
    }
  };

  const removeItem = (
    field:
      | "highlights"
      | "inclusions"
      | "exclusions"
      | "availableDates"
      | "images",
    index: number,
    currentValues: string[]
  ) => {
    const newValues = currentValues.filter((_, i) => i !== index);
    setValue(field, newValues);
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    const formData = watch();

    switch (step) {
      case 0: // Basic Information
        if (!formData.title?.trim()) errors.title = "Title is required";
        if (!formData.destination?.trim())
          errors.destination = "Destination is required";
        if (!formData.duration?.trim())
          errors.duration = "Duration is required";
        if (!formData.price || formData.price <= 0)
          errors.price = "Valid price is required";
        if (!formData.description?.trim())
          errors.description = "Description is required";

        // Custom validation
        const priceError = validationHelpers.price.isValid(
          formData.price,
          formData.originalPrice
        );
        if (priceError) errors.originalPrice = priceError;

        const groupSizeError = validationHelpers.groupSize.isValid(
          formData.groupSize?.min || 0,
          formData.groupSize?.max || 0
        );
        if (groupSizeError) errors.groupSize = groupSizeError;
        break;

      case 1: // Package Details
        if (!formData.highlights?.length)
          errors.highlights = "At least one highlight is required";
        if (!formData.inclusions?.length)
          errors.inclusions = "At least one inclusion is required";
        if (!formData.exclusions?.length)
          errors.exclusions = "At least one exclusion is required";
        if (!formData.availableDates?.length)
          errors.availableDates = "At least one available date is required";

        // Validate departure date
        const dateError = validationHelpers.dates.isValid(
          formData.departureDate,
          formData.availableDates || []
        );
        if (dateError) errors.departureDate = dateError;
        break;

      case 2: // Itinerary
        if (!formData.itinerary?.length) {
          errors.itinerary = "At least one itinerary day is required";
        } else {
          formData.itinerary.forEach((day, index) => {
            if (!day.title?.trim()) {
              errors[`itinerary_${index}_title`] = `Day ${
                index + 1
              } title is required`;
            }
            if (!day.description?.trim()) {
              errors[`itinerary_${index}_description`] = `Day ${
                index + 1
              } description is required`;
            }
            if (!day.activities?.length) {
              errors[`itinerary_${index}_activities`] = `Day ${
                index + 1
              } must have at least one activity`;
            }
          });
        }
        break;

      case 3: // Media & SEO
        if (!formData.images?.length)
          errors.images = "At least one image is required";
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const calculateProgress = () => {
    const formData = watch();
    let completedFields = 0;
    let totalFields = 0;

    // Count completed required fields
    const requiredFields = [
      "title",
      "destination",
      "duration",
      "price",
      "description",
      "category",
      "difficulty",
      "departureDate",
    ];

    requiredFields.forEach((field) => {
      totalFields++;
      if (formData[field as keyof typeof formData]) completedFields++;
    });

    // Count arrays
    if (formData.highlights?.length) completedFields++;
    totalFields++;
    if (formData.inclusions?.length) completedFields++;
    totalFields++;
    if (formData.exclusions?.length) completedFields++;
    totalFields++;
    if (formData.itinerary?.length) completedFields++;
    totalFields++;

    return (completedFields / totalFields) * 100;
  };

  const onSubmit: SubmitHandler<PackageFormData> = async (data) => {
    console.log("🚀 Form submission started with data:", data);
    try {
      setSubmitStatus({ type: null, message: "" });

      // Final validation
      if (
        !validateStep(0) ||
        !validateStep(1) ||
        !validateStep(2) ||
        !validateStep(3)
      ) {
        throw new Error("Please fix validation errors before submitting");
      }

      // Enhanced validation
      if (!data.highlights || data.highlights.length === 0) {
        throw new Error("At least one highlight is required");
      }
      if (!data.inclusions || data.inclusions.length === 0) {
        throw new Error("At least one inclusion is required");
      }
      if (!data.exclusions || data.exclusions.length === 0) {
        throw new Error("At least one exclusion is required");
      }
      if (!data.itinerary || data.itinerary.length === 0) {
        throw new Error("At least one itinerary day is required");
      }
      if (!data.images || data.images.length === 0) {
        throw new Error("At least one image is required");
      }

      // Validate itinerary data
      data.itinerary.forEach((day, index) => {
        if (!day.title.trim()) {
          throw new Error(`Day ${index + 1} title is required`);
        }
        if (!day.description.trim()) {
          throw new Error(`Day ${index + 1} description is required`);
        }
        if (!day.activities || day.activities.length === 0) {
          throw new Error(`Day ${index + 1} must have at least one activity`);
        }
      });

      console.log("✅ Validation passed, creating package object...");

      // Create new package object with better data transformation
      const newPackage: Omit<TourPackage, "id" | "rating" | "reviewCount"> = {
        ...data,
        currency: "USD",
        price: Number(data.price),
        originalPrice: data.originalPrice
          ? Number(data.originalPrice)
          : undefined,
        groupSize: {
          min: Number(data.groupSize.min),
          max: Number(data.groupSize.max),
        },
        // Ensure dates are properly formatted
        departureDate: new Date(data.departureDate).toISOString(),
        availableDates: data.availableDates.map((date) =>
          new Date(date).toISOString()
        ),
        // Sort itinerary to ensure the first day is the departure day
        itinerary: data.itinerary.sort((a, b) => a.day - b.day),
      };

      console.log("📦 Package object created:", newPackage);

      // Call API to save the package
      console.log("🌐 Calling API...");
      const response = await packageAPI.createPackage(newPackage);

      console.log("📡 API Response:", response);

      if (response.success) {
        console.log("✅ Package created successfully!");
        setSubmitStatus({
          type: "success",
          message: "Package created successfully! Redirecting...",
        });

        // Redirect to admin packages page after successful submission
        setTimeout(() => {
          router.push("/packages");
        }, 2000);
      } else {
        throw new Error(response.error || "Failed to create package");
      }
    } catch (error) {
      console.error("❌ Error creating package:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create package. Please try again.",
      });
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Basic Information */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Package Title"
                    error={!!errors.title || !!validationErrors.title}
                    helperText={errors.title?.message || validationErrors.title}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Destination"
                    error={
                      !!errors.destination || !!validationErrors.destination
                    }
                    helperText={
                      errors.destination?.message ||
                      validationErrors.destination
                    }
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Duration"
                    placeholder="e.g., 7 Days / 6 Nights"
                    error={!!errors.duration || !!validationErrors.duration}
                    helperText={
                      errors.duration?.message || validationErrors.duration
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ScheduleIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Price (USD)"
                    type="number"
                    error={!!errors.price || !!validationErrors.price}
                    helperText={
                      errors.price?.message ||
                      validationHelpers.price.isValid(
                        watch("price"),
                        watch("originalPrice")
                      ) ||
                      ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="originalPrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Original Price (Optional)"
                    type="number"
                    error={
                      !!errors.originalPrice || !!validationErrors.originalPrice
                    }
                    helperText={
                      errors.originalPrice?.message ||
                      validationHelpers.price.isValid(
                        watch("price"),
                        watch("originalPrice")
                      ) ||
                      ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Stack>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  error={!!errors.description || !!validationErrors.description}
                  helperText={
                    errors.description?.message ||
                    validationErrors.description ||
                    "Provide a compelling description of the package"
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
                  </FormControl>
                )}
              />

              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.difficulty}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select {...field} label="Difficulty">
                      {difficulties.map((difficulty) => (
                        <MenuItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Controller
                name="groupSize.min"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Minimum Group Size"
                    type="number"
                    error={
                      !!errors.groupSize?.min || !!validationErrors.groupSize
                    }
                    helperText={
                      errors.groupSize?.min?.message ||
                      validationHelpers.groupSize.isValid(
                        watch("groupSize.min") || 0,
                        watch("groupSize.max") || 0
                      ) ||
                      ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GroupIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="groupSize.max"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Maximum Group Size"
                    type="number"
                    error={!!errors.groupSize?.max}
                    helperText={errors.groupSize?.max?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GroupIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="departureDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Departure Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={
                      !!errors.departureDate || !!validationErrors.departureDate
                    }
                    helperText={
                      errors.departureDate?.message ||
                      validationErrors.departureDate
                    }
                  />
                )}
              />
            </Stack>

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
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>Featured Package</Typography>
                      <Tooltip title="Featured packages appear prominently on the homepage">
                        <InfoIcon fontSize="small" color="action" />
                      </Tooltip>
                    </Box>
                  }
                />
              )}
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            {/* Package Details */}
            <Typography variant="h6" gutterBottom>
              Package Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              {/* Highlights */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Highlights{" "}
                  {validationErrors.highlights && (
                    <Typography
                      component="span"
                      color="error"
                      variant="caption"
                    >
                      ({validationErrors.highlights})
                    </Typography>
                  )}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Highlight"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem("highlights", newHighlight, watchedHighlights);
                        setNewHighlight("");
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      addItem("highlights", newHighlight, watchedHighlights);
                      setNewHighlight("");
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {watchedHighlights?.map((highlight, index) => (
                    <Chip
                      key={index}
                      label={highlight}
                      onDelete={() =>
                        removeItem("highlights", index, watchedHighlights)
                      }
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              {/* Inclusions */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Inclusions{" "}
                  {validationErrors.inclusions && (
                    <Typography
                      component="span"
                      color="error"
                      variant="caption"
                    >
                      ({validationErrors.inclusions})
                    </Typography>
                  )}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Inclusion"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem("inclusions", newInclusion, watchedInclusions);
                        setNewInclusion("");
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      addItem("inclusions", newInclusion, watchedInclusions);
                      setNewInclusion("");
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {watchedInclusions?.map((inclusion, index) => (
                    <Chip
                      key={index}
                      label={inclusion}
                      onDelete={() =>
                        removeItem("inclusions", index, watchedInclusions)
                      }
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              {/* Exclusions */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Exclusions{" "}
                  {validationErrors.exclusions && (
                    <Typography
                      component="span"
                      color="error"
                      variant="caption"
                    >
                      ({validationErrors.exclusions})
                    </Typography>
                  )}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Exclusion"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem("exclusions", newExclusion, watchedExclusions);
                        setNewExclusion("");
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      addItem("exclusions", newExclusion, watchedExclusions);
                      setNewExclusion("");
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {watchedExclusions?.map((exclusion, index) => (
                    <Chip
                      key={index}
                      label={exclusion}
                      onDelete={() =>
                        removeItem("exclusions", index, watchedExclusions)
                      }
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              {/* Available Dates */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Available Dates{" "}
                  {validationErrors.availableDates && (
                    <Typography
                      component="span"
                      color="error"
                      variant="caption"
                    >
                      ({validationErrors.availableDates})
                    </Typography>
                  )}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Available Date"
                    type="date"
                    value={newAvailableDate}
                    onChange={(e) => setNewAvailableDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      addItem(
                        "availableDates",
                        newAvailableDate,
                        watchedAvailableDates
                      );
                      setNewAvailableDate("");
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {watchedAvailableDates?.map((date, index) => (
                    <Chip
                      key={index}
                      label={new Date(date).toLocaleDateString()}
                      onDelete={() =>
                        removeItem(
                          "availableDates",
                          index,
                          watchedAvailableDates
                        )
                      }
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            {/* Itinerary */}
            <Typography variant="h6" gutterBottom>
              Itinerary
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              {itineraryFields.map((field, index) => (
                <Card variant="outlined" key={field.id}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="h6">Day {index + 1}</Typography>
                      {itineraryFields.length > 1 && (
                        <IconButton
                          onClick={() => removeItinerary(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>

                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Controller
                          name={`itinerary.${index}.title`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Day Title"
                              error={!!errors.itinerary?.[index]?.title}
                              helperText={
                                errors.itinerary?.[index]?.title?.message
                              }
                            />
                          )}
                        />

                        <Controller
                          name={`itinerary.${index}.accommodation`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Accommodation (Optional)"
                            />
                          )}
                        />
                      </Stack>

                      <Controller
                        name={`itinerary.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Description"
                            multiline
                            rows={2}
                            error={!!errors.itinerary?.[index]?.description}
                            helperText={
                              errors.itinerary?.[index]?.description?.message
                            }
                          />
                        )}
                      />

                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Controller
                          name={`itinerary.${index}.meals`}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>Meals</InputLabel>
                              <Select
                                {...field}
                                multiple
                                label="Meals"
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {(selected as string[]).map((value) => (
                                      <Chip
                                        key={value}
                                        label={value}
                                        size="small"
                                      />
                                    ))}
                                  </Box>
                                )}
                              >
                                {mealOptions.map((meal) => (
                                  <MenuItem key={meal} value={meal}>
                                    {meal}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />

                        <TextField
                          fullWidth
                          label="Add Activity"
                          placeholder="Enter activity and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const currentActivities =
                                watch(`itinerary.${index}.activities`) || [];
                              if (
                                input.value.trim() &&
                                !currentActivities.includes(input.value.trim())
                              ) {
                                setValue(`itinerary.${index}.activities`, [
                                  ...currentActivities,
                                  input.value.trim(),
                                ]);
                                input.value = "";
                              }
                            }
                          }}
                        />
                      </Stack>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {watch(`itinerary.${index}.activities`)?.map(
                          (activity, actIndex) => (
                            <Chip
                              key={actIndex}
                              label={activity}
                              onDelete={() => {
                                const currentActivities =
                                  watch(`itinerary.${index}.activities`) || [];
                                const newActivities = currentActivities.filter(
                                  (_, i) => i !== actIndex
                                );
                                setValue(
                                  `itinerary.${index}.activities`,
                                  newActivities
                                );
                              }}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          )
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  appendItinerary({
                    day: itineraryFields.length + 1,
                    title: "",
                    description: "",
                    activities: [],
                    meals: [],
                    accommodation: "",
                  })
                }
              >
                Add Another Day
              </Button>
            </Stack>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            {/* Media & SEO */}
            <Typography variant="h6" gutterBottom>
              Media & SEO
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              {/* Images */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Images (URLs){" "}
                  {validationErrors.images && (
                    <Typography
                      component="span"
                      color="error"
                      variant="caption"
                    >
                      ({validationErrors.images})
                    </Typography>
                  )}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                {watchedImages && watchedImages.length > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    First image will be used as the featured image
                  </Typography>
                )}
              </Box>
            </Stack>
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={3}>
            {/* Review Summary */}
            <Typography variant="h6" gutterBottom>
              Review Package Details
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Title
                    </Typography>
                    <Typography variant="body1">
                      {watch("title") || "Not specified"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Destination
                    </Typography>
                    <Typography variant="body1">
                      {watch("destination") || "Not specified"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1">
                      ${watch("price") || 0}
                      {watch("originalPrice") &&
                        (watch("originalPrice") || 0) >
                          (watch("price") || 0) && (
                          <Typography
                            component="span"
                            sx={{
                              textDecoration: "line-through",
                              ml: 1,
                              color: "text.secondary",
                            }}
                          >
                            ${watch("originalPrice")}
                          </Typography>
                        )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Category & Difficulty
                    </Typography>
                    <Typography variant="body1">
                      {watch("category")} • {watch("difficulty")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Group Size
                    </Typography>
                    <Typography variant="body1">
                      {watch("groupSize.min")}-{watch("groupSize.max")} people
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Itinerary Days
                    </Typography>
                    <Typography variant="body1">
                      {watch("itinerary")?.length || 0} days
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Images
                    </Typography>
                    <Typography variant="body1">
                      {watch("images")?.length || 0} images
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        );

      default:
        return null;
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
          {/* Header with progress */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/admin/packages")}
            >
              Back to Packages
            </Button>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Add New Tour Package
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete progress: {Math.round(calculateProgress())}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress()}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </Box>
          </Stack>

          {submitStatus.type && (
            <Alert severity={submitStatus.type} sx={{ mb: 3 }}>
              {submitStatus.message}
            </Alert>
          )}

          <Paper elevation={2} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {renderStepContent(index)}

                      <Box sx={{ mt: 3 }}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            variant="outlined"
                          >
                            Back
                          </Button>
                          {activeStep === steps.length - 1 ? (
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={isSubmitting}
                              startIcon={<SaveIcon />}
                              sx={{ minWidth: 180 }}
                            >
                              {isSubmitting
                                ? "Creating Package..."
                                : "Create Package"}
                            </Button>
                          ) : (
                            <Button variant="contained" onClick={handleNext}>
                              Next
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            startIcon={<PreviewIcon />}
                            onClick={() => setIsPreviewMode(!isPreviewMode)}
                          >
                            {isPreviewMode ? "Edit" : "Preview"}
                          </Button>
                        </Stack>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default AddPackagePage;
