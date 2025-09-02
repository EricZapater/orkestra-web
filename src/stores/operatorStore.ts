import { defineStore } from "pinia";
import type { Operator, OperatorRequest } from "../types";
import type { Axios, AxiosResponse } from "axios";
import { operatorService } from "../services/operatorService";

export const useOperatorStore = defineStore("operator", {
  state: () => ({
    selectedOperator: null as Operator | null,
    operators: [] as Operator[],
    loading: false,
  }),
  actions: {
    async create(data: OperatorRequest): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await operatorService.create(data);
        if (response.status > 299) throw new Error("Create operator failed");
        await this.fetchAll();
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(id: string, data: OperatorRequest): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await operatorService.update(id, data);
        if (response.status > 299) throw new Error("Update operator failed");
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
        const response = await operatorService.delete(id);
        if (response.status > 299) throw new Error("Delete operator failed");
        this.operators = this.operators.filter(
          (operator) => operator.id !== id
        );
        if (this.selectedOperator?.id === id) {
          this.selectedOperator = null;
        }
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchById(id: string): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await operatorService.getById(id);
        if (response.status > 299) throw new Error("Get operator by ID failed");
        this.selectedOperator = response.data;
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchAll(): Promise<void> {
      try {
        this.loading = true;
        const response = await operatorService.getAll();
        if (response.status > 299) throw new Error("Get operators failed");
        this.operators = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
