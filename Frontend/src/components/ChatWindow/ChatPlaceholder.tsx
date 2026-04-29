import { MessageCircle } from "lucide-react";

const ChatPlaceholder: React.FC = () => {
    return <div className="flex-1 bg-transparent flex flex-col items-center justify-center text-center p-8 text-slate-500 h-full">
        <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
            <MessageCircle className="size-16 mb-6 text-cyan-400/80 relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-semibold text-slate-300 tracking-wide">Welcome to Zentalk</h2>
        <p className="text-sm mt-3 max-w-xs text-slate-500 leading-relaxed">Select a conversation from the sidebar to start messaging.</p>
    </div>
}

export default ChatPlaceholder;