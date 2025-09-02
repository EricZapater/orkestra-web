import apiClient from "../plugins/apiClient";
import type { AxiosResponse } from "axios";
import type { OperatorRequest } from "../types";

export const operatorService = {
  async create(data: OperatorRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/operators", data);
      if (res.status > 299) {
        throw new Error("Create operator failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async update(id: string, data: OperatorRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/operators/${id}`, data);
      if (res.status > 299) {
        throw new Error("Update operator failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async delete(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/operators/${id}`);
      if (res.status > 299) {
        throw new Error("Delete operator failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getById(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/operators/${id}`);
      if (res.status > 299) {
        throw new Error("Get operator by ID failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getAll(): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get("/operators");
      if (res.status > 299) {
        throw new Error("Get operators failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
};
