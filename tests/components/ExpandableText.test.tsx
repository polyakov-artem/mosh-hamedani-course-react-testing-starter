import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  describe("when first rendered, text = 'some text', length of text <= 255", () => {
    test("should render only text text ", () => {
      const expectedText = "some text";
      const { expandButton } = renderExpandableText({
        text: expectedText,
      });

      expect(screen.queryByText(expectedText)).toBeInTheDocument();
      expect(expandButton).not.toBeInTheDocument();
    });
  });

  describe("when first rendered, text length > 255", () => {
    test("should render trimmed text, button", () => {
      const passedText = "a".repeat(300);
      const trimmedText = trimText(passedText);
      const { expandButton } = renderExpandableText({
        text: passedText,
      });

      expect(screen.queryByText(trimmedText)).toBeInTheDocument();
      expect(screen.queryByText(passedText)).not.toBeInTheDocument();
      expect(expandButton).toHaveTextContent(/More/i);
    });
  });

  describe("when text length > 255, user clicked on 'Show More' button", () => {
    test("should render full text, button text should change to 'show less'", async () => {
      const passedText = "a".repeat(300);
      const trimmedText = trimText(passedText);
      const { expandButton, user } = renderExpandableText({
        text: passedText,
        user: true,
      });

      await user!.click(expandButton!);

      expect(screen.queryByText(trimmedText)).not.toBeInTheDocument();
      expect(screen.queryByText(passedText)).toBeInTheDocument();
      expect(expandButton).toHaveTextContent(/less/i);
    });
  });
});

const trimText = (text: string, limit: number = 255) =>
  text.substring(0, limit) + "...";

const renderExpandableText = ({
  text,
  user,
}: {
  text: string;
  user?: boolean;
}) => {
  const utils = render(<ExpandableText text={text} />);

  const expandButton = screen.queryByRole("button");

  return {
    utils,
    expandButton,
    user: user ? userEvent.setup() : null,
  };
};
