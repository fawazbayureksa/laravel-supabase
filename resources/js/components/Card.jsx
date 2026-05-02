import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', animate = true, ...props }) {
    const Component = animate ? motion.div : 'div';
    const animationProps = animate ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
    } : {};

    return (
        <Component
            className={cn(
                'bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-100 dark:border-white/6 overflow-hidden',
                className
            )}
            {...animationProps}
            {...props}
        >
            {children}
        </Component>
    );
}

Card.Header = ({ children, className = '', title, subtitle }) => (
    <div className={cn('px-6 py-5 border-b border-gray-50 dark:border-white/4', className)}>
        {title && <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{title}</h3>}
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        {children}
    </div>
);

Card.Body = ({ children, className = '' }) => (
    <div className={cn('p-6', className)}>
        {children}
    </div>
);

Card.Footer = ({ children, className = '' }) => (
    <div className={cn('px-6 py-4 bg-gray-50/50 dark:bg-white/2 border-t border-gray-50 dark:border-white/4', className)}>
        {children}
    </div>
);
