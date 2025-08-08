"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";
import {
  Groups,
  Star,
  TrendingUp,
  SupportAgent,
  Verified,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      position: "CEO & Founder",
      image: "/images/team/sarah.jpg",
      bio: "15+ years in travel industry, passionate about creating memorable experiences.",
    },
    {
      name: "Michael Chen",
      position: "Head of Operations",
      image: "/images/team/michael.jpg",
      bio: "Expert in travel logistics and customer service excellence.",
    },
    {
      name: "Emily Rodriguez",
      position: "Travel Specialist",
      image: "/images/team/emily.jpg",
      bio: "Specializes in adventure travel and cultural experiences.",
    },
  ];

  const milestones = [
    {
      year: "2015",
      event: "Company Founded",
      description:
        "Started with a vision to make travel accessible to everyone",
    },
    {
      year: "2017",
      event: "First 1000 Customers",
      description: "Reached our first major milestone in customer satisfaction",
    },
    {
      year: "2019",
      event: "International Expansion",
      description: "Expanded services to cover 50+ countries worldwide",
    },
    {
      year: "2021",
      event: "Digital Innovation",
      description: "Launched our advanced booking platform and mobile app",
    },
    {
      year: "2023",
      event: "10,000+ Happy Travelers",
      description: "Celebrated serving over 10,000 satisfied customers",
    },
    {
      year: "2025",
      event: "Sustainable Travel Initiative",
      description: "Leading the industry in eco-friendly travel solutions",
    },
  ];

  const stats = [
    { icon: <Groups />, number: "10,000+", label: "Happy Travelers" },
    { icon: <Star />, number: "4.9", label: "Average Rating" },
    { icon: <TrendingUp />, number: "150+", label: "Destinations" },
    { icon: <SupportAgent />, number: "24/7", label: "Customer Support" },
  ];

  const values = [
    {
      icon: <Verified />,
      title: "Trust & Reliability",
      description:
        "We build lasting relationships through transparency and dependable service.",
    },
    {
      icon: <Star />,
      title: "Excellence",
      description:
        "We strive for perfection in every aspect of your travel experience.",
    },
    {
      icon: <Groups />,
      title: "Customer First",
      description:
        "Your satisfaction and happiness are at the heart of everything we do.",
    },
    {
      icon: <SupportAgent />,
      title: "Innovation",
      description:
        "We continuously evolve to provide cutting-edge travel solutions.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(76, 175, 80, 0.6) 100%), url(/images/about-hero.jpg)",
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
              About TravelPro
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ opacity: 0.9, maxWidth: 800, mx: "auto" }}
            >
              Your trusted partner in creating unforgettable travel experiences
              since 2015
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={6}
            alignItems="center"
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                Our Story
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
              >
                Founded in 2015 with a simple mission: to make extraordinary
                travel experiences accessible to everyone. What started as a
                small team of passionate travelers has grown into a trusted
                travel agency serving thousands of happy customers worldwide.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
              >
                We believe that travel has the power to transform lives, broaden
                perspectives, and create lasting memories. Our dedicated team
                works tirelessly to craft personalized experiences that exceed
                expectations and create stories worth sharing.
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
              >
                Today, we&apos;re proud to be recognized as one of the leading
                travel agencies, known for our exceptional service, attention to
                detail, and commitment to sustainable travel practices.
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/images/about-story.jpg"
                alt="Our Story"
                sx={{
                  width: "100%",
                  height: 400,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            </Box>
          </Stack>
        </motion.div>
      </Container>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            sx={{ flexWrap: "wrap" }}
          >
            {stats.map((stat, index) => (
              <Box key={index} sx={{ flex: { xs: "1 1 50%", md: "1 1 25%" } }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: "primary.main",
                        mb: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Our Values Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Our Values
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            The principles that guide everything we do
          </Typography>
        </motion.div>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          {values.map((value, index) => (
            <Box
              key={index}
              sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* Timeline Section */}
      <Box sx={{ backgroundColor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
              Our Journey
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Key milestones in our growth story
            </Typography>
          </motion.div>

          <Stack spacing={4}>
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={3}
                  alignItems="center"
                  sx={{
                    flexDirection:
                      index % 2 === 0
                        ? { xs: "column", md: "row" }
                        : { xs: "column", md: "row-reverse" },
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 120,
                      height: 120,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold">
                      {milestone.year}
                    </Typography>
                  </Box>
                  <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                    >
                      {milestone.event}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {milestone.description}
                    </Typography>
                  </Paper>
                </Stack>
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            The passionate people behind your perfect trip
          </Typography>
        </motion.div>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          {teamMembers.map((member, index) => (
            <Box
              key={index}
              sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" } }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card sx={{ textAlign: "center", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      {member.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Stack>
      </Container>
    </Layout>
  );
};

export default AboutPage;
