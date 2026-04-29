import { Contact, Settings } from "lucide-react";
import { useState } from "react";
import AddConversationModal from "./AddConversationalModel";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center justify-between px-4 py-4">
            <div>
                <h1 className="text-xl text-white font-bold tracking-wide">Messages</h1>
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