import type { AxiosResponse } from "axios";
import type { ProjectRequest, Project } from "../types";
import apiClient from "../plugins/apiClient";

export const projectService = {
  async createProject(data: ProjectRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/projects", data);
      if (res.status > 299) {
        throw new Error("Create project failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  async updateProject(data: Project): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/projects/${data.id}`, data);
      return res;
    } catch (error) {
      throw error;
    }
  },
  async deleteProject(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/projects/${id}`);
      if (res.status > 299) {
        throw new Error("Delete project failed");
      }
      return res;
    } catch (error) {
      console.error("Delete project error:", error);
      throw error;
    }
  },
  async getProjects(): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get("/projects");
      return res;
    } catch (error) {
      console.error("Get projects error:", error);
      throw error;
    }
  },
  async getProjectById(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/projects/${id}`);
      return res;
    } catch (error) {
      console.error("Get projects error:", error);
      throw error;
    }
  },
  async getProjectCalendarBetweenDates(
    startDate: string,
    endDate: string
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(
        `/projects/calendar/dates?start_date=${startDate}&end_date=${endDate}`
      );
      if (res.status > 299) {
        throw new Error("Get project calendar failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
};
