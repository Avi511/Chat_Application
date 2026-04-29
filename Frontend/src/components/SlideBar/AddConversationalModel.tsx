import { useEffect } from "react";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import { Loader2, Phone } from "lucide-react"

import { conversationService } from "../../services/conversationService";
import { useSocket } from "../../context/SocketContext";
import Modal from "../UI/Model";
import { useQuery } from "@tanstack/react-query";

const addConversationSchema = z.object({
    mobileNumber: z.string().regex(/^\d{10,15}$/, { message: "Invalid mobile number" })
})

type AddConversationFormData = z.infer<typeof addConversationSchema>

interface AddConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddConversationModal: React.FC<AddConversationModalProps> = ({
    isOpen,
    onClose
}) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<AddConversationFormData>({
        resolver: zodResolver(addConversationSchema)
    })
    const { socket } = useSocket();

    const mobileNumber = watch('mobileNumber');

    const { isFetching, refetch } = useQuery({
        queryKey: ["checkMobileNumber", mobileNumber],
        queryFn: () => conversationService.checkMobileNumber(mobileNumber),
        enabled: false,
        retry: false
    })

    const onSubmit = async (formData: AddConversationFormData) => {
        const result = await refetch();

        if (result?.data?.success) {
            socket?.emit('conversation:request', {
                mobileNumber: formData.mobileNumber,
            })
            onClose();
        } else {
            const errorMessage = (result.error as any)?.response?.data?.message ?? "Invalid mobile number";
            toast.error(errorMessage);
        }
    }

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset])

    return <>
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Conversation"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="mobileNumber" className="block text-slate-300 mb-2 text-sm font-medium">Mobile Number</label>
                <div className="relative mb-4">
                    <Phone className="absolute inset-y-0 left-3 size-5 text-slate-400 top-1/2 -translate-y-1/2" />
                    <input
                        {...register('mobileNumber')}
                        placeholder="Enter mobile number"
                        className="text-white bg-slate-800/50 w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder:text-slate-500"
                    />
                </div>
                {errors.mobileNumber && <p className="text-red-400 text-xs mt-1 mb-3">{errors.mobileNumber.message}</p>}
                <button
                    type="submit"
                    disabled={isFetching}
                    className="w-full flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl hover:opacity-90 transition-all cursor-pointer font-medium shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                >
                    {isFetching ? <Loader2 className="animate-spin size-5" /> : "Connect"}
                </button>
            </form>
        </Modal>
    </>
}

export default AddConversationModal;