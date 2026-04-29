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
        <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                    {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-black">
                        {user.fullName || user.username} <span className="font-normal text-gray-500">({user.connectCode})</span>
                    </h3>
                    <p className="text-xs text-gray-500">Online</p>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 cursor-pointer"
                title="Logout"
            >
                <LogOut size={18} />
            </button>
        </div>
    );
};

export default UserProfile;
