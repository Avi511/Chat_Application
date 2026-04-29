import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg"
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) => {
    if (!isOpen) return null;

    const sizeClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
    };

    return <>
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50">
            <div
                className={`
                    bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full ${sizeClass[size]} p-6    
                `}
            >
                <div className="flex justify-between items-center mb-5">
                    {title && <h2 className="text-xl text-white font-bold tracking-wide">{title}</h2>}
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mb-2">
                    {children}
                </div>
                {footer && <div className="mt-6 pt-4 border-t border-white/10">{footer}</div>}
            </div>
        </div>
    </>
}

export default Modal;