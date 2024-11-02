import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToastDemo from "../../src/components/ToastDemo";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
  describe("when first rendered", () => {
    test("should render button", () => {
      const { button } = renderTagList();

      expect(button).toBeInTheDocument();
    });
  });

  describe("when button is clicked", () => {
    test("should display toast message", async () => {
      const { button, getToast, user } = renderTagList();

      await user.click(button);
      const toast = await getToast();

      expect(toast).toBeInTheDocument();
    });
  });
});

const renderTagList = () => {
  const utils = render(
    <>
      <ToastDemo />
      <Toaster />
    </>
  );

  const toastMessage = /Success/i;

  const helpers = {
    utils,
    user: userEvent.setup(),
    button: screen.getByRole("button"),
    getToast: async () => await screen.findByText(toastMessage),
  };

  return helpers;
};
