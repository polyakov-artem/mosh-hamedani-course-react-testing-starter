import { http, HttpResponse, PathParams } from "msw";
import { fetchedCategories, fetchedProducts } from "./constants";

export const categoriesResolver = async () => {
  return HttpResponse.json(fetchedCategories);
};

export const productsResolver = async () => {
  return HttpResponse.json(fetchedProducts);
};

export const singleProductResolver = async ({
  params,
}: {
  params: PathParams;
}) => {
  const { id } = params;
  const product = fetchedProducts.find((p) => p.id === parseInt(`${id}`));

  if (!product) {
    return new HttpResponse(null, { status: 404 });
  }

  return HttpResponse.json(product);
};

export const handlers = [
  http.get("/categories", categoriesResolver),
  http.get("/products/:id", singleProductResolver),
  http.get("/products", productsResolver),
];
