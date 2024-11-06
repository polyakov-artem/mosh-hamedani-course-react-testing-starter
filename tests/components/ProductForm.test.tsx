import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Product } from "../../src/entities";
import { MockAllProviders } from "../../src/mocks/providers";
import {
  assertAbsence,
  assertExistance,
  toRegExp,
} from "../../src/mocks/testUtils";
import { addServerDelay } from "../../src/mocks/server-utils";
import { server } from "../../src/mocks/server";
import userEvent from "@testing-library/user-event";
import { fetchedCategories, fetchedProducts } from "../../src/mocks/constants";
import { ProductFormData } from "../../src/validationSchemas/productSchema";
import { Toaster } from "react-hot-toast";

describe("ProductForm", () => {
  describe("when categories are loading", () => {
    test("should render form fields", () => {
      addServerDelay(server);

      renderProductForm(getProps());

      assertExistance(getLoadingMessage);
      assertAbsence(getForm);
    });
  });

  describe("when categories are loaded", () => {
    test("should render form fields", async () => {
      renderProductForm(getProps());

      await waitForFormToLoad();

      assertExistance(
        getForm,
        getNameInput,
        getPriceInput,
        getCategorySelect,
        getSubmitButton
      );
    });

    test("should autofocus name input", async () => {
      renderProductForm(getProps());

      await waitForFormToLoad();

      expect(getNameInput()).toHaveFocus();
    });
  });

  describe("when product prop provided", () => {
    test("should render filled form", async () => {
      const product = fetchedProducts[0];
      const categoryName = getCategoryName(product.categoryId);
      renderProductForm(getProps(product));

      await waitForFormToLoad();

      const elements = assertExistance(
        getNameInput,
        getPriceInput,
        getCategorySelect,
        getSubmitButton
      );

      expect(categoryName?.length).toBeGreaterThan(1);
      expect(elements.nameInput).toHaveValue(product.name);
      expect(elements.priceInput).toHaveValue(String(product.price));
      expect(elements.categorySelect).toHaveTextContent(categoryName!);
    });
  });

  describe("when user clicked on category selector", () => {
    test("should render all options", async () => {
      const user = getUser();
      renderProductForm(getProps());

      await waitForFormToLoad();
      await user.click(getCategorySelect());

      assertOptions(fetchedCategories.map((category) => category.name));
    });
  });

  describe("when wrongly filled name filed, clicked 'submit'", () => {
    test.each([
      {
        scenario: "missing",
        errorMessage: "required",
        name: undefined,
      },
      {
        scenario: "longer than 255",
        name: "a".repeat(256),
        errorMessage: "at most 255",
      },
    ])(
      "should render $errorMessage error if name is $scenario",
      async ({ name, errorMessage }) => {
        renderProductForm(getProps());

        await waitForFormToLoad();
        await fillAndSubmit({ ...fetchedProducts[0], name });

        expect(getErrorMessage(errorMessage)).toBeInTheDocument();
      }
    );
  });

  describe("when wrongly filled price filed, clicked 'submit'", () => {
    test.each([
      {
        scenario: "missing",
        price: undefined,
        errorMessage: "required",
      },
      {
        scenario: "not a number",
        price: "abc",
        errorMessage: "required",
      },
      {
        scenario: "more than 1000",
        price: "1001",
        errorMessage: "equal to 1000",
      },
      {
        scenario: "less than 1",
        price: "-1",
        errorMessage: "equal to 1",
      },
    ])(
      "should render $errorMessage error if price is $scenario",
      async ({ price, errorMessage }) => {
        renderProductForm(getProps());

        await waitForFormToLoad();
        await fillAndSubmit({ ...fetchedProducts[0], price });

        expect(getErrorMessage(errorMessage)).toBeInTheDocument();
      }
    );
  });

  describe("when did not select the category, clicked 'submit'", () => {
    test.each([
      {
        scenario: "missing",
        errorMessage: "required",
      },
    ])(
      "should render $errorMessage error if category is $scenario",
      async ({ errorMessage }) => {
        renderProductForm(getProps());

        await waitForFormToLoad();
        await fillAndSubmit({ ...fetchedProducts[0], categoryId: undefined });

        expect(getErrorMessage(errorMessage)).toBeInTheDocument();
      }
    );
  });

  describe("with form filled user clicked 'submit'", () => {
    test("should call onsubmit with formData and disable 'submit' button", async () => {
      const formData: Partial<Product> = fetchedProducts[0];
      delete formData.id;
      const props = getProps(undefined, "pending");

      renderProductForm(props);
      await waitForFormToLoad();
      await fillAndSubmit(formData);

      const button = getSubmitButton();
      expect(props.onSubmit).toBeCalledWith(formData);
      expect(button).toBeDisabled();
    });
  });

  describe("when received an error while submitting", () => {
    test("should render error and enable button", async () => {
      const formData = fetchedProducts[0];
      const props = getProps(undefined, "error");

      renderProductForm(props);
      await waitForFormToLoad();
      await fillAndSubmit(formData);

      const toast = await waitFor(getToast);
      expect(toast).toHaveTextContent(/error occurred/i);
      expect(getSubmitButton()).toBeEnabled();
    });
  });

  describe("when submit is successful", () => {
    test("should enable submit button", async () => {
      const formData = fetchedProducts[0];
      const props = getProps(undefined, "success");

      renderProductForm(props);
      await waitForFormToLoad();
      await fillAndSubmit(formData);

      const button = getSubmitButton();
      await waitFor(() => expect(button).toBeEnabled());
    });
  });
});

interface Props {
  product?: Product;
  onSubmit: (product: ProductFormData) => Promise<void>;
}

const getProps = (
  product?: Product,
  result: "pending" | "error" | "success" = "pending"
): Props => {
  const onSubmit = vi.fn();

  const handlers = {
    pending: () => new Promise(() => {}),
    error: () => Promise.reject(new Error("Error")),
    success: () => Promise.resolve("success"),
  };

  onSubmit.mockImplementation(handlers[result]);

  return {
    product,
    onSubmit,
  };
};

const renderProductForm = (props: Props) => {
  return render(
    <MockAllProviders>
      <ProductForm {...props} />
      <Toaster />
    </MockAllProviders>
  );
};

const waitForFormToLoad = async () => {
  await waitForElementToBeRemoved(getLoadingMessage);
};

const getCategoryName = (categoryId: number | string) =>
  fetchedCategories.find((c) => c.id === categoryId)?.name;

const fillAndSubmit = async ({
  name,
  price,
  categoryId,
}: {
  name?: string;
  price?: string | number;
  categoryId?: string | number;
}) => {
  const user = getUser();

  if (name) {
    await user.type(getNameInput(), name);
  }

  if (price) {
    await user.type(getPriceInput(), `${price}`);
  }

  if (categoryId) {
    await user.click(getCategorySelect());
    await user.click(getOption(getCategoryName(categoryId)!));
  }

  await user.click(getSubmitButton());
};

const getUser = () => userEvent.setup();
const getForm = () => screen.getByRole("form");
const getNameInput = () => screen.getByPlaceholderText(/name/i);
const getPriceInput = () => screen.getByPlaceholderText(/price/i);
const getCategorySelect = () =>
  screen.getByRole("combobox", { name: /category/i });
const getSubmitButton = () => screen.getByRole("button");
const getLoadingMessage = () => screen.getByText(/loading/i);
const getAllOptions = () => screen.getAllByRole("option");
const getOption = (text: string) =>
  screen.getByRole("option", { name: toRegExp(text) });

const assertOptions = (optionsTexts: string[]) => {
  expect(getAllOptions()).toHaveLength(optionsTexts.length);

  optionsTexts.forEach((optionText) => {
    expect(getOption(optionText)).toBeInTheDocument();
  });
};

const getErrorMessage = (text: string) => screen.getByText(toRegExp(text));
const getToast = () => screen.getByRole("status");
