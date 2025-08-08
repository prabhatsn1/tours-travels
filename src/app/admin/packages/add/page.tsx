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
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
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

const AddPackagePage: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newAvailableDate, setNewAvailableDate] = useState("");
  const [newImage, setNewImage] = useState("");

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
      originalPrice: undefined,
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
          accommodation: "",
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

  const onSubmit: SubmitHandler<PackageFormData> = async (data) => {
    try {
      setSubmitStatus({ type: null, message: "" });

      // Create new package object
      const newPackage: Omit<TourPackage, "id" | "rating" | "reviewCount"> = {
        ...data,
        currency: "USD",
      };

      // Call API to save the package
      const response = await packageAPI.createPackage(newPackage);

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: "Package created successfully!",
        });

        // Reset form after successful submission
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(response.error || "Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create package. Please try again.",
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
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Add New Tour Package
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Create a new tour package with detailed information and itinerary.
          </Typography>

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
                        name="title"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Package Title"
                            error={!!errors.title}
                            helperText={errors.title?.message}
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
                            error={!!errors.destination}
                            helperText={errors.destination?.message}
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
                            label="Duration (e.g., 7 Days / 6 Nights)"
                            error={!!errors.duration}
                            helperText={errors.duration?.message}
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
                            error={!!errors.price}
                            helperText={errors.price?.message}
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
                            label="Original Price (USD) - Optional"
                            type="number"
                            error={!!errors.originalPrice}
                            helperText={errors.originalPrice?.message}
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
                          error={!!errors.description}
                          helperText={errors.description?.message}
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
                            error={!!errors.groupSize?.min}
                            helperText={errors.groupSize?.min?.message}
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
                            error={!!errors.departureDate}
                            helperText={errors.departureDate?.message}
                          />
                        )}
                      />
                    </Stack>
                  </Stack>
                </Box>

                {/* Dynamic Arrays */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Package Details
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
                    </Box>

                    {/* Inclusions */}
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Inclusions
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
                              addItem(
                                "inclusions",
                                newInclusion,
                                watchedInclusions
                              );
                              setNewInclusion("");
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            addItem(
                              "inclusions",
                              newInclusion,
                              watchedInclusions
                            );
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
                        Exclusions
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
                              addItem(
                                "exclusions",
                                newExclusion,
                                watchedExclusions
                              );
                              setNewExclusion("");
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            addItem(
                              "exclusions",
                              newExclusion,
                              watchedExclusions
                            );
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
                        Available Dates
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
                    </Box>
                  </Stack>
                </Box>

                {/* Itinerary */}
                <Box>
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
                            <Typography variant="h6">
                              Day {index + 1}
                            </Typography>
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
                                  error={
                                    !!errors.itinerary?.[index]?.description
                                  }
                                  helperText={
                                    errors.itinerary?.[index]?.description
                                      ?.message
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
                                          {(selected as string[]).map(
                                            (value) => (
                                              <Chip
                                                key={value}
                                                label={value}
                                                size="small"
                                              />
                                            )
                                          )}
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
                                      watch(`itinerary.${index}.activities`) ||
                                      [];
                                    if (
                                      input.value.trim() &&
                                      !currentActivities.includes(
                                        input.value.trim()
                                      )
                                    ) {
                                      setValue(
                                        `itinerary.${index}.activities`,
                                        [
                                          ...currentActivities,
                                          input.value.trim(),
                                        ]
                                      );
                                      input.value = "";
                                    }
                                  }
                                }}
                              />
                            </Stack>

                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {watch(`itinerary.${index}.activities`)?.map(
                                (activity, actIndex) => (
                                  <Chip
                                    key={actIndex}
                                    label={activity}
                                    onDelete={() => {
                                      const currentActivities =
                                        watch(
                                          `itinerary.${index}.activities`
                                        ) || [];
                                      const newActivities =
                                        currentActivities.filter(
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
                </Box>

                {/* Submit Button */}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ minWidth: 200 }}
                  >
                    {isSubmitting ? "Creating Package..." : "Create Package"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default AddPackagePage;
