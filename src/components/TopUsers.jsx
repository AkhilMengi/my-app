import { useState, useEffect } from "react";
import {
    FiUsers,
    FiTrendingUp,
    FiActivity,
    FiZap,
} from "react-icons/fi";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function TopUsers({ isDark = true }) {
    const [topUsersData, setTopUsersData] = useState([]);
    const [stats, setStats] = useState({
        totalUniqueUsers: 0,
        totalTopUsers: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const card = isDark
        ? "bg-white/5 border-white/10"
        : "bg-white border-slate-200";

    const colors = [
        "#7dd3e8", // muted sky
        "#b4a7d6", // muted lavender
        "#86c9b0", // muted sage
        "#f0c98a", // muted sand
        "#f0a0a0", // muted rose
        "#f4b8d0", // muted blush
        "#93b8e8", // muted periwinkle
        "#80cec8", // muted seafoam
        "#f5c09a", // muted peach
        "#a5aae8", // muted slate-blue
    ];

    useEffect(() => {
        const fetchTopUsersData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    "http://localhost:8000/api/top-users"
                );
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const apiData = await response.json();
                console.log("Top Users API Response:", apiData);

                // Extract and transform data
                const totalUniqueUsers = apiData.total_unique_users || 0;
                const totalTopUsers = apiData.total_top_users || 0;
                const countPerPersona = apiData.count_per_persona || {};

                // Transform persona data for pie chart
                const pieData = Object.entries(countPerPersona).map(
                    ([persona, count], index) => ({
                        name: persona.charAt(0).toUpperCase() + persona.slice(1),
                        value: count,
                        originalName: persona,
                        color: colors[index % colors.length],
                    })
                );

                setStats({
                    totalUniqueUsers,
                    totalTopUsers,
                });
                setTopUsersData(pieData);
            } catch (err) {
                console.error("Error fetching top users data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopUsersData();
    }, []);

    const CustomTooltip = ({ active, payload }) => {
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
                        {payload[0].name}
                    </p>
                    <p className="text-lg font-black mt-1">
                        {payload[0].value}
                    </p>
                    <p className="text-[11px] text-slate-400">Users</p>
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
                            Top Users
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            User personas distribution & insights
                        </p>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-400">
                                Total Unique Users
                            </span>
                            <span className="text-cyan-400">
                                <FiUsers />
                            </span>
                        </div>
                        <h2 className="text-xl font-black mt-2">
                            {stats.totalUniqueUsers}
                        </h2>
                    </div>

                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-400">
                                Total Top Users
                            </span>
                            <span className="text-purple-400">
                                <FiTrendingUp />
                            </span>
                        </div>
                        <h2 className="text-xl font-black mt-2">
                            {stats.totalTopUsers}
                        </h2>
                    </div>
                </div>

                {/* PIE CHART SECTION */}
                <div className="grid lg:grid-cols-3 gap-4">
                    {/* Chart Container */}
                    <div
                        className={`lg:col-span-2 rounded-2xl border p-4 ${card}`}
                    >
                        <div className="flex justify-between mb-3">
                            <h2 className="font-bold text-sm">
                                User Personas Distribution
                            </h2>
                            <span
                                className={`text-xs flex items-center gap-1 ${
                                    loading
                                        ? "text-amber-400"
                                        : "text-emerald-400"
                                }`}
                            >
                                <FiZap size={12} />
                                {loading ? "Loading..." : error ? "Error" : "Live"}
                            </span>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm p-4 text-center">
                                Error: {error}
                            </div>
                        )}

                        {topUsersData.length === 0 && !loading && !error && (
                            <div className="text-slate-400 text-sm p-4 text-center">
                                No data available
                            </div>
                        )}

                        {topUsersData.length > 0 && (
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={topUsersData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={75}
                                        outerRadius={130}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {topUsersData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.color ||
                                                    colors[
                                                        index % colors.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={<CustomTooltip />}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: "20px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Personas List */}
                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <h3 className="font-bold text-sm mb-4">
                            Persona Breakdown
                        </h3>

                        {topUsersData.length > 0 ? (
                            <div className="space-y-3">
                                {topUsersData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`rounded-xl p-3 flex items-center justify-between border ${
                                            isDark
                                                ? "border-white/10 bg-white/5"
                                                : "border-slate-200 bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        item.color,
                                                }}
                                            ></div>
                                            <span className="text-xs font-semibold">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-sm font-black text-cyan-400">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-slate-400 text-xs text-center py-4">
                                No personas data
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Summary */}
                {topUsersData.length > 0 && (
                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <h3 className="font-bold text-sm mb-4">
                            Summary Statistics
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">
                                    Total Personas
                                </p>
                                <p className="text-lg font-black">
                                    {topUsersData.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">
                                    Average Users/Persona
                                </p>
                                <p className="text-lg font-black">
                                    {Math.round(
                                        topUsersData.reduce(
                                            (sum, p) => sum + p.value,
                                            0
                                        ) / topUsersData.length
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">
                                    Max Users
                                </p>
                                <p className="text-lg font-black text-emerald-400">
                                    {Math.max(...topUsersData.map(p => p.value))}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">
                                    Min Users
                                </p>
                                <p className="text-lg font-black text-orange-400">
                                    {Math.min(...topUsersData.map(p => p.value))}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
