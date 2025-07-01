import type { AxiosResponse } from "axios";
import type { TaskRequest } from "../types";
import apiClient from "../plugins/apiClient";

export const taskService = {
  async createTask(data: TaskRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/tasks", data);
      if (res.status > 299) {
        throw new Error("Create task failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async updateTask(id: string, data: TaskRequest): Promise<AxiosResponse> {
    try {
      console.log("service ", id, "data ", data);
      const res = await apiClient.put(`/tasks/${id}`, data);
      if (res.status > 299) {
        throw new Error("update task failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async deleteTask(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/tasks/${id}`);
      if (res.status > 299) {
        throw new Error("delete task failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getTaskById(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/tasks/${id}`);
      if (res.status > 299) {
        throw new Error("Get task by ID failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },

  async getTasksByStatus(status: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/tasks/status/${status}`);
      if (res.status > 299) {
        throw new Error("Get tasks by status failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },

  async getTasksByUserId(userId: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/tasks/user/${userId}`);
      if (res.status > 299) {
        throw new Error("Get tasks by user ID failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },

  async getTasksByProjectId(projectId: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/tasks/project/${projectId}`);
      if (res.status > 299) {
        throw new Error("Get tasks by project ID failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },

  async getTasksByPriority(priority: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/tasks/priority/${priority}`);
      if (res.status > 299) {
        throw new Error("Get tasks by priority failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },

  async getAllTasks(): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get("/tasks");
      if (res.status > 299) {
        throw new Error("Get all tasks failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
};
