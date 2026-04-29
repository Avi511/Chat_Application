import { Search } from "lucide-react";
import { useConversationContext } from "../../context/ConversationContext";

const SearchBar = () => {

    const { searchTerm, setSearchTerm } = useConversationContext();

    return (
        <div className="px-4 pb-4">
            <div className="relative group">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
                />
                <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full bg-transparent py-2 pl-9 pr-4 text-sm text-white placeholder-white/70 focus:outline-none focus:bg-white/10 transition-all"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                />
            </div>
        </div>
    );
};

export default SearchBar;
