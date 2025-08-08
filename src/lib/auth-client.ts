import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { env } from "@/lib/config/env";

export const authClient = createAuthClient({
  // Domain Configurations
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [adminClient()],
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message);
    }
  }
});
