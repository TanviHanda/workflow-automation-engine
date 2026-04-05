// lib/auth.ts

import { APIError, betterAuth } from "better-auth";
import { hashPassword } from "better-auth/crypto";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar, checkout, portal } from "@polar-sh/better-auth";
import prisma from "@/lib/db";
import { polarClient } from "./polar";
import { validatePasswordPolicy } from "./password-policy";

async function hashValidatedPassword(password: string) {
  const policyError = validatePasswordPolicy(password);

  if (policyError) {
    throw new APIError("BAD_REQUEST", {
      message: policyError,
    });
  }

  return hashPassword(password);
}

export const auth = betterAuth({
  // DATABASE (Prisma – untouched)
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // AUTH METHOD (Email + Password)
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    password: {
      hash: hashValidatedPassword,
    },
  },
  socialProviders: {
    github:{
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google:{
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  },
  // POLAR PLUGIN (YT FLOW – UPDATED)
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,

      use: [
        checkout({
          products: [
            {
              productId: "bf6c1534-83ff-4f00-b77a-c0ca73a5ce40", 
              slug: "pro",
            },
          ],
          successUrl: "/workflows",
        }),
        portal(),
      ],
    }),
  ],
});
