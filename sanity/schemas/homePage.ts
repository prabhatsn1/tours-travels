import { defineType, defineField } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Discover Your Next Adventure",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
    }),
    defineField({
      name: "heroBadge",
      title: "Hero Badge Text",
      type: "string",
      initialValue: "🌟 #1 Travel Agency 2024",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "servicesTitle",
      title: "Services Section Title",
      type: "string",
      initialValue: "Our Premium Services",
    }),
    defineField({
      name: "servicesSubtitle",
      title: "Services Section Subtitle",
      type: "string",
    }),
    defineField({
      name: "featuredPackagesTitle",
      title: "Featured Packages Section Title",
      type: "string",
      initialValue: "Featured Packages",
    }),
    defineField({
      name: "destinationsTitle",
      title: "Destinations Section Title",
      type: "string",
      initialValue: "Popular Destinations",
    }),
    defineField({
      name: "testimonialsTitle",
      title: "Testimonials Section Title",
      type: "string",
      initialValue: "What Our Travelers Say",
    }),
    defineField({
      name: "newsletterTitle",
      title: "Newsletter Title",
      type: "string",
      initialValue: "Stay Updated with Amazing Deals",
    }),
    defineField({
      name: "newsletterSubtitle",
      title: "Newsletter Subtitle",
      type: "string",
    }),
    defineField({
      name: "faqTitle",
      title: "FAQ Section Title",
      type: "string",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "ctaTitle",
      title: "CTA Title",
      type: "string",
      initialValue: "Ready to Start Your Adventure?",
    }),
    defineField({
      name: "ctaSubtitle",
      title: "CTA Subtitle",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
