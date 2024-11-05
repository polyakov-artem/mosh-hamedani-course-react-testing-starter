import { FC } from "react";
import useProducts from "../hooks/useProducts";
import { Table } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import QuantitySelector from "./QuantitySelector";

interface ProductTableProps {
  selectedCategoryId?: number;
}

const ProductTable: FC<ProductTableProps> = ({ selectedCategoryId }) => {
  const {
    data: products,
    error: errorProducts,
    isLoading: isProductsLoading,
  } = useProducts();

  if (errorProducts) return <div>Error: {errorProducts.message}</div>;

  const skeletons = [1, 2, 3, 4, 5];

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

export default ProductTable;
