import { useState, useMemo } from "react";
import {
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiFilter,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function TariffDistribution({
  isDark = true,
}) {
  const card = isDark
    ? "bg-white/5 border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.22)]"
    : "bg-white border-slate-200 shadow-sm";

  const input =
    isDark
      ? "bg-slate-900/80 border-white/10 text-white"
      : "bg-white border-slate-200 text-slate-900";

  const [search, setSearch] =
    useState("");
  const [status, setStatus] =
    useState("All Status");
  const [segment, setSegment] =
    useState("All");

  const [page, setPage] =
    useState(1);

  const [sortBy, setSortBy] =
    useState("name");

  const [sortDir, setSortDir] =
    useState("asc");

  const perPage = 5;

  const tariffs = [
    {
      name: "Basic Saver",
      rate: 0.09,
      customers: 1240,
      revenue: 84,
      status: "Active",
      type: "Residential",
    },
    {
      name: "Standard Plus",
      rate: 0.12,
      customers: 2810,
      revenue: 214,
      status: "Active",
      type: "Commercial",
    },
    {
      name: "Premium Flex",
      rate: 0.16,
      customers: 1620,
      revenue: 188,
      status: "Active",
      type: "Commercial",
    },
    {
      name: "Industrial Core",
      rate: 0.08,
      customers: 420,
      revenue: 121,
      status: "Active",
      type: "Industrial",
    },
    {
      name: "Night Saver",
      rate: 0.07,
      customers: 880,
      revenue: 66,
      status: "Pending",
      type: "Residential",
    },
    {
      name: "Green Energy",
      rate: 0.14,
      customers: 930,
      revenue: 92,
      status: "Active",
      type: "Residential",
    },
    {
      name: "SME Growth",
      rate: 0.11,
      customers: 760,
      revenue: 58,
      status: "Pending",
      type: "Commercial",
    },
    {
      name: "Enterprise Max",
      rate: 0.19,
      customers: 260,
      revenue: 174,
      status: "Active",
      type: "Industrial",
    },
  ];

  const filteredTariffs =
    useMemo(() => {
      let data =
        tariffs.filter((item) => {
          const s =
            item.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const st =
            status ===
            "All Status"
              ? true
              : item.status ===
                status;

          const seg =
            segment === "All"
              ? true
              : item.type ===
                segment;

          return (
            s && st && seg
          );
        });

      data.sort((a, b) => {
        let A = a[sortBy];
        let B = b[sortBy];

        if (
          typeof A ===
          "string"
        ) {
          A =
            A.toLowerCase();
          B =
            B.toLowerCase();
        }

        if (A < B)
          return sortDir ===
            "asc"
            ? -1
            : 1;

        if (A > B)
          return sortDir ===
            "asc"
            ? 1
            : -1;

        return 0;
      });

      return data;
    }, [
      search,
      status,
      segment,
      sortBy,
      sortDir,
    ]);

  const totalPages =
    Math.ceil(
      filteredTariffs.length /
        perPage
    ) || 1;

  const paginatedData =
    filteredTariffs.slice(
      (page - 1) * perPage,
      page * perPage
    );

  const totalRevenue =
    filteredTariffs.reduce(
      (a, b) =>
        a + b.revenue,
      0
    );

  const totalCustomers =
    filteredTariffs.reduce(
      (sum, item) =>
        sum + item.customers,
      0
    );

  const pieData =
    filteredTariffs.map(
      (item, i) => ({
        name: item.name,
        value: item.customers,
        percentage: (
          (item.customers /
            totalCustomers) *
          100
        ).toFixed(1),
        color: [
          "#06b6d4",
          "#8b5cf6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#14b8a6",
          "#6366f1",
          "#ec4899",
        ][i % 8],
      })
    );

  const lineData =
    filteredTariffs.map(
      (item) => ({
        name:
          item.name.split(
            " "
          )[0],
        revenue:
          item.revenue,
      })
    );

  const sortColumn = (
    col
  ) => {
    if (sortBy === col) {
      setSortDir(
        sortDir === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const SortIcon = ({
    col,
  }) =>
    sortBy === col ? (
      sortDir === "asc" ? (
        <FiChevronUp />
      ) : (
        <FiChevronDown />
      )
    ) : (
      <FiChevronDown className="opacity-30" />
    );

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        isDark
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tariff Distribution
          </h1>

          <p className="text-xs mt-1 text-slate-400">
            Dynamic tariff plans,
            pricing intelligence &
            customer distribution
          </p>
        </div>

        {/* Filters */}
        <div
          className={`rounded-3xl border p-4 grid md:grid-cols-4 gap-3 ${card}`}
        >
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
            <FiFilter />
            Filters
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${input}`}
          >
            <FiSearch className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );
                setPage(1);
              }}
              placeholder="Search tariff..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(
                e.target.value
              );
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-sm border transition ${input}`}
          >
            <option>
              All Status
            </option>
            <option>Active</option>
            <option>Pending</option>
          </select>

          <select
            value={segment}
            onChange={(e) => {
              setSegment(
                e.target.value
              );
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-sm border transition ${input}`}
          >
            <option>All</option>
            <option>
              Residential
            </option>
            <option>
              Commercial
            </option>
            <option>
              Industrial
            </option>
          </select>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            [
              "Plans",
              filteredTariffs.length,
              <FiDollarSign />,
            ],
            [
              "Customers",
              filteredTariffs.reduce(
                (
                  a,
                  b
                ) =>
                  a +
                  b.customers,
                0
              ),
              <FiUsers />,
            ],
            [
              "Avg Rate",
              `$${(
                filteredTariffs.reduce(
                  (
                    a,
                    b
                  ) =>
                    a +
                    b.rate,
                  0
                ) /
                filteredTariffs.length
              ).toFixed(2)}`,
              <FiCheckCircle />,
            ],
            [
              "Revenue",
              `$${totalRevenue}K`,
              <FiTrendingUp />,
            ],
          ].map(([t, v, i], idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 ${card}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 uppercase tracking-wide">
                  {t}
                </span>

                <span className="text-cyan-400 text-lg">
                  {i}
                </span>
              </div>

              <h2 className="text-2xl font-black mt-2 tracking-tight">
                {v}
              </h2>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          className={`rounded-3xl border overflow-hidden ${card}`}
        >
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="font-bold text-sm tracking-wide uppercase">
              Tariff Plans
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className={`${
                  isDark
                    ? "bg-white/5"
                    : "bg-slate-100"
                }`}
              >
                <tr>
                  {[
                    [
                      "name",
                      "Name",
                    ],
                    [
                      "type",
                      "Type",
                    ],
                    [
                      "rate",
                      "Rate",
                    ],
                    [
                      "customers",
                      "Customers",
                    ],
                    [
                      "status",
                      "Status",
                    ],
                  ].map(
                    (
                      [
                        key,
                        label,
                      ]
                    ) => (
                      <th
                        key={
                          key
                        }
                        onClick={() =>
                          sortColumn(
                            key
                          )
                        }
                        className="text-left px-5 py-3 cursor-pointer text-xs font-semibold uppercase tracking-wide"
                      >
                        <div className="flex items-center gap-2">
                          {
                            label
                          }
                          <SortIcon
                            col={
                              key
                            }
                          />
                        </div>
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {paginatedData.map(
                  (
                    item,
                    i
                  ) => (
                    <tr
                      key={i}
                      className="border-t border-white/5 hover:bg-white/[0.03] transition"
                    >
                      <td className="px-5 py-4 font-medium">
                        {
                          item.name
                        }
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {
                          item.type
                        }
                      </td>
                      <td className="px-5 py-4 font-medium text-cyan-400">
                        $
                        {
                          item.rate
                        }
                      </td>
                      <td className="px-5 py-4">
                        {
                          item.customers
                        }
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status ===
                            "Active"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-amber-500/15 text-amber-400"
                          }`}
                        >
                          {
                            item.status
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-white/10 flex justify-between items-center">
            <p className="text-xs text-slate-400">
              Page {page} of{" "}
              {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPage((p) =>
                    Math.max(
                      1,
                      p - 1
                    )
                  )
                }
                className="w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-white/5 transition"
              >
                <FiChevronLeft />
              </button>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(
                      totalPages,
                      p + 1
                    )
                  )
                }
                className="w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-white/5 transition"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Pie */}
          <div
            className={`rounded-3xl border p-4 ${card}`}
          >
            <h2 className="text-sm font-bold mb-4 uppercase tracking-wide">
              Tariff Share by Customers
            </h2>

            <div className="grid md:grid-cols-2 gap-4 items-center">
              <div className="h-[280px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {pieData.map(
                        (item, i) => (
                          <Cell
                            key={i}
                            fill={item.color}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius:
                          "16px",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                        background:
                          isDark
                            ? "#0f172ae6"
                            : "#ffffff",
                        fontSize:
                          "12px",
                      }}
                      formatter={(
                        value,
                        name,
                        props
                      ) => [
                        `${props.payload.percentage}%`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {pieData.map(
                  (item, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center px-3 py-2 rounded-xl ${
                        isDark
                          ? "bg-white/5"
                          : "bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            background:
                              item.color,
                          }}
                        />
                        <span className="text-sm">
                          {item.name}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-cyan-400">
                        {item.percentage}%
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Line */}
          <div
            className={`rounded-3xl border p-4 ${card}`}
          >
            <h2 className="text-sm font-bold mb-4 uppercase tracking-wide">
              Revenue by Tariff
            </h2>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <LineChart
                data={
                  lineData
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.08}
                />
                <XAxis
                  dataKey="name"
                  fontSize={11}
                />
                <YAxis fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius:
                      "16px",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background:
                      isDark
                        ? "#0f172ae6"
                        : "#ffffff",
                    fontSize:
                      "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#06b6d4",
                  }}
                  activeDot={{
                    r: 6,
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