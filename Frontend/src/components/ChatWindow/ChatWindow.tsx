import { useConversationStore } from "../../stores/conversationStore";
import ChatHeader from "./ChatHeader";
import ChatPlaceholder from "./ChatPlaceholder";
import MessageInput from "./MessageInput.tsx";
import MessageList from "./MessageList.tsx";

const ChatWindow: React.FC = () => {
    const { activeConversationId } = useConversationStore();

    return <div className="h-screen w-full bg-white flex flex-col justify-between overflow-hidden">
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