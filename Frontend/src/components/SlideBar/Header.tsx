import { Menu } from "lucide-react";

const Header = () => {
    return (
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                    <span className="text-white text-lg font-bold">Z</span>
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-wide">Zentalk</h1>
                    <p className="text-xs text-slate-400">Messaging Platform</p>
                </div>
            </div>

            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <Menu size={18} className="text-slate-300" />
            </button>
        </div>
    );
};

export default Header;