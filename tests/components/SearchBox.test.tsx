import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  describe("when first rendered", () => {
    test("should render correctly", () => {
      const { input } = renderSearchBox();

      expect(input).toBeInTheDocument();
    });
  });

  describe("when user typed the text ", () => {
    const text = "text";

    test("should render typed text ", async () => {
      const { input, user } = renderSearchBox();

      await user.type(input, text);

      expect(input).toHaveValue(text);
    });
  });

  describe("when user typed the text and pressed Enter", () => {
    test("should call onChange callback with typed text in argument", async () => {
      const text = "text";
      const { input, onChange, user } = renderSearchBox();

      await user.type(input, text);
      await user.keyboard("{Enter}");

      expect(onChange).toBeCalledWith(text);
    });
  });

  describe("when input is empty and focused user pressed Enter", () => {
    test("should not call onChange callback", async () => {
      const { input, onChange, user } = renderSearchBox();

      input.focus();
      await user.keyboard("{Enter}");

      expect(onChange).not.toBeCalled();
    });
  });
});

const renderSearchBox = () => {
  const onChange = vi.fn();
  const utils = render(<SearchBox onChange={onChange} />);

  const input = screen.getByPlaceholderText(/Search/i);
  return { utils, onChange, input, user: userEvent.setup() };
};
