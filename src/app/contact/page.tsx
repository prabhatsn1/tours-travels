"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Send,
  Facebook,
  Instagram,
  WhatsApp,
  BusinessCenter,
  SupportAgent,
  QuestionAnswer,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "@/components/layout/Layout";
import { contactInfo } from "@/data/sampleData";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: "email" | "phone" | "whatsapp";
}

const contactSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  subject: yup.string().required("Subject is required"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
  preferredContact: yup
    .string()
    .oneOf(["email", "phone", "whatsapp"])
    .required("Please select preferred contact method"),
});

const ContactPage: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      preferredContact: "email",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("loading");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Contact form submitted:", data);
      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    }
  };

  const contactMethods = [
    {
      icon: <Phone />,
      title: "Phone",
      value: contactInfo.phone,
      description: "Call us for immediate assistance",
      action: `tel:${contactInfo.phone}`,
    },
    {
      icon: <Email />,
      title: "Email",
      value: contactInfo.email,
      description: "Send us your queries anytime",
      action: `mailto:${contactInfo.email}`,
    },
    {
      icon: <WhatsApp />,
      title: "WhatsApp",
      value: contactInfo.whatsapp,
      description: "Chat with us on WhatsApp",
      action: contactInfo.whatsapp
        ? `https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}`
        : undefined,
    },
    {
      icon: <LocationOn />,
      title: "Visit Us",
      value: `${contactInfo.address.street}, ${contactInfo.address.city}`,
      description: "Come to our office",
      action: `https://maps.google.com/?q=${encodeURIComponent(
        `${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.state}`
      )}`,
    },
  ];

  const inquiryTypes = [
    {
      icon: <BusinessCenter />,
      title: "General Inquiries",
      description: "Questions about our services and packages",
    },
    {
      icon: <SupportAgent />,
      title: "Customer Support",
      description: "Help with existing bookings",
    },
    {
      icon: <QuestionAnswer />,
      title: "Partnership",
      description: "Business partnerships and collaborations",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(76, 175, 80, 0.6) 100%), url(/images/contact-hero.jpg)",
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
              Get in Touch
            </Typography>
            <Typography variant="h5" align="center" sx={{ opacity: 0.9 }}>
              We&apos;re here to help plan your perfect journey
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Methods */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          {contactMethods.map((method, index) => (
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
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                  onClick={() =>
                    method.action && window.open(method.action, "_blank")
                  }
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
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
                      {method.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {method.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary"
                      gutterBottom
                      fontWeight="medium"
                    >
                      {method.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {method.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={6}>
          {/* Contact Form */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper elevation={2} sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  fontWeight="bold"
                  color="primary"
                >
                  Send us a Message
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </Typography>

                {submitStatus === "success" && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Thank you for your message! We&apos;ll get back to you
                    within 24 hours.
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    Sorry, there was an error sending your message. Please try
                    again.
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Full Name"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email Address"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Phone Number"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                          />
                        )}
                      />
                      <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Subject"
                            error={!!errors.subject}
                            helperText={errors.subject?.message}
                          />
                        )}
                      />
                    </Stack>

                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Message"
                          multiline
                          rows={4}
                          error={!!errors.message}
                          helperText={errors.message?.message}
                        />
                      )}
                    />

                    <FormControl error={!!errors.preferredContact}>
                      <FormLabel>Preferred Contact Method</FormLabel>
                      <Controller
                        name="preferredContact"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup {...field} row>
                            <FormControlLabel
                              value="email"
                              control={<Radio />}
                              label="Email"
                            />
                            <FormControlLabel
                              value="phone"
                              control={<Radio />}
                              label="Phone"
                            />
                            <FormControlLabel
                              value="whatsapp"
                              control={<Radio />}
                              label="WhatsApp"
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<Send />}
                      disabled={submitStatus === "loading"}
                      sx={{ px: 4, py: 1.5, alignSelf: "flex-start" }}
                    >
                      {submitStatus === "loading"
                        ? "Sending..."
                        : "Send Message"}
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </motion.div>
          </Box>

          {/* Contact Information */}
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  fontWeight="bold"
                  color="primary"
                >
                  Office Information
                </Typography>

                <List disablePadding>
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={`${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.state} ${contactInfo.address.zipCode}, ${contactInfo.address.country}`}
                    />
                  </ListItem>

                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <Schedule color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Business Hours"
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Weekdays: {contactInfo.businessHours.weekdays}
                          </Typography>
                          <Typography variant="body2">
                            Weekends: {contactInfo.businessHours.weekends}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Follow Us
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {contactInfo.socialMedia.facebook && (
                    <Button
                      variant="outlined"
                      startIcon={<Facebook />}
                      component="a"
                      href={contactInfo.socialMedia.facebook}
                      target="_blank"
                      size="small"
                    >
                      Facebook
                    </Button>
                  )}
                  {contactInfo.socialMedia.instagram && (
                    <Button
                      variant="outlined"
                      startIcon={<Instagram />}
                      component="a"
                      href={contactInfo.socialMedia.instagram}
                      target="_blank"
                      size="small"
                    >
                      Instagram
                    </Button>
                  )}
                </Stack>
              </Paper>

              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="bold"
                  color="primary"
                >
                  What can we help you with?
                </Typography>
                {inquiryTypes.map((type, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Box sx={{ color: "primary.main", mr: 2, mt: 0.5 }}>
                      {type.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {type.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </motion.div>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default ContactPage;
