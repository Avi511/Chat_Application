import { Loader2, AlertCircle } from "lucide-react";
import { useConversationContext } from "../../context/ConversationContext";
import ConversationItem from "./ConversationItem";

const Conversations = () => {
    const {
        filteredConversations,
        isLoading,
        isError,
    } = useConversationContext();

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-sm font-medium">Loading conversations...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center text-gray-500">
                <AlertCircle className="w-8 h-8 text-red-500/50" />
                <p className="text-sm font-medium text-red-500/80">Failed to load conversations</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors underline underline-offset-4"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (filteredConversations.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
                <p className="text-sm font-medium">No conversations found</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
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
