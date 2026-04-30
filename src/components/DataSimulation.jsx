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
  FiPlus,
  FiX,
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
} from "recharts";

const COMPARE_COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#a78bfa"];

const TARIFF_SCORES = {
  "Basic Saver":    { Savings: 55, Flexibility: 70, Stability: 84, "Peak Use": 60, "Night Use": 52 },
  "Standard Plus":  { Savings: 62, Flexibility: 75, Stability: 78, "Peak Use": 65, "Night Use": 55 },
  "Premium Flex":   { Savings: 70, Flexibility: 88, Stability: 72, "Peak Use": 80, "Night Use": 65 },
  "Industrial Core":{ Savings: 78, Flexibility: 60, Stability: 90, "Peak Use": 85, "Night Use": 45 },
  "Night Saver":    { Savings: 82, Flexibility: 78, Stability: 68, "Peak Use": 55, "Night Use": 95 },
  "Green Energy":   { Savings: 65, Flexibility: 72, Stability: 80, "Peak Use": 70, "Night Use": 60 },
  "SME Growth":     { Savings: 68, Flexibility: 80, Stability: 76, "Peak Use": 75, "Night Use": 58 },
  "Enterprise Max": { Savings: 50, Flexibility: 92, Stability: 65, "Peak Use": 88, "Night Use": 70 },
};

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
  const [compareTariffs, setCompareTariffs] = useState(["Night Saver"]);

  const currentRate = tariffs.find((t) => t.name === currentTariff)?.rate || 0;
  const currentCost = Number((usage * currentRate).toFixed(2));

  const compareData = compareTariffs.map((name, i) => {
    const rate = tariffs.find((t) => t.name === name)?.rate || 0;
    const cost = Number((usage * rate).toFixed(2));
    const diff = Number((cost - currentCost).toFixed(2));
    return { name, rate, cost, diff, saving: diff < 0, color: COMPARE_COLORS[i] };
  });

  const bestCompare = compareData.reduce(
    (best, c) => c.cost < best.cost ? c : best,
    compareData[0]
  );

  const recommended = [...tariffs].sort((a, b) => a.rate - b.rate)[0];

  const addComparePlan = () => {
    if (compareTariffs.length >= 5) return;
    const available = tariffs.find(
      (t) => t.name !== currentTariff && !compareTariffs.includes(t.name)
    );
    if (available) setCompareTariffs([...compareTariffs, available.name]);
  };

  const removeComparePlan = (i) => {
    if (compareTariffs.length <= 1) return;
    setCompareTariffs(compareTariffs.filter((_, idx) => idx !== i));
  };

  const updateComparePlan = (i, name) => {
    const updated = [...compareTariffs];
    updated[i] = name;
    setCompareTariffs(updated);
  };

  const chartData = tariffs.map((item) => ({
    name: item.name.split(" ")[0],
    cost: Number((usage * item.rate).toFixed(0)),
    isCurrentPlan: item.name === currentTariff,
    isComparePlan: compareTariffs.includes(item.name),
    compareIndex: compareTariffs.indexOf(item.name),
  }));

  const METRICS = ["Savings", "Flexibility", "Stability", "Peak Use", "Night Use"];
  const performanceData = METRICS.map((metric) => {
    const point = { metric, current: TARIFF_SCORES[currentTariff]?.[metric] || 70 };
    compareTariffs.forEach((name, i) => {
      point[`compare_${i}`] = TARIFF_SCORES[name]?.[metric] || 70;
    });
    return point;
  });

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const annualData = MONTHS.map((month, i) => {
    const point = { month };
    compareData.forEach((c) => {
      point[c.name] = Number((Math.abs(c.diff) * (i + 1)).toFixed(2));
    });
    return point;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-3 rounded-2xl border bg-slate-900 border-white/10 text-white shadow-2xl">
          <p className="text-xs text-cyan-400 uppercase font-semibold tracking-wider">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm font-bold mt-1" style={{ color: entry.color || entry.fill }}>
              {entry.name ? `${entry.name}: ` : ""}${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
            {/* Usage */}
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
                <input
                  type="range"
                  min={0}
                  max={2000}
                  value={usage}
                  onChange={(e) => setUsage(Number(e.target.value))}
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

            {/* Current Plan */}
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
                    <option key={t.name} value={t.name} className="bg-slate-900">{t.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500">Rate: <span className="text-violet-400 font-semibold">${currentRate}/kWh</span></p>
            </div>

            {/* Compare Plans */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Compare Plans
                </label>
                {compareTariffs.length < 5 && (
                  <button
                    onClick={addComparePlan}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 rounded-lg hover:bg-cyan-500/10"
                  >
                    <FiPlus size={12} /> Add Plan
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-0.5">
                {compareTariffs.map((name, i) => {
                  const rate = tariffs.find((t) => t.name === name)?.rate || 0;
                  return (
                    <div key={i} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <div
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                            style={{ backgroundColor: COMPARE_COLORS[i] }}
                          />
                          <select
                            value={name}
                            onChange={(e) => updateComparePlan(i, e.target.value)}
                            className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all appearance-none cursor-pointer text-sm"
                          >
                            {tariffs.map((t) => (
                              <option key={t.name} value={t.name} className="bg-slate-900">{t.name}</option>
                            ))}
                          </select>
                        </div>
                        {compareTariffs.length > 1 && (
                          <button
                            onClick={() => removeComparePlan(i)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                          >
                            <FiX size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 pl-1">
                        Rate:{" "}
                        <span className="font-semibold" style={{ color: COMPARE_COLORS[i] }}>
                          ${rate}/kWh
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Bill */}
          <div className="relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-purple-500/10 backdrop-blur-xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Bill</p>
              <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400"><FiDollarSign size={18} /></div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">${currentCost}</p>
            <p className="text-xs text-slate-500 mt-1">@ ${currentRate}/kWh</p>
          </div>

          {/* Best Compare */}
          <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 backdrop-blur-xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {compareData.length === 1 ? "Compared Bill" : "Best Compare"}
              </p>
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400"><FiBarChart2 size={18} /></div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">${bestCompare.cost}</p>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {compareData.length === 1 ? `@ $${bestCompare.rate}/kWh` : bestCompare.name}
            </p>
          </div>

          {/* Best Saving */}
          <div className={`relative rounded-2xl border backdrop-blur-xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-200 ${bestCompare.saving ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-green-500/10" : "border-red-500/20 bg-gradient-to-br from-red-500/20 to-rose-500/10"}`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {compareData.length === 1 ? "Monthly Difference" : "Best Saving"}
              </p>
              <div className={`p-2 rounded-lg ${bestCompare.saving ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                {bestCompare.saving ? <FiTrendingDown size={18} /> : <FiTrendingUp size={18} />}
              </div>
            </div>
            <p className={`text-2xl font-extrabold tracking-tight ${bestCompare.saving ? "text-emerald-400" : "text-red-400"}`}>
              {bestCompare.saving ? "-" : "+"}${Math.abs(bestCompare.diff)}
            </p>
            <p className="text-xs text-slate-500 mt-1">{bestCompare.saving ? "potential saving/mo" : "extra cost/mo"}</p>
          </div>

          {/* Best Tariff */}
          <div className="relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/20 to-orange-500/10 backdrop-blur-xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best Tariff</p>
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><FiZap size={18} /></div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight truncate">{recommended.name}</p>
            <p className="text-xs text-slate-500 mt-1">${recommended.rate}/kWh lowest rate</p>
          </div>
        </div>

        {/* Multi-plan summary strip (visible only with 2+ compare plans) */}
        {compareData.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {compareData.map((c, i) => (
              <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <p className="text-xs font-semibold text-slate-300 truncate">{c.name}</p>
                </div>
                <p className="text-xl font-bold text-white">${c.cost}</p>
                <p className={`text-xs mt-1 ${c.saving ? "text-emerald-400" : "text-red-400"}`}>
                  {c.saving ? "▼" : "▲"} ${Math.abs(c.diff)}/mo
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Monthly Comparison Chart */}
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Monthly Cost Comparison</h2>
              <p className="text-xs text-slate-500 mt-0.5">All plans at {usage} kWh usage</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-violet-500 inline-block" /> {currentTariff}
              </span>
              {compareTariffs.map((name, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: COMPARE_COLORS[i] }} /> {name}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="cost" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((item, i) => (
                  <Cell
                    key={i}
                    fill={
                      item.isCurrentPlan
                        ? "#8b5cf6"
                        : item.isComparePlan
                        ? COMPARE_COLORS[item.compareIndex]
                        : "#4b5563"
                    }
                    fillOpacity={item.isCurrentPlan || item.isComparePlan ? 1 : 0.4}
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
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Plan Performance Matrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">Side-by-side scoring across key metrics</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-violet-500 inline-block" />
                <span className="truncate max-w-[80px]">{currentTariff}</span>
              </span>
              {compareTariffs.map((name, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: COMPARE_COLORS[i] }} />
                  <span className="truncate max-w-[80px]">{name}</span>
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart layout="vertical" data={performanceData} margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis type="category" dataKey="metric" width={80} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
                <Bar dataKey="current" fill="#8b5cf6" fillOpacity={0.85} radius={[0, 6, 6, 0]} maxBarSize={14} name={currentTariff} />
                {compareTariffs.map((name, i) => (
                  <Bar key={i} dataKey={`compare_${i}`} fill={COMPARE_COLORS[i]} fillOpacity={0.85} radius={[0, 6, 6, 0]} maxBarSize={14} name={name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Annual Projection */}
          <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Annual Projection</h2>
                <p className="text-xs text-slate-500 mt-0.5">Cumulative monthly difference vs current plan</p>
              </div>
              <div className="text-right pl-4">
                <p className="text-xs text-slate-500 mb-0.5">Best year-end</p>
                <p className={`text-2xl font-extrabold ${bestCompare.saving ? "text-emerald-400" : "text-red-400"}`}>
                  ${annualData[11]?.[bestCompare.name] ?? 0}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={annualData}>
                <defs>
                  {compareData.map((c, i) => (
                    <linearGradient key={i} id={`areaFill_${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.color} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={c.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
                {compareData.map((c, i) => (
                  <Area
                    key={i}
                    type="monotone"
                    dataKey={c.name}
                    stroke={c.color}
                    strokeWidth={2.5}
                    fill={`url(#areaFill_${i})`}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    name={c.name}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Banner */}
        <div
          className="rounded-2xl p-px shadow-[0_4px_40px_rgba(0,0,0,0.4)]"
          style={{ background: bestCompare.saving ? "linear-gradient(135deg,#10b981,#06b6d4)" : "linear-gradient(135deg,#ef4444,#f97316)" }}
        >
          <div className="rounded-[calc(1rem-1px)] bg-[#060B18] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${bestCompare.saving ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                <FiCheckCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Comparison Insight</p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  {compareData.length === 1 ? (
                    <>
                      Switching from <span className="font-semibold text-white">{currentTariff}</span> to{" "}
                      <span className="font-semibold" style={{ color: bestCompare.color }}>{bestCompare.name}</span> would{" "}
                      <span className="font-semibold" style={{ color: bestCompare.color }}>
                        {bestCompare.saving ? "save" : "cost"} you ${Math.abs(bestCompare.diff)}/month
                      </span>
                      , totalling <span className="font-semibold text-white">${annualData[11]?.[bestCompare.name] ?? 0}</span> over a year.
                    </>
                  ) : (
                    <>
                      Best option among <span className="font-semibold text-white">{compareData.length} compared plans</span> is{" "}
                      <span className="font-semibold" style={{ color: bestCompare.color }}>{bestCompare.name}</span>{" "}
                      ({bestCompare.saving ? "saves" : "costs extra"}{" "}
                      <span className="font-semibold" style={{ color: bestCompare.color }}>${Math.abs(bestCompare.diff)}/month</span>).{" "}
                      Yearly total: <span className="font-semibold text-white">${annualData[11]?.[bestCompare.name] ?? 0}</span>.
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all hover:scale-[1.03] shrink-0 ${
                bestCompare.saving
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  : "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              }`}
            >
              {bestCompare.saving ? "Switch & Save" : "Review Plans"}
              <FiArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
