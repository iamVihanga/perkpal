/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
import z from "zod";

// Define the schema for the environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_BETTER_AUTH_SECRET: z.string().optional(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().optional(),
  NEXT_PUBLIC_CLIENT_APP_URL: z.string().url().optional(),

  NEXT_PUBLIC_AWS_REGION: z.string().optional(),
  NEXT_PUBLIC_AWS_ACCESS_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: z.string().optional(),
  NEXT_PUBLIC_AWS_S3_BUCKET: z.string().optional()
});

// Function to validate the environment variables
export const validateEnv = () => envSchema.parse(process.env);

export type EnvSchema = z.infer<typeof envSchema>;

export const env: EnvSchema = validateEnv();

// Extend ProcessEnv interface with environment variables schema
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}
