import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Settings,
    Moon,
    Sun,
    ChevronRight,
    User as UserIcon,
    LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ActionIcon from '@/Components/ActionIcon';
import { route } from 'ziggy-js';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const savedTheme = user?.preferences?.theme ?? 'light';
    const [theme, setTheme] = useState(savedTheme);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    useEffect(()=> {
        if(user != null || user){
            setIsLoggedIn(true);
        }
    })

    // Persist theme to server
    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        router.put(
            route('user.preferences.update'),
            { theme: next, notifications: user?.preferences?.notifications ?? false },
            { preserveScroll: true, preserveState: true }
        );
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navBase =
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b';
    const navScrolled =
        'bg-white/90 dark:bg-[#111]/90 backdrop-blur-md border-[#1F6F5F]/10 dark:border-white/5 py-3';
    const navTop =
        'bg-white dark:bg-[#111] border-transparent py-4';

    return (
        <div className="min-h-screen bg-[#F8F9F8] dark:bg-[#111] text-[#1a1a1a] dark:text-[#E8E8E8] transition-colors duration-300">
            {/* ── Navbar ── */}
            <nav className={cn(navBase, scrolled ? navScrolled : navTop)}>
                <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
                    {/* Logo + nav links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                            <div className="w-9 h-9 bg-[#1F6F5F] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1F6F5F]/25 group-hover:shadow-[#1F6F5F]/40 transition-shadow">
                                <LayoutDashboard size={20} />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-[#1a1a1a] dark:text-white leading-none">
                                Sotta<span className="text-[#1F6F5F]">.</span>
                            </span>
                        </Link>

                    </div>

                    {/* Right actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#1F6F5F]/8 hover:text-[#1F6F5F] dark:hover:text-[#1F6F5F] transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="w-px h-5 bg-gray-200 dark:bg-white/10" />

                        {/* Avatar + name */}
                        <Link href={route('profile.edit')} className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-[#1F6F5F]/10 text-[#1F6F5F] flex items-center justify-center font-bold text-sm border border-[#1F6F5F]/15 group-hover:border-[#1F6F5F]/35 transition-colors">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="hidden lg:block leading-none">
                                {/* <p className="text-sm font-semibold text-[#1a1a1a] dark:text-white">{user?.name}</p> */}
                                {/* <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{user?.name ?? 'Sign in'}</p> */}
                            </div>
                        </Link>



                        {/* Logout */}
                        {!isLoggedIn && 
                            <Link
                            href={route('login')}
                            method="post"
                            as="button"
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                                <LogIn size={18} />
                            </Link>
                        }
                        {isLoggedIn && 
                            <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                                <LogOut size={18} />
                            </Link>
                        }
                    </div>

                    {/* Mobile burger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 text-[#1a1a1a] dark:text-white"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* ── Mobile drawer ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className="fixed inset-0 z-40 bg-white dark:bg-[#111] pt-24 px-6 md:hidden flex flex-col"
                    >
                        <nav className="flex flex-col gap-2 flex-1">
                            <MobileNavItem href={route('dashboard')} active={route().current('dashboard')}>Dashboard</MobileNavItem>
                            <MobileNavItem href={route('profile.index')} active={route().current('profile.index')}>Profile</MobileNavItem>
                        </nav>

                        <div className="pb-10 flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                <div className="w-11 h-11 bg-[#1F6F5F] text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-[#1a1a1a] dark:text-white text-sm">{user?.name}</p>
                                    <p className="text-xs text-gray-400">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-sm font-semibold"
                            >
                                {theme === 'dark' ? <Sun size={18} className="text-[#1F6F5F]" /> : <Moon size={18} className="text-[#1F6F5F]" />}
                                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                            </button>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl font-bold text-sm"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Sidebar ── */}
            <aside className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 p-2.5 bg-white/60 dark:bg-[#111]/60 backdrop-blur-xl border-y border-r border-gray-200/50 dark:border-white/5 rounded-r-2xl shadow-2xl shadow-[#1F6F5F]/5">
                <ActionIcon
                    icon={LayoutDashboard}
                    isActive={route().current('index')}
                    onClick={() => router.visit(route('index'))}
                    className="w-10 h-10"
                />
                <ActionIcon
                    icon={UserIcon}
                    isActive={route().current('profile.index')}
                    onClick={() => router.visit(route('profile.index'))}
                    className="w-10 h-10"
                />
            </aside>


            {/* ── Page content ── */}
            <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20">
                {header && (
                    <div className="mb-8">
                        {header}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, active, children }) {
    return (
        <Link
            href={href}
            className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                active
                    ? 'text-[#1F6F5F] bg-[#1F6F5F]/8'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#1F6F5F] hover:bg-[#1F6F5F]/5'
            )}
        >
            {children}
        </Link>
    );
}

function MobileNavItem({ href, active, children }) {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-center justify-between px-5 py-4 rounded-2xl text-base font-bold transition-colors',
                active
                    ? 'bg-[#1F6F5F] text-white'
                    : 'bg-gray-50 dark:bg-white/5 text-[#1a1a1a] dark:text-gray-200'
            )}
        >
            {children}
            <ChevronRight size={18} className={active ? 'opacity-80' : 'opacity-25'} />
        </Link>
    );
}
