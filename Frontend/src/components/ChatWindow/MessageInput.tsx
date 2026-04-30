import { Send } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useConversationStore } from "../../stores/conversationStore";
import { useSocket } from "../../context/SocketContext";
import { useRef, useState } from "react";
import { CryptoUtils } from "../../utils/crypto";

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

    const handleSendMessage = async () => {
        if (message.trim() === '' || !user || !socket || !selectedConversation) return;

        try {
            let payload: any = {
                conversationId: selectedConversation.conversationId,
                userId: user.id,
                friendId: selectedConversation.friend.id,
                content: message.trim(),
            };

            // E2EE Encryption
            if (user.publicKey && selectedConversation.friend.publicKey) {
                const senderPubKey = await CryptoUtils.importPublicKey(user.publicKey);
                const recipientPubKey = await CryptoUtils.importPublicKey(selectedConversation.friend.publicKey);
                
                const encrypted = await CryptoUtils.encryptMessage(
                    message.trim(),
                    recipientPubKey,
                    senderPubKey
                );

                payload.content = encrypted.content;
                payload.senderKey = encrypted.senderKey;
                payload.recipientKey = encrypted.recipientKey;
                payload.isEncrypted = true;
            } else {
                console.warn("E2EE keys missing:", { 
                    myKey: !!user.publicKey, 
                    friendKey: !!selectedConversation.friend.publicKey 
                }, "sending in plaintext...");
                // Note: For strict E2EE, we might want to block plaintext sending
            }

            socket.emit("conversation:send-message", payload);

            setMessage('');

            if (isTypingRef.current) {
                emitTyping(false);
            }
        } catch (error) {
            console.error("Failed to encrypt/send message:", error);
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


    return <div className="p-3 md:p-4 border-t border-white/10 bg-white/5 backdrop-blur-md z-10">
        <div className="flex items-center max-w-4xl mx-auto gap-2 md:gap-3">
            <div className="flex-1 relative">
                <textarea
                    placeholder="Type a message..."
                    className="w-full text-[15px] bg-slate-800 text-white placeholder:text-slate-500 rounded-2xl md:rounded-full py-3 px-4 md:px-5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none block overflow-hidden leading-[1.2rem] h-[44px]"
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

            <div className="shrink-0">
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