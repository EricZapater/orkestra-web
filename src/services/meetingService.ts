import type { AxiosResponse } from "axios";
import apiClient from "../plugins/apiClient";
import type {
  MeetingParticipantRequest,
  MeetingRequest,
  MeetingTopicAgreementRequest,
  MeetingTopicsRequest,
} from "../types";

export const meetingService = {
  async createMeeting(data: MeetingRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/meetings", data);
      if (res.status > 299) {
        throw new Error("Create meeting failed");
      }
      return res;
    } catch (error) {
      console.error("Create meeting error:", error);
      throw error;
    }
  },
  async updateMeeting(
    id: string,
    data: MeetingRequest
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/meetings/${id}`, data);
      if (res.status > 299) {
        throw new Error("Update meeting failed");
      }
      return res;
    } catch (error) {
      console.error("Update meeting error:", error);
      throw error;
    }
  },
  async deleteMeeting(id: string): Promise<void> {
    try {
      const res = await apiClient.delete(`/meetings/${id}`);
      if (res.status > 299) {
        throw new Error("Delete meeting failed");
      }
    } catch (error) {
      console.error("Delete meeting error:", error);
      throw error;
    }
  },
  async getMeetingById(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/meetings/${id}`);
      if (res.status > 299) {
        throw new Error("Get meeting by ID failed");
      }
      return res;
    } catch (error) {
      console.error("Get meeting by ID error:", error);
      throw error;
    }
  },
  async getMeetingsByGroupId(groupId: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(`/meetings/group/${groupId}`);
      if (res.status > 299) {
        throw new Error("Get meetings by group ID failed");
      }
      return res;
    } catch (error) {
      console.error("Get meetings by group ID error:", error);
      throw error;
    }
  },
  async getMeetingsBetweenDates(
    groupId: string,
    startDate: string,
    endDate: string
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.get(
        `/meetings/dates?start_date=${startDate}&end_date=${endDate}&group_id=${groupId}`
      );
      if (res.status > 299) {
        throw new Error("Get meetings between dates failed");
      }
      return res;
    } catch (error) {
      console.error("Get meetings between dates error:", error);
      throw error;
    }
  },
  async addParticipantToMeeting(
    data: MeetingParticipantRequest
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/meetings/participants", data);
      if (res.status > 299) {
        throw new Error("Add participant to meeting failed");
      }
      return res;
    } catch (error) {
      console.error("Add participant to meeting error:", error);
      throw error;
    }
  },
  async removeParticipantFromMeeting(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/meetings/participants/${id}`);
      if (res.status > 299) {
        throw new Error("Remove participant from meeting failed");
      }
      return res;
    } catch (error) {
      console.error("Remove participant from meeting error:", error);
      throw error;
    }
  },
  async addTopicToMeeting(data: MeetingTopicsRequest): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/meetings/topics", data);
      if (res.status > 299) {
        throw new Error("Add topic to meeting failed");
      }
      return res;
    } catch (error) {
      console.error("Add topic to meeting error:", error);
      throw error;
    }
  },
  async removeTopicFromMeeting(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/meetings/topics/${id}`);
      if (res.status > 299) {
        throw new Error("Remove topic from meeting failed");
      }
      return res;
    } catch (error) {
      console.error("Remove topic from meeting error:", error);
      throw error;
    }
  },
  async addTopicAgreementToMeeting(
    data: MeetingTopicAgreementRequest
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.post("/meetings/topic-agreements", data);
      if (res.status > 299) {
        throw new Error("Add topic agreement to meeting failed");
      }
      return res;
    } catch (error) {
      console.error("Add topic agreement to meeting error:", error);
      throw error;
    }
  },
  async removeTopicAgreementFromMeeting(id: string): Promise<AxiosResponse> {
    try {
      const res = await apiClient.delete(`/meetings/topic-agreements/${id}`);
      if (res.status > 299) {
        throw new Error("Remove topic agreement from meeting failed");
      }
      return res;
    } catch (error) {
      console.error("Remove topic agreement from meeting error:", error);
      throw error;
    }
  },
  async updateTopicAgreement(
    data: MeetingTopicAgreementRequest,
    id: string
  ): Promise<AxiosResponse> {
    try {
      const res = await apiClient.put(`/meetings/topic-agreements/${id}`, data);
      if (res.status > 299) {
        throw new Error("Update topic agreement failed");
      }
      return res;
    } catch (error) {
      console.error("Update topic agreement error:", error);
      throw error;
    }
  },
};
