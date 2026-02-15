import { useState } from 'react';
import Link from 'next/link';
import Input from '../common/Input';
import Button from '../common/Button';
import { useToast } from '@/context/ToastContext';

export default function AuthForm({ type, onSubmit }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (type === 'register') {
                await onSubmit(email, password, fullName);
            } else {
                await onSubmit(email, password);
            }
        } catch (err) {
            showToast(err.message || 'An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
            {/* Logo/Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold mb-4 shadow-lg">
                    S
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {type === 'login' ? 'Welcome Back' : 'Get Started'}
                </h2>
                <p className="text-slate-500 text-sm">
                    {type === 'login' ? 'Sign in to continue to SmartBook' : 'Create your account to get started'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {type === 'register' && (
                    <Input
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                    />
                )}
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                <Button type="submit" disabled={loading} variant="primary">
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        type === 'login' ? 'Sign In' : 'Create Account'
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                    {type === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                                Sign In
                            </Link>
                        </>
                    )}
                </p>
            </div>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-center text-slate-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
