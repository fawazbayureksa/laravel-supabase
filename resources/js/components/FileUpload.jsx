import { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileUpload({
    label,
    error,
    onChange,
    accept,
    multiple = false,
    className = '',
    ...props
}) {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState('');
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFileName(file.name);
            onChange?.(file);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            onChange?.(file);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setFileName('');
        onChange?.(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={cn('flex flex-col gap-1.5 w-full', className)}>
            {label && (
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <div
                className={cn(
                    'relative min-h-[120px] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1c1c1c]',
                    dragActive
                        ? 'border-[#1F6F5F] bg-[#1F6F5F]/5 scale-[0.99]'
                        : 'border-gray-200 dark:border-white/10 hover:border-[#1F6F5F]/40 hover:bg-[#1F6F5F]/4',
                    error ? 'border-red-500 bg-red-50 dark:bg-red-500/5' : ''
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept={accept}
                    multiple={multiple}
                    {...props}
                />

                <AnimatePresence mode="wait">
                    {!fileName ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#1F6F5F]/10 text-[#1F6F5F] flex items-center justify-center">
                                <Upload size={20} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {accept ? `Only ${accept} files allowed` : 'Any file up to 10MB'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="filled"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 w-full max-w-xs bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/6"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[#1F6F5F] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#1F6F5F]/20">
                                {accept?.includes('image') ? <ImageIcon size={20} /> : <FileText size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                                    {fileName}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                                    Ready to upload
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={clearFile}
                                className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
}
