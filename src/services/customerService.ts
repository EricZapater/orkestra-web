import type { AxiosResponse } from "axios";
import type { CustomerRequest, UserCustomerRequest } from "../types";
import apiClient from "../plugins/apiClient";

export const customerService = {
  async createCustomer(data: CustomerRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/customers", data);
      if (res.status > 299) {
        throw new Error("Create customer failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async updateCustomer(
    id: string,
    data: CustomerRequest
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/customers/${id}`, data);
      if (res.status > 299) {
        throw new Error("Update customer failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async deleteCustomer(id: string): Promise<void> {
    try {
      const res = await apiClient.delete(`/customers/${id}`);
      if (res.status > 299) {
        throw new Error("Delete customer failed");
      }
    } catch (error) {
      throw error;
    }
  },

  async getCustomerById(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/customers/${id}`);
      if (res.status > 299) {
        throw new Error("Get customer by ID failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },

  async getCustomers(): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get("/customers");
      if (res.status > 299) {
        throw new Error("Get customers failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async addUserToCustomer(data: UserCustomerRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/customers/adduser", data);
      if (res.status > 299) {
        throw new Error("Add user to customer failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async removeUserToCustomer(
    data: UserCustomerRequest
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/customers/removeuser", data);
      if (res.status > 299) {
        throw new Error("Remove user from customer failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
};
