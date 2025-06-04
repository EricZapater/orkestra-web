import { defineStore } from "pinia";
import { meetingService } from "../services/meetingService";
import type { AxiosResponse } from "axios";
import type {
  MeetingRequest,
  MeetingResponse,
  MeetingSummaryResponse,
} from "../types";
import type {
  MeetingParticipantRequest,
  MeetingTopicAgreementRequest,
  MeetingTopicsRequest,
} from "../types";

export const useMeetingStore = defineStore("meeting", {
  state: () => ({
    meetings: [] as MeetingSummaryResponse[],
    selectedMeeting: null as MeetingResponse | null,
  }),

  actions: {
    async createMeeting(data: MeetingRequest): Promise<AxiosResponse> {
      try {
        const response = await meetingService.createMeeting(data);
        if (response.status > 299) throw new Error("Create meeting failed");
        return response;
      } catch (error) {
        console.error("Create meeting error:", error);
        throw error;
      }
    },
    async updateMeeting(id: string, data: MeetingRequest) {
      try {
        const response = await meetingService.updateMeeting(id, data);
        if (response.status > 299) throw new Error("Update meeting failed");
      } catch (error) {
        console.error("Update meeting error:", error);
        throw error;
      }
    },
    async deleteMeeting(id: string) {
      try {
        await meetingService.deleteMeeting(id);
      } catch (error) {
        console.error("Delete meeting error:", error);
        throw error;
      }
    },
    async fectchMeetingById(id: string) {
      try {
        const response = await meetingService.getMeetingById(id);
        this.selectedMeeting = response.data;
      } catch (error) {
        console.error("Fetch meeting by ID error:", error);
        throw error;
      }
    },
    async fetchMeetingsByGroupId(groupId: string) {
      try {
        const response = await meetingService.getMeetingsByGroupId(groupId);
        this.meetings = response.data;
      } catch (error) {
        console.error("Fetch meetings by group ID error:", error);
        throw error;
      }
    },
    async fetchMeetingsBetweenDates(
      groupId: string,
      startDate: string,
      endDate: string
    ) {
      try {
        const response = await meetingService.getMeetingsBetweenDates(
          groupId,
          startDate,
          endDate
        );
        this.meetings = response.data;
      } catch (error) {
        console.error("Fetch meetings between dates error:", error);
        throw error;
      }
    },
    async addParticipantToMeeting(data: MeetingParticipantRequest) {
      try {
        const response = await meetingService.addParticipantToMeeting(data);
        if (response.status > 299)
          throw new Error("Add participant to meeting failed");
      } catch (error) {
        console.error("Add participant to meeting error:", error);
        throw error;
      }
    },
    async removeParticipantFromMeeting(id: string) {
      try {
        const response = await meetingService.removeParticipantFromMeeting(id);
        if (response.status > 299)
          throw new Error("Remove participant from meeting failed");
      } catch (error) {
        console.error("Remove participant from meeting error:", error);
        throw error;
      }
    },
    async addTopicToMeeting(data: MeetingTopicsRequest) {
      try {
        const response = await meetingService.addTopicToMeeting(data);
        if (response.status > 299)
          throw new Error("Add topic to meeting failed");
      } catch (error) {
        console.error("Add topic to meeting error:", error);
        throw error;
      }
    },
    async removeTopicFromMeeting(id: string) {
      try {
        const response = await meetingService.removeTopicFromMeeting(id);
        if (response.status > 299)
          throw new Error("Remove topic from meeting failed");
      } catch (error) {
        console.error("Remove topic from meeting error:", error);
        throw error;
      }
    },
    async addTopicAgreementToMeeting(data: MeetingTopicAgreementRequest) {
      try {
        const response = await meetingService.addTopicAgreementToMeeting(data);
        if (response.status > 299)
          throw new Error("Add topic agreement to meeting failed");
      } catch (error) {
        console.error("Add topic agreement to meeting error:", error);
        throw error;
      }
    },
    async removeTopicAgreementFromMeeting(id: string) {
      try {
        const response = await meetingService.removeTopicAgreementFromMeeting(
          id
        );
        if (response.status > 299)
          throw new Error("Remove topic agreement from meeting failed");
      } catch (error) {
        console.error("Remove topic agreement from meeting error:", error);
        throw error;
      }
    },
    async updateTopicAgreementFromMeeting(
      data: MeetingTopicAgreementRequest,
      id: string
    ) {
      try {
        const response = await meetingService.updateTopicAgreement(data, id);
        if (response.status > 299)
          throw new Error("Update topic agreement to meeting failed");
      } catch (error) {
        console.error("Update topic agreement to meeting error:", error);
        throw error;
      }
    },
  },
});
