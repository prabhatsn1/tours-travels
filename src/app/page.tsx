"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Flight,
  Hotel,
  DirectionsCar,
  Security,
  Star,
  PlayArrow,
  LocationOn,
  Phone,
  Email,
  WhatsApp,
  ExpandMore,
  ArrowUpward,
  CheckCircle,
  TravelExplore,
  CameraAlt,
  LocalOffer,
  EmojiEvents,
  Verified,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import PackageCard from "@/components/ui/PackageCard";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { packageAPI, getDestinations } from "@/lib/api";
import { TourPackage, Destination } from "@/types";
import { testimonials } from "@/data/sampleData";

const HomePage: React.FC = () => {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    travelers: "2",
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false);

  // API data states
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured packages and popular destinations in parallel
        const [packagesResponse, destinationsResponse] = await Promise.all([
          packageAPI.getFeaturedPackages(),
          getDestinations({ featured: true, limit: 6 }),
        ]);

        if (packagesResponse.success && packagesResponse.data) {
          setTourPackages(packagesResponse.data);
        } else {
          console.error("Failed to fetch packages:", packagesResponse.error);
        }

        if (destinationsResponse.success && destinationsResponse.data) {
          setDestinations(destinationsResponse.data);
        } else {
          console.error(
            "Failed to fetch destinations:",
            destinationsResponse.error
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Search:", searchData);
    // Enhanced search logic with validation
    if (!searchData.destination.trim()) {
      alert("Please select a destination");
      return;
    }
    // Navigate to search results or filter packages
  };

  const handleNewsletterSubmit = () => {
    if (newsletterEmail && newsletterEmail.includes("@")) {
      setShowNewsletterSuccess(true);
      setNewsletterEmail("");
    }
  };

  // Enhanced Hero Section
  const HeroSection = () => (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(76, 175, 80, 0.8) 100%), url(/images/hero-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "10%",
          opacity: 0.1,
          fontSize: "8rem",
        }}
      >
        <TravelExplore />
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          opacity: 0.1,
          fontSize: "6rem",
        }}
      >
        <CameraAlt />
      </Box>

      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="center"
        >
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ mb: 2 }}>
                <Chip
                  label="🌟 #1 Travel Agency 2024"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    mb: 2,
                  }}
                />
              </Box>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: "3rem", md: "4rem" } }}
              >
                Discover Your Next
                <Box
                  component="span"
                  sx={{
                    color: "secondary.main",
                    display: "block",
                    background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Adventure
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
              >
                Create unforgettable memories with our expertly crafted travel
                experiences. From breathtaking destinations to luxurious
                accommodations.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip
                  icon={<Verified />}
                  label="Trusted by 10,000+ travelers"
                  variant="outlined"
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)" }}
                />
                <Chip
                  icon={<EmojiEvents />}
                  label="Award winning service"
                  variant="outlined"
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)" }}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "secondary.main",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Explore Packages
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "secondary.main",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Watch Video
                </Button>
              </Stack>
            </motion.div>
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Enhanced Search Card */}
              <Card
                sx={{
                  p: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocalOffer sx={{ color: "primary.main", mr: 1 }} />
                  <Typography
                    variant="h6"
                    color="text.primary"
                    fontWeight="bold"
                  >
                    Find Your Perfect Trip
                  </Typography>
                  <Chip
                    label="Save 20%"
                    size="small"
                    color="success"
                    sx={{ ml: "auto" }}
                  />
                </Box>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Where to?"
                    value={searchData.destination}
                    onChange={(e) =>
                      handleSearchChange("destination", e.target.value)
                    }
                    variant="outlined"
                    placeholder="Enter destination..."
                    InputProps={{
                      startAdornment: (
                        <LocationOn sx={{ color: "primary.main", mr: 1 }} />
                      ),
                    }}
                  />
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      label="Check In"
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) =>
                        handleSearchChange("checkIn", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label="Check Out"
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) =>
                        handleSearchChange("checkOut", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    select
                    label="Travelers"
                    value={searchData.travelers}
                    onChange={(e) =>
                      handleSearchChange("travelers", e.target.value)
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <MenuItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Traveler" : "Travelers"}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Search />}
                    onClick={handleSearch}
                    sx={{
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      boxShadow: "0 4px 15px rgba(25,118,210,0.4)",
                    }}
                  >
                    Search Trips
                  </Button>
                </Stack>
              </Card>
            </motion.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );

  // Enhanced Services Section
  const ServicesSection = () => (
    <Box
      sx={{
        py: 8,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(76, 175, 80, 0.1))",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "linear-gradient(45deg, rgba(156, 39, 176, 0.1), rgba(255, 152, 0, 0.1))",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              fontWeight="bold"
              sx={{
                background: "linear-gradient(45deg, #1976d2, #4caf50)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              Our Premium Services
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{
                mb: 2,
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Everything you need for the perfect trip, backed by our 24/7
              support and best price guarantee
            </Typography>
          </Box>
        </motion.div>

        {/* Services Grid with Better Arrangement */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: { xs: 3, sm: 4 },
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          {[
            {
              icon: <Flight />,
              title: "Flight Booking",
              desc: "Best deals on flights worldwide with flexible cancellation",
              features: [
                "Price match guarantee",
                "24/7 support",
                "Flexible dates",
              ],
              color: "#2196F3",
              gradient: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
            },
            {
              icon: <Hotel />,
              title: "Hotel Booking",
              desc: "Luxury to budget accommodations verified by our team",
              features: [
                "Verified reviews",
                "Best locations",
                "Free cancellation",
              ],
              color: "#4CAF50",
              gradient: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
            },
            {
              icon: <DirectionsCar />,
              title: "Car Rentals",
              desc: "Comfortable rides for your journey with GPS included",
              features: ["GPS navigation", "Full insurance", "Pickup service"],
              color: "#FF9800",
              gradient: "linear-gradient(135deg, #FF9800 0%, #FFC107 100%)",
            },
            {
              icon: <Security />,
              title: "Travel Insurance",
              desc: "Comprehensive coverage for complete peace of mind",
              features: [
                "Medical coverage",
                "Trip cancellation",
                "24/7 assistance",
              ],
              color: "#9C27B0",
              gradient: "linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)",
            },
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  border: `2px solid transparent`,
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 40px ${service.color}25`,
                    borderColor: `${service.color}30`,
                    "& .service-icon": {
                      transform: "scale(1.1)",
                      background: service.gradient,
                    },
                  },
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  {/* Icon with enhanced styling */}
                  <Box
                    className="service-icon"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: `linear-gradient(45deg, ${service.color}15, ${service.color}25)`,
                      color: service.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      transition: "all 0.3s ease",
                      border: `3px solid ${service.color}20`,
                    }}
                  >
                    {service.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ color: "text.primary", mb: 1.5 }}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2.5, lineHeight: 1.6, minHeight: 40 }}
                  >
                    {service.desc}
                  </Typography>

                  {/* Features List */}
                  <Stack spacing={1.5}>
                    {service.features.map((feature, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: `${service.color}08`,
                          borderRadius: 2,
                          py: 0.5,
                          px: 1,
                        }}
                      >
                        <CheckCircle
                          sx={{ fontSize: 16, color: service.color, mr: 1 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight="medium"
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );

  // Featured Packages Section
  const FeaturedPackagesSection = () => (
    <Box sx={{ backgroundColor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            Featured Packages
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Handpicked destinations for unforgettable experiences
          </Typography>
        </motion.div>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Box>
        ) : tourPackages.length > 0 ? (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            sx={{ flexWrap: "wrap", justifyContent: "center" }}
          >
            {tourPackages.map((pkg, index) => (
              <Box
                key={pkg.id}
                sx={{ flex: { xs: "1 1 100%", md: "1 1 45%", lg: "1 1 30%" } }}
              >
                <PackageCard package={pkg} index={index} />
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No featured packages available at the moment.
            </Typography>
          </Box>
        )}

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button variant="outlined" size="large" sx={{ px: 4 }}>
            View All Packages
          </Button>
        </Box>
      </Container>
    </Box>
  );

  // Newsletter Section
  const NewsletterSection = () => (
    <Box sx={{ backgroundColor: "background.paper", py: 8 }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            />
            <Email sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Stay Updated with Amazing Deals
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Get exclusive travel deals, destination guides, and insider tips
              delivered to your inbox
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ maxWidth: 500, mx: "auto" }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.7)",
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleNewsletterSubmit}
                sx={{
                  backgroundColor: "white",
                  color: "primary.main",
                  px: 4,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                }}
              >
                Subscribe
              </Button>
            </Stack>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Join 50,000+ travelers who never miss a deal
            </Typography>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );

  // FAQ Section
  const FAQSection = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Everything you need to know about traveling with us
        </Typography>
      </motion.div>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
        <Box sx={{ flex: 1 }}>
          {[
            {
              question: "How do I book a package?",
              answer:
                "You can book directly through our website or call our 24/7 support team. We accept all major payment methods and offer flexible payment plans.",
            },
            {
              question: "What's included in the packages?",
              answer:
                "Our packages typically include accommodation, meals, transportation, guided tours, and travel insurance. Specific inclusions vary by package.",
            },
            {
              question: "Can I customize my trip?",
              answer:
                "Absolutely! We offer fully customizable packages to match your preferences, budget, and travel dates.",
            },
          ].map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" fontWeight="bold">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box sx={{ flex: 1 }}>
          {[
            {
              question: "What's your cancellation policy?",
              answer:
                "We offer flexible cancellation up to 48 hours before departure for most packages. Premium packages may have different terms.",
            },
            {
              question: "Do you provide travel insurance?",
              answer:
                "Yes, comprehensive travel insurance is included in all our packages, covering medical emergencies, trip cancellation, and lost baggage.",
            },
            {
              question: "How do I contact support while traveling?",
              answer:
                "Our 24/7 support team is available via phone, WhatsApp, or our mobile app. We also have local representatives in most destinations.",
            },
          ].map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" fontWeight="bold">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Stack>
    </Container>
  );

  // Contact CTA Section
  const ContactCTASection = () => (
    <Box sx={{ backgroundColor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <Card sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Start Your Adventure?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Get in touch with our travel experts for personalized
            recommendations
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Phone />}
              sx={{ px: 4 }}
            >
              Call Now: +1 (555) 123-4567
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<WhatsApp />}
              sx={{ px: 4 }}
            >
              WhatsApp Chat
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Email />}
              sx={{ px: 4 }}
            >
              Email Us
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );

  // Testimonials Section
  const TestimonialsSection = () => (
    <Box sx={{ backgroundColor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            What Our Travelers Say
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Real experiences from real travelers
          </Typography>
        </motion.div>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          {testimonials.map((testimonial, index) => (
            <Box
              key={testimonial.id}
              sx={{ flex: { xs: "1 1 100%", md: "1 1 45%", lg: "1 1 30%" } }}
            >
              <TestimonialCard testimonial={testimonial} index={index} />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );

  // Popular Destinations
  const PopularDestinationsSection = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Popular Destinations
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Explore the world&apos;s most amazing places
        </Typography>
      </motion.div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : destinations.length > 0 ? (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          {destinations.map((destination, index) => (
            <Box
              key={destination.id}
              sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" } }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: 300,
                    backgroundImage: `url(${
                      destination.images[0] || "/images/placeholder.jpg"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover .overlay": {
                      opacity: 0.8,
                    },
                  }}
                >
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                      opacity: 0.6,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                  <CardContent
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      color: "white",
                      zIndex: 2,
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {destination.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {destination.country}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Star fontSize="small" />
                      <Typography variant="body2">
                        {destination.averageRating} ({destination.reviewCount}{" "}
                        reviews)
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      From ${destination.startingPrice}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No destinations available at the moment.
          </Typography>
        </Box>
      )}
    </Container>
  );

  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <FeaturedPackagesSection />
      <PopularDestinationsSection />
      <TestimonialsSection />
      <NewsletterSection />
      <FAQSection />
      <ContactCTASection />

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
          >
            <Fab
              color="primary"
              onClick={scrollToTop}
              sx={{
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease",
                },
              }}
            >
              <ArrowUpward />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter Success Snackbar */}
      <Snackbar
        open={showNewsletterSuccess}
        autoHideDuration={4000}
        onClose={() => setShowNewsletterSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowNewsletterSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully subscribed to our newsletter! 🎉
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default HomePage;
