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
} from "@mui/material";
import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { Destination } from "@/types";
import { createDestination } from "@/lib/api";

// Form data interface
interface DestinationFormData {
  name: string;
  country: string;
  region: string;
  description: string;
  images: string[];
  highlights: string[];
  bestTimeToVisit: string;
  startingPrice: number;
  currency: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Validation schema
const destinationSchema: yup.ObjectSchema<DestinationFormData> = yup.object({
  name: yup.string().required("Destination name is required"),
  country: yup.string().required("Country is required"),
  region: yup.string().required("Region is required"),
  description: yup.string().required("Description is required"),
  images: yup
    .array()
    .of(yup.string().url("Must be a valid URL").required())
    .min(1, "At least one image is required")
    .required(),
  highlights: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one highlight is required")
    .required(),
  bestTimeToVisit: yup.string().required("Best time to visit is required"),
  startingPrice: yup
    .number()
    .min(0, "Starting price must be positive")
    .required("Starting price is required"),
  currency: yup.string().required("Currency is required"),
  tags: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one tag is required")
    .required(),
  coordinates: yup
    .object({
      lat: yup
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .required("Latitude is required"),
      lng: yup
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .required("Longitude is required"),
    })
    .required(),
});

// Constants
const regions = [
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa",
  "Oceania",
  "Middle East",
  "Caribbean",
];

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "SGD",
];

const commonTags = [
  "Beach",
  "Mountains",
  "City",
  "Culture",
  "Adventure",
  "Wildlife",
  "History",
  "Food",
  "Shopping",
  "Nightlife",
  "Family-Friendly",
  "Luxury",
  "Budget",
  "Nature",
  "Architecture",
  "Museums",
  "Art",
  "Photography",
  "Hiking",
  "Water Sports",
];

const AddDestinationPage: React.FC = () => {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // State for dynamic arrays
  const [newHighlight, setNewHighlight] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newTag, setNewTag] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DestinationFormData>({
    resolver: yupResolver(destinationSchema),
    defaultValues: {
      name: "",
      country: "",
      region: "",
      description: "",
      images: [],
      highlights: [],
      bestTimeToVisit: "",
      startingPrice: 0,
      currency: "USD",
      tags: [],
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
  });

  const watchedHighlights = watch("highlights");
  const watchedImages = watch("images");
  const watchedTags = watch("tags");

  const addItem = (
    field: "highlights" | "images" | "tags",
    value: string,
    currentValues: string[]
  ) => {
    if (value.trim() && !currentValues.includes(value.trim())) {
      setValue(field, [...currentValues, value.trim()]);
    }
  };

  const removeItem = (
    field: "highlights" | "images" | "tags",
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

  const onSubmit: SubmitHandler<DestinationFormData> = async (data) => {
    try {
      setSubmitStatus({ type: null, message: "" });

      // Create new destination object
      const newDestination: Omit<Destination, "id"> = {
        ...data,
        averageRating: 0,
        reviewCount: 0,
      };

      // Call API to save the destination
      const response = await createDestination(newDestination);

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: "Destination created successfully!",
        });

        // Redirect to destinations list after successful creation
        setTimeout(() => {
          router.push("/destinations");
        }, 2000);
      } else {
        throw new Error(response.error || "Failed to create destination");
      }
    } catch (error) {
      console.error("Error creating destination:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create destination. Please try again.",
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
                Add New Destination
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create a new travel destination with detailed information and
                imagery.
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
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Destination Name"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />

                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Country"
                            error={!!errors.country}
                            helperText={errors.country?.message}
                          />
                        )}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <Controller
                        name="region"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.region}>
                            <InputLabel>Region</InputLabel>
                            <Select {...field} label="Region">
                              {regions.map((region) => (
                                <MenuItem key={region} value={region}>
                                  {region}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.region && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, ml: 2 }}
                              >
                                {errors.region.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="bestTimeToVisit"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Best Time to Visit"
                            placeholder="e.g., March to May, October to November"
                            error={!!errors.bestTimeToVisit}
                            helperText={errors.bestTimeToVisit?.message}
                          />
                        )}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <Controller
                        name="startingPrice"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Starting Price"
                            type="number"
                            error={!!errors.startingPrice}
                            helperText={errors.startingPrice?.message}
                          />
                        )}
                      />

                      <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.currency}>
                            <InputLabel>Currency</InputLabel>
                            <Select {...field} label="Currency">
                              {currencies.map((currency) => (
                                <MenuItem key={currency} value={currency}>
                                  {currency}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.currency && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, ml: 2 }}
                              >
                                {errors.currency.message}
                              </Typography>
                            )}
                          </FormControl>
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
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      )}
                    />
                  </Stack>
                </Box>

                {/* Coordinates */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <LocationIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Location Coordinates
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <Controller
                      name="coordinates.lat"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Latitude"
                          type="number"
                          inputProps={{ step: "any" }}
                          error={!!errors.coordinates?.lat}
                          helperText={errors.coordinates?.lat?.message}
                        />
                      )}
                    />

                    <Controller
                      name="coordinates.lng"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Longitude"
                          type="number"
                          inputProps={{ step: "any" }}
                          error={!!errors.coordinates?.lng}
                          helperText={errors.coordinates?.lng?.message}
                        />
                      )}
                    />
                  </Stack>
                </Box>

                {/* Dynamic Content */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Content Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    {/* Highlights */}
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Highlights
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
                              addItem(
                                "highlights",
                                newHighlight,
                                watchedHighlights
                              );
                              setNewHighlight("");
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            addItem(
                              "highlights",
                              newHighlight,
                              watchedHighlights
                            );
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
                      {errors.highlights && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.highlights.message}
                        </Typography>
                      )}
                    </Box>

                    {/* Images */}
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Images (URLs)
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
                      {errors.images && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.images.message}
                        </Typography>
                      )}
                    </Box>

                    {/* Tags */}
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Tags
                      </Typography>

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
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
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
                    </Box>
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
                    >
                      {isSubmitting
                        ? "Creating Destination..."
                        : "Create Destination"}
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

export default AddDestinationPage;
