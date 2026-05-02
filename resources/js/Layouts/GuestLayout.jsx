import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9F8] dark:bg-[#111] text-[#1a1a1a] dark:text-[#E8E8E8] px-4 py-12 transition-colors duration-300">
            {/* Brand mark */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10 flex flex-col items-center gap-3"
            >
                <Link href="/" className="flex flex-col items-center gap-3 group">
                    <div className="w-16 h-16 bg-[#1F6F5F] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#1F6F5F]/20 group-hover:shadow-[#1F6F5F]/35 transition-shadow">
                        <LayoutDashboard size={36} />
                    </div>
                    <h1 className="font-extrabold text-2xl tracking-tight">
                        Sotta<span className="text-[#1F6F5F]">.</span>
                    </h1>
                </Link>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/8 shadow-sm overflow-hidden"
            >
                <div className="p-8 sm:p-10">
                    {children}
                </div>
            </motion.div>

            {/* Footer */}
            <p className="mt-8 text-xs text-gray-400 font-medium">
                &copy; 2026 Sotta &bull; All rights reserved
            </p>
        </div>
    );
}
