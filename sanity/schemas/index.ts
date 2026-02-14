import { testimonial } from "./testimonial";
import { service } from "./service";
import { faq } from "./faq";
import { aboutPage } from "./aboutPage";
import { contactInfo } from "./contactInfo";
import { homePage } from "./homePage";

export const schemaTypes = [
  // Content types (static/display content only)
  testimonial,
  service,
  faq,

  // Page singletons
  homePage,
  aboutPage,
  contactInfo,
];
