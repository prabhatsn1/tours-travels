"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Breadcrumbs,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  ThumbUp,
  ThumbUpOutlined,
  Comment,
  Facebook,
  Twitter,
  LinkedIn,
  Print,
  ArrowBack,
  AccessTime,
  CalendarToday,
  Visibility,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { BlogPost } from "@/types";

const BlogPostPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  // Fetch blog post by slug
  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blog post");
      }

      if (data.success) {
        setPost(data.data);
        setLikes(data.data.likesCount || 0);
      } else {
        throw new Error(data.error || "Blog post not found");
      }
    } catch (err) {
      console.error("Error fetching blog post:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch blog post"
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch related posts
  const fetchRelatedPosts = useCallback(
    async (category: string) => {
      try {
        const response = await fetch(`/api/blog?category=${category}&limit=3`);
        const data = await response.json();

        if (response.ok && data.success) {
          // Filter out the current post from related posts
          const filtered = data.data.filter((p: BlogPost) => p.slug !== slug);
          setRelatedPosts(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching related posts:", err);
      }
    },
    [slug]
  );

  // Fetch post on component mount or slug change
  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  // Fetch related posts when post is loaded
  useEffect(() => {
    if (post?.category) {
      fetchRelatedPosts(post.category);
    }
  }, [post?.category, fetchRelatedPosts]);

  const handleLike = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "PATCH",
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress size={48} />
          </Box>
        </Container>
      </Layout>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
              {error || "Blog post not found"}
            </Alert>
            <Typography variant="h4" gutterBottom>
              Blog Post Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              The requested blog post could not be found.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/blog"
              startIcon={<ArrowBack />}
            >
              Back to Blog
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

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
            <Link
              href="/blog"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Blog
            </Link>
            <Typography color="primary" fontWeight="medium">
              {post.title}
            </Typography>
          </Breadcrumbs>
        </motion.div>

        {/* Main Layout using Stack */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={4}
          alignItems="flex-start"
        >
          {/* Main Content */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                {/* Article Header */}
                <Box sx={{ mb: 4 }}>
                  <Chip
                    label={post.category}
                    variant="filled"
                    color="primary"
                    sx={{ mb: 2 }}
                  />
                  <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ lineHeight: 1.2 }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {post.excerpt}
                  </Typography>

                  {/* Author Info and Meta */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={post.author.avatar}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {post.author.name}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <CalendarToday sx={{ fontSize: 16 }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <AccessTime sx={{ fontSize: 16 }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {post.readTime} min read
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <Visibility sx={{ fontSize: 16 }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {post.viewCount || 0} views
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton
                          onClick={() => setIsBookmarked(!isBookmarked)}
                          color={isBookmarked ? "primary" : "default"}
                        >
                          {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton
                          onClick={handleLike}
                          color={isLiked ? "primary" : "default"}
                        >
                          {isLiked ? <ThumbUp /> : <ThumbUpOutlined />}
                        </IconButton>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton>
                          <Comment />
                        </IconButton>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton onClick={() => window.print()}>
                          <Print />
                        </IconButton>
                      </motion.div>
                    </Stack>
                  </Stack>
                </Box>

                {/* Featured Image */}
                <Box sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
                  <Image
                    src={post.featuredImage || "/images/placeholder.jpg"}
                    alt={post.title}
                    width={800}
                    height={400}
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>

                {/* Article Content */}
                <Box
                  sx={{
                    "& h2": {
                      fontSize: "2rem",
                      fontWeight: "bold",
                      mt: 4,
                      mb: 2,
                      color: "primary.main",
                    },
                    "& h3": {
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      mt: 3,
                      mb: 2,
                    },
                    "& p": {
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      mb: 2,
                      color: "text.secondary",
                    },
                    "& ul": {
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      mb: 2,
                      pl: 3,
                    },
                    "& li": {
                      mb: 1,
                      color: "text.secondary",
                    },
                    "& img": {
                      width: "100%",
                      borderRadius: 2,
                      my: 3,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <Box
                  sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}
                >
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    fontWeight="medium"
                  >
                    Tags:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {post.tags.map((tag) => (
                      <motion.div key={tag} whileHover={{ scale: 1.05 }}>
                        <Chip
                          label={tag}
                          variant="outlined"
                          size="small"
                          sx={{ cursor: "pointer" }}
                        />
                      </motion.div>
                    ))}
                  </Stack>
                </Box>

                {/* Share Section */}
                <Divider sx={{ my: 4 }} />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Share this article
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    {[
                      {
                        icon: <Facebook />,
                        platform: "facebook",
                        color: "#1877F2",
                      },
                      {
                        icon: <Twitter />,
                        platform: "twitter",
                        color: "#1DA1F2",
                      },
                      {
                        icon: <LinkedIn />,
                        platform: "linkedin",
                        color: "#0A66C2",
                      },
                    ].map((social) => (
                      <motion.div
                        key={social.platform}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton
                          onClick={() => handleShare(social.platform)}
                          sx={{
                            bgcolor: social.color,
                            color: "white",
                            "&:hover": {
                              bgcolor: social.color,
                              opacity: 0.8,
                            },
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </motion.div>
                    ))}
                  </Stack>
                </Box>

                {/* Author Bio */}
                <Paper
                  sx={{ p: 3, mt: 4, bgcolor: "grey.50", borderRadius: 3 }}
                >
                  <Stack direction="row" spacing={3}>
                    <Avatar
                      src={post.author.avatar}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        About {post.author.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {post.author.bio}
                      </Typography>
                      <Button variant="outlined" size="small">
                        View Profile
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </Paper>
            </motion.div>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: { xs: "100%", lg: "400px" }, flexShrink: 0 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Related Posts */}
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  position: "sticky",
                  top: 24,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Related Articles
                </Typography>
                <Stack spacing={2}>
                  {relatedPosts.map((relatedPost) => (
                    <motion.div
                      key={relatedPost.id}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card sx={{ borderRadius: 2 }}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={
                            relatedPost.featuredImage ||
                            "/images/placeholder.jpg"
                          }
                          alt={relatedPost.title}
                        />
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            component={Link}
                            href={`/blog/${relatedPost.slug}`}
                            sx={{
                              textDecoration: "none",
                              color: "inherit",
                              "&:hover": { color: "primary.main" },
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {relatedPost.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {relatedPost.readTime} min read
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Stack>
              </Paper>
            </motion.div>
          </Box>
        </Stack>

        {/* Navigation */}
        <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: "divider" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              startIcon={<ArrowBack />}
              component={Link}
              href="/blog"
              variant="outlined"
            >
              Back to Blog
            </Button>
            <Typography variant="body2" color="text.secondary">
              {likes} likes
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Layout>
  );
};

export default BlogPostPage;
