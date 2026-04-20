import { MessageSquare, LogOut, User, Settings, Menu } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <aside className="w-full md:w-72 h-screen bg-slate-950/95 border-r border-cyan-500/10 text-white flex flex-col">
            {/* Top */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                        <span className="text-white text-lg font-bold">Z</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wide">Zentalk</h1>
                        <p className="text-xs text-slate-400">Messaging Platform</p>
                    </div>
                </div>

                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <Menu size={18} className="text-slate-300" />
                </button>
            </div>

            {/* Profile */}
            <div className="px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center font-bold text-lg">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-white truncate">
                            {user?.name || "User"}
                        </h2>
                        <p className="text-xs text-slate-400 truncate">
                            {user?.username || "user@example.com"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-5 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-500/15 transition">
                    <MessageSquare size={18} />
                    <span className="font-medium">Chats</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/5 hover:text-white transition">
                    <User size={18} />
                    <span className="font-medium">Profile</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/5 hover:text-white transition">
                    <Settings size={18} />
                    <span className="font-medium">Settings</span>
                </button>
            </nav>

            {/* Bottom */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500/80 to-pink-600/80 text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default SideBar;