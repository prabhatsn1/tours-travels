"use client";

import React, { useState } from "react";
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
  ArrowForward,
  AccessTime,
  CalendarToday,
  Visibility,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { blogPosts } from "@/data/sampleData";
import { BlogPost } from "@/types";

// Extended blog posts (same as in blog page)
const extendedBlogPosts: BlogPost[] = [
  ...blogPosts,
  {
    id: "2",
    title: "Essential Travel Photography Tips for Beginners",
    slug: "travel-photography-tips-beginners",
    excerpt:
      "Capture stunning memories of your travels with these professional photography tips and techniques.",
    content: `
      <h2>Introduction to Travel Photography</h2>
      <p>Travel photography is one of the most rewarding forms of photography, allowing you to capture memories and share the beauty of the world with others. Whether you're using a smartphone or a professional camera, these tips will help you take stunning photos during your travels.</p>

      <h3>1. Plan Your Shots</h3>
      <p>Research your destination before you arrive. Look up iconic viewpoints, local customs, and the best times for photography. Golden hour (just after sunrise and before sunset) provides the most flattering light for most subjects.</p>

      <h3>2. Master the Rule of Thirds</h3>
      <p>Divide your frame into nine equal sections with two horizontal and two vertical lines. Place important elements along these lines or at their intersections. This creates more balanced and visually appealing compositions.</p>

      <h3>3. Include People in Your Shots</h3>
      <p>Adding people to your landscape photos provides scale and human interest. Always ask permission when photographing locals, and consider hiring local guides who can help you connect with communities respectfully.</p>

      <h3>4. Pack Light but Smart</h3>
      <p>Bring versatile lenses that can handle multiple situations. A 24-70mm lens is perfect for most travel scenarios, while a 50mm prime lens is excellent for street photography and portraits.</p>

      <h3>5. Backup Your Photos</h3>
      <p>Always have a backup plan for your photos. Use cloud storage, multiple memory cards, or portable hard drives to ensure you don't lose precious memories.</p>

      <h2>Conclusion</h2>
      <p>Remember, the best camera is the one you have with you. Focus on telling stories through your images, and don't be afraid to experiment with different perspectives and techniques. Happy shooting!</p>
    `,
    author: {
      name: "Mike Chen",
      avatar: "/images/authors/mike.jpg",
      bio: "Professional travel photographer and content creator with over 8 years of experience capturing destinations worldwide.",
    },
    publishedAt: "2025-01-12",
    readTime: 6,
    category: "Photography",
    tags: ["Photography", "Travel Tips", "Beginner Guide", "Camera"],
    featuredImage: "/images/blog/photography-tips.jpg",
    images: [
      "/images/blog/photography-1.jpg",
      "/images/blog/photography-2.jpg",
    ],
    seo: {
      metaTitle: "Travel Photography Tips for Beginners - Complete Guide",
      metaDescription:
        "Learn professional travel photography techniques to capture amazing photos during your trips.",
      keywords: ["travel photography", "photography tips", "beginner guide"],
    },
  },
  {
    id: "3",
    title: "Budget Travel: How to See the World for Less",
    slug: "budget-travel-guide",
    excerpt:
      "Discover proven strategies to travel the world on a budget without compromising on experiences.",
    content: `
      <h2>Travel More, Spend Less</h2>
      <p>Traveling on a budget doesn't mean sacrificing quality experiences. With careful planning and smart strategies, you can explore amazing destinations without breaking the bank.</p>

      <h3>1. Use Budget Airlines and Be Flexible</h3>
      <p>Book flights during off-peak seasons and be flexible with your dates. Use comparison sites like Skyscanner and Google Flights to find the best deals. Consider budget airlines for short-haul flights.</p>

      <h3>2. Stay in Alternative Accommodations</h3>
      <p>Hostels, Airbnb, and homestays often provide better value than hotels. Many hostels now offer private rooms, and staying with locals gives you authentic cultural experiences.</p>

      <h3>3. Eat Like a Local</h3>
      <p>Street food and local markets offer delicious meals at fraction of restaurant prices. Cook your own meals when possible, and always carry a reusable water bottle.</p>

      <h3>4. Use Public Transportation</h3>
      <p>Public transport is usually much cheaper than taxis or rental cars. Many cities offer tourist passes that include unlimited transport and attraction discounts.</p>

      <h3>5. Free Activities and Attractions</h3>
      <p>Research free walking tours, museums with free admission days, parks, beaches, and hiking trails. Many cities offer incredible free experiences if you know where to look.</p>

      <h2>Smart Money Management</h2>
      <p>Set a daily budget and track your expenses. Use apps like Trail Wallet or TravelSpend to monitor your spending and stay on track with your budget goals.</p>
    `,
    author: {
      name: "Lisa Rodriguez",
      avatar: "/images/authors/lisa.jpg",
      bio: "Budget travel expert and digital nomad who has visited 50+ countries on a shoestring budget.",
    },
    publishedAt: "2025-01-10",
    readTime: 10,
    category: "Budget Travel",
    tags: ["Budget Travel", "Money Saving", "Travel Hacks", "Backpacking"],
    featuredImage: "/images/blog/budget-travel.jpg",
    images: ["/images/blog/budget-1.jpg"],
    seo: {
      metaTitle: "Budget Travel Guide - See the World for Less",
      metaDescription:
        "Learn how to travel on a budget with expert tips and money-saving strategies.",
      keywords: ["budget travel", "cheap travel", "travel tips"],
    },
  },
];

const BlogPostPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(42);

  // Find the blog post by slug
  const post = extendedBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
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
        </Container>
      </Layout>
    );
  }

  // Get related posts (for simplicity, just get other posts)
  const relatedPosts = extendedBlogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;

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
                              1.2k views
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
            <Button
              endIcon={<ArrowForward />}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              }}
            >
              Next Article
            </Button>
          </Stack>
        </Box>
      </Container>
    </Layout>
  );
};

export default BlogPostPage;
