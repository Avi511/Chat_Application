import { Circle } from "lucide-react";

const Conversations = () => {
    // Placeholder data for conversations
    const chats = [
        { id: 1, name: "Alice Smith", lastMessage: "Hey, are we still on for today?", time: "10:45 AM", online: true, unread: 2 },
        { id: 2, name: "Development Team", lastMessage: "The new build is ready!", time: "9:30 AM", online: false, unread: 0 },
        { id: 3, name: "Bob Jones", lastMessage: "Check out this screenshot", time: "Yesterday", online: true, unread: 0 },
        { id: 4, name: "Marketing Room", lastMessage: "New campaign launch next week", time: "Monday", online: false, unread: 5 },
    ];

    return (
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10">
            <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">Recent Chats</p>
            
            {chats.map((chat) => (
                <button
                    key={chat.id}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all group relative"
                >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-lg text-slate-300 border border-white/5">
                            {chat.name.charAt(0)}
                        </div>
                        {chat.online && (
                            <Circle 
                                size={12} 
                                className="absolute -bottom-1 -right-1 fill-green-500 text-slate-950 stroke-[3px]" 
                            />
                        )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                                {chat.name}
                            </h3>
                            <span className="text-[10px] text-slate-500 font-medium">{chat.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                            {chat.lastMessage}
                        </p>
                    </div>

                    {/* Unread Badge */}
                    {chat.unread > 0 && (
                        <div className="absolute right-4 bottom-4 w-5 h-5 bg-cyan-500 text-slate-950 text-[10px] font-bold rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            {chat.unread}
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};

export default Conversations;
