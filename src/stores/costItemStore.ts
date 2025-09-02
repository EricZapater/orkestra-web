import { defineStore } from "pinia";
import type { CostItem, CostItemRequest } from "../types";
import type { AxiosResponse } from "axios";
import { costItemService } from "../services/costItemService";

export const useCostItemStore = defineStore("costitem", {
  state: () => ({
    costItems: [] as CostItem[],
    selectedCostItem: null as CostItem | null,
    loading: false,
  }),
  actions: {
    async create(data: CostItemRequest): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await costItemService.create(data);
        if (response.status > 299) throw new Error("Create cost item failed");
        this.costItems.push(response.data);
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(id: string, data: CostItemRequest): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await costItemService.update(id, data);
        if (response.status > 299) throw new Error("Update cost item failed");
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async delete(id: string): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await costItemService.delete(id);
        if (response.status > 299) throw new Error("Delete cost item failed");
        this.costItems = this.costItems.filter(
          (costItem) => costItem.id !== id
        );
        if (this.selectedCostItem?.id === id) {
          this.selectedCostItem = null;
        }
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchCostItems(): Promise<void> {
      try {
        this.loading = true;
        const response = await costItemService.getAll();
        if (response.status > 299)
          throw new Error("Fetch all cost items failed");
        this.costItems = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchCostItem(id: string): Promise<void> {
      try {
        this.loading = true;
        const response = await costItemService.getById(id);
        if (response.status > 299) throw new Error("Fetch cost item failed");
        this.selectedCostItem = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchCostItemsByProjectId(id: string): Promise<void> {
      try {
        this.loading = true;
        const response = await costItemService.getByProjectId(id);
        console.log(response);
        if (response.data) {
          this.costItems = [...response.data];
        } else {
          this.costItems = [];
        }

        if (response.status > 299)
          throw new Error("Fetch cost items by project id failed");
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
