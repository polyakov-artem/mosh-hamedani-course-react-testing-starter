import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "../providers/CartProvider";
import { Theme } from "@radix-ui/themes";

export const MockQueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const MockAllProviders = ({ children }: PropsWithChildren) => {
  return (
    <MockQueryProvider>
      <CartProvider>
        <Theme>{children}</Theme>
      </CartProvider>
    </MockQueryProvider>
  );
};
