import AuthStatus from "../../src/components/AuthStatus";
import {
  assertAbsence,
  assertExistance,
  mockAuthState,
  toRegExp,
} from "../../src/mocks/testUtils";

import { render, screen } from "@testing-library/react";

describe("AuthStatus", () => {
  describe("when authentication is pending", () => {
    test("should render loading message", () => {
      mockAuthState({
        isLoading: true,
        isAuthenticated: false,
        user: undefined,
      });

      renderAuthStatus();

      assertExistance(getLoadingMessage);
      assertAbsence(getLogoutBtn, getLoginBtn);
    });
  });

  describe("when authentication is successful", () => {
    test("should render user name, log out button", async () => {
      mockAuthState({
        isLoading: false,
        isAuthenticated: true,
        user: { name: userName },
      });

      renderAuthStatus();

      assertExistance(getLogoutBtn, getUserName);
      assertAbsence(getLoginBtn, getLoadingMessage);
    });
  });

  describe("when user is not authencticated", () => {
    test("should render login button", async () => {
      mockAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: undefined,
      });

      renderAuthStatus();

      assertExistance(getLoginBtn);
      assertAbsence(getLogoutBtn, getLoadingMessage, getLogoutBtn);
    });
  });
});

const renderAuthStatus = () => {
  render(<AuthStatus />);
};

const userName = "David";
const getLoadingMessage = () => screen.getByText(/loading/i);
const getLogoutBtn = () => screen.getByRole("button", { name: /Log Out/i });
const getLoginBtn = () => screen.getByRole("button", { name: /Log In/i });
const getUserName = () => screen.getByText(toRegExp(userName));
