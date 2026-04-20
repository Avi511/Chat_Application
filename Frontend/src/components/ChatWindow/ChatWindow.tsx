import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../stores/authStore";
import { 
    Send, 
    Hash, 
    Search, 
    MoreVertical, 
    Smile, 
    Paperclip, 
    Circle 
} from "lucide-react";
import { toast } from "sonner";

interface ChatWindowProps {
    activeRoom: string;
}

const ChatWindow = ({ activeRoom }: ChatWindowProps) => {
    const { user } = useAuthStore();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Placeholder for socket logic
        toast.info(`Message sent to #${activeRoom}`);
        setMessage("");
    };

    if (!user) return null;

    return (
        <main className="flex-1 flex flex-col relative bg-slate-950">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                        <Hash size={18} />
                    </div>
                    <div>
                        <h2 className="font-bold text-white capitalize">{activeRoom}</h2>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <Circle size={6} className="fill-current" />
                            12 users online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-white transition-colors"><Search size={20} /></button>
                    <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
                </div>
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
                {/* Placeholder Messages */}
                <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shrink-0 mt-1">A</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white">Alice Smith</span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Today at 10:45 AM</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 max-w-2xl text-slate-300 leading-relaxed">
                            Hey everyone! Has anyone seen the latest Zentalk design updates in the channel? 🎨
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white shrink-0 mt-1">B</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white">Bob Jones</span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Today at 10:48 AM</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 max-w-2xl text-slate-300 leading-relaxed">
                            Not yet, checking them out now. They look pretty slick!
                        </div>
                    </div>
                </div>

                <div className="flex flex-row-reverse gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-white shrink-0 mt-1 shadow-lg shadow-cyan-900/10">
                        {user.name && user.name[0]}
                    </div>
                    <div className="flex-1 flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Just now</span>
                            <span className="font-bold text-cyan-400">You</span>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-tr-none p-3 max-w-2xl text-cyan-100 leading-relaxed">
                            Glad you like them! I've been working on making the UI feel more "Antigravity".
                        </div>
                    </div>
                </div>

                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 bg-slate-950/80 backdrop-blur-md">
                <form
                    onSubmit={handleSendMessage}
                    className="relative max-w-5xl mx-auto flex items-center gap-2"
                >
                    <div className="flex-1 relative">
                        <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`Message #${activeRoom}`}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-24 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all text-white placeholder-slate-600"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-500">
                            <button type="button" className="hover:text-cyan-400 transition-colors"><Smile size={20} /></button>
                            <button
                                type="submit"
                                className="w-10 h-10 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:hover:bg-cyan-500 transition-all"
                                disabled={!message.trim()}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ChatWindow;