import type { Axios, AxiosResponse } from "axios";
import type { CreateUserRequest } from "../types";
import authClient from "../plugins/authClient";
import apiClient from "../plugins/apiClient";

export const userService = {
  async createUser(data: CreateUserRequest): Promise<AxiosResponse> {
    try {
      const res = await authClient.post("/register", data);
      return res;
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  },
  async getUsers(): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get("/users");
      return res;
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  },
  async getUserById(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/users/${id}`);
      return res;
    } catch (error) {
      console.error("Get user by ID error:", error);
      throw error;
    }
  },
  async updateUser(
    id: string,
    data: CreateUserRequest
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/users/${id}`, data);
      return res;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },
  async deleteUser(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/users/${id}`);
      return res;
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  },
  async getUsersByGroupId(groupId: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/users/group/${groupId}`);
      return res;
    } catch (error) {
      console.error("Get users by group ID error:", error);
      throw error;
    }
  },
};
