import apiClient from "../utils/apiClient";

export const conversationService = {
    async getConversations() {
        const response = await apiClient.get("/conversations");
        return response.data;
    },
    async checkConnectCode(connectCode: string) {
        const response = await apiClient.get(`/conversations/check-connect-code?connectCode=${connectCode}`);
        return response.data;
    },
    async getMessages(conversationId: string) {
        const response = await apiClient.get(`/conversations/${conversationId}/messages`);
        return response.data;
    }
}