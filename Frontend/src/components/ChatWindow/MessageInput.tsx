import { Send } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useConversationStore } from "../../stores/conversationStore";
import { useSocket } from "../../context/SocketContext";
import { useRef, useState } from "react";

const MessageInput: React.FC = () => {
    const { user } = useAuthStore();
    const { activeConversationId, conversations } = useConversationStore();
    const { socket } = useSocket();
    const [message, setMessage] = useState('');

    const selectedConversation = conversations.find(c => c.conversationId === activeConversationId);

    const typingTimeoutRef = useRef<number | null>(null);
    const isTypingRef = useRef(false);

    const emitTyping = (isTyping: boolean) => {
        if (!socket || !user || !selectedConversation) return;

        socket.emit("conversation:typing", {
            userId: user.id,
            friendId: selectedConversation.friend.id,
            isTyping,
        });
        isTypingRef.current = isTyping;
    };

    if (!selectedConversation) return null;

    const handleSendMessage = () => {
        if (message.trim() === '' || !user || !socket) return;

        socket.emit("conversation:send-message", {
            conversationId: selectedConversation.conversationId,
            userId: user.id,
            friendId: selectedConversation.friend.id,
            content: message.trim(),
        });

        setMessage('');

        if (isTypingRef.current) {
            emitTyping(false);
        }
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        if (!isTypingRef.current) {
            emitTyping(true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = window.setTimeout(() => {
            emitTyping(false);
        }, 500);
    };


    return <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md z-10">
        <div className="flex items-center max-w-4xl mx-auto">
            <div className="flex-1 relative">
                <textarea
                    placeholder="Type a message..."
                    className="w-full text-[15px] bg-slate-800 text-white placeholder:text-slate-500 rounded-full py-3.5 px-5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none block overflow-hidden leading-[1.2rem] h-[44px]"
                    value={message}
                    onChange={(e) => handleOnChange(e)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
            </div>

            <div className="ml-3">
                <button
                    onClick={handleSendMessage}
                    type="button"
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full size-11 flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                    <Send className="size-[18px] ml-0.5" />
                </button>
            </div>
        </div>
    </div>
}

export default MessageInput;