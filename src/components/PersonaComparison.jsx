import { useState, useEffect } from "react";
import {
    FiBarChart2,
    FiArrowRight,
    FiTrendingUp,
    FiTrendingDown,
    FiZap,
    FiUsers,
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
    Cell,
} from "recharts";

export default function PersonaComparison({ isDark = true }) {
    const [personaA, setPersonaA] = useState("Persona A");
    const [personaB, setPersonaB] = useState("Persona B");
    const [allPersonas, setAllPersonas] = useState([]);
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const card = isDark
        ? "bg-white/5 border-white/10"
        : "bg-white border-slate-200";

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

    // Transform comparison data for bar chart
    const getChartData = () => {
        if (!comparisonData?.top20_summary) return [];

        const summary = comparisonData.top20_summary;
        const personaAData = summary[personaA] || {};
        const personaBData = summary[personaB] || {};

        const keys = Array.from(
            new Set([...Object.keys(personaAData), ...Object.keys(personaBData)])
        ).filter(key => typeof personaAData[key] === 'number' || typeof personaBData[key] === 'number');

        return keys.slice(0, 10).map(key => ({
            name: key,
            [personaA]: personaAData[key] || 0,
            [personaB]: personaBData[key] || 0,
        }));
    };

    // Get difference data
    const getDifferenceData = () => {
        if (!comparisonData?.difference_a_minus_b) return [];

        const diffs = comparisonData.difference_a_minus_b;
        return Object.entries(diffs).map(([key, value]) => {
            const numValue = typeof value === 'number' ? value : 0;
            const personaAval = comparisonData.top20_summary?.[personaA]?.[key];
            
            // Calculate percentage - if personaAval is 0 or undefined, use difference as base
            let percentage = "0.00";
            if (personaAval && numValue !== 0) {
                percentage = ((numValue / personaAval) * 100).toFixed(2);
            } else if (!personaAval && numValue !== 0) {
                // If no base value, show 0% as fallback
                percentage = "0.00";
            }

            // Debug logging
            if (key.includes('val') || key.includes('metric')) {
                console.log(`${key}: personaAval=${personaAval}, numValue=${numValue}, percentage=${percentage}`);
            }

            return {
                name: key,
                difference: numValue.toFixed(2),
                percentage: percentage,
                isPositive: numValue >= 0,
            };
        });
    };

    const chartData = getChartData();
    const differenceData = getDifferenceData();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className={`px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl ${
                        isDark
                            ? "bg-slate-900/95 border-white/10 text-white"
                            : "bg-white/95 border-slate-200 text-slate-900"
                    }`}
                >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">
                        {label}
                    </p>
                    {payload.map((entry, idx) => {
                        const entryName = entry?.name || entry?.dataKey || `Value ${idx + 1}`;
                        const entryValue = entry?.value ?? 0;
                        return (
                            <p key={idx} style={{ color: entry?.color }} className="font-semibold">
                                {entryName}: {typeof entryValue === 'number' ? entryValue.toFixed(2) : entryValue}
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className={`min-h-screen p-4 sm:p-5 ${
                isDark
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-900"
            }`}
        >
            <div className="max-w-7xl mx-auto space-y-4">
                {/* HEADER */}
                <div className="flex flex-wrap justify-between gap-2 items-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black">
                            Persona Comparison
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Compare metrics between two personas
                        </p>
                    </div>
                </div>

                {/* SELECTORS */}
                <div className={`rounded-2xl border p-5 ${card}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        {/* Persona A Selector */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.18em] font-semibold text-slate-400">
                                Persona A
                            </label>
                            <select
                                value={personaA}
                                onChange={(e) => setPersonaA(e.target.value)}
                                className={`w-full px-3 py-3 rounded-2xl text-sm border transition-all outline-none shadow-sm ${
                                    isDark
                                        ? "bg-slate-900/80 border-white/10 focus:border-cyan-400 focus:bg-slate-900"
                                        : "bg-white border-slate-200 focus:border-cyan-500"
                                }`}
                            >
                                {allPersonas.map((persona) => (
                                    <option key={persona} value={persona}>
                                        {persona}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                            <FiArrowRight
                                size={24}
                                className={isDark ? "text-cyan-400" : "text-cyan-600"}
                            />
                        </div>

                        {/* Persona B Selector */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.18em] font-semibold text-slate-400">
                                Persona B
                            </label>
                            <select
                                value={personaB}
                                onChange={(e) => setPersonaB(e.target.value)}
                                className={`w-full px-3 py-3 rounded-2xl text-sm border transition-all outline-none shadow-sm ${
                                    isDark
                                        ? "bg-slate-900/80 border-white/10 focus:border-cyan-400 focus:bg-slate-900"
                                        : "bg-white border-slate-200 focus:border-cyan-500"
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

                {/* MESSAGE */}
                {personaA === personaB && (
                    <div
                        className={`rounded-xl p-4 text-center text-sm font-medium ${
                            isDark
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                    >
                        Please select two different personas to compare
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div
                            className={`animate-spin rounded-full h-8 w-8 border-2 border-transparent ${
                                isDark
                                    ? "border-t-cyan-400 border-r-cyan-400"
                                    : "border-t-cyan-600 border-r-cyan-600"
                            }`}
                        ></div>
                    </div>
                )}

                {error && (
                    <div className="text-red-400 text-sm p-4 text-center rounded-xl border border-red-500/20 bg-red-500/10">
                        Error: {error}
                    </div>
                )}

                {comparisonData && personaA !== personaB && (
                    <>
                        {/* COMPARISON CHART */}
                        <div className={`rounded-2xl border p-4 ${card}`}>
                            <div className="flex justify-between mb-4">
                                <h2 className="font-bold text-sm">
                                    Metrics Comparison
                                </h2>
                                <span className="text-xs flex items-center gap-1 text-emerald-400">
                                    <FiZap size={12} />
                                    Live
                                </span>
                            </div>

                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            opacity={0.1}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey={personaA}
                                            fill={colors.personaA}
                                            radius={[8, 8, 0, 0]}
                                        />
                                        <Bar
                                            dataKey={personaB}
                                            fill={colors.personaB}
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center text-slate-400 py-8">
                                    No comparison data available
                                </div>
                            )}
                        </div>

                        {/* DIFFERENCES */}
                        <div className={`rounded-2xl border p-4 ${card}`}>
                            <h2 className="font-bold text-sm mb-4">
                                {personaA} vs {personaB} - Difference
                            </h2>

                            {differenceData.length > 0 ? (
                                <div className="space-y-3">
                                    {differenceData.map((item, idx) => {
                                        if (!item || !item.name) return null;
                                        return (
                                        <div
                                            key={idx}
                                            className={`rounded-xl p-4 border flex justify-between items-center ${
                                                isDark
                                                    ? "bg-white/5 border-white/10"
                                                    : "bg-white/50 border-slate-200"
                                            }`}
                                        >
                                            <div>
                                                <h3 className="font-semibold text-sm mb-1">
                                                    {item.name || 'Unknown'}
                                                </h3>
                                                <div className="flex gap-4 text-xs">
                                                    <span className="text-slate-400">
                                                        Absolute: {parseFloat(item.difference || 0) > 0 ? "+" : ""}{item.difference || '0.00'}
                                                    </span>
                                                    <span className="text-slate-400">
                                                        Percentage: {parseFloat(item.percentage || 0) > 0 ? "+" : ""}{item.percentage || '0.00'}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`flex items-center gap-2 ${
                                                    item.isPositive
                                                        ? "text-emerald-400"
                                                        : "text-red-400"
                                                }`}
                                            >
                                                {item.isPositive ? (
                                                    <FiTrendingUp size={16} />
                                                ) : (
                                                    <FiTrendingDown size={16} />
                                                )}
                                                <span className="font-bold">
                                                    {parseFloat(item.percentage || 0) > 0 ? "+" : ""}{item.percentage || '0.00'}%
                                                </span>
                                            </div>
                                        </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 py-8">
                                    No difference data available
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
