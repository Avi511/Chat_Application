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
            navigate("/auth");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const copyConnectId = () => {
        if (user?.mobileNumber) {
            navigator.clipboard.writeText(user.mobileNumber);
            setCopied(true);
            toast.success("Mobile number copied!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!user) return null;

    return (
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400 border border-white/10">
                    {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        {user.fullName || user.username} <span className="font-normal text-slate-500">({user.mobileNumber})</span>
                    </h3>
                    <p className="text-xs text-green-400">Online</p>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors p-2 cursor-pointer"
                title="Logout"
            >
                <LogOut size={18} />
            </button>
        </div>
    );
};

export default UserProfile;
