import { FiBarChart2, FiActivity, FiTrendingUp, FiUsers } from 'react-icons/fi';

export default function CustomerConsumption({ isDark = true }) {
  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Customer Consumption</h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Monitor and analyze customer energy usage patterns</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg">Export Report</button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            ['Active Customers', '1.2K', <FiUsers />],
            ['Avg Consumption', '2.4kWh', <FiActivity />],
            ['Peak Hours', '6-9 PM', <FiBarChart2 />],
            ['Variance', '±12%', <FiTrendingUp />],
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
          <h2 className="text-xl font-bold mb-4">Consumption Trends</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-2"><FiBarChart2 /></p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Graph visualization coming soon...</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`rounded-3xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-lg mb-4">Top Consumers</h3>
            <div className="space-y-3">
              {['Customer A - 450 kWh', 'Customer B - 380 kWh', 'Customer C - 325 kWh'].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-lg mb-4">Peak Hours Analysis</h3>
            <div className="space-y-3">
              {['Morning Peak: 7-9 AM', 'Evening Peak: 6-9 PM', 'Night Valley: 2-5 AM'].map((item, i) => (
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
