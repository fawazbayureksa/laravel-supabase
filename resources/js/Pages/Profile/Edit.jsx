import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, AlertTriangle, Trash2 } from 'lucide-react';

const inputClass =
    'block w-full rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-[#222] px-4 py-3 text-sm text-[#1a1a1a] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]/30 focus:border-[#1F6F5F] transition-colors';

export default function Edit({ auth, user }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.profile?.phone ?? '',
        address: user.profile?.address ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold text-[#1F6F5F] uppercase tracking-widest mb-1">Account</p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a] dark:text-white">Profile Settings</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Update your personal information and account details.
                    </p>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="max-w-2xl space-y-6">
                {/* Personal info form */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/8 p-6"
                >
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Personal Information</h2>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Full name" icon={<User size={14} />} error={errors.name}>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Email address" icon={<Mail size={14} />} error={errors.email}>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Phone number" icon={<Phone size={14} />}>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="+1 555 000 0000"
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Address" icon={<MapPin size={14} />}>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="123 Main St, City"
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#1F6F5F] hover:bg-[#195f51] text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-[#1F6F5F]/20 disabled:opacity-50"
                            >
                                <Save size={15} />
                                {processing ? 'Saving…' : 'Save changes'}
                            </button>

                            {recentlySuccessful && (
                                <motion.span
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm font-semibold text-[#1F6F5F]"
                                >
                                    Saved successfully
                                </motion.span>
                            )}
                        </div>
                    </form>
                </motion.section>

                {/* Danger zone */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 }}
                    className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-red-100 dark:border-red-900/30 p-6"
                >
                    <div className="flex items-start gap-3 mb-5">
                        <AlertTriangle size={17} className="text-red-500 mt-0.5 shrink-0" />
                        <div>
                            <h2 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Danger Zone</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Permanently deleting your account cannot be undone.
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={15} />
                        Delete my account
                    </button>
                </motion.section>
            </div>
        </AuthenticatedLayout>
    );
}

function Field({ label, icon, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <span className="text-[#1F6F5F]">{icon}</span>
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
