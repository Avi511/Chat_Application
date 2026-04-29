import type React from "react";
import { EllipsisVertical, X } from "lucide-react";
import { useConversationStore } from "../../stores/conversationStore";

const ChatHeader: React.FC = () => {
    const { activeConversationId, conversations, setActiveConversation } = useConversationStore();
    const selectedConversation = conversations.find(c => c.conversationId === activeConversationId);

    if (!selectedConversation) return null;

    return <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
            <div className="relative">
                <img 
                    src={selectedConversation.friend.avatar || "https://avatar.iran.liara.run/public"} 
                    alt="User image" 
                    className="size-10 rounded-full object-cover border border-gray-100" 
                />
                {selectedConversation.friend.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
            </div>
            <div>
                <h2 className="font-semibold text-black">{selectedConversation.friend.fullName || selectedConversation.friend.username}</h2>
                <p className={`text-xs ${selectedConversation.friend.online ? 'text-green-500' : 'text-gray-500'}`}>
                    {selectedConversation.friend.online ? 'Online' : 'Offline'}
                </p>
            </div>
        </div>
        <div className="flex space-x-4">
            <button className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer p-2 hover:bg-gray-100 rounded-full">
                <EllipsisVertical className="size-5" />
            </button>
            <button onClick={() => setActiveConversation(null)} className="sm:hidden text-gray-500 hover:text-red-500 transition-colors cursor-pointer p-2 hover:bg-gray-100 rounded-full">
                <X className="size-5" />
            </button>
        </div>
    </div>
}

export default ChatHeader;