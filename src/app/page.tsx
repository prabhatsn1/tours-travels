"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";
import {
  Search,
  Flight,
  Hotel,
  DirectionsCar,
  Security,
  Star,
  TrendingUp,
  Groups,
  SupportAgent,
  PlayArrow,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import PackageCard from "@/components/ui/PackageCard";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { tourPackages, destinations, testimonials } from "@/data/sampleData";

const HomePage: React.FC = () => {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    travelers: "2",
  });

  const handleSearchChange = (field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Search:", searchData);
    // Handle search logic
  };

  // Hero Section
  const HeroSection = () => (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(76, 175, 80, 0.8) 100%), url(/images/hero-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        color: "white",
        position: "relative",
      }}
    >
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
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                Discover Your Next
                <Box
                  component="span"
                  sx={{ color: "secondary.main", display: "block" }}
                >
                  Adventure
                </Box>
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Create unforgettable memories with our expertly crafted travel
                experiences
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "secondary.main",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
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
                    },
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
              {/* Search Card */}
              <Card sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                <Typography
                  variant="h6"
                  color="text.primary"
                  gutterBottom
                  fontWeight="bold"
                >
                  Find Your Perfect Trip
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Where to?"
                    value={searchData.destination}
                    onChange={(e) =>
                      handleSearchChange("destination", e.target.value)
                    }
                    variant="outlined"
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
                    sx={{ py: 1.5 }}
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

  // Services Section
  const ServicesSection = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Our Services
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Everything you need for the perfect trip
        </Typography>
      </motion.div>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={4}
        sx={{ flexWrap: "wrap", justifyContent: "center" }}
      >
        {[
          {
            icon: <Flight />,
            title: "Flight Booking",
            desc: "Best deals on flights worldwide",
          },
          {
            icon: <Hotel />,
            title: "Hotel Booking",
            desc: "Luxury to budget accommodations",
          },
          {
            icon: <DirectionsCar />,
            title: "Car Rentals",
            desc: "Comfortable rides for your journey",
          },
          {
            icon: <Security />,
            title: "Travel Insurance",
            desc: "Comprehensive coverage for peace of mind",
          },
        ].map((service, index) => (
          <Box
            key={index}
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}
          >
            <motion.div
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
                  "&:hover": {
                    transform: "translateY(-8px)",
                    transition: "transform 0.3s ease",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {service.icon}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.desc}
                </Typography>
              </Card>
            </motion.div>
          </Box>
        ))}
      </Stack>
    </Container>
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

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          {tourPackages
            .filter((pkg) => pkg.featured)
            .map((pkg, index) => (
              <Box
                key={pkg.id}
                sx={{ flex: { xs: "1 1 100%", md: "1 1 45%", lg: "1 1 30%" } }}
              >
                <PackageCard package={pkg} index={index} />
              </Box>
            ))}
        </Stack>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button variant="outlined" size="large" sx={{ px: 4 }}>
            View All Packages
          </Button>
        </Box>
      </Container>
    </Box>
  );

  // Stats Section
  const StatsSection = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={4}
        sx={{ flexWrap: "wrap" }}
      >
        {[
          { icon: <Groups />, number: "10,000+", label: "Happy Travelers" },
          { icon: <Star />, number: "4.9", label: "Average Rating" },
          { icon: <TrendingUp />, number: "150+", label: "Destinations" },
          { icon: <SupportAgent />, number: "24/7", label: "Customer Support" },
        ].map((stat, index) => (
          <Box key={index} sx={{ flex: { xs: "1 1 50%", md: "1 1 25%" } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: "center",
                  "&:hover": {
                    elevation: 4,
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <Box
                  sx={{
                    color: "primary.main",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stat.number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        ))}
      </Stack>
    </Container>
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
    </Container>
  );

  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <FeaturedPackagesSection />
      <StatsSection />
      <PopularDestinationsSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default HomePage;
