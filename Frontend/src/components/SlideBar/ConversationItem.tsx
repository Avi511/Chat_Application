import type { Conversation } from "../../context/ConversationContext";
import type React from "react";

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: (conversationId: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onClick }) => {
    const { friend, lastMessage, unreadCounts, conversationId } = conversation;

    const formatTime = (timestamp: string) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } else if (diffInDays === 1) {
            return "Yesterday";
        } else if (diffInDays < 7) {
            return date.toLocaleDateString([], { weekday: "short" });
        } else {
            return date.toLocaleDateString([], { month: "short", day: "numeric" });
        }
    };

    const totalUnread = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);

    return (
        <button
            onClick={() => onClick(conversationId)}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group relative border ${isActive
                    ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 shadow-[0_8px_32px_0_rgba(0,255,255,0.1)] backdrop-blur-md"
                    : "hover:bg-white/5 border-transparent hover:border-white/5"
                }`}
        >
            {/* Active Indicator Bar */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
            )}

            {/* Avatar Section */}
            <div className="relative shrink-0">
                <div
                    className={`p-0.5 rounded-2xl transition-all duration-500 ${isActive ? "bg-gradient-to-tr from-cyan-500 to-blue-500" : "bg-transparent group-hover:bg-white/10"
                        }`}
                >
                    {friend.avatar ? (
                        <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-12 h-12 rounded-[14px] object-cover border-2 border-slate-900"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-bold text-lg text-slate-300 border-2 border-slate-900">
                            {friend.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Online Status */}
                {friend.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-slate-950 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                    <h3
                        className={`text-sm font-bold truncate transition-colors duration-300 ${isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                            }`}
                    >
                        {friend.name}
                    </h3>
                    <span
                        className={`text-[10px] font-medium shrink-0 transition-colors duration-300 ${isActive ? "text-cyan-400/80" : "text-slate-500 group-hover:text-slate-400"
                            }`}
                    >
                        {lastMessage ? formatTime(lastMessage.timestamp) : ""}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                        className={`text-xs truncate transition-colors duration-300 ${isActive ? "text-slate-300" : "text-slate-500 group-hover:text-slate-400"
                            }`}
                    >
                        {lastMessage?.content || "Start a conversation"}
                    </p>

                    {/* Unread Badge */}
                    {totalUnread > 0 && (
                        <div className="shrink-0 min-w-[18px] h-[18px] px-1 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-in zoom-in duration-300">
                            {totalUnread}
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ConversationItem;