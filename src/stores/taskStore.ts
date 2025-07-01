import { defineStore } from "pinia";
import type { AxiosResponse } from "axios";
import type { Task, TaskRequest } from "../types";
import { taskService } from "../services/taskService";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as Task[],
    selectedTask: null as Task | null,
    loading: false,
  }),

  getters: {
    todoTasks: (state) => state.tasks.filter((task) => task.status === "ToDo"),
    inProgressTasks: (state) =>
      state.tasks.filter((task) => task.status === "InProgress"),
    doneTasks: (state) => state.tasks.filter((task) => task.status === "Done"),
    pendingTasks: (state) =>
      state.tasks.filter((task) => task.status === "Pending"),

    tasksByProject: (state) => (projectId: string) =>
      state.tasks.filter((task) => task.project_id === projectId),

    tasksByPriority: (state) => (priority: string) =>
      state.tasks.filter((task) => task.priority === priority),
  },

  actions: {
    async createTask(data: TaskRequest): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await taskService.createTask(data);
        if (response.status > 299) throw new Error("Create task failed");

        // Afegir la nova tasca a l'estat local
        this.tasks.push(response.data);
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTask(id: string, data: TaskRequest): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await taskService.updateTask(id, data);
        if (response.status > 299) throw new Error("Update task failed");

        // Actualitzar la tasca en l'estat local
        const index = this.tasks.findIndex((task) => task.id === id);
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...data };
        }

        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTaskStatus(id: string, status: Task["status"]): Promise<void> {
      try {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) throw new Error("Task not found");

        // Actualització optimista
        const originalStatus = task.status;
        task.status = status;

        try {
          await taskService.updateTask(id, { ...task, status });
        } catch (error) {
          // Revertir en cas d'error
          task.status = originalStatus;
          throw error;
        }
      } catch (error) {
        throw error;
      }
    },

    async deleteTask(id: string): Promise<AxiosResponse> {
      try {
        this.loading = true;
        const response = await taskService.deleteTask(id);
        if (response.status > 299) throw new Error("Delete task failed");

        // Eliminar de l'estat local
        this.tasks = this.tasks.filter((task) => task.id !== id);

        // Netejar selectedTask si era la que s'ha eliminat
        if (this.selectedTask?.id === id) {
          this.selectedTask = null;
        }

        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTasks(): Promise<void> {
      try {
        this.loading = true;
        const response = await taskService.getAllTasks();
        if (response.status > 299) throw new Error("Fetch all tasks failed");
        this.tasks = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTaskById(id: string): Promise<void> {
      try {
        this.loading = true;
        const response = await taskService.getTaskById(id);
        if (response.status > 299) throw new Error("Fetch task by ID failed");
        this.selectedTask = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTasksByStatus(status: string): Promise<void> {
      try {
        this.loading = true;
        const response = await taskService.getTasksByStatus(status);
        if (response.status > 299) throw new Error("Fetch by status failed");
        this.tasks = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTasksByUserId(userId: string): Promise<void> {
      try {
        this.loading = true;
        const response = await taskService.getTasksByUserId(userId);
        if (response.status > 299) throw new Error("Fetch by user ID failed");
        this.tasks = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTasksByProjectId(projectId: string): Promise<void> {
      try {
        this.loading = true;
        const response = await taskService.getTasksByProjectId(projectId);
        if (response.status > 299)
          throw new Error("Fetch by project ID failed");
        this.tasks = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTasksByPriority(priority: string): Promise<void> {
      try {
        this.loading = true;
        const response = await taskService.getTasksByPriority(priority);
        if (response.status > 299) throw new Error("Fetch by priority failed");
        this.tasks = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Accions locals per gestionar l'estat
    setSelectedTask(task: Task | null) {
      this.selectedTask = task;
    },

    clearTasks() {
      this.tasks = [];
      this.selectedTask = null;
    },
  },
});
