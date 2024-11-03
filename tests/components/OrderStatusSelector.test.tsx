import { getByText, screen } from "@testing-library/dom";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { render } from "@testing-library/react";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  describe("when rendered", () => {
    test("should render correctly", () => {
      const { trigger } = renderOrderStatusSelector();

      expect(trigger).toBeInTheDocument();
      expect(trigger).toContainElement(getByText(trigger, /new/i));
    });
  });

  describe("when user clicked on the button", () => {
    test("should render list of options with heading", async () => {
      const optionsText = [/New/i, /Processed/i, /Fulfilled/i];
      const heading = /status/i;
      const { trigger, user, getOptions } = renderOrderStatusSelector();

      await user.click(trigger);

      const options = await getOptions();
      expect(options).toHaveLength(optionsText.length);
      options.forEach((option, i) => {
        expect(option).toHaveTextContent(optionsText[i]);
      });
      expect(screen.getByText(heading)).toBeInTheDocument();
    });
  });

  describe("when user selected an option", () => {
    test.each([
      { label: /processed/i, value: "processed" },
      { label: /fulfilled/i, value: "fulfilled" },
    ])(
      "should call onChange with $value when the $label option is selected",
      async ({ label, value }) => {
        const { trigger, user, onChange, getOption } =
          renderOrderStatusSelector();
        await user.click(trigger);

        const option = await getOption(label);
        await user.click(option);

        expect(onChange).toHaveBeenCalledWith(value);
      }
    );
  });

  describe("when user change selected option", () => {
    test("should change the selected option", async () => {
      const currentLabel = /processed/i;
      const currentValue = "processed";
      const nextLabel = /new/i;
      const nextValue = "new";
      const { trigger, user, onChange, getOption } =
        renderOrderStatusSelector();

      await user.click(trigger);
      const currentOption = await getOption(currentLabel);
      await user.click(currentOption);

      expect(onChange).toHaveBeenCalledWith(currentValue);

      await user.click(trigger);
      const nextOption = await getOption(nextLabel);
      await user.click(nextOption);

      expect(onChange).toHaveBeenCalledWith(nextValue);
    });
  });
});

const renderOrderStatusSelector = () => {
  const onChange = vi.fn();
  const utils = render(
    <Theme>
      <OrderStatusSelector onChange={onChange} />
    </Theme>
  );

  return {
    trigger: screen.getByRole("combobox"),
    utils,
    onChange,
    user: userEvent.setup(),
    getOptions: async () => await screen.findAllByRole("option"),
    getOption: async (label: RegExp) =>
      await screen.findByRole("option", { name: label }),
  };
};
