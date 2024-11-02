import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserList", () => {
  describe("when array of users is passed", () => {
    test("should render a list of links with user names", () => {
      const users = [
        { id: 1, name: "John" },
        { id: 2, name: "Alice" },
      ];

      renderUserList({ users });

      users.forEach(({ name, id }) => {
        const link = screen.getByRole("link", { name });
        expect(link).toHaveAttribute("href", `/users/${id}`);
        expect(link).toHaveTextContent(name);
      });
    });
  });

  describe("when array of users is not  passed", () => {
    test("should render 'No users available', should not render a list of users", () => {
      renderUserList({ users: [] });

      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
      expect(screen.getByText(/No users/i)).toBeInTheDocument();
    });
  });
});

const renderUserList = ({ users }: { users: User[] }) =>
  render(<UserList users={users}></UserList>);
