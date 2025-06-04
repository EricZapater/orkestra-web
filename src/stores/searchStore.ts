import { defineStore } from "pinia";
import type { SearchResponse, SearchRequest } from "../types";
import { searchService } from "../services/searchService";

export const useSearchStore = defineStore("search", {
  state: () => ({
    results: [] as SearchResponse[],
  }),
  actions: {
    async findByText(data: SearchRequest) {
      try {
        const response = await searchService.findByText(data);
        this.results = response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
