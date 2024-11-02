import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";

describe("Greet", () => {
  test("should render Hello with the name if name provided", () => {
    render(<Greet name="John" />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/john/i);
  });

  test("should render Login button if name is not provided", () => {
    render(<Greet />);

    const heading = screen.queryByRole("heading");
    const button = screen.getByRole("button");
    expect(heading).not.toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Login/i);
  });
});
