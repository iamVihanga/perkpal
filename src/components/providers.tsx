"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

// React-Query Client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        // disableTransitionOnChange
        enableColorScheme
      >
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </QueryClientProvider>
      </NextThemesProvider>
    </Suspense>
  );
}
