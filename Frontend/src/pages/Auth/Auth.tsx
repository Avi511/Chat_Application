import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./partials/LoginForm";
import RegisterForm from "./partials/RegisterForm";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950 text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0">
                <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full" />
                <div className="absolute bottom-[-100px] right-[-100px] w-[280px] h-[280px] bg-blue-700/20 blur-3xl rounded-full" />
            </div>

            {/* Left Side */}
            <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center px-8 py-14 border-b md:border-b-0 md:border-r border-white/10">
                <div className="max-w-lg">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                            <span className="text-white text-2xl font-extrabold tracking-wider">
                                Z
                            </span>
                        </div>
                        <div>
                            <p className="text-cyan-400 text-sm uppercase tracking-[0.3em] font-semibold">
                                Next Gen Messaging
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white">
                                Zentalk
                            </h1>
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        A focused, distraction-free communication platform designed for clarity,
                        speed, and seamless collaboration.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-cyan-400/20 bg-white/5 backdrop-blur-md p-4">
                            <h3 className="text-white font-semibold">Realtime Chat</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Instant messaging with smooth performance.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-blue-400/20 bg-white/5 backdrop-blur-md p-4">
                            <h3 className="text-white font-semibold">Secure Access</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Reliable authentication and protected sessions.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-sky-400/20 bg-white/5 backdrop-blur-md p-4">
                            <h3 className="text-white font-semibold">Minimal UI</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Clean design that keeps you focused.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-indigo-400/20 bg-white/5 backdrop-blur-md p-4">
                            <h3 className="text-white font-semibold">Team Ready</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Built for collaboration and productivity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center px-6 py-10 sm:px-10">
                <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-xl shadow-xl p-8 sm:p-10">
                    <div className="mb-8 text-center">
                        <p className="text-cyan-400 text-xs uppercase tracking-[0.35em] font-semibold mb-3">
                            {isLogin ? "Login" : "Register"}
                        </p>

                        <h2 className="text-3xl font-bold text-white">
                            {isLogin ? "Welcome to Zentalk" : "Join Zentalk"}
                        </h2>

                        <p className="text-slate-400 mt-3 text-sm sm:text-base">
                            {isLogin
                                ? "Sign in to continue your conversations."
                                : "Create your account and start chatting instantly."}
                        </p>
                    </div>

                    {isLogin ? (
                        <LoginForm navigate={navigate} />
                    ) : (
                        <RegisterForm navigate={navigate} onSuccess={() => setIsLogin(true)} />
                    )}

                    <div className="mt-8 text-center border-t border-white/10 pt-6">
                        <p className="text-sm text-slate-400">
                            {isLogin ? "Don’t have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-cyan-400 font-semibold hover:text-cyan-300 transition"
                            >
                                {isLogin ? "Register" : "Login"}
                            </button>
                        </p>
                    </div>

                    <div className="mt-5 text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-sm text-slate-500 hover:text-cyan-400 transition"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;