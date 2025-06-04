import type { AxiosResponse } from "axios";
import apiClient from "../plugins/apiClient";
import type { GroupRequest } from "../types";

export const groupService = {
  async createGroup(data: GroupRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/groups", data);
      if (res.status > 299) {
        throw new Error("Create group failed");
      }
      return res;
    } catch (error) {
      console.error("Create group error:", error);
      throw error;
    }
  },

  async updateGroup(id: string, data: GroupRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/groups/${id}`, data);
      if (res.status > 299) {
        throw new Error("Update group failed");
      }
      return res;
    } catch (error) {
      console.error("Update group error:", error);
      throw error;
    }
  },

  async deleteGroup(id: string): Promise<void> {
    try {
      const res = await apiClient.delete(`/groups/${id}`);
      if (res.status > 299) {
        throw new Error("Delete group failed");
      }
    } catch (error) {
      console.error("Delete group error:", error);
      throw error;
    }
  },

  async getGroupById(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/groups/${id}`);
      if (res.status > 299) {
        throw new Error("Get group by ID failed");
      }
      return res;
    } catch (error) {
      console.error("Get group by ID error:", error);
      throw error;
    }
  },

  async getGroups(): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get("/groups");
      if (res.status > 299) {
        throw new Error("Get groups failed");
      }
      return res;
    } catch (error) {
      console.error("Get groups error:", error);
      throw error;
    }
  },

  async getGroupsByUserId(userId: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/groups/user/${userId}`);
      if (res.status > 299) {
        throw new Error("Get groups by user ID failed");
      }
      return res;
    } catch (error) {
      console.error("Get groups by user ID error:", error);
      throw error;
    }
  },
  async addUserToGroup(
    groupId: string,
    userId: string
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/groups/${groupId}/users/${userId}`);
      if (res.status > 299) {
        throw new Error("Add user to group failed");
      }
      return res;
    } catch (error) {
      console.error("Add user to group error:", error);
      throw error;
    }
  },
  async removeUserFromGroup(
    groupId: string,
    userId: string
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/groups/${groupId}/users/${userId}`);
      if (res.status > 299) {
        throw new Error("Remove user from group failed");
      }
      return res;
    } catch (error) {
      console.error("Remove user from group error:", error);
      throw error;
    }
  },
};
