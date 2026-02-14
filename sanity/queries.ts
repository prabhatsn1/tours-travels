import { sanityClient } from "./client";
import { Testimonial, FAQ, Service, ContactInfo } from "@/types";

// ============================================================
// TESTIMONIALS
// ============================================================
export async function getTestimonialsFromSanity(): Promise<Testimonial[]> {
  const query = `*[_type == "testimonial"] | order(_createdAt desc) {
    "id": _id,
    customerName,
    "customerImage": customerImage.asset->url,
    location,
    rating,
    review,
    tourTitle,
    travelDate,
    verified
  }`;

  return sanityClient.fetch(query);
}

// ============================================================
// SERVICES
// ============================================================
export async function getServicesFromSanity(): Promise<Service[]> {
  const query = `*[_type == "service"] | order(order asc) {
    "id": _id,
    name,
    description,
    icon,
    features,
    startingPrice,
    currency
  }`;

  return sanityClient.fetch(query);
}

// ============================================================
// FAQS
// ============================================================
export async function getFAQsFromSanity(): Promise<FAQ[]> {
  const query = `*[_type == "faq"] | order(order asc) {
    "id": _id,
    question,
    answer,
    category,
    order
  }`;

  return sanityClient.fetch(query);
}

// ============================================================
// CONTACT INFO (singleton)
// ============================================================
export async function getContactInfoFromSanity(): Promise<ContactInfo | null> {
  const query = `*[_type == "contactInfo"][0] {
    email,
    phone,
    whatsapp,
    address,
    socialMedia,
    businessHours
  }`;

  return sanityClient.fetch(query);
}

// ============================================================
// ABOUT PAGE (singleton)
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAboutPageFromSanity(): Promise<any> {
  const query = `*[_type == "aboutPage"][0] {
    heroTitle,
    heroSubtitle,
    storyTitle,
    storyContent,
    "storyImage": storyImage.asset->url,
    stats,
    values,
    milestones,
    teamMembers[] {
      name,
      position,
      "image": image.asset->url,
      bio
    }
  }`;

  return sanityClient.fetch(query);
}

// ============================================================
// HOME PAGE (singleton)
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getHomePageFromSanity(): Promise<any> {
  const query = `*[_type == "homePage"][0] {
    heroTitle,
    heroSubtitle,
    heroBadge,
    "heroImage": heroImage.asset->url,
    servicesTitle,
    servicesSubtitle,
    featuredPackagesTitle,
    destinationsTitle,
    testimonialsTitle,
    newsletterTitle,
    newsletterSubtitle,
    faqTitle,
    faqs,
    ctaTitle,
    ctaSubtitle
  }`;

  return sanityClient.fetch(query);
}
