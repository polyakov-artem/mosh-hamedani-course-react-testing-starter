import { screen, waitFor } from "@testing-library/react";
import { fetchedProducts } from "../../src/mocks/constants";
import { addNetworkError } from "../../src/mocks/server-utils";
import { server } from "../../src/mocks/server";

import {
  assertElements,
  navigateTo,
  toRegExp,
} from "../../src/mocks/testUtils";

const product = fetchedProducts[0];

describe("ProductDetailPage", () => {
  describe("when product is loading", () => {
    test("should render only 'loading' placeholder", async () => {
      renderProductDetailPage();

      assertElements(renderingCases.loading);
    });
  });

  describe("when network error occured", () => {
    test("should render only error message", async () => {
      addNetworkError(server);

      renderProductDetailPage();
      await waitFor(getErrorMessage);

      assertElements(renderingCases.error);
    });
  });

  describe("when product is loaded", () => {
    test("should render product details", async () => {
      renderProductDetailPage();
      await waitFor(getHeading);

      assertElements(renderingCases.loaded);
    });
  });

  describe("when product id is not found", () => {
    test("should render only error message", async () => {
      renderProductDetailPage(true);

      await waitFor(getNotFoundMessage);

      assertElements(renderingCases.notFound);
    });
  });
});

const renderProductDetailPage = (invalidId = false) => {
  navigateTo(`/products/${invalidId ? -1 : product.id}`);
};

const getHeading = () => screen.getByRole("heading", { name: product.name });
const getPrice = () => screen.getByText(toRegExp(product.price));
const getLoadingMessage = () => screen.getByText(/Loading/i);
const getNotFoundMessage = () => screen.getByText(/not found/i);
const getErrorMessage = () => screen.getByText(/Error/i);

const renderingCases = {
  loading: {
    exist: [getLoadingMessage],
    absent: [getHeading, getPrice, getNotFoundMessage, getErrorMessage],
  },
  error: {
    exist: [getErrorMessage],
    absent: [getHeading, getPrice, getNotFoundMessage, getLoadingMessage],
  },
  notFound: {
    exist: [getNotFoundMessage],
    absent: [getHeading, getPrice, getErrorMessage, getLoadingMessage],
  },
  loaded: {
    exist: [getHeading, getPrice],
    absent: [getErrorMessage, getNotFoundMessage, getLoadingMessage],
  },
};
