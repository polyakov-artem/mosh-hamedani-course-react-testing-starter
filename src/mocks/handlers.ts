import { http, HttpResponse } from "msw";
import { fetchedCategories, fetchedProducts } from "./constants";

export const categoriesResolver = async () => {
  return HttpResponse.json(fetchedCategories);
};

export const productsResolver = async () => {
  return HttpResponse.json(fetchedProducts);
};

export const handlers = [
  http.get("/categories", categoriesResolver),
  http.get("/products", productsResolver),
];
