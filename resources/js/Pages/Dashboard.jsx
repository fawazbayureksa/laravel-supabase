import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    User,
    Phone,
    MapPin,
    Shield,
    Bell,
    Moon,
    Sun,
    CheckCircle2,
    Calendar,
    Activity,
    ChevronRight,
    Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard({ auth }) {
    const { user } = auth;
    const { flash } = usePage().props;

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        theme: user.preferences?.theme ?? 'light',
        notifications: user.preferences?.notifications ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('user.preferences.update'));
    };

    const initial = user.name?.charAt(0)?.toUpperCase() ?? '?';
    const lastLogin = user.last_login_at
        ? new Date(user.last_login_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Today';

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-bold text-[#1F6F5F] uppercase tracking-widest mb-1.5">Dashboard</p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Welcome back, {user.name.split(' ')[0]} 👋
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your account and preferences from here.
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* ── Stat chips ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'Status', value: 'Active', icon: <Activity size={15} />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                    { label: 'Last login', value: lastLogin, icon: <Calendar size={15} />, color: 'text-[#1F6F5F]', bg: 'bg-[#1F6F5F]/8 dark:bg-[#1F6F5F]/10' },
                    { label: 'Account type', value: user.role ?? 'Standard', icon: <Shield size={15} />, color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-white/5' },
                ].map(({ label, value, icon, color, bg }) => (
                    <div key={label} className="flex items-center gap-3 bg-white dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/6 rounded-2xl px-4 py-3.5">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', bg, color)}>
                            {icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ── Left: Profile card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-4 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-100 dark:border-white/6 overflow-hidden"
                >
                    {/* Profile header */}
                    <div className="bg-[#1F6F5F]/6 dark:bg-[#1F6F5F]/10 px-6 pt-6 pb-10 relative">
                        <div className="w-16 h-16 rounded-2xl bg-[#1F6F5F] text-white text-2xl font-black flex items-center justify-center shadow-lg shadow-[#1F6F5F]/30">
                            {initial}
                        </div>
                        <h2 className="mt-3 text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">{user.name}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1F6F5F] bg-[#1F6F5F]/10 border border-[#1F6F5F]/15 rounded-full px-2.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1F6F5F]" />
                            {user.role ?? 'Member'}
                        </span>
                    </div>

                    {/* Profile details */}
                    <div className="px-6 py-5 space-y-4 -mt-4 bg-white dark:bg-[#1c1c1c] rounded-t-2xl relative">
                        <ProfileRow icon={<Phone size={14} />} label="Phone" value={user.profile?.phone} />
                        <ProfileRow icon={<MapPin size={14} />} label="Location" value={user.profile?.address} />
                    </div>

                    <div className="px-6 pb-5">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-[#1F6F5F]/8 dark:hover:bg-[#1F6F5F]/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#1F6F5F] transition-colors group"
                        >
                            <span className="flex items-center gap-2">
                                <Settings size={15} className="text-gray-400 group-hover:text-[#1F6F5F]" />
                                Edit profile
                            </span>
                            <ChevronRight size={15} className="text-gray-300 group-hover:text-[#1F6F5F]" />
                        </Link>
                    </div>
                </motion.div>

                {/* ── Right: Preferences card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.06 }}
                    className="lg:col-span-8 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-100 dark:border-white/6"
                >
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/6">
                        <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Preferences</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Customize how the application looks and behaves.</p>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-4">
                        {/* Appearance */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-50 dark:border-white/4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#1F6F5F]/8 dark:bg-[#1F6F5F]/10 text-[#1F6F5F] flex items-center justify-center shrink-0">
                                    {data.theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Appearance</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Switch between light and dark interface</p>
                                </div>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-[#111] rounded-xl p-1 gap-1 w-fit">
                                {['light', 'dark'].map(opt => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setData('theme', opt)}
                                        className={cn(
                                            'px-5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                                            data.theme === opt
                                                ? 'bg-white dark:bg-[#1c1c1c] text-[#1F6F5F] shadow-sm'
                                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center justify-between gap-4 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#1F6F5F]/8 dark:bg-[#1F6F5F]/10 text-[#1F6F5F] flex items-center justify-center shrink-0">
                                    <Bell size={17} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Email Notifications</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Receive alerts about account activity</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setData('notifications', !data.notifications)}
                                className={cn(
                                    'relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none',
                                    data.notifications ? 'bg-[#1F6F5F]' : 'bg-gray-200 dark:bg-[#333]'
                                )}
                            >
                                <span
                                    className={cn(
                                        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                                        data.notifications && 'translate-x-5'
                                    )}
                                />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center gap-4">
                            <button
                                disabled={processing}
                                className="px-6 py-2.5 bg-[#1F6F5F] hover:bg-[#195f51] text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-[#1F6F5F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving…' : 'Save preferences'}
                            </button>

                            <AnimatePresence>
                                {(recentlySuccessful || flash?.status === 'preferences-updated') && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-1.5 text-sm font-semibold text-[#1F6F5F]"
                                    >
                                        <CheckCircle2 size={15} />
                                        Saved
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}

function ProfileRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-[#1F6F5F] opacity-60 shrink-0">{icon}</span>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                <p className={cn('text-sm font-semibold mt-0.5', value ? 'text-gray-800 dark:text-gray-200' : 'text-gray-300 dark:text-gray-600 italic')}>
                    {value ?? 'Not set'}
                </p>
            </div>
        </div>
    );
}
