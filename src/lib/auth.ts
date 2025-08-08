/* eslint-disable @typescript-eslint/no-unused-vars */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin as adminPlugin,
  apiKey,
  openAPI,
  organization
} from "better-auth/plugins";

import { env } from "@/lib/config/env";
import { db } from "@/database";
import * as schema from "@/database/schema";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),

  // Email Authentication
  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url, token }, request) => {
      // TODO: Implement email sending logic
      console.log({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`
      });
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // TODO: Implement email sending logic
      console.log({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`
      });
    }
  },

  socialProviders: {},
  plugins: [adminPlugin(), openAPI()],

  advanced: {
    crossSubDomainCookies: {
      enabled: true
    }
  }
});

export type Session = typeof auth.$Infer.Session;
