import type { AxiosResponse } from "axios";
import apiClient from "../plugins/apiClient";
import type { CostItem, CostItemRequest } from "../types";

export const costItemService = {
  async create(data: CostItemRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/projects/costitems", data);
      if (res.status > 299) {
        throw new Error("Create CostItem failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async delete(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/projects/costitems/${id}`);
      if (res.status > 299) {
        throw new Error("Delete CostItem failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getByProjectId(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/projects/costitems/project/${id}`);
      if (res.status > 299) {
        throw new Error("Get CostItem By Project ID failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
};
