"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  MenuItem,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, Star, LocationOn } from "@mui/icons-material";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { getDestinations } from "@/lib/api";
import { Destination } from "@/types";

const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const regions = [
    "All",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Africa",
    "Oceania",
  ];
  const budgetRanges = useMemo(
    () => [
      { label: "All", value: "", min: undefined, max: undefined },
      { label: "Budget ($0-$500)", value: "budget", min: 0, max: 500 },
      { label: "Mid-range ($500-$1500)", value: "mid", min: 500, max: 1500 },
      { label: "Luxury ($1500+)", value: "luxury", min: 1500, max: undefined },
    ],
    []
  );

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError("");

        const budgetRange = budgetRanges.find((r) => r.value === budgetFilter);

        const params = {
          search: searchTerm || undefined,
          region:
            regionFilter && regionFilter !== "All" ? regionFilter : undefined,
          minPrice: budgetRange?.min,
          maxPrice: budgetRange?.max,
          sortBy:
            sortBy === "name"
              ? "name"
              : sortBy === "price-low"
              ? "price"
              : sortBy === "price-high"
              ? "price"
              : sortBy === "rating"
              ? "rating"
              : "name",
          sortOrder:
            sortBy === "price-high" || sortBy === "rating"
              ? ("desc" as const)
              : ("asc" as const),
          limit: 50, // Get more results for client-side display
        };

        const response = await getDestinations(params);

        if (response.success) {
          setDestinations(response.data || []);
        } else {
          setError(response.error || "Failed to fetch destinations");
        }
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to load destinations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [searchTerm, regionFilter, budgetFilter, sortBy, budgetRanges]);

  const filteredDestinations = useMemo(() => {
    // Since we're doing server-side filtering, we just return the destinations as is
    // But we can add any additional client-side filtering if needed
    return destinations;
  }, [destinations]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading destinations...
          </Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(76, 175, 80, 0.6) 100%), url(/images/destinations-hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: 12,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              align="center"
            >
              Explore Destinations
            </Typography>
            <Typography variant="h5" align="center" sx={{ opacity: 0.9 }}>
              Discover amazing places around the world
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Filters Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
            >
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                  fullWidth
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Box>

              <TextField
                select
                label="Region"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {regions.map((region) => (
                  <MenuItem key={region} value={region === "All" ? "" : region}>
                    {region}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Budget"
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                {budgetRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </motion.div>
      </Container>

      {/* Error Display */}
      {error && (
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Container>
      )}

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography variant="h6" gutterBottom>
          {filteredDestinations.length} destinations found
        </Typography>

        <Stack spacing={4} sx={{ mt: 3 }}>
          {filteredDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease",
                    boxShadow: 3,
                  },
                }}
              >
                <Stack direction={{ xs: "column", md: "row" }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: "100%", md: 300 },
                      height: { xs: 200, md: 250 },
                      objectFit: "cover",
                    }}
                    image={destination.images[0] || "/images/placeholder.jpg"}
                    alt={destination.name}
                  />
                  <Box
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {destination.name}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <LocationOn fontSize="small" color="primary" />
                            <Typography variant="body1" color="text.secondary">
                              {destination.country}
                            </Typography>
                            <Chip
                              label={destination.region}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Stack>
                        </Box>

                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {destination.description}
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <Star sx={{ color: "gold", fontSize: 20 }} />
                            <Typography variant="body2" fontWeight="medium">
                              {destination.averageRating.toFixed(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ({destination.reviewCount} reviews)
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ flexWrap: "wrap" }}
                        >
                          {destination.highlights
                            .slice(0, 3)
                            .map((highlight, idx) => (
                              <Chip
                                key={idx}
                                label={highlight}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          {destination.highlights.length > 3 && (
                            <Chip
                              label={`+${
                                destination.highlights.length - 3
                              } more`}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          )}
                        </Stack>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Starting from
                            </Typography>
                            <Typography
                              variant="h5"
                              fontWeight="bold"
                              color="primary"
                            >
                              ${destination.startingPrice}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              per person
                            </Typography>
                          </Box>
                          <Button variant="contained" size="large">
                            View Details
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          ))}
        </Stack>

        {filteredDestinations.length === 0 && !loading && !error && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No destinations found matching your criteria.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your filters or search terms.
            </Typography>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default DestinationsPage;
