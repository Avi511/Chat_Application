import { useAuthStore } from "../../stores/authStore";
import { useConversationStore } from "../../stores/conversationStore";
import { useEffect, useState } from "react";
import { CryptoUtils } from "../../utils/crypto";
import { Shield } from "lucide-react";

export interface MessageProps {
    _id?: string;
    messageId?: string;
    sender?: { _id: string; username?: string; name?: string };
    senderId?: string;
    content: string;
    read?: boolean;
    createdAt?: string;
    timestamp?: string;
    profilePicture?: string;
    senderKey?: string;
    recipientKey?: string;
}

const MessageItem: React.FC<MessageProps> = ({
    sender,
    senderId,
    content,
    createdAt,
    timestamp,
    profilePicture,
    senderKey,
    recipientKey
}) => {
    const { user } = useAuthStore();
    const { fetchConversations } = useConversationStore();
    const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);
    
    // Determine if the current user is the sender (handling both payload formats)
    const currentSenderId = sender?._id || senderId;
    const userIsSender = currentSenderId === user?.id;

    useEffect(() => {
        const decrypt = async () => {
            if (!user || !content) return;
            
            // 1. Check if the message is actually encrypted (contains keys)
            if (!senderKey || !recipientKey) {
                setDecryptedContent(content);
                setIsDecrypting(false);
                return;
            }

            // 2. Wait for Private Key presence
            const storedPrivateKey = localStorage.getItem(`prv_key_${user.id}`);
            if (!storedPrivateKey) {
                // If we are currently setting up E2EE, wait. Otherwise, it's a lost key case.
                setDecryptedContent("[Encrypted - Private Key Missing]");
                setIsDecrypting(false);
                return;
            }

            setIsDecrypting(true);
            try {
                const privateKey = await CryptoUtils.importPrivateKey(storedPrivateKey);
                const keyToUse = userIsSender ? senderKey : recipientKey;
                
                if (!keyToUse) {
                    setDecryptedContent("[Encrypted - Key Mismatch]");
                    return;
                }

                const decrypted = await CryptoUtils.decryptMessage(content, keyToUse, privateKey);
                setDecryptedContent(decrypted);
            } catch (error: any) {
                // Decryption failed (usually due to a key mismatch from a DB reset)
                setDecryptedContent("[Legacy Message - Unreadable]");
            } finally {
                setIsDecrypting(false);
            }
        };

        decrypt();
    }, [content, senderKey, recipientKey, user, userIsSender]);

    const timeString = createdAt || timestamp;
    const created = timeString ? new Date(timeString) : new Date();
    const now = new Date();

    const diffInMs = now.getTime() - created.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    const time = created.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    const date = created.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    const displayTime = diffInDays > 1 ? `${date} ${time}` : time;

    if (userIsSender) {
        return <div className="flex justify-end mb-4">
            <div className={`relative p-3 md:p-4 rounded-2xl shadow-lg backdrop-blur-md border ${
                        userIsSender 
                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/20 text-white rounded-tr-none" 
                            : "bg-white/5 border-white/10 text-slate-100 rounded-tl-none"
                    } max-w-[85%] md:max-w-md break-words`}>
                <p className="text-[15px] leading-relaxed">
                    {isDecrypting ? "Decrypting..." : decryptedContent}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                    {senderKey && <Shield size={10} className="text-cyan-200" />}
                    <span className="text-[11px] text-cyan-100/70">{displayTime}</span>
                </div>
            </div>
        </div>
    }

    return <div className="flex mb-4 items-end">
        <img
            src={profilePicture || "/profileicon.jpg"}
            alt={sender?.username || "User"}
            className="w-8 h-8 rounded-full object-cover mr-2 mb-1"
        />
        <div className="relative p-3 md:p-4 rounded-2xl shadow-lg backdrop-blur-md border bg-white/5 border-white/10 text-slate-100 rounded-tl-none max-w-[85%] md:max-w-md break-words">
            <p className="text-[15px] leading-relaxed">
                {isDecrypting ? "Decrypting..." : decryptedContent}
            </p>
            <div className="flex items-center gap-1 mt-1">
                {senderKey && <Shield size={10} className="text-slate-500" />}
                <span className="text-[11px] text-slate-500">{displayTime}</span>
            </div>
        </div>
    </div>
}

export default MessageItem;