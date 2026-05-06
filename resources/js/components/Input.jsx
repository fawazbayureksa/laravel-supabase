import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default forwardRef(function Input(
    { type = 'text', className = '', isFocused = false, label, error, icon: Icon, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F6F5F] transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    {...props}
                    type={type}
                    className={cn(
                        'w-full bg-white dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/6 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 transition-all focus:border-[#1F6F5F] focus:ring-4 focus:ring-[#1F6F5F]/10 placeholder:text-gray-300 dark:placeholder:text-gray-600',
                        Icon ? 'pl-11 pr-4' : 'px-4',
                        'py-3',
                        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : '',
                        className
                    )}
                    ref={input}
                />
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
});
