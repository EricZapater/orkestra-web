import type { AxiosResponse } from "axios";
import type { ProjectRequest } from "../types";
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
