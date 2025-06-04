// stores/groupStore.ts
import { defineStore } from "pinia";
import { groupService } from "../services/groupService";
import type { GroupRequest, GroupResponse } from "../types";

export const useGroupStore = defineStore("group", {
  state: () => ({
    groups: [] as GroupResponse[],
    selectedGroup: null as GroupResponse | null,
  }),

  actions: {
    async fetchGroups() {
      try {
        const response = await groupService.getGroups();
        this.groups = response.data;
      } catch (error) {
        console.error("Fetch groups error:", error);
        throw error;
      }
    },

    async fetchGroupById(id: string) {
      try {
        const response = await groupService.getGroupById(id);
        this.selectedGroup = response.data;
      } catch (error) {
        console.error("Fetch group by ID error:", error);
        throw error;
      }
    },

    async createGroup(data: GroupRequest) {
      try {
        const response = await groupService.createGroup(data);
        if (response.status > 299) throw new Error("Create group failed");
        await this.fetchGroups();
      } catch (error) {
        console.error("Create group error:", error);
        throw error;
      }
    },

    async updateGroup(id: string, data: GroupRequest) {
      try {
        const response = await groupService.updateGroup(id, data);
        if (response.status > 299) throw new Error("Update group failed");
        await this.fetchGroups();
      } catch (error) {
        console.error("Update group error:", error);
        throw error;
      }
    },

    async deleteGroup(id: string) {
      try {
        await groupService.deleteGroup(id);
        await this.fetchGroups();
      } catch (error) {
        console.error("Delete group error:", error);
        throw error;
      }
    },

    async fetchGroupsByUserId(userId: string) {
      try {
        const response = await groupService.getGroupsByUserId(userId);
        return response.data;
      } catch (error) {
        console.error("Fetch groups by user ID error:", error);
        throw error;
      }
    },

    async addUserToGroup(groupId: string, userId: string) {
      try {
        const response = await groupService.addUserToGroup(groupId, userId);
        if (response.status > 299) throw new Error("Add user to group failed");
      } catch (error) {
        console.error("Add user to group error:", error);
        throw error;
      }
    },
    async addUsersToGroup(groupId: string, usersId: string[]) {
      try {
        console.log(usersId);
        const userPromises = usersId.map((userId) =>
          groupService.addUserToGroup(groupId, userId)
        );
        const responses = await Promise.all(userPromises);
        responses.forEach((response) => {
          if (response.status > 299)
            throw new Error("Add user to group failed");
        });
      } catch (error) {
        console.error("Add user to group error:", error);
        throw error;
      }
    },

    async removeUserFromGroup(groupId: string, userId: string) {
      try {
        const response = await groupService.removeUserFromGroup(
          groupId,
          userId
        );
        if (response.status > 299)
          throw new Error("Remove user from group failed");
      } catch (error) {
        console.error("Remove user from group error:", error);
        throw error;
      }
    },
  },
});
