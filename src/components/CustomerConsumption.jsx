import { useState, useMemo } from "react";
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
    const [range, setRange] =
        useState("Monthly");
    const [segment, setSegment] =
        useState("All");
    const [region, setRegion] =
        useState("All Regions");
    const [customerType, setCustomerType] =
        useState("All Types");
    const [source, setSource] =
        useState("Smart Meter");

    const card =
        isDark
            ? "bg-white/5 border-white/10"
            : "bg-white border-slate-200";

    /* RANGE DATA */
    const rangeData = {
        Daily: [
            { month: "Mon", value: 420 },
            { month: "Tue", value: 510 },
            { month: "Wed", value: 470 },
            { month: "Thu", value: 560 },
            { month: "Fri", value: 610 },
            { month: "Sat", value: 390 },
        ],
        Weekly: [
            { month: "W1", value: 1800 },
            { month: "W2", value: 2300 },
            { month: "W3", value: 2100 },
            { month: "W4", value: 2480 },
        ],
        Monthly: [
            { month: "Jan", value: 2100 },
            { month: "Feb", value: 2400 },
            { month: "Mar", value: 2250 },
            { month: "Apr", value: 2780 },
            { month: "May", value: 3120 },
            { month: "Jun", value: 2980 },
        ],
        Yearly: [
            { month: "2021", value: 16200 },
            { month: "2022", value: 19100 },
            { month: "2023", value: 22500 },
            { month: "2024", value: 24700 },
        ],
    };

    const trendData = rangeData[range];

    const hourlyData = [
        { time: "6AM", load: 110 },
        { time: "9AM", load: 180 },
        { time: "12PM", load: 160 },
        { time: "3PM", load: 240 },
        { time: "6PM", load: 320 },
        { time: "9PM", load: 270 },
    ];

    const allSegments = [
        {
            name: "Industrial",
            value: 48,
            color: "#06b6d4",
        },
        {
            name: "Commercial",
            value: 32,
            color: "#8b5cf6",
        },
        {
            name: "Residential",
            value: 20,
            color: "#10b981",
        },
    ];

    const segmentData = useMemo(() => {
        if (segment === "All")
            return allSegments;

        return allSegments.filter(
            (x) => x.name === segment
        );
    }, [segment]);

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
                                setRange("Monthly");
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
                        {[
                            {
                                label: "Time Range",
                                value: range,
                                set: setRange,
                                options: [
                                    "Daily",
                                    "Weekly",
                                    "Monthly",
                                    "Yearly",
                                ],
                            },
                            {
                                label: "Segment",
                                value: segment,
                                set: setSegment,
                                options: [
                                    "All",
                                    "Industrial",
                                    "Commercial",
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
                                    "Enterprise",
                                    "SME",
                                    "Domestic",
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

                            <span className="text-xs text-emerald-400 flex items-center gap-1">
                                <FiZap size={12} />
                                Live
                            </span>
                        </div>

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
                                    dataKey="month"
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
                    </div>

                    {/* CUSTOMER MIX */}
                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <FiPieChart className="text-cyan-400" />
                            Customer Mix
                        </h2>

                        <div className="grid grid-cols-2 gap-2 items-center">
                            <ResponsiveContainer
                                width="100%"
                                height={220}
                            >
                                <PieChart>
                                    <Pie
                                        data={segmentData}
                                        innerRadius={45}
                                        outerRadius={72}
                                        dataKey="value"
                                        paddingAngle={4}
                                    >
                                        {segmentData.map(
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
                                {segmentData.map(
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
                    </div>
                </div>

                {/* PEAK HOURS */}
                {/* Replace ONLY the bottom charts section with this */}

                <div className="grid lg:grid-cols-2 gap-4">
                    {/* Peak Hours */}
                    <div
                        className={`rounded-2xl border p-4 ${card}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-sm">
                                Peak Hours Load
                            </h2>

                            <span className="text-[11px] text-cyan-400">
                                Smart Meter Live
                            </span>
                        </div>

                        <ResponsiveContainer
                            width="100%"
                            height={240}
                        >
                            <BarChart
                                data={hourlyData}
                                barSize={34}
                            >
                                <defs>
                                    <linearGradient
                                        id="barGlow"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#06b6d4"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#8b5cf6"
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    opacity={0.06}
                                />

                                <XAxis
                                    dataKey="time"
                                    fontSize={11}
                                />
                                <YAxis fontSize={11} />

                                <Tooltip
                                    cursor={{
                                        fill: isDark
                                            ? "rgba(255,255,255,0.03)"
                                            : "rgba(0,0,0,0.03)",
                                    }}
                                    content={
                                        <CustomTooltip />
                                    }
                                />

                                <Bar
                                    dataKey="load"
                                    fill="url(#barGlow)"
                                    radius={[
                                        10, 10, 0, 0,
                                    ]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
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
                                AI Prediction
                            </span>
                        </div>

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
                                    dataKey="month"
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
                    </div>
                </div>
            </div>
        </div>
    );
}