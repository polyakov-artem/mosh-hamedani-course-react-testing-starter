import { Select, Table } from "@radix-ui/themes";

import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QuantitySelector from "../components/QuantitySelector";

import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";

function BrowseProducts() {
  const {
    data: products,
    error: errorProducts,
    isLoading: isProductsLoading,
  } = useProducts();

  const {
    data: categories,
    error: errorCategories,
    isLoading: isCategoriesLoading,
  } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  if (errorProducts) return <div>Error: {errorProducts.message}</div>;

  const renderCategories = () => {
    if (isCategoriesLoading)
      return <Skeleton containerTestId="categories-skeleton" />;
    if (errorCategories) return <div>Error: {errorCategories.message}</div>;
    return (
      <Select.Root
        onValueChange={(categoryId) =>
          setSelectedCategoryId(parseInt(categoryId))
        }
      >
        <Select.Trigger placeholder="Filter by Category" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Category</Select.Label>
            <Select.Item value="all">All</Select.Item>
            {categories?.map((category) => (
              <Select.Item key={category.id} value={category.id.toString()}>
                {category.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    );
  };

  const renderProducts = () => {
    const skeletons = [1, 2, 3, 4, 5];

    if (errorProducts) return <div>Error: {errorProducts}</div>;

    const visibleProducts = selectedCategoryId
      ? products?.filter((p) => p.categoryId === selectedCategoryId)
      : products;

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body data-testid={"table-body"}>
          {isProductsLoading &&
            skeletons.map((skeleton) => (
              <Table.Row key={skeleton}>
                <Table.Cell>
                  <Skeleton containerTestId="cell-skeleton" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton containerTestId="cell-skeleton" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton containerTestId="cell-skeleton" />
                </Table.Cell>
              </Table.Row>
            ))}
          {!isProductsLoading &&
            visibleProducts &&
            visibleProducts.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">{renderCategories()}</div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
