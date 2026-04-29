import { useConversationStore } from "../../stores/conversationStore";
import ChatHeader from "./ChatHeader";
import ChatPlaceholder from "./ChatPlaceholder";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatWindow: React.FC = () => {
    const { activeConversationId } = useConversationStore();

    return <div className="min-h-screen max-h-screen w-full bg-white flex flex-col justify-between">
        {activeConversationId && <ChatHeader />}
        {activeConversationId && <MessageList />}
        {!activeConversationId && <ChatPlaceholder />}
        {activeConversationId && <MessageInput />}
    </div>
}

export default ChatWindow;