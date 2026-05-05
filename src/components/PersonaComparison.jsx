import { useState, useEffect } from "react";
import {
    FiArrowRight,
    FiTrendingUp,
    FiTrendingDown,
    FiZap,
    FiBarChart2,
    FiActivity,
} from "react-icons/fi";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
} from "recharts";

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

        return {
            val1: typeof val1 === 'number' ? val1.toFixed(2) : '0.00',
            val2: typeof val2 === 'number' ? val2.toFixed(2) : '0.00',
            difference: difference.toFixed(2),
            isPositive: difference >= 0,
        };
    };

    const mainValues = getMainValues();

    // Build grouped bar chart data from top20_summary
    const getBarChartData = () => {
        if (!comparisonData?.top20_summary) return [];
        const aData = comparisonData.top20_summary[personaA] || {};
        const bData = comparisonData.top20_summary[personaB] || {};
        const keys = Array.from(
            new Set([...Object.keys(aData), ...Object.keys(bData)])
        ).filter(k => typeof aData[k] === "number" || typeof bData[k] === "number");
        return keys.slice(0, 8).map(k => ({
            metric: k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            [personaA]: parseFloat((aData[k] || 0).toFixed(2)),
            [personaB]: parseFloat((bData[k] || 0).toFixed(2)),
        }));
    };

    // Build radar chart data (normalised 0–100)
    const getRadarData = () => {
        if (!comparisonData?.top20_summary) return [];
        const aData = comparisonData.top20_summary[personaA] || {};
        const bData = comparisonData.top20_summary[personaB] || {};
        const keys = Array.from(
            new Set([...Object.keys(aData), ...Object.keys(bData)])
        ).filter(k => typeof aData[k] === "number" || typeof bData[k] === "number");
        return keys.slice(0, 6).map(k => {
            const aVal = aData[k] || 0;
            const bVal = bData[k] || 0;
            const max = Math.max(aVal, bVal, 1);
            return {
                subject: k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                [personaA]: parseFloat(((aVal / max) * 100).toFixed(1)),
                [personaB]: parseFloat(((bVal / max) * 100).toFixed(1)),
            };
        });
    };

    const barData = getBarChartData();
    const radarData = getRadarData();

    const BarTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className={`px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs ${
                isDark ? "bg-slate-900/95 border-white/10 text-white" : "bg-white/95 border-slate-200 text-slate-800"
            }`}>
                <p className="font-bold text-slate-400 mb-2 uppercase tracking-widest">{label}</p>
                {payload.map((e, i) => (
                    <p key={i} style={{ color: e.color }} className="font-semibold">
                        {e.name}: {e.value}
                    </p>
                ))}
            </div>
        );
    };

    const RadarTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className={`px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs ${
                isDark ? "bg-slate-900/95 border-white/10 text-white" : "bg-white/95 border-slate-200 text-slate-800"
            }`}>
                <p className="font-bold text-slate-400 mb-2">{label}</p>
                {payload.map((e, i) => (
                    <p key={i} style={{ color: e.color }} className="font-semibold">
                        {e.name}: {e.value}%
                    </p>
                ))}
            </div>
        );
    };
    return (
        <div className={`min-h-screen p-6 ${
            isDark
                ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
                : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"
        }`}>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* ── HEADER ─────────────────────────────────────────── */}
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 mb-1">
                        Persona Comparison
                    </h1>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Side-by-side metric analysis across two user personas
                    </p>
                </div>

                {/* ── PERSONA SELECTORS ──────────────────────────────── */}
                <div className={`rounded-3xl border backdrop-blur-md p-6 ${
                    isDark ? "bg-white/5 border-white/10 shadow-2xl" : "bg-white/60 border-white shadow-lg"
                }`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-400">Persona A</label>
                            <select
                                value={personaA}
                                onChange={e => setPersonaA(e.target.value)}
                                className={`w-full px-4 py-3 rounded-2xl text-sm font-medium border transition-all outline-none ${
                                    isDark
                                        ? "bg-slate-900/80 border-cyan-500/30 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20"
                                        : "bg-white border-cyan-300 focus:border-cyan-500"
                                }`}
                            >
                                {allPersonas.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/30">
                                <FiArrowRight size={20} className="text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400">Persona B</label>
                            <select
                                value={personaB}
                                onChange={e => setPersonaB(e.target.value)}
                                className={`w-full px-4 py-3 rounded-2xl text-sm font-medium border transition-all outline-none ${
                                    isDark
                                        ? "bg-slate-900/80 border-emerald-500/30 focus:border-emerald-400 focus:shadow-lg focus:shadow-emerald-500/20"
                                        : "bg-white border-emerald-300 focus:border-emerald-500"
                                }`}
                            >
                                {allPersonas.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── WARNINGS / STATES ─────────────────────────────── */}
                {personaA === personaB && (
                    <div className={`rounded-2xl p-4 text-center text-sm font-medium ${
                        isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                        Select two different personas to compare
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className={`animate-spin rounded-full h-12 w-12 border-2 border-transparent ${
                            isDark ? "border-t-cyan-400 border-r-emerald-400" : "border-t-cyan-500 border-r-emerald-500"
                        }`} />
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Comparing personas…</p>
                    </div>
                )}

                {error && (
                    <div className={`rounded-2xl p-4 text-center text-sm font-medium ${
                        isDark ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                        Error: {error}
                    </div>
                )}

                {/* ── MAIN CONTENT ──────────────────────────────────── */}
                {comparisonData && personaA !== personaB && mainValues && (
                    <div className="space-y-8">

                        {/* KPI HERO CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Val 1 */}
                            <div className={`rounded-3xl border backdrop-blur-md p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                                isDark
                                    ? "bg-gradient-to-br from-cyan-500/15 via-cyan-600/5 to-transparent border-cyan-500/40 shadow-xl shadow-cyan-500/10"
                                    : "bg-gradient-to-br from-cyan-100 via-cyan-50 to-white border-cyan-300 shadow-lg"
                            }`}>
                                <p className="text-xs uppercase tracking-[0.3em] font-black text-cyan-400 mb-4">{personaA}</p>
                                <p className="text-6xl font-black text-cyan-400 drop-shadow-lg mb-4">{mainValues.val1}</p>
                                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mb-4" />
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <FiZap size={13} className="text-cyan-400" />
                                    <span>Primary Value</span>
                                </div>
                            </div>

                            {/* Difference */}
                            <div className="flex items-center justify-center">
                                <div className={`rounded-3xl border backdrop-blur-md p-8 text-center w-full ${
                                    mainValues.isPositive
                                        ? isDark ? "bg-gradient-to-br from-emerald-500/15 via-emerald-600/5 to-transparent border-emerald-500/40 shadow-xl shadow-emerald-500/10"
                                               : "bg-gradient-to-br from-emerald-100 via-emerald-50 to-white border-emerald-300 shadow-lg"
                                        : isDark ? "bg-gradient-to-br from-rose-500/15 via-rose-600/5 to-transparent border-rose-500/40 shadow-xl shadow-rose-500/10"
                                               : "bg-gradient-to-br from-rose-100 via-rose-50 to-white border-rose-300 shadow-lg"
                                }`}>
                                    <div className="flex justify-center mb-4">
                                        <div className={`p-3 rounded-2xl ${mainValues.isPositive ? (isDark ? "bg-emerald-500/20" : "bg-emerald-200/60") : (isDark ? "bg-rose-500/20" : "bg-rose-200/60")}`}>
                                            {mainValues.isPositive
                                                ? <FiTrendingUp size={22} className="text-emerald-400" />
                                                : <FiTrendingDown size={22} className="text-rose-400" />}
                                        </div>
                                    </div>
                                    <p className={`text-5xl font-black drop-shadow-lg ${mainValues.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                                        {parseFloat(mainValues.difference) > 0 ? "+" : ""}{mainValues.difference}
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mt-3">Difference</p>
                                </div>
                            </div>

                            {/* Val 2 */}
                            <div className={`rounded-3xl border backdrop-blur-md p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                                isDark
                                    ? "bg-gradient-to-br from-emerald-500/15 via-emerald-600/5 to-transparent border-emerald-500/40 shadow-xl shadow-emerald-500/10"
                                    : "bg-gradient-to-br from-emerald-100 via-emerald-50 to-white border-emerald-300 shadow-lg"
                            }`}>
                                <p className="text-xs uppercase tracking-[0.3em] font-black text-emerald-400 mb-4">{personaB}</p>
                                <p className="text-6xl font-black text-emerald-400 drop-shadow-lg mb-4">{mainValues.val2}</p>
                                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent mb-4" />
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <FiZap size={13} className="text-emerald-400" />
                                    <span>Primary Value</span>
                                </div>
                            </div>
                        </div>

                        {/* GROUPED BAR CHART */}
                        {barData.length > 0 && (
                            <div className={`rounded-3xl border backdrop-blur-md p-6 ${
                                isDark ? "bg-white/5 border-white/10 shadow-xl" : "bg-white/60 border-white shadow-lg"
                            }`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-2 rounded-xl ${isDark ? "bg-cyan-500/15" : "bg-cyan-100"}`}>
                                        <FiBarChart2 size={16} className="text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-sm">Metric Breakdown</h2>
                                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Top metrics compared side by side</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4 text-xs">
                                        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                                            {personaA}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                                            {personaB}
                                        </span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={barData} barCategoryGap="35%" barGap={4}>
                                        <defs>
                                            <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#0891b2" stopOpacity={0.5} />
                                            </linearGradient>
                                            <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#059669" stopOpacity={0.5} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"} vertical={false} />
                                        <XAxis dataKey="metric" tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} width={45} />
                                        <Tooltip content={<BarTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
                                        <Bar dataKey={personaA} fill="url(#gradA)" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey={personaB} fill="url(#gradB)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* RADAR CHART */}
                        {radarData.length > 0 && (
                            <div className={`rounded-3xl border backdrop-blur-md p-6 ${
                                isDark ? "bg-white/5 border-white/10 shadow-xl" : "bg-white/60 border-white shadow-lg"
                            }`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-2 rounded-xl ${isDark ? "bg-emerald-500/15" : "bg-emerald-100"}`}>
                                        <FiActivity size={16} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-sm">Profile Radar</h2>
                                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Normalised metric coverage (0–100)</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4 text-xs">
                                        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                                            {personaA}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                                            {personaB}
                                        </span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                                        <PolarGrid stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }} />
                                        <Radar name={personaA} dataKey={personaA} stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                                        <Radar name={personaB} dataKey={personaB} stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                                        <Tooltip content={<RadarTooltip />} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* SUMMARY FOOTER */}
                        <div className={`rounded-2xl border backdrop-blur-md p-8 ${
                            isDark ? "bg-white/5 border-white/10 shadow-lg" : "bg-white/60 border-white shadow-md"
                        }`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                                <div className="space-y-2 py-4 md:py-0">
                                    <p className="text-xs text-slate-400 uppercase tracking-[0.15em] font-bold">Value 1</p>
                                    <p className="text-4xl font-black text-cyan-400">{mainValues.val1}</p>
                                    <p className="text-xs text-slate-500">{personaA}</p>
                                </div>
                                <div className="space-y-2 py-4 md:py-0 flex flex-col items-center justify-center">
                                    <p className="text-xs text-slate-400 uppercase tracking-[0.15em] font-bold">Δ Difference</p>
                                    <p className={`text-4xl font-black ${mainValues.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                                        {parseFloat(mainValues.difference) > 0 ? "+" : ""}{mainValues.difference}
                                    </p>
                                </div>
                                <div className="space-y-2 py-4 md:py-0">
                                    <p className="text-xs text-slate-400 uppercase tracking-[0.15em] font-bold">Value 2</p>
                                    <p className="text-4xl font-black text-emerald-400">{mainValues.val2}</p>
                                    <p className="text-xs text-slate-500">{personaB}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
