import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];

    return (
      <div
        className="
          bg-slate-900/95
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          px-4
          py-3
          shadow-2xl
        "
      >
        <p className="text-slate-400 text-xs uppercase tracking-wider">
          Persona
        </p>

        <p className="text-white font-bold text-lg mb-2">
          {data.payload.persona}
        </p>

        <p className="text-blue-400 font-semibold">
          {data.name}
        </p>

        <p className="text-2xl font-black text-white mt-1">
          {data.value.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};

const HistogramChart = () => {
  const [data, setData] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch('/supplier-buckets');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        const uniquePersonas = [
          ...new Set(jsonData.map((item) => item.persona)),
        ].sort((a, b) => {
          if (a === 'All') return -1;
          if (b === 'All') return 1;
          return a.localeCompare(b);
        });

        setPersonas(uniquePersonas);
        setData(jsonData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Data
  const filteredData =
    selectedPersona === 'All'
      ? data
      : data.filter((item) => item.persona === selectedPersona);

  // Blue Gradient Palette
  const blueColors = [
    '#2563EB',
    '#3B82F6',
    '#60A5FA',
    '#38BDF8',
    '#0EA5E9',
    '#0284C7',
    '#1D4ED8',
    '#2563EB',
    '#3B82F6',
    '#60A5FA',
  ];

  // Stats
  const avgCost =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, d) => sum + d.total_cost, 0) /
          filteredData.length
        ).toFixed(0)
      : 0;

  const avgBill =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, d) => sum + d.total_bill, 0) /
          filteredData.length
        ).toFixed(0)
      : 0;

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center">
          <div className="h-14 w-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-5"></div>

          <p className="text-blue-300 text-lg font-semibold">
            Loading Analytics...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center max-w-lg">
          <h2 className="text-red-400 text-2xl font-bold mb-2">
            Failed to Load
          </h2>

          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B1120] overflow-hidden relative p-6 md:p-10">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full"></div>

        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.25em] text-blue-400 text-sm font-bold mb-3">
              Analytics Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-black text-white">
              Bucket Histograms
            </h1>

            <p className="text-slate-400 mt-4 text-lg">
              Cost & billing distribution across supplier buckets
            </p>
          </div>

          {/* Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-sm font-medium">
              Select Persona
            </label>

            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="
                bg-white/5
                backdrop-blur-xl
                border border-white/10
                hover:border-blue-400/40
                text-white
                px-5
                py-3
                rounded-2xl
                outline-none
                transition-all
                shadow-xl
                focus:ring-2
                focus:ring-blue-500/40
              "
            >
              {personas.map((persona) => (
                <option
                  key={persona}
                  value={persona}
                  className="bg-slate-900"
                >
                  {persona}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
          {/* Cost Chart */}
          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border border-white/10
              bg-white/5
              backdrop-blur-xl
              p-6
              shadow-2xl
              transition-all
              hover:border-blue-400/30
            "
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Total Cost
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Distribution by bucket
                  </p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={420}>
                <BarChart
                  data={filteredData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 70,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="bucket_labels"
                    stroke="#94A3B8"
                    angle={-35}
                    textAnchor="end"
                    height={80}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    stroke="#94A3B8"
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill: 'rgba(59,130,246,0.08)',
                    }}
                  />

                  <Bar
                    dataKey="total_cost"
                    radius={[12, 12, 0, 0]}
                  >
                    {filteredData.map((entry, index) => (
                      <Cell
                        key={`cost-${index}`}
                        fill={blueColors[index % blueColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bill Chart */}
          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border border-white/10
              bg-white/5
              backdrop-blur-xl
              p-6
              shadow-2xl
              transition-all
              hover:border-cyan-400/30
            "
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Total Bill
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Billing distribution by bucket
                  </p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={420}>
                <BarChart
                  data={filteredData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 70,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="bucket_labels"
                    stroke="#94A3B8"
                    angle={-35}
                    textAnchor="end"
                    height={80}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    stroke="#94A3B8"
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill: 'rgba(34,211,238,0.08)',
                    }}
                  />

                  <Bar
                    dataKey="total_bill"
                    radius={[12, 12, 0, 0]}
                  >
                    {filteredData.map((entry, index) => (
                      <Cell
                        key={`bill-${index}`}
                        fill={blueColors[index % blueColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            {
              label: 'Personas',
              value: personas.length,
            },
            {
              label: 'Average Cost',
              value: `$${avgCost}`,
            },
            {
              label: 'Average Bill',
              value: `$${avgBill}`,
            },
            {
              label: 'Buckets',
              value: filteredData.length,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
                rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                p-6
                shadow-xl
                hover:bg-white/10
                transition-all
                group
              "
            >
              <p className="text-slate-400 text-sm font-medium">
                {item.label}
              </p>

              <h3 className="text-3xl md:text-4xl font-black text-white mt-4 group-hover:text-blue-300 transition-colors">
                {item.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistogramChart;