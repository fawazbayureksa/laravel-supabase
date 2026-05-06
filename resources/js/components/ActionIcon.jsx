import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ActionIcon({
    icon: Icon,
    activeIcon: ActiveIcon,
    isActive = false,
    label,
    count,
    onClick,
    className = '',
    activeClassName = 'text-red-500 bg-red-50 dark:bg-red-500/10',
    inactiveClassName = 'text-gray-400 hover:text-[#1F6F5F] hover:bg-[#1F6F5F]/8 dark:hover:bg-[#1F6F5F]/10',
    ...props
}) {
    const DisplayIcon = isActive && ActiveIcon ? ActiveIcon : Icon;

    return (
        <div className="flex items-center gap-1.5 group">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClick}
                className={cn(
                    'w-9 h-9 flex items-center justify-center rounded-xl transition-all',
                    isActive ? activeClassName : inactiveClassName,
                    className
                )}
                {...props}
            >
                <DisplayIcon size={18} className={cn(isActive && 'fill-current')} />
            </motion.button>
            {(count !== undefined || label) && (
                <span className={cn(
                    'text-xs font-bold tracking-tight transition-colors',
                    isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                )}>
                    {count ?? label}
                </span>
            )}
        </div>
    );
}
