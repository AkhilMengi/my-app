import { FiDollarSign, FiActivity, FiUsers, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function TariffDistribution({ isDark = true }) {
  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Tariff Distribution</h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>View and manage pricing tiers and tariff structures</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg">Add Tariff</button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            ['Tariff Plans', '8', <FiDollarSign />],
            ['Avg Rate', '$0.12/kWh', <FiActivity />],
            ['Customers', '5.8K', <FiUsers />],
            ['Revenue', '$1.2M', <FiTrendingUp />],
          ].map(([label, value, icon], i) => (
            <div key={i} className={`rounded-2xl border p-5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-cyan-400">{icon}</span>
              </div>
              <div className="text-3xl font-black mt-3">{value}</div>
            </div>
          ))}
        </div>

        <div className={`rounded-3xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
          <h2 className="text-xl font-bold mb-4">Tariff Plans Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <th className="text-left p-4 font-bold">Plan Name</th>
                  <th className="text-left p-4 font-bold">Rate ($/kWh)</th>
                  <th className="text-left p-4 font-bold">Customers</th>
                  <th className="text-left p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Basic', rate: '0.10', customers: '1200', status: 'Active' },
                  { name: 'Standard', rate: '0.12', customers: '2800', status: 'Active' },
                  { name: 'Premium', rate: '0.15', customers: '1500', status: 'Active' },
                  { name: 'Industrial', rate: '0.08', customers: '300', status: 'Active' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <td className="p-4">{row.name}</td>
                    <td className="p-4">${row.rate}</td>
                    <td className="p-4">{row.customers}</td>
                    <td className="p-4 flex items-center gap-2">
                      <FiCheckCircle className="text-emerald-400" />
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`rounded-3xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-lg mb-4">Distribution by Plan</h3>
            <div className="space-y-3">
              {['Basic: 21%', 'Standard: 48%', 'Premium: 26%', 'Industrial: 5%'].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-lg mb-4">Revenue Distribution</h3>
            <div className="space-y-3">
              {['Basic: 18%', 'Standard: 45%', 'Premium: 32%', 'Industrial: 5%'].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
