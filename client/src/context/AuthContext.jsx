'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        showToast('Welcome back!', 'success');
        router.push('/dashboard');
    };

    const register = async (email, password, fullName) => {
        await api.post('/auth/register', { email, password, fullName });
        showToast('Account created successfully! Please login to continue.', 'success');
        router.push('/login');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
