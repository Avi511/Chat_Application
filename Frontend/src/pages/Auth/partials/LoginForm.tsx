import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../../stores/authStore";
import { toast } from "sonner";
import { Lock, Loader2, Eye, EyeOff, UserCircle } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    navigate: NavigateFunction;
}

const LoginForm = ({ navigate }: LoginFormProps) => {
    const { login, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data);
            toast.success("Logged in successfully!");
            navigate("/chat");
        } catch (error: any) {
            toast.error(error.message || "Failed to login");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <UserCircle size={18} />
                    </div>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        className={`w-full pl-11 pr-4 py-3 bg-slate-900/80 text-white placeholder:text-slate-500 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.email
                            ? "border-red-500/70 focus:ring-red-500/30"
                            : "border-slate-700 focus:border-cyan-400/60 focus:ring-cyan-400/20"
                            }`}
                    />
                </div>
                {errors.email && (
                    <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <Lock size={18} />
                    </div>
                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-12 py-3 bg-slate-900/80 text-white placeholder:text-slate-500 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.password
                            ? "border-red-500/70 focus:ring-red-500/30"
                            : "border-slate-700 focus:border-cyan-400/60 focus:ring-cyan-400/20"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-2xl font-semibold shadow-[0_0_25px_rgba(34,211,238,0.18)] hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Logging in...
                    </>
                ) : (
                    "Sign In"
                )}
            </button>
        </form>
    );
};

export default LoginForm;