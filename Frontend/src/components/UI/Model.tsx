import { X } from "lucide-react";
import { createPortal } from "react-dom";

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

    return createPortal(
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex justify-center items-center z-[9999] p-4">
            <div
                className={`
                    bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl w-full ${sizeClass[size]} p-8 backdrop-blur-xl animate-in fade-in zoom-in duration-300
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    {title && <h2 className="text-2xl text-white font-bold tracking-tight">{title}</h2>}
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-2">
                    {children}
                </div>
                {footer && <div className="mt-8 pt-6 border-t border-white/10">{footer}</div>}
            </div>
        </div>,
        document.body
    );
}

export default Modal;