import { useState, useEffect } from "react";
import {
    FiArrowRight,
    FiTrendingUp,
    FiTrendingDown,
    FiZap,
} from "react-icons/fi";

export default function PersonaComparison({ isDark = true }) {
    const [personaA, setPersonaA] = useState("Persona A");
    const [personaB, setPersonaB] = useState("Persona B");
    const [allPersonas, setAllPersonas] = useState([]);
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const colors = {
        personaA: "#06b6d4",
        personaB: "#10b981",
        positive: "#10b981",
        negative: "#ef4444",
    };

    // Fetch available personas on mount
    useEffect(() => {
        const fetchPersonas = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/personas"
                );
                if (response.ok) {
                    const data = await response.json();
                    const personas = data.personas || [];
                    setAllPersonas(personas);
                    if (personas.length >= 2) {
                        setPersonaA(personas[0]);
                        setPersonaB(personas[1]);
                    }
                }
            } catch (err) {
                console.error("Error fetching personas:", err);
            }
        };
        fetchPersonas();
    }, []);

    // Fetch comparison data when personas change
    useEffect(() => {
        if (!personaA || !personaB || personaA === personaB) {
            setComparisonData(null);
            return;
        }

        const fetchComparisonData = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.append("persona_a", personaA);
                params.append("persona_b", personaB);

                const response = await fetch(
                    `http://localhost:8000/api/persona-comparison?${params.toString()}`
                );

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();
                console.log("Comparison Data:", data);
                console.log("Persona A Summary:", data.top20_summary?.[personaA]);
                console.log("Persona B Summary:", data.top20_summary?.[personaB]);
                console.log("Differences:", data.difference_a_minus_b);
                setComparisonData(data);
            } catch (err) {
                console.error("Error fetching comparison data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComparisonData();
    }, [personaA, personaB]);

    // Get the main metric values (val1 and val2)
    const getMainValues = () => {
        if (!comparisonData?.top20_summary) return null;

        const summary = comparisonData.top20_summary;
        const personaAData = summary[personaA] || {};
        const personaBData = summary[personaB] || {};

        // Get first numeric value from each persona
        const val1 = Object.values(personaAData).find(v => typeof v === 'number') || 0;
        const val2 = Object.values(personaBData).find(v => typeof v === 'number') || 0;

        // Calculate difference
        const difference = val2 - val1;
        const percentage = val1 !== 0 ? ((difference / val1) * 100).toFixed(2) : "0.00";

        return {
            val1: typeof val1 === 'number' ? val1.toFixed(2) : '0.00',
            val2: typeof val2 === 'number' ? val2.toFixed(2) : '0.00',
            difference: difference.toFixed(2),
            percentage: percentage,
            isPositive: difference >= 0,
        };
    };

    const mainValues = getMainValues();

    return (
        <div
            className={`min-h-screen p-6 ${
                isDark
                    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
                    : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"
            }`}
        >
            <div className="max-w-6xl mx-auto space-y-8">
                {/* HEADER */}
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2">
                        Persona Comparison
                    </h1>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Compare two personas at a glance
                    </p>
                </div>

                {/* PERSONA SELECTORS */}
                <div
                    className={`rounded-3xl border backdrop-blur-sm p-6 ${
                        isDark
                            ? "bg-white/5 border-white/10 shadow-2xl"
                            : "bg-white/50 border-white shadow-lg"
                    }`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* Persona A */}
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-400">
                                Persona A
                            </label>
                            <select
                                value={personaA}
                                onChange={(e) => setPersonaA(e.target.value)}
                                className={`w-full px-4 py-3 rounded-2xl text-sm font-medium border transition-all outline-none ${
                                    isDark
                                        ? "bg-slate-900/80 border-cyan-500/30 focus:border-cyan-400 focus:bg-slate-900 focus:shadow-lg focus:shadow-cyan-400/20"
                                        : "bg-white border-cyan-300 focus:border-cyan-500 focus:shadow-lg"
                                }`}
                            >
                                {allPersonas.map((persona) => (
                                    <option key={persona} value={persona}>
                                        {persona}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Arrow Divider */}
                        <div className="flex justify-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500">
                                <FiArrowRight size={20} className="text-white" />
                            </div>
                        </div>

                        {/* Persona B */}
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400">
                                Persona B
                            </label>
                            <select
                                value={personaB}
                                onChange={(e) => setPersonaB(e.target.value)}
                                className={`w-full px-4 py-3 rounded-2xl text-sm font-medium border transition-all outline-none ${
                                    isDark
                                        ? "bg-slate-900/80 border-emerald-500/30 focus:border-emerald-400 focus:bg-slate-900 focus:shadow-lg focus:shadow-emerald-400/20"
                                        : "bg-white border-emerald-300 focus:border-emerald-500 focus:shadow-lg"
                                }`}
                            >
                                {allPersonas.map((persona) => (
                                    <option key={persona} value={persona}>
                                        {persona}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ERROR STATE */}
                {personaA === personaB && (
                    <div
                        className={`rounded-2xl p-4 text-center text-sm font-medium ${
                            isDark
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                    >
                        Please select two different personas
                    </div>
                )}

                {/* LOADING STATE */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className={`animate-spin rounded-full h-12 w-12 border-2 border-transparent ${
                                    isDark
                                        ? "border-t-cyan-400 border-r-emerald-400"
                                        : "border-t-cyan-500 border-r-emerald-500"
                                }`}
                            ></div>
                            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                Comparing personas...
                            </p>
                        </div>
                    </div>
                )}

                {/* ERROR STATE */}
                {error && (
                    <div className={`rounded-2xl p-4 text-center text-sm font-medium ${
                        isDark
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                        Error: {error}
                    </div>
                )}

                {/* COMPARISON DISPLAY */}
                {comparisonData && personaA !== personaB && mainValues && (
                    <div className="space-y-8">
                        {/* VALUES COMPARISON */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Persona A Value */}
                            <div
                                className={`rounded-3xl border backdrop-blur-sm p-8 text-center transition-all hover:shadow-2xl ${
                                    isDark
                                        ? "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/30 shadow-xl shadow-cyan-500/10"
                                        : "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300 shadow-lg"
                                }`}
                            >
                                <p className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-400 mb-4">
                                    {personaA}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-5xl font-black text-cyan-400">
                                        {mainValues.val1}
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <FiZap size={16} className="text-cyan-400" />
                                        <span className="text-xs text-slate-400">Primary Value</span>
                                    </div>
                                </div>
                            </div>

                            {/* Difference Badge */}
                            <div className="flex items-center justify-center">
                                <div
                                    className={`rounded-2xl border backdrop-blur-sm p-6 text-center ${
                                        mainValues.isPositive
                                            ? isDark
                                                ? "bg-emerald-500/10 border-emerald-500/30"
                                                : "bg-emerald-50 border-emerald-300"
                                            : isDark
                                            ? "bg-red-500/10 border-red-500/30"
                                            : "bg-red-50 border-red-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        {mainValues.isPositive ? (
                                            <FiTrendingUp className={mainValues.isPositive ? "text-emerald-400" : "text-red-400"} />
                                        ) : (
                                            <FiTrendingDown className={mainValues.isPositive ? "text-emerald-400" : "text-red-400"} />
                                        )}
                                    </div>
                                    <p className={`text-3xl font-black ${mainValues.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                                        {parseFloat(mainValues.percentage) > 0 ? "+" : ""}{mainValues.percentage}%
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {parseFloat(mainValues.difference) > 0 ? "+" : ""}{mainValues.difference}
                                    </p>
                                </div>
                            </div>

                            {/* Persona B Value */}
                            <div
                                className={`rounded-3xl border backdrop-blur-sm p-8 text-center transition-all hover:shadow-2xl ${
                                    isDark
                                        ? "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30 shadow-xl shadow-emerald-500/10"
                                        : "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 shadow-lg"
                                }`}
                            >
                                <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400 mb-4">
                                    {personaB}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-5xl font-black text-emerald-400">
                                        {mainValues.val2}
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <FiZap size={16} className="text-emerald-400" />
                                        <span className="text-xs text-slate-400">Primary Value</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STATS FOOTER */}
                        <div
                            className={`rounded-2xl border backdrop-blur-sm p-6 ${
                                isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-white/50 border-white"
                            }`}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-[0.1em]">Diff</p>
                                    <p className={`text-lg font-bold mt-1 ${mainValues.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                                        {mainValues.difference}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-[0.1em]">Change</p>
                                    <p className={`text-lg font-bold mt-1 ${mainValues.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                                        {mainValues.percentage}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-[0.1em]">Val1</p>
                                    <p className="text-lg font-bold text-cyan-400 mt-1">{mainValues.val1}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-[0.1em]">Val2</p>
                                    <p className="text-lg font-bold text-emerald-400 mt-1">{mainValues.val2}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
