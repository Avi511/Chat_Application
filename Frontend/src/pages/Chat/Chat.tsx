import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import SideBar from "../../components/SlideBar/SlideBar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

const Chat = () => {
    const { user } = useAuthStore();
    const [activeRoom, setActiveRoom] = useState("general");

    if (!user) return null;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden">
            <SideBar />
            <ChatWindow />
        </div>
    );
};

export default Chat;