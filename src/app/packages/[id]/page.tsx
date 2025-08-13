"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
  Rating,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  NavigateBefore,
  NavigateNext,
  LocationOn,
  AccessTime,
  Group,
  Star,
  CalendarToday,
  CheckCircle,
  Close,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { packageAPI } from "@/lib/api";
import { TourPackage } from "@/types";

const PackageDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    date: "",
    specialRequests: "",
  });

  // Fetch package data
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await packageAPI.getPackageById(packageId, {
          includeVirtuals: true,
        });

        if (response.success && response.data) {
          setPackageData(response.data);
        } else {
          setError(response.error || "Package not found");
        }
      } catch (err) {
        console.error("Error fetching package:", err);
        setError("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackage();
    }
  }, [packageId]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading package details...
          </Typography>
        </Container>
      </Layout>
    );
  }

  if (error || !packageData) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            {error || "Package Not Found"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {error || "The requested package could not be found."}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/packages"
            startIcon={<ArrowBack />}
          >
            Back to Packages
          </Button>
        </Container>
      </Layout>
    );
  }

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? packageData.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === packageData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleBookingSubmit = () => {
    // Handle booking submission
    console.log("Booking submitted:", bookingForm);
    setShowBookingDialog(false);
    // You can add actual booking logic here
  };

  const handleBookingFormChange = (field: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      {/* Hero Section with Image Gallery */}
      <Box sx={{ position: "relative", height: { xs: 300, md: 500 } }}>
        <Image
          src={
            packageData.images[currentImageIndex] || "/images/placeholder.jpg"
          }
          alt={packageData.title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
          }}
        />

        {/* Image Navigation */}
        {packageData.images.length > 1 && (
          <>
            <IconButton
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
              onClick={() => handleImageNavigation("prev")}
            >
              <NavigateBefore />
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
              onClick={() => handleImageNavigation("next")}
            >
              <NavigateNext />
            </IconButton>
          </>
        )}

        {/* Header Content */}
        <Container
          maxWidth="lg"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            color: "white",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button
              startIcon={<ArrowBack />}
              sx={{ color: "white", mb: 2 }}
              component={Link}
              href="/packages"
            >
              Back to Packages
            </Button>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              {packageData.title}
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn />
                <Typography variant="h6">{packageData.destination}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTime />
                <Typography variant="h6">{packageData.duration}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating value={packageData.rating} readOnly size="small" />
                <Typography variant="body2">
                  {packageData.rating} ({packageData.reviewCount} reviews)
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Package Info Cards */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <Card sx={{ flex: 1, p: 2, textAlign: "center" }}>
                  <AccessTime
                    sx={{ fontSize: 40, mb: 1, color: "primary.main" }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Duration
                  </Typography>
                  <Typography variant="body2">
                    {packageData.duration}
                  </Typography>
                </Card>

                <Card sx={{ flex: 1, p: 2, textAlign: "center" }}>
                  <Group sx={{ fontSize: 40, mb: 1, color: "primary.main" }} />
                  <Typography variant="h6" fontWeight="bold">
                    Group Size
                  </Typography>
                  <Typography variant="body2">
                    {packageData.groupSize.min}-{packageData.groupSize.max}{" "}
                    people
                  </Typography>
                </Card>

                <Card sx={{ flex: 1, p: 2, textAlign: "center" }}>
                  <Star sx={{ fontSize: 40, mb: 1, color: "primary.main" }} />
                  <Typography variant="h6" fontWeight="bold">
                    Difficulty
                  </Typography>
                  <Typography variant="body2">
                    {packageData.difficulty}
                  </Typography>
                </Card>

                <Card sx={{ flex: 1, p: 2, textAlign: "center" }}>
                  <CalendarToday
                    sx={{ fontSize: 40, mb: 1, color: "primary.main" }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Next Departure
                  </Typography>
                  <Typography variant="body2">
                    {new Date(packageData.departureDate).toLocaleDateString()}
                  </Typography>
                </Card>
              </Stack>

              {/* Description */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {packageData.description}
                  </Typography>
                </CardContent>
              </Card>

              {/* Highlights */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Package Highlights
                  </Typography>
                  <Stack spacing={1}>
                    {packageData.highlights.map((highlight, index) => (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        key={index}
                      >
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="body1">{highlight}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Itinerary */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Detailed Itinerary
                  </Typography>
                  <Stack spacing={3}>
                    {packageData.itinerary.map((day, index) => (
                      <Card key={index} variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="primary">
                            Day {day.day}: {day.title}
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {day.description}
                          </Typography>

                          {day.activities.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Activities:
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                              >
                                {day.activities.map((activity, actIndex) => (
                                  <Chip
                                    key={actIndex}
                                    label={activity}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}

                          {day.meals.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Meals:
                              </Typography>
                              <Typography variant="body2">
                                {day.meals.join(", ")}
                              </Typography>
                            </Box>
                          )}

                          {day.accommodation && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom>
                                Accommodation:
                              </Typography>
                              <Typography variant="body2">
                                {day.accommodation}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Inclusions & Exclusions */}
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="success.main"
                      fontWeight="bold"
                    >
                      Included
                    </Typography>
                    <Stack spacing={1}>
                      {packageData.inclusions.map((inclusion, index) => (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          key={index}
                        >
                          <CheckCircle color="success" fontSize="small" />
                          <Typography variant="body2">{inclusion}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="error.main"
                      fontWeight="bold"
                    >
                      Not Included
                    </Typography>
                    <Stack spacing={1}>
                      {packageData.exclusions.map((exclusion, index) => (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          key={index}
                        >
                          <Close color="error" fontSize="small" />
                          <Typography variant="body2">{exclusion}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </motion.div>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: { xs: "100%", lg: 400 } }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Pricing Card */}
              <Card
                sx={{
                  position: "sticky",
                  top: 24,
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ${packageData.price}
                    {packageData.originalPrice &&
                      packageData.originalPrice > packageData.price && (
                        <Typography
                          component="span"
                          variant="h6"
                          sx={{
                            textDecoration: "line-through",
                            ml: 2,
                            opacity: 0.7,
                          }}
                        >
                          ${packageData.originalPrice}
                        </Typography>
                      )}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                    per person
                  </Typography>

                  <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Available Dates:
                      </Typography>
                      <Stack spacing={1}>
                        {packageData.availableDates
                          .slice(0, 3)
                          .map((date, index) => (
                            <Typography key={index} variant="body2">
                              {new Date(date).toLocaleDateString()}
                            </Typography>
                          ))}
                        {packageData.availableDates.length > 3 && (
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            +{packageData.availableDates.length - 3} more dates
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      "&:hover": { bgcolor: "grey.100" },
                    }}
                    onClick={() => setShowBookingDialog(true)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Stack>
      </Container>

      {/* Booking Dialog */}
      <Dialog
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Book Your Adventure</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={bookingForm.name}
              onChange={(e) => handleBookingFormChange("name", e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={bookingForm.email}
              onChange={(e) => handleBookingFormChange("email", e.target.value)}
            />
            <TextField
              fullWidth
              label="Phone"
              value={bookingForm.phone}
              onChange={(e) => handleBookingFormChange("phone", e.target.value)}
            />
            <TextField
              select
              fullWidth
              label="Number of Travelers"
              value={bookingForm.travelers}
              onChange={(e) =>
                handleBookingFormChange("travelers", e.target.value)
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <MenuItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Traveler" : "Travelers"}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Preferred Date"
              value={bookingForm.date}
              onChange={(e) => handleBookingFormChange("date", e.target.value)}
            >
              {packageData.availableDates.map((date) => (
                <MenuItem key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Special Requests"
              multiline
              rows={3}
              value={bookingForm.specialRequests}
              onChange={(e) =>
                handleBookingFormChange("specialRequests", e.target.value)
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained">
            Submit Booking Request
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default PackageDetailsPage;
