import { defineStore } from "pinia";
import type { AxiosResponse } from "axios";
import type {
  Project,
  ProjectCalendarResponse,
  ProjectRequest,
} from "../types";
import { projectService } from "../services/projectService";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projectsCalendar: [] as ProjectCalendarResponse[],
    selectedProjectCalendar: null as ProjectCalendarResponse | null,
    projects: [] as Project[],
    selectedProject: null as Project | null,
  }),
  actions: {
    async createProject(data: ProjectRequest): Promise<AxiosResponse> {
      try {
        const response = await projectService.createProject(data);
        if (response.status > 299) throw new Error("Create project failed");
        return response;
      } catch (error) {
        throw error;
      }
    },
    async fetchProjectCalendarBetweenDates(startDate: string, endDate: string) {
      try {
        const response = await projectService.getProjectCalendarBetweenDates(
          startDate,
          endDate
        );
        this.projectsCalendar = response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
