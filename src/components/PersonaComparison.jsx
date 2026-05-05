import { useState, useEffect } from "react";
import {
  FiZap,
  FiTrendingDown,
  FiTrendingUp,
  FiBarChart2,
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

export default function PersonaComparison({ isDark = true }) {
  const [personaA, setPersonaA] = useState("");
  const [personaB, setPersonaB] = useState("");
  const [allPersonas, setAllPersonas] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch persona list on mount ───────────────────────────────
  useEffect(() => {
    fetch("http://localhost:8000/api/personas")
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data) => {
        const list = data.personas || [];
        setAllPersonas(list);
        if (list.length >= 2) {
          setPersonaA(list[0]);
          setPersonaB(list[1]);
        }
      })
      .catch((e) => console.error("Persona list fetch failed:", e));
  }, []);

  // ── Fetch comparison when selection changes ───────────────────
  useEffect(() => {
    if (!personaA || !personaB || personaA === personaB) {
      setComparisonData(null);
      return;
    }
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ persona_a: personaA, persona_b: personaB });
    fetch(`http://localhost:8000/api/persona-comparison?${params}`)
      .then((r) => r.ok ? r.json() : Promise.reject(`API ${r.status}`))
      .then((data) => { setComparisonData(data); })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [personaA, personaB]);

  // ── Derived values ────────────────────────────────────────────
  const aData = comparisonData?.top20_summary?.[personaA] || {};
  const bData = comparisonData?.top20_summary?.[personaB] || {};
  const diffs = comparisonData?.difference_a_minus_b || {};

  const numericKeys = Array.from(
    new Set([...Object.keys(aData), ...Object.keys(bData)])
  ).filter((k) => typeof aData[k] === "number" || typeof bData[k] === "number");

  const val1 = numericKeys.length ? (aData[numericKeys[0]] ?? 0) : 0;
  const val2 = numericKeys.length ? (bData[numericKeys[0]] ?? 0) : 0;
  const diff = val2 - val1;
  const isPositive = diff >= 0;

  const barData = numericKeys.slice(0, 8).map((k) => ({
    name: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    [personaA]: parseFloat((aData[k] || 0).toFixed(2)),
    [personaB]: parseFloat((bData[k] || 0).toFixed(2)),
  }));

  const radarData = numericKeys.slice(0, 6).map((k) => {
    const a = aData[k] || 0;
    const b = bData[k] || 0;
    const max = Math.max(a, b, 1);
    return {
      subject: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      [personaA]: parseFloat(((a / max) * 100).toFixed(1)),
      [personaB]: parseFloat(((b / max) * 100).toFixed(1)),
    };
  });

  const diffCards = Object.entries(diffs).slice(0, 6).map(([key, val]) => ({
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: typeof val === "number" ? parseFloat(val.toFixed(2)) : 0,
  }));

  const trendData = numericKeys.slice(0, 6).map((k, i) => ({
    metric: (i + 1).toString(),
    [personaA]: parseFloat((aData[k] || 0).toFixed(2)),
    [personaB]: parseFloat((bData[k] || 0).toFixed(2)),
  }));

  const showData = comparisonData && personaA !== personaB;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-3 rounded-2xl border bg-slate-900 border-white/10 text-white shadow-2xl">
          <p className="text-xs text-cyan-400 uppercase font-semibold tracking-wider mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm font-bold mt-0.5" style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "#060B18", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">Persona Intelligence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-white">Persona </span>
              <span style={{ background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Comparison
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-lg">
              Compare user personas, analyse metric differences and identify behavioural patterns.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs border border-white/5 rounded-2xl px-4 py-2.5 bg-white/3 backdrop-blur-sm shrink-0">
            <FiActivity size={14} className="text-emerald-400" />
            <span className="text-slate-300">Live comparison</span>
          </div>
        </div>

        {/* SELECTOR BAR */}
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-5">
            <FiUsers size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-300">Comparison Parameters</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Persona A</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" />
                <select
                  value={personaA}
                  onChange={(e) => setPersonaA(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                >
                  {allPersonas.map((p) => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                </select>
              </div>
              {personaA && <p className="text-xs text-slate-500">Selected: <span className="text-cyan-400 font-semibold">{personaA}</span></p>}
            </div>
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/30">
                <FiArrowRight size={18} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Persona B</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400" />
                <select
                  value={personaB}
                  onChange={(e) => setPersonaB(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 rounded-xl border border-white/10 bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                >
                  {allPersonas.map((p) => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                </select>
              </div>
              {personaB && <p className="text-xs text-slate-500">Selected: <span className="text-purple-400 font-semibold">{personaB}</span></p>}
            </div>
          </div>
        </div>

        {/* GUARD STATES */}
        {personaA === personaB && personaA !== "" && (
          <div className="rounded-xl p-4 text-center text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Please select two different personas to compare
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-cyan-400 border-r-purple-500" />
            <p className="text-slate-400 text-sm">Comparing personas…</p>
          </div>
        )}
        {error && (
          <div className="rounded-xl p-4 text-center text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            Error: {error}
          </div>
        )}

        {/* MAIN DATA */}
        {showData && (
          <>
            {/* KPI Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 backdrop-blur-xl p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Value 1 — {personaA}</p>
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400"><FiZap size={18} /></div>
                </div>
                <p className="text-3xl font-extrabold text-cyan-400 tracking-tight">{val1.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1 truncate">{numericKeys[0] || "Primary metric"}</p>
              </div>

              <div className={`relative rounded-2xl border backdrop-blur-xl p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-200 ${isPositive ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-green-500/10" : "border-red-500/20 bg-gradient-to-br from-red-500/20 to-rose-500/10"}`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Difference (B − A)</p>
                  <div className={`p-2 rounded-lg ${isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {isPositive ? <FiTrendingUp size={18} /> : <FiTrendingDown size={18} />}
                  </div>
                </div>
                <p className={`text-3xl font-extrabold tracking-tight ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {diff > 0 ? "+" : ""}{diff.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{isPositive ? "B is higher" : "A is higher"}</p>
              </div>

              <div className="relative rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-violet-500/10 backdrop-blur-xl p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Value 2 — {personaB}</p>
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><FiZap size={18} /></div>
                </div>
                <p className="text-3xl font-extrabold text-purple-400 tracking-tight">{val2.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1 truncate">{numericKeys[0] || "Primary metric"}</p>
              </div>
            </div>

            {/* Difference strip */}
            {diffCards.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {diffCards.map((d, i) => (
                  <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-4">
                    <p className="text-xs font-semibold text-slate-400 truncate mb-2">{d.label}</p>
                    <p className={`text-xl font-bold ${d.value > 0 ? "text-emerald-400" : d.value < 0 ? "text-red-400" : "text-slate-400"}`}>
                      {d.value > 0 ? "+" : ""}{d.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{d.value > 0 ? "▲ B leads" : d.value < 0 ? "▼ A leads" : "equal"}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Metric Comparison Bar Chart */}
            {barData.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Metric Comparison</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Top metrics across both personas</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-400 inline-block" /> {personaA}</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: "#8b5cf6" }} /> {personaB}</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData} barGap={4} barCategoryGap="30%">
                    <defs>
                      <linearGradient id="pcGradA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#0891b2" stopOpacity={0.5} />
                      </linearGradient>
                      <linearGradient id="pcGradB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.5} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey={personaA} fill="url(#pcGradA)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar dataKey={personaB} fill="url(#pcGradB)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Two-column: Radar + Trend */}
            <div className="grid lg:grid-cols-2 gap-5">
              {radarData.length > 0 && (
                <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-white">Profile Radar</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Normalised scoring (0–100) across metrics</p>
                  </div>
                  <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-400 inline-block" /> {personaA}</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: "#8b5cf6" }} /> {personaB}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={270}>
                    <RadarChart data={radarData} margin={{ top: 5, right: 30, bottom: 5, left: 30 }}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Radar name={personaA} dataKey={personaA} stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                      <Radar name={personaB} dataKey={personaB} stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {trendData.length > 0 && (
                <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white">Value Trend</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Metric-by-metric distribution</p>
                    </div>
                    <div className="text-right pl-4">
                      <p className="text-xs text-slate-500 mb-0.5">Top difference</p>
                      <p className={`text-2xl font-extrabold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                        {diff > 0 ? "+" : ""}{diff.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={270}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="pcAreaA" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="pcAreaB" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
                      <Area type="monotone" dataKey={personaA} stroke="#06b6d4" strokeWidth={2.5} fill="url(#pcAreaA)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                      <Area type="monotone" dataKey={personaB} stroke="#8b5cf6" strokeWidth={2.5} fill="url(#pcAreaB)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Performance Matrix (horizontal bars) */}
            {barData.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white">Performance Matrix</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Side-by-side horizontal scoring</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-400 inline-block" /> {personaA}</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: "#8b5cf6" }} /> {personaB}</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart layout="vertical" data={barData} margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
                    <Bar dataKey={personaA} fill="#06b6d4" fillOpacity={0.85} radius={[0, 6, 6, 0]} maxBarSize={14} />
                    <Bar dataKey={personaB} fill="#8b5cf6" fillOpacity={0.85} radius={[0, 6, 6, 0]} maxBarSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Insight Banner */}
            <div
              className="rounded-2xl p-px shadow-[0_4px_40px_rgba(0,0,0,0.4)]"
              style={{ background: isPositive ? "linear-gradient(135deg,#10b981,#06b6d4)" : "linear-gradient(135deg,#ef4444,#f97316)" }}
            >
              <div className="rounded-[calc(1rem-1px)] bg-[#060B18] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${isPositive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Comparison Insight</p>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      <span className="font-semibold text-cyan-400">{personaA}</span> scores{" "}
                      <span className="font-semibold text-white">{val1.toFixed(2)}</span> while{" "}
                      <span className="font-semibold text-purple-400">{personaB}</span> scores{" "}
                      <span className="font-semibold text-white">{val2.toFixed(2)}</span> on the primary metric.{" "}
                      <span className={`font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                        {isPositive ? personaB : personaA} leads by {Math.abs(diff).toFixed(2)} units.
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 border border-white/10 text-slate-300 bg-white/5">
                  {numericKeys.length} metrics analysed
                  <FiBarChart2 size={15} />
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

