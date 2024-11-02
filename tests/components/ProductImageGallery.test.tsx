import { render } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  describe("when array of imageUrls is passed", () => {
    test("should render a list of images", () => {
      const imageUrls = ["1", "2"];

      renderProductImageGallery({ imageUrls });

      const images = document.querySelectorAll("ul li img");
      [...images].forEach((img, i) =>
        expect(img).toHaveAttribute("src", imageUrls[i])
      );
    });
  });

  describe("when array of imageUrls is not  passed", () => {
    test("should not render ProductImageGallery", () => {
      const { container } = renderProductImageGallery({ imageUrls: [] });

      expect(container).toBeEmptyDOMElement();
    });
  });
});

const renderProductImageGallery = ({ imageUrls }: { imageUrls: string[] }) =>
  render(<ProductImageGallery imageUrls={imageUrls}></ProductImageGallery>);
