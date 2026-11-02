import { z } from "zod";

const sellerSchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  email: z.string(),
  phone: z.string(),
});

export const propertySchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  currency: z.string(),
  beds: z.number(),
  baths: z.number(),
  areaSqm: z.number(),
  addressLine: z.string(),
  city: z.string(),
  features: z.array(z.string()),
  modelUrl: z.string(),
  seller: sellerSchema,
  propertyType: z.string().optional(),
  floors: z.number().optional(),
  parkingSlots: z.number().optional(),
  listingDescription: z.string().optional(),
});

export const propertiesArraySchema = z.array(propertySchema);

export const contactRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(8, "Please add a short message"),
});
