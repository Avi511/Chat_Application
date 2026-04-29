import { Contact, Settings } from "lucide-react";
import { useState } from "react";
import AddConversationModal from "./AddConversationalModel";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Chat Pad" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                <h1 className="text-xl text-white font-bold tracking-wide">Chat Pad</h1>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsOpen(true)} 
                    className="p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
                    title="Add Contact"
                >
                    <Contact size={18} className="text-white" />
                </button>
                <button 
                    className="p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
                    title="Settings"
                >
                    <Settings size={18} className="text-white" />
                </button>
            </div>

            <AddConversationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
};

export default Header;