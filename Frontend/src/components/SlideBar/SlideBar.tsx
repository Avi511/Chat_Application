import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";

const SideBar = () => {
    return (
        <aside className="w-full md:w-80 h-screen bg-slate-950/95 border-r border-white/5 text-white flex flex-col shadow-2xl z-20">
            <Header />
            <SearchBar />
            <Conversations />
            <UserProfile />
        </aside>
    );
};

export default SideBar;