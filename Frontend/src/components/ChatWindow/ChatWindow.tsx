import { useConversationStore } from "../../stores/conversationStore";
import ChatHeader from "./ChatHeader";
import ChatPlaceholder from "./ChatPlaceholder";
import MessageInput from "./MessageInput.tsx";
import MessageList from "./MessageList.tsx";

const ChatWindow: React.FC = () => {
    const { activeConversationId } = useConversationStore();

    return <div className="h-screen w-full bg-[#0B1120] flex flex-col justify-between overflow-hidden relative">
        {/* Subtle background glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

        <div className="z-10 flex flex-col h-full w-full">
            {activeConversationId ? (
                <>
                    <ChatHeader />
                    <MessageList />
                    <MessageInput />
                </>
            ) : (
                <ChatPlaceholder />
            )}
        </div>
    </div>
}

export default ChatWindow;