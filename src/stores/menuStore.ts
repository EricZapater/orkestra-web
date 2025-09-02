import { defineStore } from "pinia";
import type { Menu, MenuRequest, MenuToProfileRequest } from "../types";
import { menuService } from "../services/menuService";
export const useMenuStore = defineStore("menu", {
  state: () => ({
    menus: [] as Menu[],
    selectedMenu: null as Menu | null,
  }),
  actions: {
    async create(data: MenuRequest) {
      try {
        const response = await menuService.create(data);
        if (response.status > 299) throw new Error("Create menu failed");
        await this.fetchAll();
      } catch (error) {
        throw error;
      }
    },
    async update(id: string, data: MenuRequest) {
      try {
        const response = await menuService.update(id, data);
        if (response.status > 299) throw new Error("Update menu failed");
        await this.fetchAll();
      } catch (error) {
        throw error;
      }
    },
    async delete(id: string) {
      try {
        const response = await menuService.delete(id);
        if (response.status > 299) throw new Error("Delete menu failed");
        await this.fetchAll();
      } catch (error) {
        throw error;
      }
    },
    async fetchByID(id: string) {
      try {
        const response = await menuService.getByID(id);
        if (response.status > 299) throw new Error("fetch by id failed");
        this.selectedMenu = response.data;
      } catch (error) {
        throw error;
      }
    },
    async fetchAll() {
      try {
        const response = await menuService.getAll();
        if (response.status > 299) throw new Error("Fetch all menu failed");
        this.menus = response.data;
      } catch (error) {
        throw error;
      }
    },
    async fetchByProfileID(id: string) {
      try {
        const response = await menuService.getByProfileID(id);
        if (response.status > 299)
          throw new Error("Fetch by profile id failed");
        this.menus = response.data;
      } catch (error) {
        throw error;
      }
    },
    async addToProfile(request: MenuToProfileRequest) {
      try {
        const response = await menuService.addToProfile(request);
        if (response.status > 299)
          throw new Error("Add menu to profile failed");
        await this.fetchByProfileID(request.ProfileID);
      } catch (error) {
        throw error;
      }
    },
    async removeFromProfile(request: MenuToProfileRequest) {
      try {
        const response = await menuService.removeFromProfile(request);
        if (response.status > 299)
          throw new Error("Remove menu from profile failed");
        await this.fetchByProfileID(request.ProfileID);
      } catch (error) {
        throw error;
      }
    },
  },
});
