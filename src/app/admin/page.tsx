"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TravelExplore as PackagesIcon,
  LocationOn as DestinationsIcon,
  Article as BlogIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  People as UsersIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { packageAPI } from "@/lib/api";

// Define proper types for API responses
interface Destination {
  _id: string;
  name: string;
  featured: boolean;
  [key: string]: unknown;
}

interface BlogPost {
  _id: string;
  title: string;
  published: boolean;
  [key: string]: unknown;
}

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  // State management
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    status: string;
    loading: boolean;
  }>({
    connected: false,
    status: "unknown",
    loading: false,
  });

  const [stats, setStats] = useState({
    packages: { total: 0, featured: 0, loading: true },
    destinations: { total: 0, featured: 0, loading: true },
    blogs: { total: 0, published: 0, loading: true },
  });

  const [recentActivity, setRecentActivity] = useState<
    Array<{
      id: string;
      type: "package" | "destination" | "blog";
      action: "created" | "updated" | "deleted";
      title: string;
      timestamp: Date;
    }>
  >([]);

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

  // Fetch statistics
  const fetchStats = async () => {
    try {
      // Fetch packages stats
      const packagesResponse = await packageAPI.getAllPackages();
      if (packagesResponse.success && packagesResponse.data) {
        const packages = packagesResponse.data;
        setStats((prev) => ({
          ...prev,
          packages: {
            total: packages.length,
            featured: packages.filter((p) => p.featured).length,
            loading: false,
          },
        }));
      }

      // Fetch destinations stats
      try {
        const destResponse = await fetch("/api/destinations");
        const destData = await destResponse.json();
        if (destData.success && destData.data) {
          const destinations: Destination[] = destData.data;
          setStats((prev) => ({
            ...prev,
            destinations: {
              total: destinations.length,
              featured: destinations.filter((d: Destination) => d.featured)
                .length,
              loading: false,
            },
          }));
        }
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setStats((prev) => ({
          ...prev,
          destinations: { ...prev.destinations, loading: false },
        }));
      }

      // Fetch blogs stats
      try {
        const blogResponse = await fetch("/api/blog");
        const blogData = await blogResponse.json();
        if (blogData.success && blogData.data) {
          const blogs: BlogPost[] = blogData.data;
          setStats((prev) => ({
            ...prev,
            blogs: {
              total: blogs.length,
              published: blogs.filter((b: BlogPost) => b.published).length,
              loading: false,
            },
          }));
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setStats((prev) => ({
          ...prev,
          blogs: { ...prev.blogs, loading: false },
        }));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
    fetchStats();

    // Set some mock recent activity
    setRecentActivity([
      {
        id: "1",
        type: "package",
        action: "created",
        title: "Himalayan Adventure Trek",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: "2",
        type: "blog",
        action: "updated",
        title: "Top 10 Travel Destinations for 2025",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "3",
        type: "destination",
        action: "created",
        title: "Bali, Indonesia",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      },
    ]);
  }, []);

  const managementCards = [
    {
      title: "Tour Packages",
      icon: <PackagesIcon />,
      description: "Manage tour packages, pricing, and availability",
      count: stats.packages.total,
      featured: stats.packages.featured,
      loading: stats.packages.loading,
      color: "primary" as ChipColor,
      actions: [
        { label: "View All", action: () => router.push("/admin/packages") },
        { label: "Add New", action: () => router.push("/admin/packages/add") },
      ],
    },
    {
      title: "Destinations",
      icon: <DestinationsIcon />,
      description: "Manage travel destinations and locations",
      count: stats.destinations.total,
      featured: stats.destinations.featured,
      loading: stats.destinations.loading,
      color: "secondary" as ChipColor,
      actions: [
        { label: "View All", action: () => router.push("/admin/destinations") },
        {
          label: "Add New",
          action: () => router.push("/admin/destinations/add"),
        },
      ],
    },
    {
      title: "Blog Posts",
      icon: <BlogIcon />,
      description: "Manage blog content and articles",
      count: stats.blogs.total,
      featured: stats.blogs.published,
      loading: stats.blogs.loading,
      color: "info" as ChipColor,
      actions: [
        { label: "View All", action: () => router.push("/admin/blog") },
        { label: "Add New", action: () => router.push("/admin/blog/add") },
      ],
    },
  ];

  const quickActions = [
    {
      title: "Database Health",
      icon: dbStatus.connected ? <CloudDoneIcon /> : <CloudOffIcon />,
      status: dbStatus.connected ? "Connected" : "Disconnected",
      color: dbStatus.connected ? "success" : "error",
      action: checkDatabaseConnection,
      loading: dbStatus.loading,
    },
    {
      title: "System Analytics",
      icon: <AnalyticsIcon />,
      status: "View Reports",
      color: "info",
      action: () => router.push("/admin/analytics"),
      loading: false,
    },
    {
      title: "User Management",
      icon: <UsersIcon />,
      status: "Manage Users",
      color: "warning",
      action: () => router.push("/admin/users"),
      loading: false,
    },
    {
      title: "System Settings",
      icon: <SettingsIcon />,
      status: "Configure",
      color: "default",
      action: () => router.push("/admin/settings"),
      loading: false,
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <DashboardIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Admin Dashboard
                </Typography>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  checkDatabaseConnection();
                  fetchStats();
                }}
              >
                Refresh Data
              </Button>
            </Stack>

            <Typography variant="h6" color="text.secondary">
              Manage your travel agency content and monitor system health
            </Typography>
          </Box>

          {/* Database Status Alert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Alert
              severity={dbStatus.connected ? "success" : "error"}
              sx={{ mb: 4 }}
              icon={
                dbStatus.loading ? (
                  <CircularProgress size={20} />
                ) : dbStatus.connected ? (
                  <CheckCircleIcon />
                ) : (
                  <WarningIcon />
                )
              }
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={checkDatabaseConnection}
                  disabled={dbStatus.loading}
                >
                  {dbStatus.loading ? "Checking..." : "Recheck"}
                </Button>
              }
            >
              Database Status:{" "}
              {dbStatus.connected
                ? "Connected and operational"
                : "Connection failed - check your MongoDB configuration"}
            </Alert>
          </motion.div>

          <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
            {/* Management Cards */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Content Management
              </Typography>

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                sx={{ mb: 4 }}
              >
                {managementCards.map((card, index) => (
                  <Box key={card.title} sx={{ flex: 1 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: (theme) => theme.shadows[8],
                          },
                        }}
                      >
                        <CardContent sx={{ flex: 1 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ mb: 2 }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: `${card.color}.main`,
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {card.icon}
                            </Box>
                            <Typography variant="h6" fontWeight="bold">
                              {card.title}
                            </Typography>
                          </Stack>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {card.description}
                          </Typography>

                          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            {card.loading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <>
                                <Chip
                                  label={`Total: ${card.count}`}
                                  color={card.color}
                                  variant="outlined"
                                />
                                <Chip
                                  label={`Featured: ${card.featured}`}
                                  color={card.color}
                                />
                              </>
                            )}
                          </Stack>
                        </CardContent>

                        <CardActions>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ width: "100%" }}
                          >
                            {card.actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                size="small"
                                variant={
                                  actionIndex === 0 ? "outlined" : "contained"
                                }
                                onClick={action.action}
                                startIcon={
                                  actionIndex === 1 ? <AddIcon /> : <ViewIcon />
                                }
                                sx={{ flex: 1 }}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </Stack>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Box>
                ))}
              </Stack>

              {/* Quick Actions */}
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Quick Actions
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ flexWrap: "wrap" }}
                >
                  {quickActions.map((action, index) => (
                    <Box
                      key={action.title}
                      sx={{
                        flex: {
                          xs: 1,
                          sm: "0 1 calc(50% - 8px)",
                          md: "0 1 calc(25% - 12px)",
                        },
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            height: "100%",
                            "&:hover": {
                              backgroundColor: "action.hover",
                              transform: "translateY(-2px)",
                            },
                          }}
                          onClick={action.action}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Box
                              sx={{
                                color: `${action.color}.main`,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {action.loading ? (
                                <CircularProgress size={24} />
                              ) : (
                                action.icon
                              )}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {action.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {action.status}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </motion.div>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Recent Activity Sidebar */}
            <Box sx={{ minWidth: { xs: "100%", lg: 320 } }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card sx={{ height: "fit-content" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Recent Activity
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {recentActivity.length > 0 ? (
                      <List dense>
                        {recentActivity.map((activity) => (
                          <ListItem key={activity.id} sx={{ px: 0 }}>
                            <ListItemIcon>
                              {activity.type === "package" && (
                                <PackagesIcon color="primary" />
                              )}
                              {activity.type === "destination" && (
                                <DestinationsIcon color="secondary" />
                              )}
                              {activity.type === "blog" && (
                                <BlogIcon color="info" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={activity.title}
                              secondary={
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ flexWrap: "wrap" }}
                                >
                                  <Chip
                                    label={activity.action}
                                    size="small"
                                    color={
                                      activity.action === "created"
                                        ? "success"
                                        : activity.action === "updated"
                                        ? "info"
                                        : "error"
                                    }
                                    variant="outlined"
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatTimeAgo(activity.timestamp)}
                                  </Typography>
                                </Stack>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        No recent activity
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* System Overview */}
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      System Overview
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Stack spacing={2}>
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">Database</Typography>
                          <Chip
                            size="small"
                            label={dbStatus.connected ? "Online" : "Offline"}
                            color={dbStatus.connected ? "success" : "error"}
                          />
                        </Stack>
                      </Box>

                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">API Status</Typography>
                          <Chip
                            size="small"
                            label="Operational"
                            color="success"
                          />
                        </Stack>
                      </Box>

                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">Last Backup</Typography>
                          <Typography variant="caption" color="text.secondary">
                            2 hours ago
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;
