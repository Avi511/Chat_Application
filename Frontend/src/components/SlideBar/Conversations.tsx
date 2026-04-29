import { Loader2, AlertCircle } from "lucide-react";
import { useConversationContext } from "../../context/ConversationContext";
import ConversationItem from "./ConversationItem";

const Conversations = () => {
    const {
        filteredConversations,
        isLoading,
        isError,
        activeConversationId,
        setActiveConversationId
    } = useConversationContext();

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                <p className="text-sm font-medium">Loading conversations...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center text-slate-500">
                <AlertCircle className="w-8 h-8 text-rose-500/50" />
                <p className="text-sm font-medium text-rose-500/80">Failed to load conversations</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (filteredConversations.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
                <p className="text-sm font-medium text-slate-500">No conversations found</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10">
            <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">Recent Chats</p>

            {filteredConversations.map((conv) => (
                <ConversationItem
                    key={conv.conversationId}
                    {...conv}
                />
            ))}
        </div>
    );
};

export default Conversations;
//2.53.22 iwara
