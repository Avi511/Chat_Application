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
    _id,
    messageId,
    sender,
    senderId,
    content,
    read,
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
            <div className="bg-sky-500 text-white p-3 max-w-xs lg:max-w-md rounded-2xl shadow-sm">
                <p className="text-sm">{content}</p>
                <span className="text-xs flex items-center gap-1 text-blue-100 mt-1">{displayTime}</span>
            </div>
        </div>
    }

    return <div className="flex mb-4">
        <img
            src="https://avatar.iran.liara.run/public"
            alt={sender?.username || "User"}
            className="size-8 rounded-full object-cover mr-2"
        />
        <div className="bg-white p-3 max-w-xs lg:max-w-md rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-800">{content}</p>
            <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">{displayTime}</span>
        </div>
    </div>
}

export default MessageItem;