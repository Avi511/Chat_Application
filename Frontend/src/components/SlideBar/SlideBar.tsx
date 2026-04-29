import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import { ConversationProvider } from "../../context/ConversationContext";

const SideBar = () => {
    return (
        <aside className="w-full md:w-80 h-screen bg-white border-r border-gray-200 flex flex-col z-20">
            <ConversationProvider>
                <div className="bg-[#00a8ff]">
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