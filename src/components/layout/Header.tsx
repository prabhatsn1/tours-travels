"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Avatar,
  Chip,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  FlightTakeoff,
  Language,
  ExploreOutlined,
  HomeOutlined,
  PhotoCameraOutlined,
  InfoOutlined,
  MiscellaneousServicesOutlined,
  ArticleOutlined,
  ContactMailOutlined,
  BookOnlineOutlined,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { defaultThemeConfig } from "@/lib/theme";

const navigationItems = [
  { label: "Home", href: "/", icon: HomeOutlined },
  { label: "Destinations", href: "/destinations", icon: Language },
  { label: "Packages", href: "/packages", icon: ExploreOutlined },
  { label: "Services", href: "/services", icon: MiscellaneousServicesOutlined },
  { label: "About", href: "/about", icon: InfoOutlined },
  { label: "Blog", href: "/blog", icon: ArticleOutlined },
  { label: "Contact", href: "/contact", icon: ContactMailOutlined },
];

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 280, height: "100%" }}>
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FlightTakeoff sx={{ fontSize: 28 }} />
        <Typography variant="h6" fontWeight="600">
          {defaultThemeConfig.companyName}
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ ml: "auto", color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ px: 2, py: 3 }}>
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              component={Link}
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <item.icon sx={{ mr: 2, color: "primary.main" }} />
              <ListItemText primary={item.label} />
            </ListItem>
          </motion.div>
        ))}

        <Box sx={{ px: 2, mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<BookOnlineOutlined />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            Start Journey
          </Button>
        </Box>
      </List>
    </Box>
  );

  return (
    <>
      {/* Floating Status Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.95),
            backdropFilter: "blur(10px)",
            color: "white",
            py: 0.8,
            display: { xs: "none", lg: "block" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Chip
                  icon={<FlightTakeoff />}
                  label="Your Dream Destination Awaits"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </motion.div>

              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                🌍 Explore • 📸 Discover • ✈️ Adventure
              </Typography>

              <Chip
                icon={<PhotoCameraOutlined />}
                label="24/7 Travel Support"
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            </Box>
          </Container>
        </Box>
      </motion.div>

      {/* Main Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: scrolled
            ? alpha(theme.palette.background.paper, 0.95)
            : theme.palette.background.paper,
          backdropFilter: scrolled ? "blur(20px)" : "none",
          transition: "all 0.3s ease",
          borderBottom: scrolled
            ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            : "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1.5, px: 0 }}>
            {/* Logo Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Box
                component={Link}
                href="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FlightTakeoff sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: 1,
                    }}
                  >
                    {defaultThemeConfig.companyName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.7rem",
                      letterSpacing: 1,
                    }}
                  >
                    TRAVEL BEYOND
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    borderRadius: 6,
                    p: 0.5,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        component={Link}
                        href={item.href}
                        startIcon={<item.icon />}
                        sx={{
                          color: "text.primary",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          px: 2,
                          py: 1,
                          borderRadius: 4,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            color: "primary.main",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            )}

            {/* Right Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<BookOnlineOutlined />}
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      borderRadius: 5,
                      px: 3,
                      py: 1.2,
                      fontWeight: 600,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 25px ${alpha(
                          theme.palette.primary.main,
                          0.4
                        )}`,
                      },
                    }}
                  >
                    Book Journey
                  </Button>
                </motion.div>
              )}

              {/* Mobile menu button */}
              {isMobile && (
                <motion.div whileTap={{ scale: 0.9 }}>
                  <IconButton
                    onClick={handleDrawerToggle}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <MenuIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                </motion.div>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            backgroundColor: "background.paper",
          },
        }}
      >
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: 280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {drawer}
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </>
  );
};

export default Header;
