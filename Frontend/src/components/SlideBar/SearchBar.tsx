import { Search } from "lucide-react";
import { useConversationContext } from "../../context/ConversationContext";

const SearchBar = () => {

    const { searchTerm, setSearchTerm } = useConversationContext();

    return (
        <div className="px-4 pb-4">
            <div className="relative group bg-slate-800 rounded-full border border-white/5 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full bg-transparent py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none"
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
