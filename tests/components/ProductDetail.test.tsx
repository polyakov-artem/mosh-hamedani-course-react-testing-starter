import { render, screen, waitFor } from "@testing-library/react";
import { fetchedProducts } from "../../src/mocks/constants";
import { addNetworkError } from "../../src/mocks/server-utils";
import { server } from "../../src/mocks/server";
import ProductDetail from "../../src/components/ProductDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("ProductDetail", () => {
  describe("when product is loading", () => {
    test("should render only 'loading' placeholder", async () => {
      const { getLoadingMessage, getHeading } = renderProductDetail(1);

      expect(getHeading).toThrow();
      expect(await getLoadingMessage()).toBeInTheDocument();
    });
  });

  describe("when network error occured", () => {
    test("should render only error message", async () => {
      addNetworkError(server);
      const { getErrorMessage, getHeading } = renderProductDetail(1);

      expect(getHeading).toThrow();
      const messageEl = await getErrorMessage();
      expect(messageEl).toBeInTheDocument();
    });
  });

  describe("when product is loaded", () => {
    test("should render product details", async () => {
      const expectedProduct = fetchedProducts[0];
      const { getHeading } = renderProductDetail(1);

      await waitFor(getHeading);

      expect(
        await screen.findByText(`$${expectedProduct.price}`, { exact: false })
      ).toBeInTheDocument();
      expect(
        await screen.findByText(`${expectedProduct.name}`, { exact: false })
      ).toBeInTheDocument();
    });
  });

  describe("when product id is not found", () => {
    test("should render only error message", async () => {
      const { getHeading, getNotFoundMessage } = renderProductDetail(100);

      const messageEl = await getNotFoundMessage();
      expect(messageEl).toBeInTheDocument();
      expect(getHeading).toThrow();
    });
  });
});

const renderProductDetail = (productId: number) => {
  const client = new QueryClient();

  const utils = render(
    <QueryClientProvider client={client}>
      <ProductDetail productId={productId} />
    </QueryClientProvider>
  );

  const helpers = {
    utils,
    getHeading: () => screen.getByRole("heading"),
    getLoadingMessage: async () => await screen.findByText(/Loading/i),
    getNotFoundMessage: async () => await screen.findByText(/not found/i),
    getErrorMessage: async (text = "") =>
      await screen.findByText(new RegExp("Error: " + text, "i")),
  };

  return helpers;
};
