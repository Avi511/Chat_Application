import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
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
                friendId: selectedConversation.friend.id,
            });
        }

    }, [data, activeConversationId, socket, user, selectedConversation])

    useMessageListen(activeConversationId || undefined, selectedConversation?.friend.id, containerRef);

    const { isTyping } = useTypingListen(
        selectedConversation?.friend.id,
        containerRef
    )

    if (isLoading) {
        return <div className="relative flex-1 h-full flex items-center justify-center bg-white">
            <Loader2 className="w-8 h-8 animate-spin text-[#00a8ff]" />
        </div>
    }

    return <div ref={containerRef} className="flex-1 bg-white overflow-y-auto p-4 pb-10">
        {hasNextPage && <div className="flex justify-center mb-6 mt-2">
            <button
                type="button"
                className="px-4 py-1.5 text-xs font-medium bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-all cursor-pointer flex items-center space-x-2"
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
            >
                {isFetchingNextPage ? (
                    <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00a8ff]" />
                        <span>Loading older messages...</span>
                    </>
                ) : (
                    <span>Load previous messages</span>
                )}
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