"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { packageAPI } from "@/lib/api";
import { TourPackage } from "@/types";

const AdminPackagesPage: React.FC = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<TourPackage | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(
    null
  );
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    status: string;
    loading: boolean;
  }>({
    connected: false,
    status: "unknown",
    loading: false,
  });

  // Fetch packages
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

  useEffect(() => {
    fetchPackages();
  }, []);

  // Check database connection
  const checkDatabaseConnection = async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch("/api/health");
      const result = await response.json();

      setDbStatus({
        connected: result.success && result.data.database.connected,
        status: result.data.database.status,
        loading: false,
      });
    } catch (error) {
      console.error("Database connection check failed:", error);
      setDbStatus({
        connected: false,
        status: "error",
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || pkg.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Handle delete
  const handleDeleteClick = (pkg: TourPackage) => {
    setPackageToDelete(pkg);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!packageToDelete) return;

    try {
      const response = await packageAPI.deletePackage(packageToDelete.id);
      if (response.success) {
        setPackages(packages.filter((p) => p.id !== packageToDelete.id));
        setDeleteDialogOpen(false);
        setPackageToDelete(null);
      } else {
        setError("Failed to delete package");
      }
    } catch (err) {
      console.error("Error deleting package:", err);
      setError("Failed to delete package");
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    pkg: TourPackage
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPackage(pkg);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPackage(null);
  };

  const handleEdit = () => {
    if (selectedPackage) {
      router.push(`/admin/packages/edit/${selectedPackage.id}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedPackage) {
      router.push(`/packages/${selectedPackage.id}`);
    }
    handleMenuClose();
  };

  const categories = [
    "All",
    "Adventure",
    "Cultural",
    "Relaxation",
    "Wildlife",
    "Honeymoon",
    "Family",
    "Luxury",
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Package Management
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {/* Database Status Button */}
              <Button
                variant="outlined"
                startIcon={
                  dbStatus.loading ? (
                    <CircularProgress size={16} />
                  ) : dbStatus.connected ? (
                    <CloudDoneIcon />
                  ) : (
                    <CloudOffIcon />
                  )
                }
                onClick={checkDatabaseConnection}
                disabled={dbStatus.loading}
                color={dbStatus.connected ? "success" : "error"}
                sx={{ minWidth: 160 }}
              >
                {dbStatus.loading
                  ? "Checking..."
                  : dbStatus.connected
                  ? "DB Connected"
                  : "DB Disconnected"}
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/admin/packages/add")}
                size="large"
              >
                Add New Package
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
              >
                <TextField
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1, minWidth: 250 }}
                />

                <TextField
                  select
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 120 }}
                >
                  {filteredPackages.length} of {packages.length} packages
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Packages Stack */}
              <Stack spacing={3}>
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: "100%", md: 300 },
                          height: { xs: 200, md: 200 },
                          objectFit: "cover",
                        }}
                        image={pkg.images?.[0] || "/images/placeholder.jpg"}
                        alt={pkg.title}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <CardContent sx={{ flex: 1 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            sx={{ mb: 1 }}
                          >
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{ flex: 1, mr: 1 }}
                            >
                              {pkg.title}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, pkg)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Stack>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {pkg.destination}
                          </Typography>

                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                              label={pkg.category}
                              size="small"
                              color="primary"
                            />
                            <Chip
                              label={pkg.difficulty}
                              size="small"
                              variant="outlined"
                            />
                            {pkg.featured && (
                              <Chip
                                label="Featured"
                                size="small"
                                color="secondary"
                              />
                            )}
                          </Stack>

                          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Duration: {pkg.duration}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ⭐ {pkg.rating} ({pkg.reviewCount} reviews)
                            </Typography>
                          </Stack>

                          <Typography variant="h6" color="primary">
                            ${pkg.price}
                          </Typography>
                        </CardContent>

                        <CardActions
                          sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                        >
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => router.push(`/packages/${pkg.id}`)}
                          >
                            View
                          </Button>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() =>
                                router.push(`/admin/packages/edit/${pkg.id}`)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteClick(pkg)}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </CardActions>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Stack>

              {/* No Results */}
              {filteredPackages.length === 0 && !loading && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No packages found
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {searchTerm || categoryFilter !== "All"
                      ? "Try adjusting your search or filters."
                      : "Get started by adding your first package."}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/admin/packages/add")}
                  >
                    Add New Package
                  </Button>
                </Box>
              )}
            </>
          )}

          {/* Floating Action Button */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: 24, right: 24 }}
            onClick={() => router.push("/admin/packages/add")}
          >
            <AddIcon />
          </Fab>

          {/* Context Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleView}>
              <ViewIcon sx={{ mr: 1 }} />
              View Package
            </MenuItem>
            <MenuItem onClick={handleEdit}>
              <EditIcon sx={{ mr: 1 }} />
              Edit Package
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (selectedPackage) handleDeleteClick(selectedPackage);
                handleMenuClose();
              }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Delete Package
            </MenuItem>
          </Menu>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Package</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete &ldquo;{packageToDelete?.title}
                &rdquo;? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default AdminPackagesPage;
