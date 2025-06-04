import type { AxiosResponse } from "axios";
import type { SearchRequest } from "../types";
import apiClient from "../plugins/apiClient";

export const searchService = {
  async findByText(data: SearchRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/search", data);
      if (res.status > 299) {
        throw new Error("Search failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
};
