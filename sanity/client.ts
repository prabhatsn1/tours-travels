import createClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { sanityConfig } from "./config";

const isSanityConfigured = Boolean(
  sanityConfig.projectId && /^[a-z0-9-]+$/.test(sanityConfig.projectId),
);

export const sanityClient = isSanityConfigured
  ? createClient({ ...sanityConfig, token: process.env.SANITY_API_TOKEN })
  : ({
      // minimal stub so imports don't throw during build when SANITY isn't configured
      fetch: async () => null,
    } as unknown as ReturnType<typeof createClient>);

const builder = isSanityConfigured ? imageUrlBuilder(sanityClient) : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder ? (builder as any).image(source) : "";
}
