import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutDashboard, ShieldCheck, Zap, BookOpen } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#111] text-[#1a1a1a] dark:text-[#E8E8E8] transition-colors duration-300">
            <Head title="Welcome" />

            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#111]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-[#1F6F5F] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1F6F5F]/20">
                            <LayoutDashboard size={20} />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight">
                            Sotta<span className="text-[#1F6F5F]">.</span>
                        </span>
                    </Link>

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2 rounded-xl bg-[#1F6F5F] text-white text-sm font-bold hover:bg-[#195f51] transition-colors shadow-sm shadow-[#1F6F5F]/20"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-[#1F6F5F] transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-5 py-2 rounded-xl bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] text-sm font-bold hover:opacity-90 transition-opacity"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* ── Hero ── */}
            <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#1F6F5F]/20 bg-[#1F6F5F]/5 text-[#1F6F5F] text-xs font-bold tracking-widest uppercase">
                        <Zap size={12} className="fill-[#1F6F5F]" />
                        Laravel + Inertia + Supabase
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
                        The modern Laravel<br />
                        <span className="text-[#1F6F5F]">starter kit</span> you need.
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Production-ready boilerplate with React, Tailwind CSS, and Supabase.
                        Focus on your product — not on setup.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={route('register')}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#1F6F5F] hover:bg-[#195f51] text-white font-bold rounded-2xl text-base transition-colors shadow-xl shadow-[#1F6F5F]/20 group"
                        >
                            Get started for free
                            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <a
                            href="https://laravel.com/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/8 rounded-2xl font-bold text-base hover:border-[#1F6F5F]/30 transition-colors text-[#1a1a1a] dark:text-white"
                        >
                            <BookOpen size={18} />
                            Documentation
                        </a>
                    </div>
                </motion.div>

                {/* ── Features ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
                >
                    <FeatureCard icon={<Zap />} title="Instant Setup">
                        Get a full-stack Laravel + React application running in under 5 minutes with zero boilerplate fatigue.
                    </FeatureCard>
                    <FeatureCard icon={<ShieldCheck />} title="Secure by Design">
                        Supabase auth with Laravel's robust middleware, CSRF protection, and proper session handling out of the box.
                    </FeatureCard>
                    <FeatureCard icon={<LayoutDashboard />} title="Production UI">
                        A thoughtfully designed component library using Tailwind CSS 3, Framer Motion, and Lucide icons.
                    </FeatureCard>
                </motion.div>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-100 dark:border-white/5 py-10">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#1F6F5F] rounded-lg flex items-center justify-center text-white">
                            <LayoutDashboard size={14} />
                        </div>
                        <span className="font-semibold">Sotta &copy; 2026</span>
                    </div>
                    <span>Built for the Laravel community</span>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, children }) {
    return (
        <div className="p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/8 hover:border-[#1F6F5F]/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-[#1F6F5F]/8 text-[#1F6F5F] flex items-center justify-center mb-5 group-hover:bg-[#1F6F5F]/15 transition-colors">
                {icon}
            </div>
            <h3 className="text-base font-bold mb-2 text-[#1a1a1a] dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{children}</p>
        </div>
    );
}
