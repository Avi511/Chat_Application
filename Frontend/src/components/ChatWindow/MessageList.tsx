import { useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages";
import { useConversationStore } from "../../stores/conversationStore";
import MessageItem from "./MessageItem";
import { useAuthStore } from "../../stores/authStore";
import { useSocket } from "../../context/SocketContext";
import { useMessageListen } from "../../hooks/useMessageListen";
import { useTypingListen } from "../../hooks/useTypingListen";
import TypingIndicator from "./TypingIndicator";

const MessageList: React.FC = () => {
    const { activeConversationId, conversations } = useConversationStore();
    const { user } = useAuthStore();
    const containerRef = useRef<HTMLDivElement | null>(null);
    
    const selectedConversation = conversations.find(c => c.conversationId === activeConversationId);
    
    const {
        data,
        isLoading,
        handleLoadMore,
        isFetchingNextPage,
        hasNextPage
    } = useMessages(activeConversationId || undefined, containerRef);
    const { socket } = useSocket();
    const previousConversationIdRef = useRef<string | null>(null);

    const allMessages = data?.pages.slice().reverse().flatMap((page) => page.messages) ?? [];

    useEffect(() => {
        if (!activeConversationId) return;

        if (data?.pages.length && previousConversationIdRef.current !== activeConversationId) {
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            }, 0)

            previousConversationIdRef.current = activeConversationId;
        }

        if (selectedConversation && user) {
            socket?.emit("conversation:mark-as-read", {
                conversationId: activeConversationId,
                userId: user.id,
                friendId: selectedConversation.friend._id,
            });
        }

    }, [data, activeConversationId, socket, user, selectedConversation])

    useMessageListen(activeConversationId || undefined, selectedConversation?.friend._id, containerRef);

    const { isTyping } = useTypingListen(
        selectedConversation?.friend._id,
        containerRef
    )

    if (isLoading) {
        return <div className="relative flex-1 h-full flex items-center justify-center">
            <div className="size-10 bg-sky-100 rounded-full animate-pulse"></div>
        </div>
    }

    return <div ref={containerRef} className="flex-1 bg-gray-50 overflow-y-auto p-4 pb-10">
        {hasNextPage && <div className="flex justify-center mb-4">
            <button
                type="button"
                className="px-2 py-1 text-xs bg-gray-300 text-white rounded-lg
                    hover:bg-gray-400 transition-colors cursor-pointer
                "
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
            >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
        </div>}

        {allMessages.map((message: any) => (
            <div key={message._id || message.messageId}>
                <MessageItem {...message} />
            </div>
        ))}

        {isTyping && <TypingIndicator />}
    </div>
}

export default MessageList;