import { LogOut, Settings, Copy, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserProfile = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const copyConnectId = () => {
        if (user?.connectCode) {
            navigator.clipboard.writeText(user.connectCode);
            setCopied(true);
            toast.success("Connect ID copied!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!user) return null;

    return (
        <div className="p-4 border-t border-white/5 space-y-4">
            {/* User Info Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
                    {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                    
                    {/* Connect ID Display */}
                    <div 
                        onClick={copyConnectId}
                        className="mt-1.5 flex items-center gap-1.5 cursor-pointer group w-fit bg-slate-900/50 px-2 py-1 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-all"
                        title="Copy Connect ID"
                    >
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 group-hover:text-cyan-400 transition-colors">ID:</span>
                        <span className="text-xs font-mono text-slate-300 group-hover:text-white transition-colors">{user.connectCode || "------"}</span>
                        {copied ? (
                            <CheckCircle2 size={12} className="text-green-400" />
                        ) : (
                            <Copy size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100" />
                        )}
                    </div>
                </div>
                <button className="p-2 text-slate-500 hover:text-white transition-colors self-start">
                    <Settings size={18} />
                </button>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500/80 to-pink-600/80 text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-red-950/20"
            >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
            </button>
        </div>
    );
};

export default UserProfile;
