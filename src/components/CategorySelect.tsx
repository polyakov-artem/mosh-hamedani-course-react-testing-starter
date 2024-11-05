import { FC } from "react";
import useCategories from "../hooks/useCategories";
import Skeleton from "react-loading-skeleton";
import { Select } from "@radix-ui/themes";

interface CategorySelectProps {
  onValueChange: (value: string) => void;
}

const CategorySelect: FC<CategorySelectProps> = ({ onValueChange }) => {
  const {
    data: categories,
    error: errorCategories,
    isLoading: isCategoriesLoading,
  } = useCategories();

  if (isCategoriesLoading)
    return <Skeleton containerTestId="categories-skeleton" />;

  if (errorCategories) return null;

  return (
    <Select.Root
      onValueChange={(categoryId: string) => onValueChange(categoryId)}
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

export default CategorySelect;
