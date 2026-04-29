import { useEffect } from "react";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import { Loader2, Wifi } from "lucide-react"

import { conversationService } from "../../services/conversationService";
import { useSocket } from "../../context/SocketContext";
import Modal from "../UI/Model";
import { useQuery } from "@tanstack/react-query";

const addConversationSchema = z.object({
    connectCode: z.string().min(6, { message: "Invalid connect ID" })
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

    const connectCode = watch('connectCode');

    const { isFetching, refetch } = useQuery({
        queryKey: ["checkConnectCode", connectCode],
        queryFn: () => conversationService.checkConnectCode(connectCode),
        enabled: false,
        retry: false
    })

    const onSubmit = async (formData: AddConversationFormData) => {
        const result = await refetch();

        if (result?.data?.success) {
            socket?.emit('conversation:request', {
                connectCode: formData.connectCode,
            })
            onClose();
        } else {
            const errorMessage = (result.error as any)?.response?.data?.message ?? "Invalid connect ID";
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
                <label htmlFor="connectCode" className="block text-slate-300 mb-2 text-sm font-medium">Connect ID</label>
                <div className="relative mb-4">
                    <Wifi className="absolute inset-y-0 left-3 size-5 text-slate-400 top-1/2 -translate-y-1/2" />
                    <input
                        {...register('connectCode')}
                        placeholder="Enter 6-digit ID"
                        className="text-white bg-slate-800/50 w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder:text-slate-500"
                    />
                </div>
                {errors.connectCode && <p className="text-red-400 text-xs mt-1 mb-3">{errors.connectCode.message}</p>}
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