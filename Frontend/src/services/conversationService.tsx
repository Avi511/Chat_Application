import apiClient from "../utils/apiClient";

export const conversationService = {
    async getConversations() {
        const response = await apiClient.get("/conversations");
        return response.data;
    },
    async checkMobileNumber(mobileNumber: string) {
        const response = await apiClient.get(`/conversations/check-mobile-number?mobileNumber=${mobileNumber}`);
        return response.data;
    },
    async getMessages(conversationId: string) {
        const response = await apiClient.get(`/conversations/${conversationId}/messages`);
        return response.data;
    }
}