import type React from "react";
import { EllipsisVertical, X } from "lucide-react";
import { useConversationStore } from "../../stores/conversationStore";

const ChatHeader: React.FC = () => {
    const { activeConversationId, conversations, setActiveConversation } = useConversationStore();
    const selectedConversation = conversations.find(c => c.conversationId === activeConversationId);

    if (!selectedConversation) return null;

    return <div className="p-4 border-b border-gray-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="relative">
                <img 
                    src={selectedConversation.friend.avatar || "https://avatar.iran.liara.run/public"} 
                    alt="User image" 
                    className="size-10 rounded-full object-cover border border-slate-700" 
                />
                {selectedConversation.friend.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-slate-900 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                )}
            </div>
            <div>
                <h2 className="font-semibold text-slate-100">{selectedConversation.friend.name || selectedConversation.friend.username}</h2>
                <p className={`${selectedConversation.friend.online ? 'text-xs text-cyan-400' : 'text-xs text-slate-400'}`}>
                    {selectedConversation.friend.online ? 'Online' : 'Offline'}
                </p>
            </div>
        </div>
        <div className="flex space-x-4">
            <button className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
                <EllipsisVertical className="size-[18px]" />
            </button>
            <button onClick={() => setActiveConversation(null)} className="sm:hidden text-slate-400 hover:text-rose-400 transition-colors cursor-pointer">
                <X className="size-5" />
            </button>
        </div>
    </div>
}

export default ChatHeader;