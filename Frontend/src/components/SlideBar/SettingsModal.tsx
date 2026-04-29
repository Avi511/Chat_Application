import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, User, AtSign, Save } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import Modal from "../UI/Model";

const settingsSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user, updateProfile, isLoading } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            username: user?.username || "",
        },
    });

    useEffect(() => {
        if (isOpen && user) {
            reset({
                fullName: user.fullName,
                username: user.username,
            });
        }
    }, [isOpen, user, reset]);

    const onSubmit = async (data: SettingsFormData) => {
        try {
            await updateProfile(data);
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
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
                            className={`w-full pl-11 pr-4 py-3 bg-slate-800/50 text-white placeholder:text-slate-500 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                                errors.fullName
                                    ? "border-red-500/70 focus:ring-red-500/30"
                                    : "border-white/10 focus:border-cyan-400/60 focus:ring-cyan-400/20"
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
                            className={`w-full pl-11 pr-4 py-3 bg-slate-800/50 text-white placeholder:text-slate-500 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                                errors.username
                                    ? "border-red-500/70 focus:ring-red-500/30"
                                    : "border-white/10 focus:border-cyan-400/60 focus:ring-cyan-400/20"
                            }`}
                        />
                    </div>
                    {errors.username && (
                        <p className="mt-2 text-xs text-red-400 pl-1">{errors.username.message}</p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || !isDirty}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-2xl font-semibold shadow-[0_0_25px_rgba(34,211,238,0.18)] hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SettingsModal;
