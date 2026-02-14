"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { sanityConfig } from "./src/sanity/config";

export default defineConfig({
  name: "tours-travels-studio",
  title: "Tours & Travels CMS",

  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton pages
            S.listItem()
              .title("Home Page")
              .child(
                S.document().schemaType("homePage").documentId("homePage"),
              ),
            S.listItem()
              .title("About Page")
              .child(
                S.document().schemaType("aboutPage").documentId("aboutPage"),
              ),
            S.listItem()
              .title("Contact Info")
              .child(
                S.document()
                  .schemaType("contactInfo")
                  .documentId("contactInfo"),
              ),
            S.divider(),
            // Content collections
            ...S.documentTypeListItems().filter(
              (listItem) =>
                !["homePage", "aboutPage", "contactInfo"].includes(
                  listItem.getId() || "",
                ),
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: sanityConfig.apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },
});
