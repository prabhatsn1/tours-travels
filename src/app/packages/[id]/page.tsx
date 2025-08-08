"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  Divider,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Group,
  Star,
  Share,
  Favorite,
  FavoriteBorder,
  CalendarToday,
  LocationOn,
  ExpandMore,
  ArrowBack,
  Phone,
  Email,
  WhatsApp,
  NavigateNext,
  NavigateBefore,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { tourPackages } from "@/data/sampleData";

const PackageDetailsPage: React.FC = () => {
  const params = useParams();
  const packageId = params.id as string;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    date: "",
    specialRequests: "",
  });

  // Find the package by ID
  const packageData = tourPackages.find((pkg) => pkg.id === packageId);

  if (!packageData) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Package Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The requested package could not be found.
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
              {/* Package Info Cards with Travel Animations */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{ flex: 1 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      borderRadius: 3,
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>\')',
                      },
                    }}
                  >
                    <AccessTime
                      sx={{
                        fontSize: 40,
                        mb: 1,
                        filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Duration
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {packageData.duration}
                    </Typography>
                  </Paper>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{ flex: 1 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      background:
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      color: "white",
                      borderRadius: 3,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Group
                      sx={{
                        fontSize: 40,
                        mb: 1,
                        filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Group Size
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {packageData.groupSize.min}-{packageData.groupSize.max}
                    </Typography>
                  </Paper>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{ flex: 1 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      background:
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      color: "white",
                      borderRadius: 3,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Star
                      sx={{
                        fontSize: 40,
                        mb: 1,
                        filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Difficulty
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {packageData.difficulty}
                    </Typography>
                  </Paper>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{ flex: 1 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      background:
                        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                      color: "white",
                      borderRadius: 3,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <CalendarToday
                      sx={{
                        fontSize: 40,
                        mb: 1,
                        filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Next Date
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" fontSize="14px">
                      {new Date(packageData.departureDate).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </motion.div>
              </Stack>

              {/* Description with Travel Animation */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-50%",
                      right: "-50%",
                      width: "100%",
                      height: "100%",
                      background:
                        "radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)",
                      animation: "float 6s ease-in-out infinite",
                    },
                    "@keyframes float": {
                      "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
                      "33%": {
                        transform: "translate(30px, -30px) rotate(120deg)",
                      },
                      "66%": {
                        transform: "translate(-20px, 20px) rotate(240deg)",
                      },
                    },
                  }}
                >
                  <CardContent sx={{ position: "relative", zIndex: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                      >
                        Package Overview
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                      sx={{ lineHeight: 1.8 }}
                    >
                      {packageData.description}
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        label={packageData.category}
                        color="primary"
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          fontWeight: "bold",
                          background:
                            "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                          color: "white",
                          border: "none",
                        }}
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Highlights with Staggered Animation */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #fff 0%, #f0f8ff 100%)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ mb: 3 }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        Tour Highlights
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {packageData.highlights.map((highlight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          whileHover={{ x: 10, scale: 1.02 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 2,
                              borderRadius: 2,
                              background:
                                "linear-gradient(90deg, rgba(102,126,234,0.1) 0%, rgba(255,255,255,0.5) 100%)",
                              border: "1px solid rgba(102,126,234,0.2)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <CheckCircle
                              color="success"
                              sx={{ mr: 2, fontSize: 24 }}
                            />
                            <Typography variant="body1" fontWeight="medium">
                              {highlight}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Itinerary with Travel-themed Animations */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #fff 0%, #f5f7fa 100%)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ mb: 3 }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        Detailed Itinerary
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {packageData.itinerary.map((day, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Accordion
                            sx={{
                              borderRadius: 2,
                              background:
                                "linear-gradient(90deg, rgba(102,126,234,0.05) 0%, rgba(255,255,255,0.8) 100%)",
                              "&:before": { display: "none" },
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <motion.div
                                  whileHover={{ rotate: 180 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <ExpandMore />
                                </motion.div>
                              }
                              sx={{
                                background:
                                  "linear-gradient(90deg, rgba(102,126,234,0.1) 0%, transparent 100%)",
                                borderRadius: 2,
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: index * 0.2,
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      background:
                                        "linear-gradient(45deg, #667eea, #764ba2)",
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Day {day.day}: {day.title}
                                  </Typography>
                                </motion.div>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{ background: "rgba(255,255,255,0.8)" }}
                            >
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                paragraph
                                sx={{ lineHeight: 1.7 }}
                              >
                                {day.description}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                color="primary"
                                fontWeight="bold"
                              >
                                🎯 Activities:
                              </Typography>
                              <Stack spacing={1} sx={{ mb: 2 }}>
                                {day.activities.map((activity, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: idx * 0.1,
                                    }}
                                    whileHover={{ x: 5 }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        p: 1,
                                      }}
                                    >
                                      <CheckCircle
                                        color="primary"
                                        sx={{ fontSize: 18, mr: 1 }}
                                      />
                                      <Typography variant="body2">
                                        {activity}
                                      </Typography>
                                    </Box>
                                  </motion.div>
                                ))}
                              </Stack>
                              {day.meals.length > 0 && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ mt: 2 }}
                                  color="secondary"
                                >
                                  🍽️ Meals: {day.meals.join(", ")}
                                </Typography>
                              )}
                              {day.accommodation && (
                                <Typography
                                  variant="subtitle2"
                                  sx={{ mt: 1 }}
                                  color="secondary"
                                >
                                  🏨 Accommodation: {day.accommodation}
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </motion.div>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Inclusions & Exclusions with Travel Theme */}
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  style={{ flex: 1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      background:
                        "linear-gradient(145deg, #e8f5e8 0%, #f0fff0 100%)",
                      border: "2px solid rgba(76, 175, 80, 0.2)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ mb: 2 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          ✅
                        </motion.div>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="success.main"
                        >
                          What&apos;s Included
                        </Typography>
                      </Stack>
                      <Stack spacing={1}>
                        {packageData.inclusions.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ x: 5, scale: 1.02 }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 1,
                              }}
                            >
                              <CheckCircle
                                color="success"
                                sx={{ fontSize: 20, mr: 1.5 }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "medium" }}
                              >
                                {item}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  style={{ flex: 1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      background:
                        "linear-gradient(145deg, #ffe8e8 0%, #fff0f0 100%)",
                      border: "2px solid rgba(244, 67, 54, 0.2)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ mb: 2 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          ❌
                        </motion.div>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="error.main"
                        >
                          What&apos;s Not Included
                        </Typography>
                      </Stack>
                      <Stack spacing={1}>
                        {packageData.exclusions.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ x: -5, scale: 1.02 }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 1,
                              }}
                            >
                              <Cancel
                                color="error"
                                sx={{ fontSize: 20, mr: 1.5 }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "medium" }}
                              >
                                {item}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
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
              {/* Pricing Card with Travel Animation */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    position: "sticky",
                    top: 24,
                    mb: 3,
                    borderRadius: 4,
                    background:
                      "linear-gradient(145deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    boxShadow: "0 20px 40px rgba(102,126,234,0.3)",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,20 Q40,5 60,20 T100,20" stroke="rgba(255,255,255,0.1)" fill="none"/><circle cx="80" cy="80" r="15" fill="rgba(255,255,255,0.05)"/></svg>\')',
                    },
                  }}
                >
                  <CardContent sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Typography
                          variant="h3"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          ${packageData.price}
                        </Typography>
                      </motion.div>
                      {packageData.originalPrice && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              textDecoration: "line-through",
                              opacity: 0.7,
                              mb: 1,
                            }}
                          >
                            ${packageData.originalPrice}
                          </Typography>
                        </motion.div>
                      )}
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        per person
                      </Typography>
                    </Box>

                    <Stack spacing={2}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                          onClick={() => setShowBookingDialog(true)}
                          sx={{
                            py: 2,
                            background:
                              "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                            boxShadow: "0 8px 16px rgba(255,107,107,0.3)",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #FF5252 30%, #FF7043 90%)",
                              boxShadow: "0 12px 20px rgba(255,107,107,0.4)",
                            },
                          }}
                        >
                          🎒 Book Your Adventure
                        </Button>
                      </motion.div>

                      <Stack direction="row" justifyContent="space-around">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconButton
                            onClick={() => setIsFavorite(!isFavorite)}
                            sx={{
                              color: isFavorite
                                ? "#FF6B6B"
                                : "rgba(255,255,255,0.7)",
                              bgcolor: "rgba(255,255,255,0.1)",
                              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                            }}
                          >
                            {isFavorite ? <Favorite /> : <FavoriteBorder />}
                          </IconButton>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: -10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconButton
                            sx={{
                              color: "rgba(255,255,255,0.7)",
                              bgcolor: "rgba(255,255,255,0.1)",
                              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                            }}
                          >
                            <Share />
                          </IconButton>
                        </motion.div>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: "medium",
                      }}
                    >
                      📅 Available Dates
                    </Typography>
                    <Stack spacing={1}>
                      {packageData.availableDates.map((date, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CalendarToday />}
                            fullWidth
                            sx={{
                              color: "white",
                              borderColor: "rgba(255,255,255,0.3)",
                              "&:hover": {
                                borderColor: "rgba(255,255,255,0.6)",
                                bgcolor: "rgba(255,255,255,0.1)",
                              },
                            }}
                          >
                            {new Date(date).toLocaleDateString()}
                          </Button>
                        </motion.div>
                      ))}
                    </Stack>

                    <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: "medium",
                      }}
                    >
                      🆘 Need Help?
                    </Typography>
                    <Stack spacing={1}>
                      {[
                        { icon: <Phone />, label: "Call Us", emoji: "📞" },
                        { icon: <WhatsApp />, label: "WhatsApp", emoji: "💬" },
                        { icon: <Email />, label: "Email Us", emoji: "✉️" },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            startIcon={item.icon}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                              color: "white",
                              borderColor: "rgba(255,255,255,0.3)",
                              "&:hover": {
                                borderColor: "rgba(255,255,255,0.6)",
                                bgcolor: "rgba(255,255,255,0.1)",
                              },
                            }}
                          >
                            {item.emoji} {item.label}
                          </Button>
                        </motion.div>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
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
