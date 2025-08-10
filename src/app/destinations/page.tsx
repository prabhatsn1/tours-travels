"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Rating,
  Divider,
} from "@mui/material";
import {
  Search,
  Star,
  LocationOn,
  Schedule,
  Group,
  AttachMoney,
  Close,
  CalendarMonth,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { getDestinations } from "@/lib/api";
import { packageAPI } from "@/lib/api";
import { Destination, TourPackage } from "@/types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`destination-tabpanel-${index}`}
      aria-labelledby={`destination-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destinationPackages, setDestinationPackages] = useState<
    Record<string, TourPackage[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState<
    Record<string, boolean>
  >({});
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

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

  // Fetch packages for a specific destination
  const fetchPackagesForDestination = useCallback(
    async (destination: string) => {
      if (destinationPackages[destination]) return; // Already loaded

      try {
        setPackagesLoading((prev) => ({ ...prev, [destination]: true }));

        const response = await packageAPI.getAllPackages({
          search: destination,
          limit: 10,
          sortBy: "rating",
          sortOrder: "desc",
        });

        if (response.success) {
          setDestinationPackages((prev) => ({
            ...prev,
            [destination]: response.data || [],
          }));
        }
      } catch (err) {
        console.error(`Error fetching packages for ${destination}:`, err);
      } finally {
        setPackagesLoading((prev) => ({ ...prev, [destination]: false }));
      }
    },
    [destinationPackages]
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

  // Load packages when destinations are loaded
  useEffect(() => {
    if (destinations.length > 0) {
      destinations.forEach((dest) => {
        fetchPackagesForDestination(dest.name);
      });
    }
  }, [destinations, fetchPackagesForDestination]);

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setDialogOpen(true);
    setSelectedTab(0);

    // Ensure packages are loaded
    fetchPackagesForDestination(destination.name);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDestination(null);
  };

  const renderPackageCard = (pkg: TourPackage) => (
    <Card key={pkg.id} sx={{ mb: 2, "&:hover": { boxShadow: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }}>
        <CardMedia
          component="img"
          sx={{
            width: { xs: "100%", sm: 200 },
            height: { xs: 150, sm: 120 },
            objectFit: "cover",
          }}
          image={pkg.images[0] || "/images/placeholder.jpg"}
          alt={pkg.title}
        />
        <CardContent sx={{ flex: 1, p: 2 }}>
          <Stack spacing={1}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {pkg.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Schedule fontSize="small" color="primary" />
                <Typography variant="body2">{pkg.duration}</Typography>
                <Group fontSize="small" color="primary" />
                <Typography variant="body2">
                  {pkg.groupSize.min}-{pkg.groupSize.max} people
                </Typography>
              </Stack>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Rating
                value={pkg.rating}
                precision={0.1}
                size="small"
                readOnly
              />
              <Typography variant="body2" color="text.secondary">
                ({pkg.reviewCount} reviews)
              </Typography>
              <Chip
                label={pkg.difficulty}
                size="small"
                color={
                  pkg.difficulty === "Easy"
                    ? "success"
                    : pkg.difficulty === "Moderate"
                    ? "warning"
                    : "error"
                }
              />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {pkg.description}
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ${pkg.originalPrice}
                  </Typography>
                )}
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${pkg.price}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  per person
                </Typography>
              </Box>
              <Button variant="contained" size="small">
                View Details
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Stack>
    </Card>
  );

  const renderDestinationDetails = () => {
    if (!selectedDestination) return null;

    const packages = destinationPackages[selectedDestination.name] || [];
    const isLoadingPackages = packagesLoading[selectedDestination.name];

    return (
      <Box>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
        >
          <Tab label="Overview" />
          <Tab label={`Packages (${packages.length})`} />
          <Tab label="Gallery" />
          <Tab label="Reviews" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {selectedDestination.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <LocationOn color="primary" />
                <Typography variant="h6">
                  {selectedDestination.country}
                </Typography>
                <Chip
                  label={selectedDestination.region}
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Typography variant="body1" paragraph>
              {selectedDestination.description}
            </Typography>

            <Box>
              <Typography variant="h6" gutterBottom>
                Key Highlights
              </Typography>
              <Stack spacing={1}>
                {selectedDestination.highlights.map((highlight, index) => (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    key={index}
                  >
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">{highlight}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Divider />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Best Time to Visit
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarMonth color="primary" />
                  <Typography variant="body1">
                    {selectedDestination.bestTimeToVisit}
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Starting Price
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AttachMoney color="primary" />
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ${selectedDestination.startingPrice}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per person
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Box>
              <Typography variant="h6" gutterBottom>
                Popular Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {selectedDestination.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Packages for {selectedDestination.name}
            </Typography>

            {isLoadingPackages ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : packages.length > 0 ? (
              <Stack spacing={2}>{packages.map(renderPackageCard)}</Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No packages available for this destination yet.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check back later for new packages!
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Photo Gallery
            </Typography>
            <Stack spacing={2}>
              {selectedDestination.images
                .reduce((rows: React.ReactNode[][], image, index) => {
                  const rowIndex = Math.floor(index / 3);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(
                    <Box key={index} sx={{ flex: 1, minWidth: 200 }}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="200"
                          image={image}
                          alt={`${selectedDestination.name} ${index + 1}`}
                          sx={{ objectFit: "cover" }}
                        />
                      </Card>
                    </Box>
                  );
                  return rows;
                }, [] as React.ReactNode[][])
                .map((row, rowIndex) => (
                  <Stack
                    key={rowIndex}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                  >
                    {row}
                  </Stack>
                ))}
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Rating
                value={selectedDestination.averageRating}
                precision={0.1}
                readOnly
              />
              <Typography variant="h6">
                {selectedDestination.averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({selectedDestination.reviewCount} reviews)
              </Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary">
              Reviews feature coming soon! In the meantime, you can contact us
              for more information about this destination.
            </Typography>
          </Box>
        </TabPanel>
      </Box>
    );
  };

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
              Discover amazing places around the world with exclusive packages
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
                      height: { xs: 200, md: 300 },
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

                        {/* Package Preview */}
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Available Packages:
                          </Typography>
                          {packagesLoading[destination.name] ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {(destinationPackages[destination.name] || [])
                                .slice(0, 3)
                                .map((pkg, idx) => (
                                  <Chip
                                    key={idx}
                                    label={`${pkg.title} - $${pkg.price}`}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                ))}
                              {(destinationPackages[destination.name] || [])
                                .length > 3 && (
                                <Chip
                                  label={`+${
                                    (
                                      destinationPackages[destination.name] ||
                                      []
                                    ).length - 3
                                  } more`}
                                  size="small"
                                  color="secondary"
                                />
                              )}
                              {(destinationPackages[destination.name] || [])
                                .length === 0 &&
                                !packagesLoading[destination.name] && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    No packages available
                                  </Typography>
                                )}
                            </Stack>
                          )}
                        </Box>

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
                          <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleDestinationClick(destination)}
                          >
                            Explore Destination
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

      {/* Destination Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: "90vh", maxHeight: "800px" },
        }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="bold">
              {selectedDestination?.name}
            </Typography>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
              sx={{ minWidth: "auto", p: 1 }}
            >
              <Close />
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {renderDestinationDetails()}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DestinationsPage;
