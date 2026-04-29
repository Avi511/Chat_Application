import type React from "react";
import { EllipsisVertical, X } from "lucide-react";
import { useConversationStore } from "../../stores/conversationStore";

const ChatHeader: React.FC = () => {
    const { activeConversationId, conversations, setActiveConversation } = useConversationStore();
    const selectedConversation = conversations.find(c => c.conversationId === activeConversationId);

    if (!selectedConversation) return null;

    return <div className="p-4 border-b border-white/10 bg-slate-900 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
            <div className="relative">
                <img 
                    src={selectedConversation.friend.avatar || "https://avatar.iran.liara.run/public"} 
                    alt="User image" 
                    className="size-10 rounded-full object-cover border border-white/10" 
                />
                {selectedConversation.friend.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
            </div>
            <div>
                <h2 className="font-semibold text-white">{selectedConversation.friend.fullName || selectedConversation.friend.username}</h2>
                <p className={`text-xs ${selectedConversation.friend.online ? 'text-green-400' : 'text-slate-500'}`}>
                    {selectedConversation.friend.online ? 'Online' : 'Offline'}
                </p>
            </div>
        </div>
        <div className="flex space-x-4">
            <button className="text-slate-400 hover:text-white transition-colors cursor-pointer p-2 hover:bg-white/10 rounded-full">
                <EllipsisVertical className="size-5" />
            </button>
            <button onClick={() => setActiveConversation(null)} className="sm:hidden text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer p-2 hover:bg-white/10 rounded-full">
                <X className="size-5" />
            </button>
        </div>
    </div>
}

export default ChatHeader;