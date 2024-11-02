import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  describe("when first rendered", () => {
    test("should render correctly", () => {
      const { btn, checkbox, heading } = renderTermsAndConditions();

      expect(heading).toHaveTextContent(/Terms & Conditions/i);
      expect(btn).toBeDisabled();
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("when user clicked on 'i accept...' checkbox", () => {
    test("should enable the button, check the checkbox", async () => {
      const user = userEvent.setup();
      const { btn, checkbox } = renderTermsAndConditions();

      await user.click(checkbox);

      expect(btn).toBeEnabled();
      expect(checkbox).toBeChecked();
    });
  });
});

const renderTermsAndConditions = () => {
  const utils = render(<TermsAndConditions />);

  const btn = screen.getByRole("button", { name: /submit/i });
  const heading = screen.getByRole("heading");
  const checkbox = screen.getByLabelText(/I accept/i);

  return { utils, heading, checkbox, btn };
};
