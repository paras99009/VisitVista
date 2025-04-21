import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

// ============================================================
// PLACE
// ============================================================
export const PlaceValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Maximum 1000 characters allowed." }),

  location: z
    .string()
    .min(2, { message: "Location is required." })
    .max(500, { message: "Maximum 500 characters." }),

  tags: z.string().optional(), // optional array of tags

  file: z.custom<File[]>(),

  mood: z.string().optional(), // optional moods like "happy", "calm", etc.

  entryFee: z
    .string()
    .optional(), // "Free" or fee like "₹100"

  bestTimeToVisit: z
    .string()
    .optional(), // like "Winter", "Morning"

  openingHours: z
    .string()
    .optional(), // like "9AM - 5PM"
});
