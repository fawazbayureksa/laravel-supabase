import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />

            {/* Heading */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a] dark:text-white">Create account</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start your journey — it only takes a moment.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <Field label="Full name" icon={<User size={15} />} error={errors.name}>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        autoFocus
                        required
                        placeholder="John Doe"
                        className="block w-full rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-[#222] px-4 py-3 text-sm text-[#1a1a1a] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]/30 focus:border-[#1F6F5F] transition-colors"
                    />
                </Field>

                <Field label="Email address" icon={<Mail size={15} />} error={errors.email}>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="block w-full rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-[#222] px-4 py-3 text-sm text-[#1a1a1a] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]/30 focus:border-[#1F6F5F] transition-colors"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Password" icon={<Lock size={15} />} error={errors.password}>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                            placeholder="••••••••"
                            className="block w-full rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-[#222] px-4 py-3 text-sm text-[#1a1a1a] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]/30 focus:border-[#1F6F5F] transition-colors"
                        />
                    </Field>

                    <Field label="Confirm" icon={<Lock size={15} />} error={errors.password_confirmation}>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            required
                            placeholder="••••••••"
                            className="block w-full rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-[#222] px-4 py-3 text-sm text-[#1a1a1a] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]/30 focus:border-[#1F6F5F] transition-colors"
                        />
                    </Field>
                </div>

                <button
                    disabled={processing}
                    className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#1F6F5F] hover:bg-[#195f51] text-white font-bold text-sm py-3.5 transition-colors shadow-lg shadow-[#1F6F5F]/20 disabled:opacity-50"
                >
                    {processing ? 'Creating account…' : 'Create account'}
                    {!processing && <ArrowRight size={16} />}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href={route('login')} className="font-semibold text-[#1F6F5F] hover:underline">
                    Sign in
                </Link>
            </p>
        </GuestLayout>
    );
}

function Field({ label, icon, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span className="text-[#1F6F5F]">{icon}</span>
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
