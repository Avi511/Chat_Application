import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, User, AtSign, Save, Camera, Image as ImageIcon, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import Modal from "../UI/Model";

const settingsSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    profilePicture: z.any().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user, updateProfile, isLoading } = useAuthStore();

    const [imagePreview, setImagePreview] = React.useState<string | null>(user?.profilePicture || null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

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
            setImagePreview(user.profilePicture || null);
            setSelectedFile(null);
        }
    }, [isOpen, user, reset]);

    const onSubmit = async (data: SettingsFormData) => {
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("username", data.username);
            if (selectedFile) {
                formData.append("profilePicture", selectedFile);
            }

            await updateProfile(formData);
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(user?.profilePicture || null);
        setSelectedFile(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center justify-center space-y-4 mb-4">
                    <div className="relative group">
                        <div className={`w-28 h-28 rounded-full overflow-hidden border-2 flex items-center justify-center transition-all ${imagePreview ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-slate-700 bg-slate-800/50'}`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-slate-600" size={44} />
                            )}
                        </div>
                        
                        <label className="absolute bottom-1 right-1 p-2.5 bg-cyan-500 rounded-full text-white cursor-pointer hover:bg-cyan-400 transition-colors shadow-lg border-2 border-slate-900">
                            <Camera size={18} />
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange}
                            />
                        </label>

                        {selectedFile && (
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-1 -right-1 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-400 transition-colors shadow-lg border-2 border-slate-900"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-slate-400">Change profile picture</p>
                </div>

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
                        disabled={isLoading || (!isDirty && !selectedFile)}
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
