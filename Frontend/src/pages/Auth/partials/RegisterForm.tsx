import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../../stores/authStore";
import { toast } from "sonner";
import { Mail, Lock, User, Loader2, Eye, EyeOff, ShieldCheck, AtSign } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    navigate: NavigateFunction;
    onSuccess: () => void;
}

const RegisterForm = ({ navigate, onSuccess }: RegisterFormProps) => {
    const { register: registerUser, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await registerUser({
                fullName: data.fullName,
                username: data.username,
                email: data.email,
                password: data.password
            });
            toast.success("Account created successfully! Please login.");
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name and Username Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <User size={18} />
                        </div>
                        <input
                            {...register("fullName")}
                            type="text"
                            placeholder="John Doe"
                            className={`w-full pl-11 pr-4 py-3 bg-slate-900/80 text-white placeholder:text-slate-500 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.fullName
                                ? "border-red-500/70 focus:ring-red-500/30"
                                : "border-slate-700 focus:border-cyan-400/60 focus:ring-cyan-400/20"
                                }`}
                        />
                    </div>
                    {errors.fullName && (
                        <p className="mt-2 text-xs text-red-400 pl-1">{errors.fullName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                        Username
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <AtSign size={18} />
                        </div>
                        <input
                            {...register("username")}
                            type="text"
                            placeholder="johndoe_22"
                            className={`w-full pl-11 pr-4 py-3 bg-slate-900/80 text-white placeholder:text-slate-500 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.username
                                ? "border-red-500/70 focus:ring-red-500/30"
                                : "border-slate-700 focus:border-cyan-400/60 focus:ring-cyan-400/20"
                                }`}
                        />
                    </div>
                    {errors.username && (
                        <p className="mt-2 text-xs text-red-400 pl-1">{errors.username.message}</p>
                    )}
                </div>
            </div>

            {/* Email Address - Full Width */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <Mail size={18} />
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
                    <p className="mt-2 text-xs text-red-400 pl-1">{errors.email.message}</p>
                )}
            </div>

            {/* Password and Confirm Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
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
                        <p className="mt-2 text-xs text-red-400 pl-1">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <ShieldCheck size={18} />
                        </div>
                        <input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full pl-11 pr-12 py-3 bg-slate-900/80 text-white placeholder:text-slate-500 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                                ? "border-red-500/70 focus:ring-red-500/30"
                                : "border-slate-700 focus:border-cyan-400/60 focus:ring-cyan-400/20"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-2 text-xs text-red-400 pl-1">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-2xl font-semibold shadow-[0_0_25px_rgba(34,211,238,0.18)] hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Creating account...
                    </>
                ) : (
                    "Create Account"
                )}
            </button>
        </form>
    );
};

export default RegisterForm;