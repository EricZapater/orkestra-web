import type { MenuRequest, MenuToProfileRequest } from "../types";
import type { AxiosResponse } from "axios";
import apiClient from "../plugins/apiClient";

export const menuService = {
  async create(data: MenuRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/menus", data);
      if (res.status > 299) {
        throw new Error("Create Menu failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async update(id: string, data: MenuRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/menus/${id}`, data);
      if (res.status > 299) {
        throw new Error("Update Menu failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async delete(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/menus/${id}`);
      if (res.status > 299) {
        throw new Error("Delete Menu failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getByID(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/menus/${id}`);
      if (res.status > 299) {
        throw new Error("Get Menu by ID failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getAll(): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/menus`);
      if (res.status > 299) {
        throw new Error("Get all Menu failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getByProfileID(profile_id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/menus/profile/${profile_id}`);
      if (res.status > 299) {
        throw new Error("Get Menu by profile -ID failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async addToProfile(request: MenuToProfileRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post(`/menus/addprofile`, request);
      if (res.status > 299) {
        throw new Error("Add menu to profile failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async removeFromProfile(
    request: MenuToProfileRequest
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post(`/menus/removeprofile`, request);
      if (res.status > 299) {
        throw new Error("Remove menu from profile failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
};
