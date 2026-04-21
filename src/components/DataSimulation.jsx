import { FiActivity, FiCheckCircle, FiClock, FiPlay } from 'react-icons/fi';

export default function DataSimulation({ isDark = true }) {
  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Data Simulation</h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Generate and test scenarios with synthetic data</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg">New Simulation</button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            ['Simulations Run', '248', <FiActivity />],
            ['Success Rate', '99.2%', <FiCheckCircle />],
            ['Avg Duration', '2.3s', <FiClock />],
            ['Latest Status', 'Running', <FiPlay />],
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
          <h2 className="text-xl font-bold mb-4">Recent Simulations</h2>
          <div className="space-y-3">
            {[
              { name: 'Peak Load Test', status: 'Completed', progress: 100 },
              { name: 'Weather Impact Scenario', status: 'Running', progress: 65 },
              { name: 'Demand Forecast Model', status: 'Queued', progress: 0 },
            ].map((sim, i) => (
              <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{sim.name}</p>
                  <span className={`text-xs px-2 py-1 rounded ${sim.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : sim.status === 'Running' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {sim.status}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full" style={{ width: `${sim.progress}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">{sim.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`rounded-3xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-lg mb-4">Simulation Parameters</h3>
            <div className="space-y-3">
              {['Dataset Size: 100K records', 'Variables: 45', 'Iterations: 1000', 'Confidence Level: 95%'].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-lg mb-4">Output Analysis</h3>
            <div className="space-y-3">
              {['Mean Prediction Error: 2.1%', 'Variance Explained: 94.3%', 'Model R²: 0.943', 'Validation: Passed'].map((item, i) => (
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
