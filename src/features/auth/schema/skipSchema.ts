import { z } from "zod";

// The API takes no parameters, but we keep a schema for clean architecture consistency
export const skipOnboardingSchema = z.object({});