import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import { ConversationProvider } from "../../context/ConversationContext";

const SideBar = () => {
    return (
        <aside className="w-full md:w-80 h-screen bg-transparent border-r border-white/10 flex flex-col z-20">
            <ConversationProvider>
                <div className="bg-white/5 border-b border-white/10 backdrop-blur-md">
                    <Header />
                    <SearchBar />
                </div>
                <Conversations />
            </ConversationProvider>
            <UserProfile />
        </aside>
    );
};

export default SideBar;