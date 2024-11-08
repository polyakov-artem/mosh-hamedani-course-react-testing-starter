import axios, { isAxiosError } from "axios";

import { Category } from "../entities";
import { useQuery } from "@tanstack/react-query";

const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchProducts,
  });
};

export const fetchProducts = async () => {
  try {
    const { data } = await axios.get<Category[]>("/categories");
    return data;
  } catch (error) {
    if (!isAxiosError(error)) {
      throw new Error("An unexpected error occurred");
    }

    throw error;
  }
};

export default useCategories;
