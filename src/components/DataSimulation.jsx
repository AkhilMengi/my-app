import { useState } from "react";
import {
  FiZap,
  FiTrendingDown,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2,
  FiSliders,
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

export default function TariffSimulator({ isDark = true }) {
  const tariffs = [
    { name: "Basic Saver", rate: 0.09 },
    { name: "Standard Plus", rate: 0.12 },
    { name: "Premium Flex", rate: 0.16 },
    { name: "Industrial Core", rate: 0.08 },
    { name: "Night Saver", rate: 0.07 },
    { name: "Green Energy", rate: 0.14 },
    { name: "SME Growth", rate: 0.11 },
    { name: "Enterprise Max", rate: 0.19 },
  ];

  const [usage, setUsage] = useState(450);
  const [currentTariff, setCurrentTariff] = useState("Basic Saver");
  const [compareTariff, setCompareTariff] = useState("Night Saver");

  const currentRate = tariffs.find((t) => t.name === currentTariff)?.rate || 0;
  const compareRate = tariffs.find((t) => t.name === compareTariff)?.rate || 0;
  const currentCost = Number((usage * currentRate).toFixed(2));
  const compareCost = Number((usage * compareRate).toFixed(2));
  const difference = Number((compareCost - currentCost).toFixed(2));
  const saving = difference < 0;
  const recommended = [...tariffs].sort((a, b) => a.rate - b.rate)[0];

  const chartData = tariffs.map((item) => ({
    name: item.name.split(" ")[0],
    cost: Number((usage * item.rate).toFixed(0)),
    active: item.name === currentTariff || item.name === compareTariff,
  }));

  const annualSavingsData = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ].map((month, index) => ({
    month,
    value: Number((Math.abs(difference) * (index + 1)).toFixed(2)),
  }));

  const yearlyTotal = annualSavingsData[11].value;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-3 rounded-2xl border bg-slate-900 border-white/10 text-white shadow-2xl">
          <p className="text-xs text-cyan-400 uppercase font-semibold tracking-wider">{label}</p>
          <p className="text-lg font-bold mt-1">${payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const performanceData = [
    { metric: "Savings",    current: 55, compare: 82 },
    { metric: "Flexibility", current: 70, compare: 78 },
    { metric: "Stability",  current: 84, compare: 68 },
    { metric: "Peak Use",   current: 60, compare: 88 },
    { metric: "Night Use",  current: 52, compare: 92 },
  ];

  const kpiCards = [
    {
      title: "Current Bill",
      value: `$${currentCost}`,
      sub: `@ $${currentRate}/kWh`,
      icon: <FiDollarSign size={18} />,
      gradient: "from-violet-500/20 to-purple-500/10",
      iconBg: "bg-violet-500/20 text-violet-400",
      border: "border-violet-500/20",
    },
    {
      title: "Compared Bill",
      value: `$${compareCost}`,
      sub: `@ $${compareRate}/kWh`,
      icon: <FiBarChart2 size={18} />,
      gradient: "from-cyan-500/20 to-blue-500/10",
      iconBg: "bg-cyan-500/20 text-cyan-400",
      border: "border-cyan-500/20",
    },
    {
      title: "Monthly Difference",
      value: `${saving ? "-" : "+"}$${Math.abs(difference)}`,
      sub: saving ? "potential saving" : "extra cost",
      icon: saving ? <FiTrendingDown size={18} /> : <FiTrendingUp size={18} />,
      gradient: saving ? "from-emerald-500/20 to-green-500/10" : "from-red-500/20 to-rose-500/10",
      iconBg: saving ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400",
      border: saving ? "border-emerald-500/20" : "border-red-500/20",
    },
    {
      title: "Best Tariff",
      value: recommended.name,
      sub: `$${recommended.rate}/kWh lowest rate`,
      icon: <FiZap size={18} />,
      gradient: "from-amber-500/20 to-orange-500/10",
      iconBg: "bg-amber-500/20 text-amber-400",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060B18] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
     

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                Pricing Intelligence
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-white">Tariff </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Simulator
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-lg">
              Compare energy plans, simulate monthly bills and optimise costs in real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs border border-white/5 rounded-2xl px-4 py-2.5 bg-white/3 backdrop-blur-sm shrink-0">
            <FiActivity size={14} className="text-emerald-400" />
            <span className="text-slate-300">Live simulation</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-5">
            <FiSliders size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-300">Simulation Parameters</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Monthly Usage (kWh)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={usage}
                  onChange={(e) => setUsage(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">kWh</span>
              </div>
             <div className="mt-2">
  {/* Top Values */}
  

  {/* Slider */}
  <input
    type="range"
    min={0}
    max={2000}
    value={usage}
    onChange={(e) =>
      setUsage(
        Number(
          e.target.value
        )
      )
    }
    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-transparent
    [&::-webkit-slider-runnable-track]:h-2
    [&::-webkit-slider-runnable-track]:rounded-full
    [&::-webkit-slider-runnable-track]:bg-gradient-to-r
    [&::-webkit-slider-runnable-track]:from-cyan-500/70
    [&::-webkit-slider-runnable-track]:to-purple-600/70

    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-5
    [&::-webkit-slider-thumb]:w-5
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:border-4
    [&::-webkit-slider-thumb]:border-cyan-500
    [&::-webkit-slider-thumb]:shadow-lg
    [&::-webkit-slider-thumb]:mt-[-6px]

    [&::-moz-range-track]:h-2
    [&::-moz-range-track]:rounded-full
    [&::-moz-range-track]:bg-gradient-to-r
    [&::-moz-range-track]:from-cyan-500/70
    [&::-moz-range-track]:to-purple-600/70

    [&::-moz-range-thumb]:h-5
    [&::-moz-range-thumb]:w-5
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-white
    [&::-moz-range-thumb]:border-4
    [&::-moz-range-thumb]:border-cyan-500"
  />

 
</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Current Plan
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400" />
                <select
                  value={currentTariff}
                  onChange={(e) => setCurrentTariff(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                >
                  {tariffs.map((t) => (
                    <option key={t.name} value={t.name} className="bg-slate-900">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500">Rate: <span className="text-violet-400 font-semibold">${currentRate}/kWh</span></p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Compare Plan
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" />
                <select
                  value={compareTariff}
                  onChange={(e) => setCompareTariff(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                >
                  {tariffs.map((t) => (
                    <option key={t.name} value={t.name} className="bg-slate-900">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500">Rate: <span className="text-cyan-400 font-semibold">${compareRate}/kWh</span></p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map(({ title, value, sub, icon, gradient, iconBg, border }, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border ${border} bg-gradient-to-br ${gradient} backdrop-blur-xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
                <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tight">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Monthly Comparison Chart */}
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Monthly Cost Comparison</h2>
              <p className="text-xs text-slate-500 mt-0.5">All plans at {usage} kWh usage</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500 inline-block" /> Selected plans
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-violet-500 inline-block" /> Other plans
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="cost" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((item, i) => (
                  <Cell
                    key={i}
                    fill={item.active ? "#06b6d4" : "#8b5cf6"}
                    fillOpacity={item.active ? 1 : 0.55}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Two-column Charts */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Performance Matrix */}
          <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Plan Performance Matrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">Side-by-side scoring across key metrics</p>
            </div>
            <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-violet-500 inline-block" />
                <span className="truncate max-w-[100px]">{currentTariff}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500 inline-block" />
                <span className="truncate max-w-[100px]">{compareTariff}</span>
              </span>
            </div>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart layout="vertical" data={performanceData} margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis type="category" dataKey="metric" width={80} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
                <Bar dataKey="current" fill="#8b5cf6" fillOpacity={0.85} radius={[0, 6, 6, 0]} maxBarSize={16} name={currentTariff} />
                <Bar dataKey="compare" fill="#06b6d4" fillOpacity={0.85} radius={[0, 6, 6, 0]} maxBarSize={16} name={compareTariff} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Annual Projection */}
          <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {saving ? "Annual Savings Projection" : "Annual Extra Cost"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Cumulative month-over-month</p>
              </div>
              <div className="text-right pl-4">
                <p className="text-xs text-slate-500 mb-0.5">Year-end total</p>
                <p className={`text-2xl font-extrabold ${saving ? "text-emerald-400" : "text-red-400"}`}>
                  ${yearlyTotal}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={annualSavingsData}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={saving ? "#10b981" : "#ef4444"} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={saving ? "#10b981" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={saving ? "#10b981" : "#ef4444"}
                  strokeWidth={2.5}
                  fill="url(#areaFill)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Banner */}
        <div
          className="rounded-2xl p-px shadow-[0_4px_40px_rgba(0,0,0,0.4)]"
          style={{ background: saving ? "linear-gradient(135deg,#10b981,#06b6d4)" : "linear-gradient(135deg,#ef4444,#f97316)" }}
        >
          <div className="rounded-[calc(1rem-1px)] bg-[#060B18] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${saving ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                <FiCheckCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Comparison Insight</p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Switching from{" "}
                  <span className="font-semibold text-white">{currentTariff}</span>
                  {" "}to{" "}
                  <span className={`font-semibold ${saving ? "text-emerald-400" : "text-red-400"}`}>{compareTariff}</span>
                  {" "}would{" "}
                  <span className={`font-semibold ${saving ? "text-emerald-400" : "text-red-400"}`}>
                    {saving ? "save" : "cost"} you ${Math.abs(difference)}/month
                  </span>
                  , totalling{" "}
                  <span className="font-semibold text-white">${yearlyTotal}</span> over a year.
                </p>
              </div>
            </div>
            <button
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all hover:scale-[1.03] shrink-0 ${
                saving
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  : "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              }`}
            >
              {saving ? "Switch & Save" : "Review Plans"}
              <FiArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
