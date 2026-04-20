import { Search } from "lucide-react";

const SearchBar = () => {
    return (
        <div className="px-6 py-4">
            <div className="relative group">
                <Search 
                    size={18} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" 
                />
                <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all backdrop-blur-sm"
                />
            </div>
        </div>
    );
};

export default SearchBar;
