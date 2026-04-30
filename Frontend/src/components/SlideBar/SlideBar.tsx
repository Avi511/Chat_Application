import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import { ConversationProvider } from "../../context/ConversationContext";

const SideBar = () => {
    return (
        <aside className="w-full h-full bg-transparent flex flex-col z-20">
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