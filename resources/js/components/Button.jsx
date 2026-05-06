import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function Button({
    type = 'button',
    className = '',
    variant = 'primary',
    size = 'md',
    processing = false,
    disabled = false,
    children,
    icon: Icon,
    ...props
}) {
    const variants = {
        primary: 'bg-[#1F6F5F] text-white hover:bg-[#195f51] shadow-sm shadow-[#1F6F5F]/20',
        secondary: 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20',
        ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-[#1F6F5F]/8 hover:text-[#1F6F5F]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg',
        md: 'px-6 py-2.5 text-sm rounded-xl',
        lg: 'px-8 py-3.5 text-base rounded-2xl',
    };

    return (
        <motion.button
            whileHover={{ scale: disabled || processing ? 1 : 1.01 }}
            whileTap={{ scale: disabled || processing ? 1 : 0.98 }}
            type={type}
            className={cn(
                'relative flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || processing}
            {...props}
        >
            {processing ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{children}</span>
                </>
            ) : (
                <>
                    {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
                    {children}
                </>
            )}
        </motion.button>
    );
}
