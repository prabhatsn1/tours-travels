/**
 * Sanity Content Helpers
 *
 * These functions fetch static/display content from Sanity CMS.
 * If Sanity is not configured or the fetch fails, they fall back
 * to the JSON mock content files in src/data/.
 *
 * Dynamic data (packages, destinations, blog posts) still comes
 * from MongoDB via API routes — this file is ONLY for static content.
 */

import {
  getTestimonialsFromSanity,
  getServicesFromSanity,
  getFAQsFromSanity,
  getContactInfoFromSanity,
  getAboutPageFromSanity,
  getHomePageFromSanity,
} from "../../sanity/queries";

import {
  faqs as fallbackFaqs,
  services as fallbackServices,
} from "@/data/sampleData";

// JSON mock content (fallback when Sanity is unavailable)
import homeMockContent from "@/data/home_mock_content.json";
import aboutMockContent from "@/data/about_mock_content.json";
import contactMockContent from "@/data/contact_mock_content.json";
import testimonialsMockContent from "@/data/testimonials_mock_content.json";

import type { Testimonial, FAQ, Service, ContactInfo } from "@/types";

// ============================================================
// HOME PAGE CONTENT
// ============================================================
export interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImage?: string;
  servicesTitle: string;
  servicesSubtitle: string;
  featuredPackagesTitle: string;
  destinationsTitle: string;
  testimonialsTitle: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  faqTitle: string;
  faqs: { question: string; answer: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
}

const defaultHomePageContent: HomePageContent = homeMockContent;

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const data = await getHomePageFromSanity();
    if (!data) return defaultHomePageContent;

    return {
      heroTitle: data.heroTitle || defaultHomePageContent.heroTitle,
      heroSubtitle: data.heroSubtitle || defaultHomePageContent.heroSubtitle,
      heroBadge: data.heroBadge || defaultHomePageContent.heroBadge,
      heroImage: data.heroImage,
      servicesTitle: data.servicesTitle || defaultHomePageContent.servicesTitle,
      servicesSubtitle:
        data.servicesSubtitle || defaultHomePageContent.servicesSubtitle,
      featuredPackagesTitle:
        data.featuredPackagesTitle ||
        defaultHomePageContent.featuredPackagesTitle,
      destinationsTitle:
        data.destinationsTitle || defaultHomePageContent.destinationsTitle,
      testimonialsTitle:
        data.testimonialsTitle || defaultHomePageContent.testimonialsTitle,
      newsletterTitle:
        data.newsletterTitle || defaultHomePageContent.newsletterTitle,
      newsletterSubtitle:
        data.newsletterSubtitle || defaultHomePageContent.newsletterSubtitle,
      faqTitle: data.faqTitle || defaultHomePageContent.faqTitle,
      faqs:
        data.faqs && data.faqs.length > 0
          ? data.faqs
          : defaultHomePageContent.faqs,
      ctaTitle: data.ctaTitle || defaultHomePageContent.ctaTitle,
      ctaSubtitle: data.ctaSubtitle || defaultHomePageContent.ctaSubtitle,
    };
  } catch (error) {
    console.warn("Failed to fetch home page content from Sanity:", error);
    return defaultHomePageContent;
  }
}

// ============================================================
// TESTIMONIALS
// ============================================================
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await getTestimonialsFromSanity();
    if (data && data.length > 0) return data;
    return testimonialsMockContent.testimonials as Testimonial[];
  } catch (error) {
    console.warn("Failed to fetch testimonials from Sanity:", error);
    return testimonialsMockContent.testimonials as Testimonial[];
  }
}

// ============================================================
// ABOUT PAGE CONTENT
// ============================================================
export interface AboutPageContent {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyContent: string[];
  storyImage: string;
  stats: { icon: string; number: string; label: string }[];
  values: { icon: string; title: string; description: string }[];
  milestones: { year: string; event: string; description: string }[];
  teamMembers: {
    name: string;
    position: string;
    image: string;
    bio: string;
  }[];
}

const defaultAboutPageContent: AboutPageContent = aboutMockContent;

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const data = await getAboutPageFromSanity();
    if (!data) return defaultAboutPageContent;

    return {
      heroTitle: data.heroTitle || defaultAboutPageContent.heroTitle,
      heroSubtitle: data.heroSubtitle || defaultAboutPageContent.heroSubtitle,
      storyTitle: data.storyTitle || defaultAboutPageContent.storyTitle,
      storyContent:
        data.storyContent && data.storyContent.length > 0
          ? data.storyContent
          : defaultAboutPageContent.storyContent,
      storyImage: data.storyImage || defaultAboutPageContent.storyImage,
      stats:
        data.stats && data.stats.length > 0
          ? data.stats
          : defaultAboutPageContent.stats,
      values:
        data.values && data.values.length > 0
          ? data.values
          : defaultAboutPageContent.values,
      milestones:
        data.milestones && data.milestones.length > 0
          ? data.milestones
          : defaultAboutPageContent.milestones,
      teamMembers:
        data.teamMembers && data.teamMembers.length > 0
          ? data.teamMembers
          : defaultAboutPageContent.teamMembers,
    };
  } catch (error) {
    console.warn("Failed to fetch about page content from Sanity:", error);
    return defaultAboutPageContent;
  }
}

// ============================================================
// SERVICES
// ============================================================
export async function getServices(): Promise<Service[]> {
  try {
    const data = await getServicesFromSanity();
    if (data && data.length > 0) return data;
    return fallbackServices;
  } catch (error) {
    console.warn("Failed to fetch services from Sanity:", error);
    return fallbackServices;
  }
}

// ============================================================
// FAQS
// ============================================================
export async function getFAQs(): Promise<FAQ[]> {
  try {
    const data = await getFAQsFromSanity();
    if (data && data.length > 0) return data;
    return fallbackFaqs;
  } catch (error) {
    console.warn("Failed to fetch FAQs from Sanity:", error);
    return fallbackFaqs;
  }
}

// ============================================================
// CONTACT INFO
// ============================================================
export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const data = await getContactInfoFromSanity();
    if (data) return data;
    return contactMockContent as ContactInfo;
  } catch (error) {
    console.warn("Failed to fetch contact info from Sanity:", error);
    return contactMockContent as ContactInfo;
  }
}
