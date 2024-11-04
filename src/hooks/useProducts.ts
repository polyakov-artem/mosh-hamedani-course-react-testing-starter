import axios, { isAxiosError } from "axios";
import { Product } from "../entities";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const fetchProducts = async () => {
  try {
    const { data } = await axios.get<Product[]>("/products");
    return data;
  } catch (error) {
    if (!isAxiosError(error)) {
      throw new Error("An unexpected error occurred");
    }

    throw error;
  }
};

export default useProducts;
