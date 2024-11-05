import { delay, http, HttpResponse } from "msw";
import { SetupServerApi } from "msw/node";

export const addServerDelay = (server: SetupServerApi, url: string = "*") => {
  server.use(
    http.get(url, async () => {
      await delay("infinite");
    })
  );
};

export const addNetworkError = (server: SetupServerApi, url: string = "*") => {
  server.use(
    http.get(url, async () => {
      return HttpResponse.error();
    })
  );
};

export const returnEmptyProducts = (server: SetupServerApi) => {
  server.use(
    http.get("/products", async () => {
      return HttpResponse.json([]);
    })
  );
};
