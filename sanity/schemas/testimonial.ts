import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerImage",
      title: "Customer Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "review",
      title: "Review",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tourTitle",
      title: "Tour Title",
      type: "string",
    }),
    defineField({
      name: "travelDate",
      title: "Travel Date",
      type: "date",
    }),
    defineField({
      name: "verified",
      title: "Verified",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "tourTitle",
      media: "customerImage",
    },
  },
});
