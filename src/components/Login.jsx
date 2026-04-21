import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiEye, FiEyeOff, FiBarChart2, FiCpu } from 'react-icons/fi';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import credentials from '../data/credentials.json';

export default function Login({ onLoginSuccess, isDark, setIsDark }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // Check if already logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            onLoginSuccess();
        }
    }, [onLoginSuccess]);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            const user = credentials.users.find(
                (u) => u.email === email && u.password === password
            );

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', user.name);
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                console.log('Login successful:', user);
                setIsLoading(false);
                onLoginSuccess();
            } else {
                setError('Invalid email or password');
                setIsLoading(false);
            }
        }, 1500);
    };

    const handleSSO = (provider) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('SSO:', provider);
        }, 1500);
    };

    return (
        <div
            className={`min-h-screen w-full flex items-center justify-center font-sans overflow-hidden p-2 transition-colors duration-500 ${isDark
                ? 'bg-slate-950'
                : 'bg-gradient-to-br from-slate-50 to-slate-100'
                }`}
        >
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {isDark ? (
                    <>
                        <div className="absolute top-20 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                        <div
                            className="absolute top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-transparent rounded-full blur-3xl animate-pulse"
                            style={{ animationDelay: '1s' }}
                        ></div>
                        <div
                            className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/15 via-blue-400/5 to-transparent rounded-full blur-3xl animate-pulse"
                            style={{ animationDelay: '2s' }}
                        ></div>
                    </>
                ) : (
                    <>
                        <div className="absolute top-20 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-300/30 via-cyan-200/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
                        <div
                            className="absolute top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-purple-300/25 via-purple-200/10 to-transparent rounded-full blur-3xl animate-pulse"
                            style={{ animationDelay: '1s' }}
                        ></div>
                        <div
                            className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-300/25 via-blue-200/10 to-transparent rounded-full blur-3xl animate-pulse"
                            style={{ animationDelay: '2s' }}
                        ></div>
                    </>
                )}
            </div>

            {/* Grid overlay */}
            <div
                className={`absolute inset-0 pointer-events-none opacity-[0.15] ${isDark
                    ? 'bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)]'
                    : 'bg-[linear-gradient(rgba(0,0,0,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.08)_1px,transparent_1px)]'
                    }`}
                style={{ backgroundSize: '50px 50px' }}
            ></div>

            {/* Theme toggle */}
            <button
                onClick={() => setIsDark(!isDark)}
                className={`fixed top-4 right-6 z-50 p-3 rounded-xl backdrop-blur-xl transition-all duration-300 border hover:scale-110 transform group ${isDark
                    ? 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/80 text-amber-400 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-400/30'
                    : 'bg-white/60 border-slate-300/60 hover:bg-white/80 text-slate-700 hover:text-slate-900 hover:shadow-lg hover:shadow-slate-400/20'
                    }`}
            >
                {isDark ? <FiMoon /> : <FiSun />}
            </button>

            {/* MAIN CONTAINER - HEIGHT REDUCED ONLY */}
            <div className="relative w-[98%] md:w-[90%] lg:w-[75%] max-w-4xl md:min-h-[540px] lg:min-h-[500px]">
                {/* Login card */}
                <div
                    className={`w-full h-full flex flex-col md:flex-row rounded-3xl overflow-hidden transition-all duration-500 backdrop-blur-xl border ${isDark
                        ? 'bg-slate-900/70 border-slate-700/60 shadow-2xl shadow-black/50'
                        : 'bg-white/80 border-slate-200/60 shadow-2xl shadow-slate-400/20'
                        }`}
                >
                    {/* LEFT PANEL */}
                    <div
                        className={`hidden md:flex md:w-1/2 p-7 flex-col justify-between relative overflow-hidden transition-all duration-500 ${isDark
                            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/60'
                            : 'bg-gradient-to-br from-slate-100 via-slate-50 to-white border-r border-slate-300/60'
                            }`}
                    >
                        <div className="absolute inset-0 opacity-30">
                            <div
                                className={`absolute top-10 right-10 w-48 h-48 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-300/30'
                                    }`}
                            ></div>
                            <div
                                className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-300/25'
                                    }`}
                            ></div>
                        </div>

                        <div className="relative z-10 animate-fade-in">
                            <div className="flex items-center gap-4 mb-8">
                                <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-2xl ${isDark
                                        ? 'bg-gradient-to-br from-cyan-400 to-purple-600'
                                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                                        }`}
                                >
                                    <HiOutlineLightningBolt />
                                </div>

                                <div>
                                    <h1
                                        className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'
                                            }`}
                                    >
                                        SmartTariff
                                    </h1>
                                    <p
                                        className={`text-sm font-bold tracking-widest ${isDark ? 'text-cyan-400' : 'text-blue-600'
                                            }`}
                                    >
                                        AI POWERED
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: <HiOutlineLightningBolt className="text-xl" />,
                                        title: 'Smart Monitoring',
                                        desc: 'Real-time energy tracking',
                                    },
                                    {
                                        icon: <FiBarChart2 className="text-xl" />,
                                        title: 'Advanced Analytics',
                                        desc: 'Predictive insights',
                                    },
                                    {
                                        icon: <FiCpu className="text-xl" />,
                                        title: 'AI Optimization',
                                        desc: 'Cost reduction algorithms',
                                    },
                                ].map((feature, i) => (
                                    <div key={i}>
                                        <div
                                            className={`p-4 rounded-xl border ${isDark
                                                ? 'bg-slate-800/40 border-cyan-500/30'
                                                : 'bg-blue-50/60 border-blue-300/40'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl text-cyan-400">{feature.icon}</span>
                                                <div>
                                                    <p
                                                        className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'
                                                            }`}
                                                    >
                                                        {feature.title}
                                                    </p>
                                                    <p
                                                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'
                                                            }`}
                                                    >
                                                        {feature.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p
                            className={`text-sm text-center ${isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}
                        >
                            Trusted by 10,000+ businesses worldwide
                        </p>
                    </div>

                    {/* RIGHT PANEL */}
                    <div
                        className={`w-full md:w-1/2 p-6 md:p-7 flex flex-col justify-center transition-all duration-500 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'
                            }`}
                    >
                        <div className="mb-2 text-center">
                            <h2 className={`text-4xl ${isDark ? "text-white" : "text-slate-600"
                                }`}>Welcome Back</h2>

                            <p
                                className={` mb-8 p-2 text-md ${isDark ? "text-slate-400" : "text-slate-600"
                                    }`}
                            >
                                Sign in to manage your energy efficiently
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-3">
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${isDark
                                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all pr-11 ${isDark
                                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <label className={`flex items-center space-x-2 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    ❌ {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full mt-6 py-3 rounded-lg font-bold transition-all duration-300 text-white ${
                                    isLoading
                                        ? 'bg-gradient-to-r from-cyan-500/50 to-purple-600/50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg hover:shadow-cyan-400/50 hover:scale-105'
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <span className="inline-block animate-spin">⏳</span>
                                        <span>Signing in...</span>
                                    </span>
                                ) : (
                                    '🔐 Sign In'
                                )}
                            </button>
                        </form>

                        <div className="my-5 text-center text-slate-400 text-sm flex items-center space-x-2">
                            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                            <span>Or continue with</span>
                            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                        </div>

                        <button
                            type="button"
                            className={`w-full py-3 rounded-lg border font-semibold transition-all duration-300 ${
                                isDark
                                    ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-700/50'
                                    : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                            }`}
                        >
                            🔐 Sign In with SSO
                        </button>

                        <div className="text-center mt-6 text-sm">
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                Don't have an account?{' '}
                            </span>
                            <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-semibold transition-colors">
                                Sign up
                            </span>
                        </div>

                        <div className={`mt-6 p-4 rounded-lg border backdrop-blur ${isDark ? 'bg-blue-500/10 border-blue-400/30' : 'bg-blue-50 border-blue-300/50'}`}>
                            <p className={`text-xs font-bold mb-3 flex items-center space-x-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                                <span>📝</span>
                                <span>Demo Credentials</span>
                            </p>
                            <div className={`space-y-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                <div className={`p-2 rounded ${isDark ? 'bg-slate-800/40' : 'bg-white/70'}`}>
                                    <p className="font-semibold">User Account</p>
                                    <p>📧 user@example.com</p>
                                    <p>🔑 password123</p>
                                </div>
                                <div className={`p-2 rounded ${isDark ? 'bg-slate-800/40' : 'bg-white/70'}`}>
                                    <p className="font-semibold">Admin Account</p>
                                    <p>📧 admin@example.com</p>
                                    <p>🔑 admin123</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}