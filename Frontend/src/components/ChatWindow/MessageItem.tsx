import { useAuthStore } from "../../stores/authStore";

export interface MessageProps {
    _id?: string;
    messageId?: string;
    sender?: { _id: string; username?: string; name?: string };
    senderId?: string;
    content: string;
    read?: boolean;
    createdAt?: string;
    timestamp?: string;
}

const MessageItem: React.FC<MessageProps> = ({
    sender,
    senderId,
    content,
    createdAt,
    timestamp
}) => {
    const { user } = useAuthStore();
    
    // Determine if the current user is the sender (handling both payload formats)
    const currentSenderId = sender?._id || senderId;
    const userIsSender = currentSenderId === user?.id;

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
                <p className="text-[15px] leading-relaxed">{content}</p>
                <span className="text-[11px] flex justify-end text-cyan-100/70 mt-1">{displayTime}</span>
            </div>
        </div>
    }

    return <div className="flex mb-4 items-end">
        <img
            src="https://avatar.iran.liara.run/public"
            alt={sender?.username || "User"}
            className="w-8 h-8 rounded-full object-cover mr-2 mb-1"
        />
        <div className="bg-slate-900 border border-white/5 p-3 px-4 max-w-xs lg:max-w-md rounded-2xl rounded-bl-sm shadow-sm">
            <p className="text-[15px] text-slate-200 leading-relaxed">{content}</p>
            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">{displayTime}</span>
        </div>
    </div>
}

export default MessageItem;