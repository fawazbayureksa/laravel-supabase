import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default forwardRef(function TextArea(
    { className = '', isFocused = false, label, error, rows = 4, ...props },
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
            <textarea
                {...props}
                rows={rows}
                className={cn(
                    'w-full bg-white dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/6 rounded-2xl text-sm font-semibold text-gray-800 dark:text-gray-100 transition-all focus:border-[#1F6F5F] focus:ring-4 focus:ring-[#1F6F5F]/10 placeholder:text-gray-300 dark:placeholder:text-gray-600 px-4 py-3 resize-none',
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : '',
                    className
                )}
                ref={input}
            />
            {error && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
});
