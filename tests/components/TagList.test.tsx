import { findAllByRole, render, screen } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  describe("when first rendered", () => {
    test("should render empty list", () => {
      const { list } = renderTagList();

      expect(list).toBeEmptyDOMElement();
    });
  });

  describe("when tags request is resolved", () => {
    test("should render list of tags", async () => {
      const tags = ["tag1", "tag2", "tag3"];

      const { getListItems } = renderTagList();
      const items = await getListItems();

      items.forEach((item, i) => expect(item).toHaveTextContent(tags[i]));
    });
  });
});

const renderTagList = () => {
  const utils = render(<TagList />);

  const helpers = {
    utils,
    list: screen.queryByRole("list"),
    getListItems: async () => await findAllByRole(helpers.list!, "listitem"),
  };

  return helpers;
};
