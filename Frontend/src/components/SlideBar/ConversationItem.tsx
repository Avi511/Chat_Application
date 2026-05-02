import type React from "react";
import type { Conversation } from "../../context/ConversationContext";
import { useAuthStore } from "../../stores/authStore";
import { useConversationStore } from "../../stores/conversationStore";
import { useEffect, useState } from "react";
import { CryptoUtils } from "../../utils/crypto";
import { Shield } from "lucide-react";

const ConversationItem: React.FC<Conversation> = ({
    conversationId, friend, unreadCounts, lastMessage
}) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation } = useConversationStore();
    const [decryptedPreview, setDecryptedPreview] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);
    
    const isSelected = activeConversationId === conversationId;
    
    useEffect(() => {
        const decrypt = async () => {
            if (!user || !lastMessage?.content) return;

            // 1. Check if the message is actually encrypted
            if (!lastMessage.senderKey || !lastMessage.recipientKey) {
                setDecryptedPreview(lastMessage.content);
                setIsDecrypting(false);
                return;
            }

            // 2. Wait for Private Key presence
            const storedPrivateKey = localStorage.getItem(`prv_key_${user.id}`);
            if (!storedPrivateKey) {
                setDecryptedPreview("[Encrypted]");
                setIsDecrypting(false);
                return;
            }

            setIsDecrypting(true);
            try {
                const privateKey = await CryptoUtils.importPrivateKey(storedPrivateKey);
                
                // Try decrypting with both senderKey and recipientKey since we don't know the sender in the preview
                let decrypted: string;
                try {
                    decrypted = await CryptoUtils.decryptMessage(lastMessage.content, lastMessage.senderKey, privateKey);
                } catch (e) {
                    try {
                        decrypted = await CryptoUtils.decryptMessage(lastMessage.content, lastMessage.recipientKey, privateKey);
                    } catch (e2: any) {
                        decrypted = "[Legacy Message]";
                    }
                }
                
                setDecryptedPreview(decrypted);
            } catch (error) {
                setDecryptedPreview("[Encrypted]");
            } finally {
                setIsDecrypting(false);
            }
        };

        decrypt();
    }, [lastMessage, user]);
    
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
                {friend.profilePicture ? (
                    <img
                        src={friend.profilePicture}
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
                    <div className="flex items-center gap-1 min-w-0">
                        <p className={`text-[13px] truncate ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                            {isDecrypting ? "Decrypting..." : (decryptedPreview || "Start a conversation...")}
                        </p>
                        {lastMessage?.senderKey && <Shield size={10} className="text-slate-500 shrink-0" />}
                    </div>
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