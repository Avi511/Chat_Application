import { MessageCircle } from "lucide-react";

const ChatPlaceholder: React.FC = () => {
    return <div className="flex-1 bg-white flex flex-col items-center justify-center text-center p-8 text-gray-500 h-full">
        <MessageCircle className="size-16 mb-4 opacity-70" />
        <h2 className="text-lg font-semibold text-gray-700">Welcome to Chatty</h2>
        <p className="text-sm mt-2 text-gray-500">Select a friend from your list to start chatting</p>
    </div>
}

export default ChatPlaceholder;