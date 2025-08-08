"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import PackageCard from "@/components/ui/PackageCard";
import { packageAPI } from "@/lib/api";
import { TourPackage } from "@/types";

const categories = [
  "All",
  "Adventure",
  "Cultural",
  "Relaxation",
  "Wildlife",
  "City",
];

const difficulties = ["All", "Easy", "Moderate", "Challenging"];

const budgetRanges = [
  { label: "All", value: "" },
  { label: "Budget ($0-$1000)", value: "budget", min: 0, max: 1000 },
  { label: "Mid-range ($1000-$3000)", value: "mid", min: 1000, max: 3000 },
  { label: "Luxury ($3000+)", value: "luxury", min: 3000, max: Infinity },
];

const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await packageAPI.getAllPackages();
        if (response.success && response.data) {
          setPackages(response.data);
        } else {
          setError("Failed to load packages");
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    const filtered = packages.filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "All" ||
        pkg.category === categoryFilter;
      const matchesDifficulty =
        !difficultyFilter ||
        difficultyFilter === "All" ||
        pkg.difficulty === difficultyFilter;

      let matchesBudget = true;
      if (budgetFilter) {
        const range = budgetRanges.find((r) => r.value === budgetFilter);
        if (range && range.min !== undefined && range.max !== undefined) {
          matchesBudget = pkg.price >= range.min && pkg.price <= range.max;
        }
      }

      return (
        matchesSearch && matchesCategory && matchesDifficulty && matchesBudget
      );
    });

    // Sort packages
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "duration":
          // Convert duration strings to numbers for comparison (extract first number)
          const aDuration = parseInt(a.duration.match(/\d+/)?.[0] || "0");
          const bDuration = parseInt(b.duration.match(/\d+/)?.[0] || "0");
          return aDuration - bDuration;
        case "name":
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [
    packages,
    searchTerm,
    categoryFilter,
    difficultyFilter,
    budgetFilter,
    sortBy,
  ]);

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(76, 175, 80, 0.6) 100%), url(/images/packages-hero.jpg)",
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
              Tour Packages
            </Typography>
            <Typography variant="h5" align="center" sx={{ opacity: 0.9 }}>
              Carefully crafted experiences for every traveler
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
                  placeholder="Search packages..."
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
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    value={category === "All" ? "" : category}
                  >
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Difficulty"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {difficulties.map((difficulty) => (
                  <MenuItem
                    key={difficulty}
                    value={difficulty === "All" ? "" : difficulty}
                  >
                    {difficulty}
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
                <MenuItem value="duration">Duration</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </motion.div>
      </Container>

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {filteredPackages.length} packages found
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ mt: 3, flexWrap: "wrap", justifyContent: "center" }}
            >
              {filteredPackages.map((pkg, index) => (
                <Box
                  key={pkg.id}
                  sx={{
                    flex: { xs: "1 1 100%", md: "1 1 45%", lg: "1 1 30%" },
                  }}
                >
                  <PackageCard package={pkg} index={index} />
                </Box>
              ))}
            </Stack>

            {filteredPackages.length === 0 && !loading && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No packages found matching your criteria.
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Try adjusting your filters or search terms.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default PackagesPage;
