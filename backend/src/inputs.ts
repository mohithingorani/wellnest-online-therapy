import { z } from "zod";

// Common
const id = z.number().int().positive();
const uuid = z.string().uuid();

// User
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

export const AuthSignupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const PublicUserSchema = z.object({
  id,
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

//  Specialty
export const SpecialtySchema = z.object({
  id: uuid,
  name: z.string().min(1),
  createdAt: z.date(),
});

// SessionType
export const SessionTypeSchema = z.object({
  id,
  name: z.string().min(1),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TherapyType
export const TherapyTypeSchema = z.object({
  id,
  name: z.string().min(1),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Language
export const LanguageSchema = z.object({
  id,
  name: z.string().min(1),
});

export const CreateSpecialtySchema = z.object({
  name: z.string().min(1),
});

// Therapist
 
export const TherapistSchema = z.object({
  id,
  experience: z.number().int().nonnegative(),
  name: z.string().min(1),
  title: z.string(),
  gender: z.string(),
  specialities: z.array(SpecialtySchema),
  sessionTypes: z.array(SessionTypeSchema),
  therapyTypes: z.array(TherapyTypeSchema),
  languages: z.array(LanguageSchema),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateTherapistSchema = z.object({
  experience: z.number().int().nonnegative(),
  name: z.string().min(1),
  title: z.string().optional(),
  gender: z.string().optional(),

// pass IDs when creating
  specialtyIds: z.array(uuid).optional(),
});

export const UpdateTherapistSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().optional(),
  experience: z.number().int().nonnegative().optional(),
  gender: z.string().optional(),
  specialtyIds: z.array(uuid).optional(),
});

export const SpecialtyArraySchema = z.array(SpecialtySchema);

// Message
export const MessageSchema = z.object({
  id,
  content: z.string().min(1),
  conversationId: id,
  senderType: z.enum(["user", "therapist"]),
  senderId: id,
  createdAt: z.date(),
});

export const ConversationSchema = z.object({
  id,
  userId: id,
  therapistId: id,
  therapist: z.object({
    id,
    name: z.string(),
    title: z.string(),
  }).optional(),
  messages: z.array(MessageSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ConversationListItemSchema = z.object({
  id,
  userId: id,
  therapistId: id,
  therapist: z.object({
    id,
    name: z.string(),
    title: z.string(),
  }),
  lastMessage: MessageSchema.nullable(),
  unreadCount: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const CreateConversationSchema = z.object({
  therapistId: id,
});

export const TherapistLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Journal
export const JournalEntrySchema = z.object({
  id,
  userId: id,
  title: z.string().min(1),
  content: z.string(),
  mood: z.number().int().min(1).max(5).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateJournalEntrySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  mood: z.number().int().min(1).max(5).optional(),
});

export const UpdateJournalEntrySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(50000).optional(),
  mood: z.number().int().min(1).max(5).optional().nullable(),
});

export const JournalEntryListQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
