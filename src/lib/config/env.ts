/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
import z from "zod";

// Define the schema for the environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  CLIENT_APP_URL: z.string().url()
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
