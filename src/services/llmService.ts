import apiClient from "../plugins/apiClient";
import type { AxiosResponse } from "axios";
import type { LLMRequest } from "../types";

export const llmService = {
  async query(data: LLMRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/llm/query", data);
      if (res.status > 299) {
        throw new Error("LLM query failed");
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
};
