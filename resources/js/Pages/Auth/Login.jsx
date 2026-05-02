import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            {/* Heading */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a] dark:text-white">Sign in</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your account.</p>
            </div>

            {status && (
                <p className="mb-6 text-sm font-medium text-[#1F6F5F] bg-[#1F6F5F]/8 border border-[#1F6F5F]/15 rounded-xl px-4 py-3">
                    {status}
                </p>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <Field label="Email address" icon={<Mail size={15} />} error={errors.email}>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        autoFocus
                        required
                        placeholder="you@example.com"
                        className="block w-full rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-[#222] px-4 py-3 text-sm text-[#1a1a1a] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]/30 focus:border-[#1F6F5F] transition-colors"
                    />
                </Field>

                {/* Password */}
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

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-[#1F6F5F] focus:ring-[#1F6F5F] w-4 h-4"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Remember me</span>
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-sm font-semibold text-[#1F6F5F] hover:underline">
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Submit */}
                <button
                    disabled={processing}
                    className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#1F6F5F] hover:bg-[#195f51] text-white font-bold text-sm py-3.5 transition-colors shadow-lg shadow-[#1F6F5F]/20 disabled:opacity-50"
                >
                    {processing ? 'Signing in…' : 'Sign in'}
                    {!processing && <ArrowRight size={16} />}
                </button>
            </form>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-gray-500">
                No account yet?{' '}
                <Link href={route('register')} className="font-semibold text-[#1F6F5F] hover:underline">
                    Create one
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
