import { render, screen } from "@testing-library/react";
import QuantitySelector from "../../src/components/QuantitySelector";
import { fetchedProducts } from "../../src/mocks/constants";
import { CartProvider } from "../../src/providers/CartProvider";
import { assertAbsence, assertExistance } from "../../src/mocks/testUtils";
import userEvent from "@testing-library/user-event";

describe("QuantitySelector", () => {
  describe("when product is not in the cart", () => {
    test("should render only 'add' button", () => {
      renderQuantitySelector();

      expect(getAddButton()).toBeInTheDocument();
      assertAbsence(getDecreaseButton, getIncreaseButton, getCountField);
    });
  });
  describe("when product is not in the cart, 'add' button clicked", () => {
    test("should remove 'add' button, render '-', '+' buttons, number of products (1)", async () => {
      await renderAndAddToCart();

      assertAbsence(getAddButton);
      const elements = assertExistance(
        getDecreaseButton,
        getIncreaseButton,
        getCountField
      );
      expect(elements.countField).toHaveTextContent("1");
    });
  });

  describe("when 1 product is in the cart, user clicked '+' button", () => {
    test("should update count to 2", async () => {
      const { user } = await renderAndAddToCart();

      await user.click(getIncreaseButton());

      expect(getCountField()).toHaveTextContent("2");
    });
  });

  describe("when 1 product is in the cart, user clicked '-' button", () => {
    test("should render only 'add' button", async () => {
      const { user } = await renderAndAddToCart();

      await user.click(getDecreaseButton());

      expect(getAddButton()).toBeInTheDocument();
      assertAbsence(getDecreaseButton, getIncreaseButton, getCountField);
    });
  });
});

const renderQuantitySelector = () => {
  const utils = render(
    <QuantitySelector product={fetchedProducts[0]} />,

    { wrapper: CartProvider }
  );

  return { utils, user: userEvent.setup() };
};

const renderAndAddToCart = async () => {
  const helpers = renderQuantitySelector();
  await helpers.user.click(getAddButton());
  return helpers;
};

const getAddButton = () => screen.getByRole("button", { name: /add/i });
const getDecreaseButton = () => screen.getByRole("button", { name: "-" });
const getIncreaseButton = () => screen.getByRole("button", { name: "+" });
const getCountField = () => screen.getByRole("status");
