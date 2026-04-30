import { useAuthStore } from "../../stores/authStore";
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
    const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);
    
    // Determine if the current user is the sender (handling both payload formats)
    const currentSenderId = sender?._id || senderId;
    const userIsSender = currentSenderId === user?.id;

    useEffect(() => {
        const decrypt = async () => {
            if (!user || !content) return;
            
            // If it's not encrypted (no keys), just show content
            if (!senderKey || !recipientKey) {
                setDecryptedContent(content);
                return;
            }

            setIsDecrypting(true);
            try {
                const storedPrivateKey = localStorage.getItem(`prv_key_${user.id}`);
                if (!storedPrivateKey) {
                    setDecryptedContent("[Encrypted - No Private Key]");
                    return;
                }

                const privateKey = await CryptoUtils.importPrivateKey(storedPrivateKey);
                const keyToUse = userIsSender ? senderKey : recipientKey;
                
                if (!keyToUse) {
                    setDecryptedContent("[Encrypted - Missing Key]");
                    return;
                }

                const decrypted = await CryptoUtils.decryptMessage(content, keyToUse, privateKey);
                setDecryptedContent(decrypted);
            } catch (error) {
                console.error("Decryption error:", error);
                setDecryptedContent("[Decryption Failed - Key Mismatch]");
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
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-3 px-4 max-w-xs lg:max-w-md rounded-2xl rounded-br-sm shadow-[0_0_15px_rgba(34,211,238,0.1)] border border-cyan-400/20">
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
        <div className="bg-slate-900 border border-white/5 p-3 px-4 max-w-xs lg:max-w-md rounded-2xl rounded-bl-sm shadow-sm">
            <p className="text-[15px] text-slate-200 leading-relaxed">
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