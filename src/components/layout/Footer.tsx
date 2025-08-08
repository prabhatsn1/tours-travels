"use client";

import React from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  Phone,
  Email,
  LocationOn,
  Send,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { defaultThemeConfig } from "@/lib/theme";
import { contactInfo } from "@/data/sampleData";

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription submitted");
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        mt: 8,
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ alignItems: "flex-start" }}
        >
          {/* Company Info */}
          <Box sx={{ flex: { xs: 1, md: 3 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  src={defaultThemeConfig.logoUrl}
                  alt={defaultThemeConfig.companyName}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {defaultThemeConfig.companyName}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Your trusted travel partner for unforgettable journeys around
                the world. We create memories that last a lifetime.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  component="a"
                  href={contactInfo.socialMedia.facebook}
                  target="_blank"
                  sx={{ color: "white" }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  component="a"
                  href={contactInfo.socialMedia.instagram}
                  target="_blank"
                  sx={{ color: "white" }}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  component="a"
                  href={contactInfo.socialMedia.twitter}
                  target="_blank"
                  sx={{ color: "white" }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  component="a"
                  href={contactInfo.socialMedia.youtube}
                  target="_blank"
                  sx={{ color: "white" }}
                >
                  <YouTube />
                </IconButton>
              </Box>
            </motion.div>
          </Box>

          {/* Quick Links */}
          <Box
            sx={{
              flex: { xs: 1, md: 2 },
              minWidth: { xs: "100%", sm: "50%", md: "auto" },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Links
              </Typography>
              <List dense>
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "/about" },
                  { label: "Destinations", href: "/destinations" },
                  { label: "Tour Packages", href: "/packages" },
                  { label: "Blog", href: "/blog" },
                ].map((item) => (
                  <ListItem key={item.label} disablePadding>
                    <ListItemText>
                      <Link
                        href={item.href}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          opacity: 0.9,
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.label}
                      </Link>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </motion.div>
          </Box>

          {/* Services */}
          <Box
            sx={{
              flex: { xs: 1, md: 2 },
              minWidth: { xs: "100%", sm: "50%", md: "auto" },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Services
              </Typography>
              <List dense>
                {[
                  "Flight Booking",
                  "Hotel Booking",
                  "Visa Assistance",
                  "Travel Insurance",
                  "Car Rentals",
                ].map((service) => (
                  <ListItem key={service} disablePadding>
                    <ListItemText>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {service}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </motion.div>
          </Box>

          {/* Contact Info */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Contact
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Phone fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {contactInfo.phone}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Email fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {contactInfo.email}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {contactInfo.address.street}, {contactInfo.address.city}
                  <br />
                  {contactInfo.address.state}, {contactInfo.address.country}
                </Typography>
              </Box>
            </motion.div>
          </Box>

          {/* Newsletter */}
          <Box sx={{ flex: { xs: 1, md: 3 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Subscribe to get travel tips and exclusive deals!
              </Typography>
              <Box component="form" onSubmit={handleNewsletterSubmit}>
                <TextField
                  fullWidth
                  placeholder="Your email address"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      "&::placeholder": {
                        color: "rgba(255, 255, 255, 0.7)",
                        opacity: 1,
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  endIcon={<Send />}
                  sx={{
                    backgroundColor: "secondary.main",
                    "&:hover": {
                      backgroundColor: "secondary.dark",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Stack>

        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 {defaultThemeConfig.companyName}. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link
              href="/privacy"
              style={{ color: "inherit", opacity: 0.8, fontSize: "0.875rem" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              style={{ color: "inherit", opacity: 0.8, fontSize: "0.875rem" }}
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              style={{ color: "inherit", opacity: 0.8, fontSize: "0.875rem" }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
