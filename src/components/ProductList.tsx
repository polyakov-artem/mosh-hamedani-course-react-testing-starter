import axios from "axios";

import { Product } from "../entities";
import { useQuery } from "react-query";

const ProductList = () => {
  const { data, error, isLoading } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (data!.length === 0) return <p>No products available.</p>;

  return (
    <ul>
      {data!.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

export default ProductList;
