import { useState, useMemo, useEffect } from "react";
import {
    FiBarChart2,
    FiActivity,
    FiTrendingUp,
    FiUsers,
    FiFilter,
    FiCalendar,
    FiDownload,
    FiZap,
    FiPieChart,
    FiMapPin,
    FiHome,
} from "react-icons/fi";
import BillingCard from "./BillingCard";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

export default function CustomerConsumption({
    isDark = true,
}) {
    /* FILTERS */
    // Set default date range: last 30 days
    const getDefaultEndDate = () => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    };
    
    const getDefaultStartDate = () => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [endDate, setEndDate] = useState(getDefaultEndDate());
    const [segment, setSegment] =
        useState("All");
    const [region, setRegion] =
        useState("All Regions");
    const [customerType, setCustomerType] =
        useState("All Types");
    const [source, setSource] =
        useState("Smart Meter");

    /* API STATE */
    const [trendData, setTrendData] = useState([]);
    const [pieTypeData, setPieTypeData] = useState([]);
    const [pieETypeData, setPieETypeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pieLoading, setPieLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pieError, setPieError] = useState(null);

    const card =
        isDark
            ? "bg-white/5 border-white/10"
            : "bg-white border-slate-200";

    /* API ENDPOINTS */
    const API_BASE = "http://localhost:8000/api/consumption-chart";

    /* FETCH DATA FROM API */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let transformedData = [];

                // Add query parameters for filters including date range
                const queryParams = new URLSearchParams();
                queryParams.append("start_date", startDate);
                queryParams.append("end_date", endDate);
                if (segment !== "All") queryParams.append("type", segment.toLowerCase());
                if (region !== "All Regions") queryParams.append("region", region.toLowerCase());
                if (customerType !== "All Types") queryParams.append("e_type", customerType.toLowerCase());
                if (source !== "Smart Meter") queryParams.append("source", source.toLowerCase());

                const url = `${API_BASE}?${queryParams.toString()}`;

                console.log("Fetching trend data from:", url);
                console.log("Filter values - startDate:", startDate, "endDate:", endDate, "segment:", segment, "region:", region, "customerType:", customerType, "source:", source);

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const apiData = await response.json();

                // Transform API data to chart format
                // Handle both formats: { data: [...] } and { averages: {...} }
                if (apiData.data && Array.isArray(apiData.data)) {
                    transformedData = apiData.data.map((item) => ({
                        date: item.date || item.month,
                        value: parseFloat(item.average_consumption || item.value),
                    }));
                } else if (apiData.averages && typeof apiData.averages === 'object') {
                    // New format: { averages: { net_SP_01: value, net_SP_02: value, ... } }
                    // Calculate average across all meters
                    const values = Object.values(apiData.averages).map(v => parseFloat(v));
                    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
                    transformedData = [{
                        date: `${startDate} to ${endDate}`,
                        value: Math.round(avgValue * 100) / 100,
                    }];
                }

                setTrendData(transformedData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
                // Fallback to empty data on error
                setTrendData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, segment, region, customerType, source]);

    /* FETCH PIE CHART DATA FROM API */
    useEffect(() => {
        const fetchPieData = async () => {
            setPieLoading(true);
            setPieError(null);
            try {
                const PIE_API_BASE = `${API_BASE.replace('/consumption-chart', '')}/pie-chart`;
                
                const colors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

                // Build query parameters for both endpoints with all three filter parameters
                const buildParams = () => {
                    const params = new URLSearchParams();
                    
                    // Add type parameter (from Segment filter)
                    if (segment !== "All") {
                        params.append("type", segment.toLowerCase());
                    }
                    
                    // Add region parameter
                    if (region !== "All Regions") {
                        params.append("region", region.toLowerCase());
                    }
                    
                    // Add e_type parameter (from Customer Type filter)
                    if (customerType !== "All Types") {
                        params.append("e_type", customerType.toLowerCase());
                    }
                    
                    return params;
                };

                const params = buildParams();
                const queryString = params.toString() ? `?${params.toString()}` : "";

                const typeUrl = `${PIE_API_BASE}/type${queryString}`;
                const eTypeUrl = `${PIE_API_BASE}/e-type${queryString}`;

                console.log("Type URL:", typeUrl);
                console.log("E-Type URL:", eTypeUrl);
                console.log("Pie filters - range:", range, "segment:", segment, "region:", region, "customerType:", customerType);
                console.log("Built params - type:", segment.toLowerCase(), "region:", region.toLowerCase(), "e_type:", customerType.toLowerCase());

                // Fetch type data (distribution by type - shows segment values like smb, industrial, residential)
                const typeResponse = await fetch(typeUrl);
                if (!typeResponse.ok) {
                    throw new Error(`Type API Error: ${typeResponse.status}`);
                }
                const typeData = await typeResponse.json();
                const transformedTypeData = typeData.data.map((item, index) => ({
                    name: item.label.charAt(0).toUpperCase() + item.label.slice(1),
                    value: item.value,
                    color: colors[index % colors.length],
                }));
                setPieTypeData(transformedTypeData);

                // Fetch e-type data (distribution by e-type - shows customer type values like 3band, eco, flat)
                const eTypeResponse = await fetch(eTypeUrl);
                if (!eTypeResponse.ok) {
                    throw new Error(`E-Type API Error: ${eTypeResponse.status}`);
                }
                const eTypeData = await eTypeResponse.json();
                const transformedETypeData = eTypeData.data.map((item, index) => ({
                    name: item.label.charAt(0).toUpperCase() + item.label.slice(1),
                    value: item.value,
                    color: colors[index % colors.length],
                }));
                setPieETypeData(transformedETypeData);

            } catch (err) {
                console.error("Error fetching pie data:", err);
                setPieError(err.message);
                setPieTypeData([]);
                setPieETypeData([]);
            } finally {
                setPieLoading(false);
            }
        };

        fetchPieData();
    }, [startDate, endDate, segment, region, customerType]);

    const hourlyData = [
        { time: "6AM", load: 110 },
        { time: "9AM", load: 180 },
        { time: "12PM", load: 160 },
        { time: "3PM", load: 240 },
        { time: "6PM", load: 320 },
        { time: "9PM", load: 270 },
    ];

    /* TOOLTIP */
    const CustomTooltip = ({
        active,
        payload,
        label,
    }) => {
        if (
            active &&
            payload &&
            payload.length
        ) {
            return (
                <div
                    className={`px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl ${isDark
                            ? "bg-slate-900/95 border-white/10 text-white"
                            : "bg-white/95 border-slate-200 text-slate-900"
                        }`}
                >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">
                        {label}
                    </p>

                    <p className="text-lg font-black mt-1">
                        {payload[0].value}
                    </p>

                    <p className="text-[11px] text-slate-400">
                        Consumption Units
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            className={`min-h-screen p-4 sm:p-5 ${isDark
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-900"
                }`}
        >
            <div className="max-w-7xl mx-auto space-y-4">
                {/* HEADER */}
                <div className="flex flex-wrap justify-between gap-2 items-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black ">
                            Customer Consumption
                        </h1>

                        <p className="text-xs text-slate-400 mt-1">
                            Demand trends, customer
                            behavior & forecasting
                        </p>
                    </div>

                    <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <FiDownload size={15} />
                        Export
                    </button>
                </div>

                {/* FILTERS */}
                <div
                    className={`relative overflow-hidden rounded-3xl border p-5 md:p-2 backdrop-blur-2xl shadow-xl ${isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-white/80 border-slate-200"
                        }`}
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-10 left-10 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full"></div>
                        <div className="absolute -bottom-10 right-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full"></div>
                    </div>

                    {/* Header */}
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                                <FiFilter size={16} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold tracking-wide">
                                    Smart Filters
                                </h3>
                                
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setStartDate(getDefaultStartDate());
                                setEndDate(getDefaultEndDate());
                                setSegment("All");
                                setRegion("All Regions");
                                setCustomerType("All Types");
                                setSource("Smart Meter");
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-400 hover:from-cyan-500/25 hover:to-purple-500/25 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="relative grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Date Range Pickers */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={`w-full px-3 py-3 rounded-2xl text-sm border transition-all outline-none shadow-sm ${isDark
                                    ? "bg-slate-900/80 border-white/10 focus:border-cyan-400 focus:bg-slate-900"
                                    : "bg-white border-slate-200 focus:border-cyan-500"
                                }`}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={`w-full px-3 py-3 rounded-2xl text-sm border transition-all outline-none shadow-sm ${isDark
                                    ? "bg-slate-900/80 border-white/10 focus:border-cyan-400 focus:bg-slate-900"
                                    : "bg-white border-slate-200 focus:border-cyan-500"
                                }`}
                            />
                        </div>

                        {[
                            {
                                label: "Segment",
                                value: segment,
                                set: setSegment,
                                options: [
                                    "All",
                                    "Smb",
                                    "Industrial",
                                    "Residential",
                                ],
                            },
                            {
                                label: "Region",
                                value: region,
                                set: setRegion,
                                options: [
                                    "All Regions",
                                    "North",
                                    "South",
                                    "East",
                                    "West",
                                ],
                            },
                            {
                                label: "Customer Type",
                                value: customerType,
                                set: setCustomerType,
                                options: [
                                    "All Types",
                                    "3band",
                                    "Eco",
                                    "Flat",
                                ],
                            },
                            {
                                label: "Source",
                                value: source,
                                set: setSource,
                                options: [
                                    "Smart Meter",
                                    "IoT Sensor",
                                    "Manual",
                                ],
                            },
                        ].map((item, i) => (
                            <div key={i} className="space-y-1.5">
                                <label className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400">
                                    {item.label}
                                </label>

                                <select
                                    value={item.value}
                                    onChange={(e) =>
                                        item.set(e.target.value)
                                    }
                                    className={`w-full px-3 py-3 rounded-2xl text-sm border transition-all outline-none shadow-sm ${isDark
                                            ? "bg-slate-900/80 border-white/10 focus:border-cyan-400 focus:bg-slate-900"
                                            : "bg-white border-slate-200 focus:border-cyan-500"
                                        }`}
                                >
                                    {item.options.map((op) => (
                                        <option key={op}>
                                            {op}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KPI */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        [
                            "Customers",
                            "1,240",
                            <FiUsers />,
                        ],
                        [
                            "Avg Usage",
                            "2.4kWh",
                            <FiActivity />,
                        ],
                        [
                            "Peak",
                            "6-9 PM",
                            <FiBarChart2 />,
                        ],
                        [
                            "Growth",
                            "+12%",
                            <FiTrendingUp />,
                        ],
                    ].map(([t, v, i], idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl border p-4 ${card}`}
                        >
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-400">
                                    {t}
                                </span>
                                <span className="text-cyan-400">
                                    {i}
                                </span>
                            </div>

                            <h2 className="text-xl font-black mt-2">
                                {v}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* MAIN CHARTS */}
                <div className="grid lg:grid-cols-3 gap-4">
                    {/* Trend */}
                    <div
                        className={`lg:col-span-2 rounded-2xl border p-4 ${card}`}
                    >
                        <div className="flex justify-between mb-3">
                            <h2 className="font-bold text-sm">
                                Consumption Trend
                            </h2>

                            <span className={`text-xs flex items-center gap-1 ${
                                loading ? "text-amber-400" : "text-emerald-400"
                            }`}>
                                <FiZap size={12} />
                                {loading ? "Loading..." : error ? "Error" : "Live"}
                            </span>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm p-4 text-center">
                                Error: {error}
                            </div>
                        )}

                        {trendData.length === 0 && !loading && !error && (
                            <div className="text-slate-400 text-sm p-4 text-center">
                                No data available
                            </div>
                        )}

                        {trendData.length > 0 && (
                            <ResponsiveContainer
                                width="100%"
                                height={250}
                            >
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient
                                            id="fillA"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#06b6d4"
                                                stopOpacity={0.6}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8b5cf6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        opacity={0.08}
                                    />

                                    <XAxis
                                        dataKey="date"
                                        fontSize={11}
                                    />
                                    <YAxis fontSize={11} />

                                    <Tooltip
                                        content={
                                            <CustomTooltip />
                                        }
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#06b6d4"
                                        strokeWidth={2}
                                        fill="url(#fillA)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* BY SEGMENT */}
                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <FiPieChart className="text-cyan-400" />
                            By Segment
                            {(region !== "All Regions" || customerType !== "All Types") && (
                                <span className="text-xs font-normal text-slate-400 ml-auto">
                                    {region !== "All Regions" && region}
                                    {region !== "All Regions" && customerType !== "All Types" && " • "}
                                    {customerType !== "All Types" && customerType}
                                </span>
                            )}
                        </h2>

                        {pieError && (
                            <div className="text-red-400 text-xs p-4 text-center">
                                Error: {pieError}
                            </div>
                        )}

                        {pieLoading && (
                            <div className="text-slate-400 text-xs p-4 text-center">
                                Loading...
                            </div>
                        )}

                        {pieTypeData.length === 0 && !pieLoading && !pieError && (
                            <div className="text-slate-400 text-xs p-4 text-center">
                                No data available
                            </div>
                        )}

                        {pieTypeData.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 items-center">
                                <ResponsiveContainer
                                    width="100%"
                                    height={220}
                                >
                                    <PieChart>
                                        <Pie
                                            data={pieTypeData}
                                            innerRadius={45}
                                            outerRadius={72}
                                            dataKey="value"
                                            paddingAngle={4}
                                        >
                                            {pieTypeData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (
                                                    <Cell
                                                        key={index}
                                                        fill={
                                                            entry.color
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>

                                        <Tooltip
                                            content={
                                                <CustomTooltip />
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>


                                <div className="space-y-3">
                                    {pieTypeData.map(
                                        (
                                            item,
                                            i
                                        ) => (
                                            <div
                                                key={i}
                                                className="flex justify-between items-center text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full"
                                                        style={{
                                                            background:
                                                                item.color,
                                                        }}
                                                    />
                                                    {item.name}
                                                </div>

                                                <span className="font-semibold">
                                                    {item.value}%
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* PEAK HOURS */}
                {/* Replace ONLY the bottom charts section with this */}

                <div className="grid lg:grid-cols-2 gap-4">
                    {/* BY CUSTOMER TYPE */}
                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-sm">
                                By Customer Type
                                {(region !== "All Regions" || segment !== "All") && (
                                    <span className="text-xs font-normal text-slate-400 ml-2">
                                        {region !== "All Regions" && region}
                                        {region !== "All Regions" && segment !== "All" && " • "}
                                        {segment !== "All" && segment}
                                    </span>
                                )}
                            </h2>
                        </div>

                        {pieError && (
                            <div className="text-red-400 text-xs p-4 text-center">
                                Error: {pieError}
                            </div>
                        )}

                        {pieLoading && (
                            <div className="text-slate-400 text-xs p-4 text-center">
                                Loading...
                            </div>
                        )}

                        {pieETypeData.length === 0 && !pieLoading && !pieError && (
                            <div className="text-slate-400 text-xs p-4 text-center">
                                No data available
                            </div>
                        )}

                        {pieETypeData.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 items-center">
                                <ResponsiveContainer
                                    width="100%"
                                    height={220}
                                >
                                    <PieChart>
                                        <Pie
                                            data={pieETypeData}
                                            innerRadius={45}
                                            outerRadius={72}
                                            dataKey="value"
                                            paddingAngle={4}
                                        >
                                            {pieETypeData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (
                                                    <Cell
                                                        key={index}
                                                        fill={
                                                            entry.color
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>

                                        <Tooltip
                                            content={
                                                <CustomTooltip />
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="space-y-3">
                                    {pieETypeData.map(
                                        (
                                            item,
                                            i
                                        ) => (
                                            <div
                                                key={i}
                                                className="flex justify-between items-center text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full"
                                                        style={{
                                                            background:
                                                                item.color,
                                                        }}
                                                    />
                                                    {item.name}
                                                </div>

                                                <span className="font-semibold">
                                                    {item.value}%
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Forecast (RESTORED) */}
                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-sm">
                                Forecast Trend
                            </h2>

                            <span className="text-[11px] text-emerald-400">
                                Based on Current Data
                            </span>
                        </div>

                        {trendData.length > 0 && (
                            <ResponsiveContainer
                                width="100%"
                                height={240}
                            >
                                <LineChart data={trendData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        opacity={0.06}
                                    />

                                    <XAxis
                                        dataKey="date"
                                        fontSize={11}
                                    />

                                    <YAxis fontSize={11} />

                                    <Tooltip
                                        content={
                                            <CustomTooltip />
                                        }
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#06b6d4"
                                        strokeWidth={3}
                                        dot={{
                                            r: 3,
                                            fill: "#06b6d4",
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: "#8b5cf6",
                                            stroke: "#fff",
                                            strokeWidth: 2,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}

                        {trendData.length === 0 && (
                            <div className="text-slate-400 text-sm p-4 text-center">
                                No forecast data available
                            </div>
                        )}
                    </div>
                </div>

                {/* BILLING CARD */}
                <BillingCard
                    isDark={isDark}
                    range={range}
                    segment={segment}
                    region={region}
                    customerType={customerType}
                    source={source}
                />
            </div>
        </div>
    );
}