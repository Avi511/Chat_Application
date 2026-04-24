import type React from "react";
import { Circle } from "lucide-react";
import type { Conversation } from "../../context/ConversationContext";

interface ConversationItemProps {
    conversation: Conversation;
    isActive?: boolean;
    onClick: (id: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onClick }) => {
    const formatTime = (timestamp: string) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInDays === 1) {
            return "Yesterday";
        } else if (diffInDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const totalUnread = Object.values(conversation.unreadCounts).reduce((acc, count) => acc + count, 0);

    return (
        <button
            onClick={() => onClick(conversation.conversationId)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all group relative border ${isActive
                    ? "bg-white/10 border-white/10 shadow-lg shadow-black/20"
                    : "hover:bg-white/5 border-transparent hover:border-white/5"
                }`}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                {conversation.friend.avatar ? (
                    <img
                        src={conversation.friend.avatar}
                        alt={conversation.friend.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/5"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-lg text-slate-300 border border-white/5">
                        {conversation.friend.name.charAt(0)}
                    </div>
                )}
                {conversation.friend.online && (
                    <Circle
                        size={12}
                        className="absolute -bottom-1 -right-1 fill-green-500 text-slate-950 stroke-[3px]"
                    />
                )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-semibold truncate transition-colors ${isActive ? "text-cyan-400" : "text-white group-hover:text-cyan-400"
                        }`}>
                        {conversation.friend.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium shrink-0">
                        {conversation.lastMessage ? formatTime(conversation.lastMessage.timestamp) : ""}
                    </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                    {conversation.lastMessage?.content || "No messages yet"}
                </p>
            </div>

            {/* Unread Badge */}
            {totalUnread > 0 && (
                <div className="shrink-0 w-5 h-5 bg-cyan-500 text-slate-950 text-[10px] font-bold rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    {totalUnread}
                </div>
            )}
        </button>
    );
};

export default ConversationItem;