import { defineStore } from "pinia";
import type { AxiosResponse } from "axios";
import type {
  OperatorToProject,
  OperatorToProjectRequest,
  Project,
  ProjectCalendarResponse,
  ProjectRequest,
} from "../types";
import { projectService } from "../services/projectService";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projectsCalendar: [] as ProjectCalendarResponse[],
    operatorsCalendar: [] as ProjectCalendarResponse[],
    selectedProjectCalendar: null as ProjectCalendarResponse | null,
    projects: [] as Project[],
    selectedProject: null as Project | null,
    projectOperators: [] as OperatorToProject[],
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
    async updateProject(data: Project): Promise<AxiosResponse> {
      try {
        const response = await projectService.updateProject(data);
        if (response.status > 299) throw new Error("Create project failed");
        return response;
      } catch (error) {
        throw error;
      }
    },
    async deleteProject(id: string): Promise<AxiosResponse> {
      try {
        const response = await projectService.deleteProject(id);
        if (response.status > 299) throw new Error("Delete project failed");
        return response;
      } catch (error) {
        throw error;
      }
    },
    async fetchProjects() {
      try {
        const response = await projectService.getProjects();
        this.projects = response.data;
      } catch (error) {
        throw error;
      }
    },
    async fetchProjectById(id: string) {
      try {
        const response = await projectService.getProjectById(id);
        this.selectedProject = response.data;
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
    async AddOperatorToProject(
      request: OperatorToProjectRequest
    ): Promise<AxiosResponse> {
      try {
        const response = await projectService.addOperatorToProject(request);
        if (response.status > 299)
          throw new Error("Add operator to project failed");
        return response;
      } catch (error) {
        throw error;
      }
    },
    async RemoveOperatorFromProject(
      request: OperatorToProjectRequest
    ): Promise<AxiosResponse> {
      try {
        const response = await projectService.removeOperatorFromProject(
          request
        );
        if (response.status > 299)
          throw new Error("Remove operator from project failed");
        return response;
      } catch (error) {
        throw error;
      }
    },
    async fetchProjectOperators(projectId: string) {
      try {
        const response = await projectService.getOperatorsFromProject(
          projectId
        );
        if (response.data) {
          this.projectOperators = [...response.data];
        } else {
          this.projectOperators = [];
        }
      } catch (error) {
        throw error;
      }
    },
    async fetchOperatorsCalendarBetweenDates(
      startDate: string,
      endDate: string
    ) {
      try {
        const response = await projectService.getOperatorsCalendarBetweenDates(
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
