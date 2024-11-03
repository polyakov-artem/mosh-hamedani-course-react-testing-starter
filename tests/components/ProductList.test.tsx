import ProductList from "../../src/components/ProductList";
import { render, screen, waitFor } from "@testing-library/react";
import { fetchedProducts } from "../../src/mocks/constants";
import {
  addNetworkError,
  returnEmptyProducts,
} from "../../src/mocks/server-utils";
import { server } from "../../src/mocks/server";

describe("ProductList", () => {
  describe("when products are loading", () => {
    test("should render only 'loading' placeholder", async () => {
      const { getLoadingMessage, getList } = renderProductList();

      expect(getList()).not.toBeInTheDocument();
      expect(getLoadingMessage()).toBeInTheDocument();
    });
  });

  describe("when network error occured", () => {
    test("should render only error message", async () => {
      addNetworkError(server);
      const { getErrorMessage, getList } = renderProductList();

      expect(getList()).not.toBeInTheDocument();
      const messageEl = await getErrorMessage();
      expect(messageEl).toHaveTextContent("Error: Network Error");
    });
  });

  describe("when non empty array of products is loaded", () => {
    test("should render only list of products", async () => {
      const { getList, getListItems } = renderProductList();

      await waitFor(getList);
      const listItems = getListItems();
      listItems.forEach((item, i) =>
        expect(item).toHaveTextContent(
          new RegExp(fetchedProducts[i].name, "gi")
        )
      );
    });
  });

  describe("when empty array of products is loaded", () => {
    test("should render 'No products' message", async () => {
      returnEmptyProducts(server);
      const { getList, getEmptyMessage } = renderProductList();

      await getEmptyMessage();
      expect(getList()).not.toBeInTheDocument();
    });
  });
});

const renderProductList = () => {
  const utils = render(<ProductList />);

  const helpers = {
    utils,
    getList: () => screen.queryByRole("list"),
    getLoadingMessage: () => screen.queryByText(/Loading/i),
    getErrorMessage: async () => await screen.findByText(/Error:/i),
    getEmptyMessage: async () => await screen.findByText(/No products/i),
    getListItems: () => screen.queryAllByRole("listitem"),
  };

  return helpers;
};
