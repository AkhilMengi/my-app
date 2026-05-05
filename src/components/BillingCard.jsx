import { useState, useEffect } from "react";
import { FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BillingCard({
    isDark = true,
    startDate = "2024-01-01",
    endDate = new Date().toISOString().split('T')[0],
    segment = "All",
    region = "All Regions",
    customerType = "All Types",
    source = "Smart Meter",
}) {
    const [billingData, setBillingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        averageBilling: 0,
        maxBilling: 0,
        minBilling: 0,
        totalBilling: 0,
    });

    const card = isDark
        ? "bg-white/5 border-white/10"
        : "bg-white border-slate-200";

    /* Helper function to convert meter index to time format */
    const meterIndexToTime = (meter) => {
        // Extract number from "net_SP_01" format
        const match = meter.match(/sp_(\d+)/i);
        if (!match) return meter;
        
        const spIndex = parseInt(match[1]); // 1 to 48
        const totalMinutes = spIndex * 30; // Each interval is 30 minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        // Format as HH:MM
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchBillingData = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = `http://localhost:8000/api/consumption-chart`;

                // Add query parameters for filters
                const queryParams = new URLSearchParams();
                queryParams.append("start_date", startDate);
                queryParams.append("end_date", endDate);
                if (segment !== "All") queryParams.append("type", segment.toLowerCase());
                if (region !== "All Regions") queryParams.append("region", region.toLowerCase());
                if (customerType !== "All Types") queryParams.append("e_type", customerType.toLowerCase());
                if (source !== "Smart Meter") queryParams.append("source", source.toLowerCase());

                const url = `${endpoint}?${queryParams.toString()}`;
                console.log("Fetching billing data from:", url);

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const apiData = await response.json();
                
                console.log("Billing API Response:", apiData);
                
                // Transform API data to chart format
                let transformedData = [];
                
                if (apiData.data && Array.isArray(apiData.data)) {
                    transformedData = apiData.data.map((item, index) => {
                        const billingValue = parseFloat(item.average_consumption);
                        const dateLabel = item.date || `Period ${index + 1}`;
                        
                        return {
                            date: dateLabel,
                            billing: billingValue,
                            fullDate: item.date,
                        };
                    });
                } else if (apiData.averages && typeof apiData.averages === 'object') {
                    // New format: { averages: { net_SP_01: value, net_SP_02: value, ... } }
                    // Show all 48 meter values individually with time labels
                    const entries = Object.entries(apiData.averages);
                    console.log("BillingCard - Total meters:", entries.length);
                    console.log("BillingCard - Last meter:", entries[entries.length - 1]);
                    
                    transformedData = entries.map(([meter, value]) => {
                        const timeLabel = meterIndexToTime(meter);
                        if (meter.includes('SP_46') || meter.includes('SP_47') || meter.includes('SP_48')) {
                            console.log(`BillingCard ${meter} -> ${timeLabel}: ${value}`);
                        }
                        return {
                            date: timeLabel, // Convert to HH:MM format
                            billing: parseFloat(value),
                            fullDate: endDate,
                        };
                    });
                }

                // Calculate statistics
                const billingValues = transformedData.map((item) => {
                    const value = parseFloat(item.billing);
                    return isNaN(value) ? 0 : value;
                });
                const avgBilling =
                    billingValues.length > 0 ? billingValues.reduce((a, b) => a + b, 0) / billingValues.length : 0;
                const maxBilling = billingValues.length > 0 ? Math.max(...billingValues) : 0;
                const minBilling = billingValues.length > 0 ? Math.min(...billingValues) : 0;
                const totalBilling = billingValues.reduce((a, b) => a + b, 0);

                setStats({
                    averageBilling: avgBilling.toFixed(2),
                    maxBilling: maxBilling.toFixed(2),
                    minBilling: minBilling.toFixed(2),
                    totalBilling: totalBilling.toFixed(2),
                });

                setBillingData(transformedData);
            } catch (err) {
                console.error("Error fetching billing data:", err);
                setError(err.message);
                setBillingData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, [startDate, endDate, segment, region, customerType, source]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload; // Get the full data object
            return (
                <div
                    className={`rounded-lg p-3 border shadow-xl ${
                        isDark
                            ? "bg-slate-900/95 border-emerald-500/30 backdrop-blur-md"
                            : "bg-white/95 border-emerald-200 backdrop-blur-md"
                    }`}
                >
                    <p
                        className={`text-xs font-bold mb-1 ${
                            isDark ? "text-slate-200" : "text-slate-800"
                        }`}
                    >
                        {dataPoint.date}
                    </p>
                    <p className="text-sm font-black text-emerald-400">
                        ${(dataPoint.billing || payload[0].value)?.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className={`rounded-3xl overflow-hidden transition-all duration-300 ${
                isDark
                    ? "bg-gradient-to-br from-slate-800/50 via-slate-900/30 to-slate-950/50 border border-emerald-500/20 shadow-2xl shadow-emerald-900/20"
                    : "bg-gradient-to-br from-emerald-50 via-white to-blue-50 border border-emerald-100 shadow-lg"
            }`}
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`p-3 rounded-xl ${
                                isDark
                                    ? "bg-gradient-to-br from-emerald-500/30 to-emerald-600/20"
                                    : "bg-gradient-to-br from-emerald-100 to-emerald-50"
                            }`}
                        >
                            <FiDollarSign
                                className={`w-5 h-5 ${
                                    isDark ? "text-emerald-400" : "text-emerald-600"
                                }`}
                            />
                        </div>
                        <div>
                            <h2
                                className={`text-lg font-black ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}
                            >
                                Consumption Trend
                            </h2>
                            <p
                                className={`text-xs ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}
                            >
                                {startDate} to {endDate} performance
                            </p>
                        </div>
                    </div>
                    <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                            isDark
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                        <FiTrendingUp className="w-3.5 h-3.5" />
                        {startDate}
                    </span>
                </div>

                {error && (
                    <div
                        className={`rounded-xl p-4 text-center text-xs font-medium ${
                            isDark
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                    >
                        Error: {error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div
                            className={`animate-spin rounded-full h-8 w-8 border-2 border-transparent ${
                                isDark
                                    ? "border-t-emerald-400 border-r-emerald-400"
                                    : "border-t-emerald-600 border-r-emerald-600"
                            }`}
                        ></div>
                    </div>
                )}

                {!loading && !error && billingData.length > 0 && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <div
                                className={`rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 ${
                                    isDark
                                        ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/30"
                                        : "bg-white/60 border border-emerald-100/50 hover:bg-white/80"
                                }`}
                            >
                                <p
                                    className={`text-[11px] font-medium mb-2 ${
                                        isDark ? "text-slate-400" : "text-slate-600"
                                    }`}
                                >
                                    Average
                                </p>
                                <p
                                    className={`text-lg font-black ${
                                        isDark ? "text-emerald-400" : "text-emerald-600"
                                    }`}
                                >
                                    ${stats.averageBilling}
                                </p>
                            </div>

                            <div
                                className={`rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 ${
                                    isDark
                                        ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/30"
                                        : "bg-white/60 border border-blue-100/50 hover:bg-white/80"
                                }`}
                            >
                                <p
                                    className={`text-[11px] font-medium mb-2 ${
                                        isDark ? "text-slate-400" : "text-slate-600"
                                    }`}
                                >
                                    Total
                                </p>
                                <p
                                    className={`text-lg font-black ${
                                        isDark ? "text-blue-400" : "text-blue-600"
                                    }`}
                                >
                                    ${stats.totalBilling}
                                </p>
                            </div>

                            <div
                                className={`rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 ${
                                    isDark
                                        ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-400/30"
                                        : "bg-white/60 border border-orange-100/50 hover:bg-white/80"
                                }`}
                            >
                                <p
                                    className={`text-[11px] font-medium mb-2 flex items-center gap-1 ${
                                        isDark ? "text-slate-400" : "text-slate-600"
                                    }`}
                                >
                                    <FiArrowUp className="w-3 h-3" /> Peak
                                </p>
                                <p
                                    className={`text-lg font-black ${
                                        isDark ? "text-orange-400" : "text-orange-600"
                                    }`}
                                >
                                    ${stats.maxBilling}
                                </p>
                            </div>

                            <div
                                className={`rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 ${
                                    isDark
                                        ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30"
                                        : "bg-white/60 border border-cyan-100/50 hover:bg-white/80"
                                }`}
                            >
                                <p
                                    className={`text-[11px] font-medium mb-2 flex items-center gap-1 ${
                                        isDark ? "text-slate-400" : "text-slate-600"
                                    }`}
                                >
                                    <FiArrowDown className="w-3 h-3" /> Low
                                </p>
                                <p
                                    className={`text-lg font-black ${
                                        isDark ? "text-cyan-400" : "text-cyan-600"
                                    }`}
                                >
                                    ${stats.minBilling}
                                </p>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div
                            className={`rounded-2xl p-4 mb-4 ${
                                isDark
                                    ? "bg-slate-950/50 border border-white/5"
                                    : "bg-white/40 border border-white/60"
                            }`}
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={billingData}>
                                    <defs>
                                        <linearGradient
                                            id="fillBilling"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#10b981"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#10b981"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={
                                            isDark
                                                ? "rgba(148, 163, 184, 0.1)"
                                                : "rgba(148, 163, 184, 0.2)"
                                        }
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{
                                            fontSize: 12,
                                            fill: isDark
                                                ? "#94a3b8"
                                                : "#64748b",
                                        }}
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    />
                                    <YAxis
                                        tick={{
                                            fontSize: 12,
                                            fill: isDark
                                                ? "#94a3b8"
                                                : "#64748b",
                                        }}
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        contentStyle={{
                                            borderRadius: "12px",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="billing"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "#10b981",
                                            r: 4,
                                            strokeWidth: 2,
                                            stroke: isDark
                                                ? "#0f172a"
                                                : "#ffffff",
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                        isAnimationActive={true}
                                        animationDuration={600}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Footer Info */}
                        <div
                            className={`text-center text-xs font-medium ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            {billingData.length} data points • {startDate} to {endDate}{" "}
                            view
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
