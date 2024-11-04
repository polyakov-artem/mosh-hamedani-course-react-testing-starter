import axios from "axios";

import { Category } from "../entities";
import { useQuery } from "@tanstack/react-query";

const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => axios.get("/categories").then((res) => res.data),
  });
};

export default useCategories;
