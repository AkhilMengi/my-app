import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDark, setIsDark] = useState(true);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Login:', { email, password });
        }, 2000);
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
                {isDark ? '🌙' : '☀️'}
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
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isDark
                                        ? 'bg-gradient-to-br from-cyan-400 to-purple-600'
                                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                                        }`}
                                >
                                    ⚡
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
                                        icon: '⚡',
                                        title: 'Smart Monitoring',
                                        desc: 'Real-time energy tracking',
                                    },
                                    {
                                        icon: '📊',
                                        title: 'Advanced Analytics',
                                        desc: 'Predictive insights',
                                    },
                                    {
                                        icon: '💡',
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
                                                <span className="text-2xl">{feature.icon}</span>
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

                        <form onSubmit={handleLogin} className="space-y-2">
                            {/* Email */}
                            <div>
                                <label
                                    className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'
                                        }`}
                                >
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
                                        ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                                        }`}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'
                                        }`}
                                >
                                    Password
                                </label>

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
                                        ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                                        }`}
                                />
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="my-5 text-center text-slate-400 text-sm">
                            Or continue with
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full  py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In with SSO'}
                        </button>

                        <div className="text-center mt-6 text-sm text-slate-400">
                            Don’t have an account?{' '}
                            <span className="text-cyan-400">Sign up</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}