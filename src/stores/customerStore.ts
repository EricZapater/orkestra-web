import { defineStore } from "pinia";
import type { Customer, CustomerRequest } from "../types";
import { customerService } from "../services/customerService";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [] as Customer[],
    selectedCustomer: null as Customer | null,
  }),
  actions: {
    async createCustomer(data: CustomerRequest) {
      try {
        const response = await customerService.createCustomer(data);
        if (response.status > 299) throw new Error("Create customer failed");
        await this.fetchCustomers();
      } catch (error) {
        throw error;
      }
    },
    async updateCustomer(id: string, data: CustomerRequest) {
      try {
        const response = await customerService.updateCustomer(id, data);
        if (response.status > 299) throw new Error("Update customer failed");
        await this.fetchCustomers();
      } catch (error) {
        throw error;
      }
    },
    async deleteCustomer(id: string) {
      try {
        await customerService.deleteCustomer(id);
        await this.fetchCustomers();
      } catch (error) {
        throw error;
      }
    },
    async fetchCustomerById(id: string) {
      try {
        const response = await customerService.getCustomerById(id);
        this.selectedCustomer = response.data;
      } catch (error) {
        throw error;
      }
    },
    async fetchCustomers() {
      try {
        const response = await customerService.getCustomers();
        this.customers = response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
