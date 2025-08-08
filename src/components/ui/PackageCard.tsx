"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Rating,
} from "@mui/material";
import { motion } from "framer-motion";
import { TourPackage } from "@/types";
import Link from "next/link";

interface PackageCardProps {
  package: TourPackage;
  index?: number;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          "&:hover": {
            "& .card-image": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        <Box sx={{ position: "relative", overflow: "hidden", height: 240 }}>
          <CardMedia
            component="img"
            height="240"
            image={pkg.images[0] || "/images/placeholder.jpg"}
            alt={pkg.title}
            className="card-image"
            sx={{
              transition: "transform 0.3s ease",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {pkg.featured && (
            <Chip
              label="Featured"
              color="secondary"
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                fontWeight: "bold",
              }}
            />
          )}
          {pkg.originalPrice && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "error.main",
                color: "white",
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" fontWeight="bold">
                {Math.round(
                  ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100
                )}
                % OFF
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight="bold"
          >
            {pkg.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {pkg.destination} • {pkg.duration}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Rating value={pkg.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({pkg.reviewCount} reviews)
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
            {pkg.description}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {pkg.highlights.slice(0, 3).map((highlight) => (
              <Chip
                key={highlight}
                label={highlight}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
            }}
          >
            <Box>
              {pkg.originalPrice && (
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
            <Button
              variant="contained"
              size="small"
              component={Link}
              href={`/packages/${pkg.id}`}
              sx={{ borderRadius: 2 }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PackageCard;
