import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import SideBar from "../../components/SlideBar/SlideBar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

const Chat = () => {
    const { user, setupE2EE } = useAuthStore();
    const [activeRoom, setActiveRoom] = useState("general");

    useEffect(() => {
        if (user) {
            setupE2EE();
        }
    }, [user, setupE2EE]);

    if (!user) return null;

    return (
        <div className="relative flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden">
            {/* Ambient Background Blobs matching Auth */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-4000" />
            </div>

            {/* Foreground Content */}
            <div className="flex w-full h-full z-10 relative bg-slate-950/40 backdrop-blur-3xl">
                <SideBar />
                <ChatWindow />
            </div>
        </div>
    );
};

export default Chat;