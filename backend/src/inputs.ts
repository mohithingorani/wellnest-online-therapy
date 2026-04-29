import { z } from "zod";

/**
 * Common helpers
 */
const id = z.number().int().positive();
const uuid = z.string().uuid();

/**
 * User
 */
export const UserSchema = z.object({
  id,
  email: z.string().email(),
  name: z.string().min(1),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

/**
 * Specialty
 */
export const SpecialtySchema = z.object({
  id: uuid,
  name: z.string().min(1),

  createdAt: z.date(),
});

export const CreateSpecialtySchema = z.object({
  name: z.string().min(1),
});

/**
 * Therapist
 */
export const TherapistSchema = z.object({
  id,
  experience: z.number().int().nonnegative(),
  name: z.string().min(1),
  specialities: z.array(SpecialtySchema),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateTherapistSchema = z.object({
  experience: z.number().int().nonnegative(),
  name: z.string().min(1),

  // pass IDs when creating
  specialtyIds: z.array(uuid).optional(),
});

export const UpdateTherapistSchema = z.object({
  experience: z.number().int().nonnegative().optional(),
  specialtyIds: z.array(uuid).optional(),
});

export const SpecialtyArraySchema = z.array(SpecialtySchema);
