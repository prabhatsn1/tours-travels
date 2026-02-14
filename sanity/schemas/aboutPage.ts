import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "About TravelPro",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "string",
    }),
    defineField({
      name: "storyTitle",
      title: "Story Title",
      type: "string",
      initialValue: "Our Story",
    }),
    defineField({
      name: "storyContent",
      title: "Story Content",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icon", title: "Icon Name", type: "string" },
            { name: "number", title: "Number", type: "string" },
            { name: "label", title: "Label", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "values",
      title: "Our Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icon", title: "Icon Name", type: "string" },
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "year", title: "Year", type: "string" },
            { name: "event", title: "Event", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
            { name: "position", title: "Position", type: "string" },
            { name: "image", title: "Image", type: "image" },
            { name: "bio", title: "Bio", type: "text" },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
