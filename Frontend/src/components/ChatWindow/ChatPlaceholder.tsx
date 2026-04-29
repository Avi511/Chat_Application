import { MessageCircle } from "lucide-react";

const ChatPlaceholder: React.FC = () => {
    return <div className="flex-1 bg-transparent flex flex-col items-center justify-center text-center p-8 text-slate-500 h-full">
        <MessageCircle className="size-16 mb-4 opacity-50 text-cyan-500" />
        <h2 className="text-lg font-semibold text-slate-300">Welcome to Chat Pad</h2>
        <p className="text-sm mt-2 text-slate-500">Select a friend from your list to start chatting</p>
    </div>
}

export default ChatPlaceholder;