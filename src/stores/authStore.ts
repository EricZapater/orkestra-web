import { defineStore } from "pinia";
import { type UserResponse } from "../types";
import { authService } from "../services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as UserResponse | null,
    expire: null as Date | null,
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await authService.login(username, password);
        if (response.status !== 200) {
          throw new Error("Login failed");
        }
        this.token = response.data.token;
        this.user = response.data.user;
        this.expire = new Date(response.data.expire);
        localStorage.setItem("orkestra.token", this.token?.toString() || "");
        localStorage.setItem("orkestra.user", JSON.stringify(this.user));
        localStorage.setItem("orkestra.expire", this.expire?.toString() || "");
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    async logout() {
      try {
        this.token = null;
        this.user = null;
        localStorage.removeItem("orkestra.token");
        localStorage.removeItem("orkestra.user");
        localStorage.removeItem("orkestra.expire");
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    },
  },
});
