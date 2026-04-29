const TypingIndicator: React.FC = () => {
    return <div className="flex mb-4 items-end">
        <img
            src="https://avatar.iran.liara.run/public"
            alt="User"
            className="w-8 h-8 rounded-full object-cover mr-2 mb-1 shadow-sm"
        />
        <div className="bg-[#f0f2f5] p-4 rounded-2xl rounded-bl-sm flex items-center shadow-sm h-10">
            <div className="size-1.5 bg-gray-400 rounded-full animate-pulse mr-1.5" style={{ animationDelay: '0s' }}></div>
            <div className="size-1.5 bg-gray-400 rounded-full animate-pulse mr-1.5" style={{ animationDelay: '0.2s' }}></div>
            <div className="size-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
    </div>
}

export default TypingIndicator;