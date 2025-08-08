"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import {
  Flight,
  Hotel,
  DirectionsCar,
  Security,
  CameraAlt,
  Map,
  SupportAgent,
  Language,
  Check,
  Star,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

const ServicesPage: React.FC = () => {
  const mainServices = [
    {
      id: "flights",
      title: "Flight Booking",
      description:
        "Find and book the best flights at competitive prices with our global airline partnerships.",
      icon: <Flight />,
      image: "/images/services/flights.jpg",
      features: [
        "Global airline partnerships",
        "Best price guarantee",
        "24/7 booking support",
        "Flexible cancellation",
        "Seat selection assistance",
      ],
      details:
        "Our experienced travel consultants work with major airlines worldwide to secure the best deals for our clients. Whether you're looking for economy comfort or luxury business class, we'll find the perfect flight to match your budget and preferences.",
    },
    {
      id: "hotels",
      title: "Hotel Booking",
      description:
        "From budget-friendly stays to luxury resorts, we have accommodations for every preference.",
      icon: <Hotel />,
      image: "/images/services/hotels.jpg",
      features: [
        "Handpicked accommodations",
        "Room upgrade assistance",
        "Special group rates",
        "Local insider recommendations",
        "Concierge services",
      ],
      details:
        "We&apos;ve personally vetted thousands of hotels worldwide to ensure quality and value. Our relationships with hotel partners allow us to offer exclusive rates and amenities that you won&apos;t find elsewhere.",
    },
    {
      id: "transport",
      title: "Ground Transportation",
      description:
        "Comfortable and reliable transportation options including car rentals and transfers.",
      icon: <DirectionsCar />,
      image: "/images/services/transport.jpg",
      features: [
        "Airport transfers",
        "Car rental partnerships",
        "Private driver services",
        "Group transportation",
        "GPS navigation support",
      ],
      details:
        "From the moment you land until your departure, we ensure smooth transportation. Our network includes trusted local operators and premium car rental companies.",
    },
  ];

  const additionalServices = [
    {
      icon: <Security />,
      title: "Travel Insurance",
      description:
        "Comprehensive coverage for medical emergencies, trip cancellations, and more.",
    },
    {
      icon: <CameraAlt />,
      title: "Photography Tours",
      description:
        "Capture memories with professional photography guides in stunning locations.",
    },
    {
      icon: <Map />,
      title: "Custom Itineraries",
      description:
        "Personalized travel plans crafted specifically for your interests and budget.",
    },
    {
      icon: <SupportAgent />,
      title: "24/7 Support",
      description: "Round-the-clock assistance wherever you are in the world.",
    },
    {
      icon: <Language />,
      title: "Translation Services",
      description:
        "Language support and cultural guidance for international destinations.",
    },
  ];

  const whyChooseUs = [
    "Expert travel consultants with years of experience",
    "Personalized service tailored to your needs",
    "Competitive pricing with transparent fees",
    "24/7 customer support during your travels",
    "Established partnerships with trusted suppliers",
    "Comprehensive travel insurance options",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(76, 175, 80, 0.6) 100%), url(/images/services-hero.jpg)",
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
              Our Services
            </Typography>
            <Typography variant="h5" align="center" sx={{ opacity: 0.9 }}>
              Comprehensive travel solutions for every journey
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Main Services Section */}
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
            Core Services
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            We&apos;re committed to providing exceptional value and service
          </Typography>
        </motion.div>

        <Stack spacing={6}>
          {mainServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card elevation={2} sx={{ overflow: "hidden" }}>
                <Stack
                  direction={{
                    xs: "column",
                    md: index % 2 === 0 ? "row" : "row-reverse",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <CardContent sx={{ p: 4, height: "100%" }}>
                      <Stack spacing={3} sx={{ height: "100%" }}>
                        <Box>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ mb: 2 }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                backgroundColor: "primary.main",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {service.icon}
                            </Box>
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              color="primary"
                            >
                              {service.title}
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                          >
                            {service.description}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 3 }}>
                            {service.details}
                          </Typography>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontWeight="bold"
                          >
                            What&apos;s Included:
                          </Typography>
                          <Stack spacing={1}>
                            {service.features.map((feature, idx) => (
                              <Stack
                                key={idx}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Check color="primary" fontSize="small" />
                                <Typography variant="body2">
                                  {feature}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>

                        <Button
                          variant="contained"
                          size="large"
                          sx={{ alignSelf: "flex-start", px: 4 }}
                        >
                          Learn More
                        </Button>
                      </Stack>
                    </CardContent>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={service.image}
                      alt={service.title}
                      sx={{ objectFit: "cover", height: "100%" }}
                    />
                  </Box>
                </Stack>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </Container>

      {/* Additional Services Section */}
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
              Additional Services
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Extra services to enhance your travel experience
            </Typography>
          </motion.div>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            sx={{ flexWrap: "wrap" }}
          >
            {additionalServices.map((service, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      p: 3,
                      textAlign: "center",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                  >
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
                      {service.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={6}
          alignItems="center"
        >
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                Why Choose Us?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Experience the difference with our professional travel services
              </Typography>
              <Stack spacing={2}>
                {whyChooseUs.map((reason, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Star color="primary" />
                    <Typography variant="body1">{reason}</Typography>
                  </Stack>
                ))}
              </Stack>
            </motion.div>
          </Box>
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, #2196F3 0%, #4CAF50 100%)",
                  color: "white",
                }}
              >
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Ready to Start Planning?
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Contact our travel experts today for a personalized
                  consultation
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    color: "primary.main",
                    "&:hover": { backgroundColor: "grey.100" },
                    px: 4,
                  }}
                >
                  Get Started
                </Button>
              </Paper>
            </motion.div>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default ServicesPage;
