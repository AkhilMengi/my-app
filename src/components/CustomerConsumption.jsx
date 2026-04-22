import { useState } from "react";
import {
  FiBarChart2,
  FiActivity,
  FiTrendingUp,
  FiUsers,
  FiFilter,
  FiCalendar,
  FiDownload,
  FiZap,
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
} from "recharts";

export default function CustomerConsumption({
  isDark = true,
}) {
  const [range, setRange] = useState("Monthly");
  const [segment, setSegment] = useState("All");

  const trendData = [
    { month: "Jan", value: 2100 },
    { month: "Feb", value: 2400 },
    { month: "Mar", value: 2250 },
    { month: "Apr", value: 2780 },
    { month: "May", value: 3120 },
    { month: "Jun", value: 2980 },
  ];

  const hourlyData = [
    { time: "6AM", load: 110 },
    { time: "9AM", load: 180 },
    { time: "12PM", load: 160 },
    { time: "3PM", load: 240 },
    { time: "6PM", load: 320 },
    { time: "9PM", load: 270 },
  ];

  const segmentData = [
    { label: "Industrial", value: 48 },
    { label: "Commercial", value: 32 },
    { label: "Residential", value: 20 },
  ];

  return (
    <div
      className={`min-h-screen p-4 ${
        isDark
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <p className="text-cyan-400 font-semibold text-[11px] uppercase tracking-[0.28em]">
              Analytics Dashboard
            </p>

            <h1 className="text-3xl font-black tracking-tight mt-1">
              Customer Consumption
            </h1>

            <p
              className={`mt-1 text-xs ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              Monitor customer usage, demand peaks
              and forecast trends
            </p>
          </div>

          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2">
            <FiDownload size={15} />
            Export
          </button>
        </div>

        {/* Filters */}
        <div
          className={`rounded-2xl border p-4 backdrop-blur-xl flex flex-wrap gap-3 items-center ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <FiFilter size={15} />
            Filters
          </div>

          <select
            value={range}
            onChange={(e) =>
              setRange(e.target.value)
            }
            className={`px-3 py-2 rounded-lg border text-sm ${
              isDark
                ? "bg-slate-900 border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>

          <select
            value={segment}
            onChange={(e) =>
              setSegment(e.target.value)
            }
            className={`px-3 py-2 rounded-lg border text-sm ${
              isDark
                ? "bg-slate-900 border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <option>All</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Industrial</option>
          </select>

          <button
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
              isDark
                ? "bg-slate-900"
                : "bg-slate-100"
            }`}
          >
            <FiCalendar size={14} />
            Last 6 Months
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-3">
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
          ].map(([label, value, icon], i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4 backdrop-blur-xl ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">
                  {label}
                </span>
                <span className="text-cyan-400 text-sm">
                  {icon}
                </span>
              </div>

              <h2 className="text-2xl font-black mt-2">
                {value}
              </h2>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Trend */}
          <div
            className={`lg:col-span-2 rounded-2xl border p-4 backdrop-blur-xl ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold">
                Consumption Trend
              </h2>

              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <FiZap size={13} />
                Live
              </span>
            </div>

            <ResponsiveContainer
              width="100%"
              height={220}
            >
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient
                    id="fill1"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#06b6d4"
                      stopOpacity={0.7}
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
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#fill1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution */}
          <div
            className={`rounded-2xl border p-4 backdrop-blur-xl ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <h2 className="text-base font-bold mb-4">
              Segments
            </h2>

            <div className="space-y-4">
              {segmentData.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>

                  <div
                    className={`h-2.5 rounded-full ${
                      isDark
                        ? "bg-slate-800"
                        : "bg-slate-200"
                    }`}
                  >
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600"
                      style={{
                        width: `${item.value}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Peak */}
          <div
            className={`rounded-2xl border p-4 backdrop-blur-xl ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <h2 className="text-base font-bold mb-3">
              Peak Hours
            </h2>

            <ResponsiveContainer
              width="100%"
              height={190}
            >
              <BarChart data={hourlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.08}
                />
                <XAxis dataKey="time" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar
                  dataKey="load"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast */}
          <div
            className={`rounded-2xl border p-4 backdrop-blur-xl ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <h2 className="text-base font-bold mb-3">
              Forecast
            </h2>

            <ResponsiveContainer
              width="100%"
              height={190}
            >
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.08}
                />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}