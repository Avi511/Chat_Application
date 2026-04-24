import { useQuery } from "@tanstack/react-query";
import { conversationService } from "../services/conversationService";

export const useConversation = () => {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: () => conversationService.getConversations(),
        retry: false,
    });
};

export default useConversation;
