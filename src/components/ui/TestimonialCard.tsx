"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Rating,
} from "@mui/material";
import { motion } from "framer-motion";
import { Verified } from "@mui/icons-material";
import { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: 1,
          "&:hover": {
            transform: "translateY(-4px)",
            transition: "transform 0.3s ease",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Rating value={testimonial.rating} readOnly size="small" />
          </Box>

          <Typography
            variant="body2"
            sx={{ mb: 3, fontStyle: "italic", textAlign: "center" }}
          >
            {testimonial.review}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={testimonial.customerImage}
              alt={testimonial.customerName}
              sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {testimonial.customerName}
                </Typography>
                {testimonial.verified && (
                  <Verified color="primary" sx={{ fontSize: 16 }} />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {testimonial.location}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {testimonial.tourTitle}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
