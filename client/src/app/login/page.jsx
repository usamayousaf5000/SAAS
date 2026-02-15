'use client';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full">
                <AuthForm type="login" onSubmit={login} />
            </div>
        </div>
    );
}
