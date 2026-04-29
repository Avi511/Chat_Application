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
                    ? "bg-cyan-500/20 border-l-4 border-cyan-400" 
                    : "bg-transparent hover:bg-white/5 border-b border-white/5 last:border-b-0 border-l-4 border-transparent"
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
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg text-cyan-400 border border-white/10">
                        {(friend.fullName || friend.username || '?').charAt(0).toUpperCase()}
                    </div>
                )}
                {friend.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
            </div>

            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className={`text-sm font-semibold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {friend.fullName || friend.username}
                    </h3>
                    <span className={`text-[11px] whitespace-nowrap shrink-0 ${isSelected ? "text-cyan-400 font-medium" : "text-slate-500"}`}>
                        {displayTime}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`text-[13px] truncate ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                        {lastMessage?.content || "Start a conversation..."}
                    </p>
                    {totalUnread > 0 && (
                        <div className="shrink-0 bg-cyan-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            {totalUnread > 99 ? '99+' : totalUnread}
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ConversationItem;