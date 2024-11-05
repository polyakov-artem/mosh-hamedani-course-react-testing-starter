import {
  getAllByRole,
  getByRole,
  getAllByTestId,
  getByTestId,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { MockQueryProvider } from "../../src/mocks/providers";
import { addNetworkError, addServerDelay } from "../../src/mocks/server-utils";
import { server } from "../../src/mocks/server";
import { CartProvider } from "../../src/providers/CartProvider";
import { fetchedCategories, fetchedProducts } from "../../src/mocks/constants";
import { assertAbsence, assertExistance } from "../../src/mocks/testUtils";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Product } from "../../src/entities";

describe("BrowseProducts", () => {
  describe("when products and categories are loading", () => {
    test("should render heading, partially table, categories skeleton, skeletons in the table body", () => {
      addServerDelay(server);

      renderBrowseProducts();

      assertExistance(
        getHeading,
        getCategoriesSkeleton,
        getTable,
        getTableNameHeader,
        getTablePriceHeader
      );

      assertTableSkeletonsExistance();
    });

    test("should not render error element, categories selector", () => {
      addServerDelay(server);

      renderBrowseProducts();

      assertAbsence(getErrorElement, getCategoriesSelector);
    });
  });

  describe("when categories are loaded", () => {
    test("should should remove selector skeleton and render the selector with all options", async () => {
      const user = userEvent.setup();
      renderBrowseProducts();

      await waitUntilCategoriesLoaded();

      const selector = getCategoriesSelector();
      expect(selector).toBeInTheDocument();
      assertAbsence(getCategoriesSkeleton);

      await user.click(selector);

      expect(getOption("All")).toBeInTheDocument();
      fetchedCategories.forEach((category) => {
        expect(getOption(category.name)).toBeInTheDocument();
      });
    });
  });

  describe("when categories loading error received, products are loaded", () => {
    test("should should render, heading, table with products, should not render categories", async () => {
      addNetworkError(server, "/categories");

      renderBrowseProducts();

      const categoriesSkeleton = getCategoriesSkeleton();
      await waitForElementToBeRemoved(categoriesSkeleton);
      const table = getTable();

      assertAbsence(getErrorElement, getCategoriesSelector, () =>
        getAllSkeletons(table)
      );

      assertTableProductsExist(fetchedProducts);
    });
  });

  describe("when products are loaded", () => {
    test("should remove skeletons in the table and render products", async () => {
      renderBrowseProducts();
      await waitUntilProductsLoaded();

      assertTableProductsExist(fetchedProducts);
    });
  });

  describe("when products loading error received", () => {
    test("should render error message, should not render heading, table, selector, selector skeleton", async () => {
      addNetworkError(server, "/products");

      renderBrowseProducts();

      await waitFor(() => {
        expect(getErrorElement()).toBeInTheDocument();
      });

      assertAbsence(getTable);
    });
  });

  describe("when products and categories are loaded, ", () => {
    describe("and user selected category", () => {
      test("should render only selected category products ", async () => {
        const user = userEvent.setup();
        const category = fetchedCategories[0];

        await renderWithAllLoaded();
        await changeCategory(category.name, user);

        const products = getCategoryProducts(category.id, fetchedProducts);
        expect(products.length).toBeGreaterThan(0);
        assertTableProductsExist(products);
      });
    });

    describe("and user changed category from Electronics to Appliances", () => {
      test("should render only Appliances products ", async () => {
        const user = userEvent.setup();
        const category = fetchedCategories[0];
        const nextCategory = fetchedCategories[1];

        await renderWithAllLoaded();
        await changeCategory(category.name, user);
        await changeCategory(nextCategory.name, user);

        const products = getCategoryProducts(nextCategory.id, fetchedProducts);
        expect(products.length).toBeGreaterThan(0);
        assertTableProductsExist(products);
      });
    });

    describe("and user changed category from Electronics to All", () => {
      test("should render all products ", async () => {
        const user = userEvent.setup();
        const category = fetchedCategories[0];
        const nextCategoryName = "All";

        await renderWithAllLoaded();
        await changeCategory(category.name, user);
        await changeCategory(nextCategoryName, user);

        assertTableProductsExist(fetchedProducts);
      });
    });
  });
});

const getCategoryProducts = (categoryId: number, products: Product[]) => {
  return products.filter((p) => p.categoryId === categoryId);
};

const waitUntilCategoriesLoaded = async () => {
  await waitFor(getCategoriesSelector);
};

const waitUntilProductsLoaded = async () => {
  const tableBody = getTableBody();
  await waitForElementToBeRemoved(getAllSkeletons(tableBody));
};

const renderWithAllLoaded = async () => {
  renderBrowseProducts();
  await waitUntilProductsLoaded();
  await waitUntilCategoriesLoaded();
};

const changeCategory = async (categoryName: string, user: UserEvent) => {
  await user.click(getCategoriesSelector());
  await user.click(getOption(categoryName));
};

const assertTableProductsExist = (products: Product[]) => {
  const tableRows = getBodyRows();
  expect(tableRows.length).toBe(products.length);

  tableRows.forEach((row, i) => {
    expect(row).toContain(getByRole(row, "cell", { name: products[i].name }));

    expect(row).toContain(
      getByRole(row, "cell", {
        name: new RegExp(String(products[i].price), "i"),
      })
    );

    expect(row).toContain(getAddBtn(row));
  });
};

const assertTableSkeletonsExistance = () => {
  const bodyRows = getBodyRows();
  expect(bodyRows.length).toBeGreaterThan(0);

  bodyRows.forEach((row) => {
    const cells = getAllByRole(row, "cell");
    expect(cells.length).toBe(3);
    cells.forEach((cell) => expect(cell).toContain(getSkeleton(cell)));
  });
};

const renderBrowseProducts = () => {
  return render(
    <MockQueryProvider>
      <CartProvider>
        <BrowseProducts />
      </CartProvider>
    </MockQueryProvider>
  );
};

const getHeading = () => screen.getByRole("heading", { name: /products/i });
const getTable = () => screen.getByRole("table");
const getTableBody = () => screen.getByTestId("table-body");
const getCategoriesSkeleton = () => screen.getByTestId("categories-skeleton");
const getBodyRows = () => getAllByRole(getTableBody()!, "row");
const getCategoriesSelector = () => screen.getByRole("combobox");
const getErrorElement = () => screen.getByText(/Error:/i);

const getTableNameHeader = () =>
  screen.getByRole("columnheader", { name: /name/i });

const getTablePriceHeader = () =>
  screen.getByRole("columnheader", { name: /price/i });

const getSkeleton = (wrapper: HTMLElement) =>
  getByTestId(wrapper, "cell-skeleton");

const getAllSkeletons = (wrapper: HTMLElement) =>
  getAllByTestId(wrapper, "cell-skeleton");

const getAddBtn = (wrapper: HTMLElement) =>
  getByRole(wrapper, "button", { name: /add to cart/i });

const getOption = (text: string) => screen.getByRole("option", { name: text });
