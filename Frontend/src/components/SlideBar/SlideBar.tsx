import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import { ConversationProvider } from "../../context/ConversationContext";

const SideBar = () => {
    return (
        <aside className="w-full md:w-80 h-screen bg-slate-950/95 border-r border-white/5 text-white flex flex-col shadow-2xl z-20">
            <Header />
            <ConversationProvider>
                <SearchBar />
                <Conversations />
            </ConversationProvider>
            <UserProfile />
        </aside>
    );
};

export default SideBar;