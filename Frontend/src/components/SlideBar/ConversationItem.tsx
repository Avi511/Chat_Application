import type React from "react";
import type { Conversation } from "../../context/ConversationContext";
import { useAuthStore } from "../../stores/authStore";
import { useConversationStore } from "../../stores/conversationStore";

const ConversationItem: React.FC<Conversation> = ({
    conversationId, friend, unreadCounts, lastMessage
}) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation } = useConversationStore();
    
    const isSelected = activeConversationId === conversationId;
    
    const totalUnread = user ? (unreadCounts[user.id] || 0) : 0;

    let displayTime = '';

    if (lastMessage?.timestamp) {
        const createdAt = new Date(lastMessage.timestamp);
        const now = new Date();

        const diffInMs = now.getTime() - createdAt.getTime();
        const diffInDays = diffInMs / (60 * 60 * 24 * 1000);

        const time = createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        const date = createdAt.toLocaleDateString([], {
            month: "short",
            day: "numeric",
        });

        displayTime = diffInDays >= 1 ? `${date} ${time}` : time;
    }

    return (
        <button
            onClick={() => {
                if (isSelected) {
                    setActiveConversation(null);
                } else {
                    setActiveConversation(conversationId);
                }
            }}
            className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
                isSelected 
                    ? "bg-[#e5f5ff]" 
                    : "bg-white hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            }`}
        >
            <div className="relative shrink-0">
                {friend.avatar ? (
                    <img
                        src={friend.avatar}
                        alt={friend.fullName || friend.username}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-lg text-indigo-600">
                        {(friend.fullName || friend.username || '?').charAt(0).toUpperCase()}
                    </div>
                )}
                {friend.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
            </div>

            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className={`text-sm font-semibold truncate ${isSelected ? "text-gray-900" : "text-gray-800"}`}>
                        {friend.fullName || friend.username}
                    </h3>
                    <span className={`text-[11px] whitespace-nowrap shrink-0 ${isSelected ? "text-blue-500 font-medium" : "text-gray-400"}`}>
                        {displayTime}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`text-[13px] truncate ${isSelected ? "text-gray-700" : "text-gray-500"}`}>
                        {lastMessage?.content || "Start a conversation..."}
                    </p>
                    {totalUnread > 0 && (
                        <div className="shrink-0 bg-[#00a8ff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {totalUnread > 99 ? '99+' : totalUnread}
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ConversationItem;