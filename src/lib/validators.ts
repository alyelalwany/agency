import { z } from "zod/v4";

export const createUnitSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1),
  type: z.enum(["residential", "commercial", "mixed"]),
  status: z.enum(["active", "inactive", "maintenance"]).optional(),
});

export const updateUnitSchema = createUnitSchema.partial();

export const createTenantSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  leaseStart: z.string(),
  leaseEnd: z.string(),
  rentAmount: z.number().positive(),
  rentStatus: z.enum(["paid", "pending", "overdue", "partial"]).optional(),
});

export const updateTenantSchema = createTenantSchema.partial();

export const createAmenitySchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    "pool",
    "gym",
    "parking",
    "laundry",
    "garden",
    "security",
    "elevator",
    "other",
  ]),
  status: z.enum(["active", "maintenance", "inactive"]).optional(),
  description: z.string().optional(),
});

export const updateAmenitySchema = createAmenitySchema.partial();

export const createProcessSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum([
    "maintenance",
    "lease_renewal",
    "inspection",
    "complaint",
    "other",
  ]),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: z.string().optional(),
});

export const updateProcessSchema = createProcessSchema.partial();

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  agentId: z.string().optional(),
  unitId: z.string(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  response: z.string().optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1),
  taskId: z.string().optional(),
});

export const settingsSchema = z.object({
  apiKey: z.string().min(1),
});
