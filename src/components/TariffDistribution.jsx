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
  FiHome,
  FiTool,
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

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState("All Status");
  const [segment, setSegment] =
    useState("All");

  const [tableType, setTableType] =
    useState("Residential");

  const [page, setPage] = useState(1);
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
      name: "SME Growth",
      rate: 0.11,
      customers: 760,
      revenue: 58,
      status: "Pending",
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
      name: "Enterprise Max",
      rate: 0.19,
      customers: 260,
      revenue: 174,
      status: "Active",
      type: "Industrial",
    },
  ];

  const filteredTariffs = useMemo(() => {
    let data = tariffs.filter((item) => {
      const s = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const st =
        status === "All Status"
          ? true
          : item.status === status;

      const seg =
        segment === "All"
          ? true
          : item.type === segment;

      return s && st && seg;
    });

    data.sort((a, b) => {
      let A = a[sortBy];
      let B = b[sortBy];

      if (typeof A === "string") {
        A = A.toLowerCase();
        B = B.toLowerCase();
      }

      if (A < B)
        return sortDir === "asc"
          ? -1
          : 1;

      if (A > B)
        return sortDir === "asc"
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

  const chartData = filteredTariffs;

  const tableFiltered = filteredTariffs.filter(
    (item) => item.type === tableType
  );

  const totalPages =
    Math.ceil(
      tableFiltered.length / perPage
    ) || 1;

  const paginatedData =
    tableFiltered.slice(
      (page - 1) * perPage,
      page * perPage
    );

  const totalRevenue =
    filteredTariffs.reduce(
      (a, b) => a + b.revenue,
      0
    );

  const totalCustomers =
    filteredTariffs.reduce(
      (a, b) => a + b.customers,
      0
    );

  const pieData = filteredTariffs.map(
    (item, i) => ({
      name: item.name,
      value: item.customers,
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

  const totalPie =
    pieData.reduce(
      (a, b) => a + b.value,
      0
    ) || 1;

  const sortColumn = (col) => {
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

  const SortIcon = ({ col }) =>
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
      className={`min-h-screen p-4 sm:p-6 ${isDark
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
        }`}
    >
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black">
            Tariff Distribution
          </h1>
          <p className="text-xs mt-1 text-slate-400">
            Dynamic tariff plans &
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
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${input}`}
          >
            <FiSearch className="text-slate-400" />
            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search tariff..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className={`px-3 py-2 rounded-xl border ${input}`}
          >
            <option>
              All Status
            </option>
            <option>Active</option>
            <option>Pending</option>
          </select>

          <select
            value={segment}
            onChange={(e) =>
              setSegment(
                e.target.value
              )
            }
            className={`px-3 py-2 rounded-xl border ${input}`}
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
              totalCustomers,
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
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">
                  {t}
                </span>
                <span className="text-cyan-400">
                  {i}
                </span>
              </div>

              <h2 className="text-2xl font-black mt-2">
                {v}
              </h2>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Pie */}
          <div
            className={`rounded-3xl border p-4 ${card}`}
          >
            <h2 className="font-bold text-sm mb-4">
              Tariff Share
            </h2>

            <div className="grid md:grid-cols-2 gap-4 items-center">
              <div className="h-[280px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={58}
                      outerRadius={92}
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {pieData.map(
                  (item, i) => (
                    <div
                      key={i}
                      className={`flex justify-between px-3 py-2 rounded-xl ${isDark
                          ? "bg-white/5"
                          : "bg-slate-100"
                        }`}
                    >
                      <span>
                        {
                          item.name
                        }
                      </span>
                      <span className="text-cyan-400 font-semibold">
                        {(
                          (item.value /
                            totalPie) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div
            className={`rounded-3xl border p-4 ${card}`}
          >
            <h2 className="font-bold text-sm mb-4">
              Revenue by Tariff
            </h2>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <LineChart
                data={chartData}
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
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#06b6d4"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Stylish Nav */}
        {/* Centered Stylish Nav */}
        <div className="flex justify-center">
          <div
            className={`rounded-2xl border p-2 flex gap-2 w-fit ${card}`}
          >
            {[
              {
                label: "Residential",
                icon: <FiHome />,
              },
              {
                label: "Industrial",
                icon: <FiTool />,
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setTableType(item.label);
                  setPage(1);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 ${tableType === item.label
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
                    : isDark
                      ? "hover:bg-white/5 text-slate-300"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table BELOW charts */}
        <div
          className={`rounded-3xl border overflow-hidden ${card}`}
        >
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="font-bold text-sm">
              {tableType} Tariffs
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className={
                  isDark
                    ? "bg-white/5"
                    : "bg-slate-100"
                }
              >
                <tr>
                  {[
                    [
                      "name",
                      "Name",
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
                    ([
                      key,
                      label,
                    ]) => (
                      <th
                        key={
                          key
                        }
                        onClick={() =>
                          sortColumn(
                            key
                          )
                        }
                        className="px-5 py-3 text-left cursor-pointer"
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
                      className="border-t border-white/5 hover:bg-white/5"
                    >
                      <td className="px-5 py-4">
                        {
                          item.name
                        }
                      </td>
                      <td className="px-5 py-4 text-cyan-400">
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
                          className={`px-3 py-1 rounded-full text-xs ${item.status ===
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
                className="w-9 h-9 rounded-xl border flex items-center justify-center"
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
                className="w-9 h-9 rounded-xl border flex items-center justify-center"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
        {/* DRILL DOWN SECTION */}
        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          {/* Usage Breakdown */}
          <div className={`rounded-3xl border p-5 ${card}`}>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">
              Usage Breakdown
            </h3>

            {[
              { label: "Peak Hours", value: 52 },
              { label: "Off-Peak", value: 31 },
              { label: "Night Load", value: 17 },
            ].map((item, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">
                    {item.label}
                  </span>
                  <span className="font-semibold text-cyan-400">
                    {item.value}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

         
          {/* <div className={`rounded-3xl border p-5 ${card}`}>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">
              Avg Monthly Bill
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">
                  Energy Cost
                </span>
                <span className="font-semibold text-cyan-400">
                  $120
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">
                  Taxes & Fees
                </span>
                <span className="font-semibold">
                  $18
                </span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-semibold">
                  Total
                </span>
                <span className="font-bold text-lg text-cyan-400">
                  $138
                </span>
              </div>
            </div>
          </div>

          
          <div className={`rounded-3xl border p-5 ${card}`}>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">
              Segment Insights
            </h3>

            {tableType === "Residential" ? (
              <div className="space-y-3 text-sm">
                <p className="text-slate-400">
                  • Higher usage during evening peak hours
                </p>
                <p className="text-slate-400">
                  • Strong adoption of green tariffs
                </p>
                <p className="text-slate-400">
                  • Avg consumption stable month-on-month
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <p className="text-slate-400">
                  • High load consistency across hours
                </p>
                <p className="text-slate-400">
                  • Lower cost tariffs preferred
                </p>
                <p className="text-slate-400">
                  • Significant bulk consumption savings
                </p>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}