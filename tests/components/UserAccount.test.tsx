import { render, screen } from "@testing-library/react";

import { describe, expect, test } from "vitest";
import { User } from "../../src/entities";
import UserAccount from "../../src/components/UserAccount";

describe("UserAccount", () => {
  describe("when name = John, isAdmin = true", () => {
    test("should render Edit button, user name", () => {
      const { button, name, heading } = renderUserAccount({ isAdmin: true });

      expect(button).toBeInTheDocument();
      expect(name).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });
  });

  describe("when name = John, isAdmin = false", () => {
    test("should not render Edit button", () => {
      const { button, name, heading } = renderUserAccount({ isAdmin: false });

      expect(button).not.toBeInTheDocument();
      expect(name).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });
  });
});

const renderUserAccount = (props?: Partial<User>) => {
  const userAccountProps = {
    user: {
      isAdmin: props?.isAdmin,
      name: "John",
      id: 1,
    },
  };

  const utils = render(<UserAccount {...userAccountProps}></UserAccount>);
  const button = screen.queryByRole("button");
  const name = screen.queryByText(userAccountProps.user.name);
  const heading = screen.queryByRole("heading", { name: /User Profile/i });

  return {
    utils,
    button,
    name,
    heading,
  };
};
