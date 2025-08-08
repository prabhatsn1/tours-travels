"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Breadcrumbs,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search,
  FilterList,
  AccessTime,
  ArrowForward,
  BookmarkBorder,
  Share,
  TrendingUp,
  CalendarToday,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout/Layout";
import { BlogPost } from "@/types";

const categories = [
  "All",
  "Destinations",
  "Travel Tips",
  "Photography",
  "Budget Travel",
  "Adventure",
  "Culture",
  "Food",
];

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 6;

  // Fetch blog posts from API
  const fetchPosts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: postsPerPage.toString(),
        sortBy: "publishedAt",
        sortOrder: "desc",
      });

      if (searchTerm) {
        queryParams.set("search", searchTerm);
      }

      if (selectedCategory && selectedCategory !== "All") {
        queryParams.set("category", selectedCategory);
      }

      const response = await fetch(`/api/blog?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blog posts");
      }

      if (data.success) {
        setPosts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalPosts(data.pagination.total);
      } else {
        throw new Error(data.error || "Failed to fetch blog posts");
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch blog posts"
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, postsPerPage]);

  // Fetch featured post separately
  const fetchFeaturedPost = async () => {
    try {
      const response = await fetch("/api/blog?featured=true&limit=1");
      const data = await response.json();

      if (response.ok && data.success && data.data.length > 0) {
        setFeaturedPost(data.data[0]);
      }
    } catch (err) {
      console.error("Error fetching featured post:", err);
    }
  };

  // Fetch posts when dependencies change
  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, selectedCategory, fetchPosts]);

  // Fetch featured post on component mount
  useEffect(() => {
    fetchFeaturedPost();
  }, []);

  // Reset to first page when search or category changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory, currentPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs sx={{ mb: 4 }}>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
            <Typography color="primary" fontWeight="medium">
              Travel Blog
            </Typography>
          </Breadcrumbs>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              Travel Stories & Insights
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
            >
              Discover amazing destinations, get expert travel tips, and find
              inspiration for your next adventure
            </Typography>
            {totalPosts > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {totalPosts} articles available
              </Typography>
            )}
          </Box>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Paper
              sx={{
                mb: 6,
                borderRadius: 4,
                overflow: "hidden",
                background: "linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }}>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{ position: "relative", height: { xs: 300, md: 400 } }}
                  >
                    <Image
                      src={
                        featuredPost.featuredImage || "/images/placeholder.jpg"
                      }
                      alt={featuredPost.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        zIndex: 1,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Chip
                          label="✨ Featured"
                          sx={{
                            background:
                              "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                            color: "white",
                            fontWeight: "bold",
                            boxShadow: "0 4px 12px rgba(255,107,107,0.3)",
                          }}
                        />
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <CardContent sx={{ p: 4, height: "100%" }}>
                    <Stack spacing={2} sx={{ height: "100%" }}>
                      <Chip
                        label={featuredPost.category}
                        variant="outlined"
                        size="small"
                        color="primary"
                        sx={{ alignSelf: "flex-start" }}
                      />
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                      >
                        {featuredPost.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        {featuredPost.excerpt}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mt: "auto",
                        }}
                      >
                        <Avatar
                          src={featuredPost.author.avatar}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {featuredPost.author.name}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(
                                featuredPost.publishedAt
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {featuredPost.readTime} min read
                            </Typography>
                          </Stack>
                        </Box>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            component={Link}
                            href={`/blog/${featuredPost.slug}`}
                            endIcon={<ArrowForward />}
                            sx={{
                              background:
                                "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                              borderRadius: 3,
                            }}
                          >
                            Read More
                          </Button>
                        </motion.div>
                      </Box>
                    </Stack>
                  </CardContent>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        )}

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
            >
              <TextField
                fullWidth
                placeholder="Search articles, destinations, tips..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: { md: 400 } }}
              />

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      label={category}
                      onClick={() => handleCategoryChange(category)}
                      variant={
                        selectedCategory === category ? "filled" : "outlined"
                      }
                      color={
                        selectedCategory === category ? "primary" : "default"
                      }
                      sx={{
                        cursor: "pointer",
                        fontWeight:
                          selectedCategory === category ? "bold" : "medium",
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>

              <Button
                startIcon={<FilterList />}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                variant="outlined"
                sx={{ minWidth: "auto" }}
              >
                Filters
              </Button>
            </Stack>
          </Paper>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert
              severity="error"
              sx={{ mb: 4 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => fetchPosts()}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress size={48} />
          </Box>
        )}

        {/* Blog Posts Grid */}
        {!loading && !error && (
          <Stack
            direction="row"
            flexWrap="wrap"
            spacing={0}
            sx={{ gap: 4, justifyContent: "flex-start" }}
          >
            {posts.length === 0 ? (
              <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No blog posts found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search terms or category filters.
                </Typography>
              </Box>
            ) : (
              posts.map((post, index) => (
                <Box
                  key={post.id}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 16px)",
                      lg: "calc(33.333% - 21.33px)",
                    },
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ y: -10 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={
                            post.featuredImage || "/images/placeholder.jpg"
                          }
                          alt={post.title}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                          }}
                        >
                          <Chip
                            label={post.category}
                            size="small"
                            sx={{
                              background: "rgba(255,255,255,0.9)",
                              backdropFilter: "blur(8px)",
                              fontWeight: "medium",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            display: "flex",
                            gap: 1,
                          }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                background: "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(8px)",
                                "&:hover": {
                                  background: "rgba(255,255,255,1)",
                                },
                              }}
                            >
                              <BookmarkBorder fontSize="small" />
                            </IconButton>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                background: "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(8px)",
                                "&:hover": {
                                  background: "rgba(255,255,255,1)",
                                },
                              }}
                            >
                              <Share fontSize="small" />
                            </IconButton>
                          </motion.div>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2} sx={{ height: "100%" }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            component={Link}
                            href={`/blog/${post.slug}`}
                            sx={{
                              textDecoration: "none",
                              color: "inherit",
                              "&:hover": { color: "primary.main" },
                              transition: "color 0.3s ease",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.6,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.excerpt}
                          </Typography>

                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.75rem" }}
                              />
                            ))}
                          </Stack>

                          <Divider />

                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ mt: "auto" }}
                          >
                            <Avatar
                              src={post.author.avatar}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="caption"
                                fontWeight="medium"
                                display="block"
                              >
                                {post.author.name}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <CalendarToday sx={{ fontSize: 12 }} />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    post.publishedAt
                                  ).toLocaleDateString()}
                                </Typography>
                                <AccessTime sx={{ fontSize: 12 }} />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {post.readTime}m
                                </Typography>
                              </Stack>
                            </Box>
                            <motion.div whileHover={{ x: 5 }}>
                              <IconButton
                                component={Link}
                                href={`/blog/${post.slug}`}
                                size="small"
                                color="primary"
                              >
                                <ArrowForward fontSize="small" />
                              </IconButton>
                            </motion.div>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              ))
            )}
          </Stack>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => handlePageChange(page)}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontWeight: "medium",
                  },
                }}
              />
            </Box>
          </motion.div>
        )}

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
        >
          <MenuItem onClick={() => setFilterAnchor(null)}>
            <TrendingUp sx={{ mr: 1 }} /> Most Popular
          </MenuItem>
          <MenuItem onClick={() => setFilterAnchor(null)}>
            <CalendarToday sx={{ mr: 1 }} /> Newest First
          </MenuItem>
          <MenuItem onClick={() => setFilterAnchor(null)}>
            <AccessTime sx={{ mr: 1 }} /> Quick Reads
          </MenuItem>
        </Menu>
      </Container>
    </Layout>
  );
};

export default BlogPage;
