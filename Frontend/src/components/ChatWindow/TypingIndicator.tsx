const TypingIndicator: React.FC = () => {
    return <div className="flex mb-4 items-end">
        <img
            src="https://avatar.iran.liara.run/public"
            alt="User"
            className="size-7 rounded-full object-cover mr-2 mb-1 shadow-sm border border-slate-700/50"
        />
        <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl rounded-tl-sm flex items-center shadow-sm border border-slate-700/50 h-10">
            <div className="size-1.5 bg-slate-400 rounded-full animate-pulse mr-1.5" style={{ animationDelay: '0s' }}></div>
            <div className="size-1.5 bg-slate-400 rounded-full animate-pulse mr-1.5" style={{ animationDelay: '0.2s' }}></div>
            <div className="size-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
    </div>
}

export default TypingIndicator;