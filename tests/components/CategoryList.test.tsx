import CategoryList from "../../src/components/CategoryList";
import { fetchedCategories } from "../../src/mocks/constants";
import { server } from "../../src/mocks/server";
import { addNetworkError, addServerDelay } from "../../src/mocks/server-utils";
import { assertAbsence, assertExistance } from "../../src/mocks/testUtils";
import ReduxProvider from "../../src/providers/ReduxProvider";
import {
  getAllByRole,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

describe("CategoryList", () => {
  describe("when loading error occured", () => {
    test("should render only error message", async () => {
      addNetworkError(server);

      renderCategoryList();

      await waitForElementToBeRemoved(getLoadingMessage);

      assertExistance(getErrorMessage);
      assertAbsence(getHeading, getLoadingMessage, getList);
    });
  });

  describe("when request is pending", () => {
    test("should render only 'loading' message", () => {
      addServerDelay(server);

      renderCategoryList();

      assertExistance(getHeading, getLoadingMessage);
      assertAbsence(getErrorMessage, getList);
    });
  });

  describe("when request array of categories is loaded", () => {
    test("should render list of categories and not render loading state messages", async () => {
      renderCategoryList();

      await waitForElementToBeRemoved(getLoadingMessage);

      assertAbsence(getErrorMessage, getLoadingMessage);
      assertListIsCorrect(
        fetchedCategories.map((c) => String(c.name)),
        getListItems()
      );
    });
  });
});

const renderCategoryList = () => {
  const utils = render(<CategoryList />, { wrapper: ReduxProvider });
  return { utils };
};

const assertListIsCorrect = (itemsContent: string[], items: HTMLElement[]) => {
  expect(items).toHaveLength(itemsContent.length);
  items.forEach((item, i) => expect(item).toHaveTextContent(itemsContent[i]));
};

const getHeading = () => screen.getByRole("heading", { name: /Category/i });
const getErrorMessage = () => screen.getByText(/Error/i);
const getLoadingMessage = () => screen.getByText(/Loading/i);
const getList = () => screen.getByRole("list");
const getListItems = () => getAllByRole(getList(), "listitem");
