import { defineStore } from "pinia";
import { userService } from "../services/userService";
import type { CreateUserRequest, UserResponse } from "../types";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as UserResponse | null,
    users: [] as UserResponse[],
    groupUsers: [] as UserResponse[],
  }),
  actions: {
    async createUser(data: CreateUserRequest) {
      try {
        const response = await userService.createUser(data);
        if (response.status > 299) {
          throw new Error("Create user failed");
        }
      } catch (error) {
        console.error("Create user error:", error);
        throw error;
      }
    },
    async fetchUsers() {
      try {
        const response = await userService.getUsers();
        this.users = response.data;
      } catch (error) {
        console.error("Fetch users error:", error);
        throw error;
      }
    },
    async fetchUserById(id: string) {
      try {
        const response = await userService.getUserById(id);
        this.user = response.data;
      } catch (error) {
        console.error("Fetch user by ID error:", error);
        throw error;
      }
    },
    async updateUser(id: string, data: CreateUserRequest) {
      try {
        const response = await userService.updateUser(id, data);
        if (response.status > 299) {
          throw new Error("Update user failed");
        }
        await this.fetchUsers();
      } catch (error) {
        console.error("Update user error:", error);
        throw error;
      }
    },
    async deleteUser(id: string) {
      try {
        await userService.deleteUser(id);
        await this.fetchUsers();
      } catch (error) {
        console.error("Delete user error:", error);
        throw error;
      }
    },
    async fetchUsersByGroupId(groupId: string) {
      try {
        const response = await userService.getUsersByGroupId(groupId);
        this.groupUsers = response.data;
      } catch (error) {
        console.error("Fetch users by group ID error:", error);
        throw error;
      }
    },
  },
});
