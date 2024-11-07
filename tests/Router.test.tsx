import { screen, waitFor } from "@testing-library/react";
import { assertExistance, navigateTo } from "../src/mocks/testUtils";
import { fetchedProducts } from "../src/mocks/constants";

const product = fetchedProducts[0];

describe("Router", () => {
  describe("when route is correct", () => {
    test.each([
      { path: "/", page: "HomePage", getter: getHomePageHeading },
      {
        path: "/products",
        page: "ProductListPage",
        getter: getProductListPageHeading,
      },
      {
        path: `/products/${product.id}`,
        page: "ProductDetailPage",
        getter: getProductDetailPageHeading,
      },
      {
        path: "/admin",
        page: "AdminHomePage",
        getter: getAdminHomePageHeading,
      },
    ])(
      "should render page $page when path is $path",
      async ({ getter, path }) => {
        navigateTo(path);

        await waitFor(() => assertExistance(getter));
      }
    );
  });

  describe("when route is incorrect", () => {
    test("should render not found page", async () => {
      navigateTo("/invalid-path");

      assertExistance(getErrorPageHeading);
    });
  });
});

const getHomePageHeading = () =>
  screen.getByRole("heading", { name: /home page/i });
const getProductListPageHeading = () =>
  screen.getByRole("heading", { name: /Products/i });
const getProductDetailPageHeading = () =>
  screen.getByRole("heading", { name: product.name });
const getErrorPageHeading = () =>
  screen.getByRole("heading", { name: /Oops/i });
const getAdminHomePageHeading = () =>
  screen.getByRole("heading", { name: /Admin Area/i });
