import type { AxiosResponse } from "axios";
import { type LoginResponse } from "../types";
import authClient from "../plugins/authClient";

export const authService = {
  async login(username: string, password: string): Promise<AxiosResponse> {
    try {
      const res = await authClient.post<LoginResponse>("/login", {
        username,
        password,
      });
      return res;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
};
