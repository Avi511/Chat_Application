import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import SideBar from "../../components/SlideBar/SlideBar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

const Chat = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const [activeRoom, setActiveRoom] = useState("general");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    if (!user) return null;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden">
            <SideBar />
            <ChatWindow activeRoom={activeRoom} />
        </div>
    );
};

export default Chat;