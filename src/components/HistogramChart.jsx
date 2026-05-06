import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-blue-200">
        <p className="font-semibold text-gray-800">{data.payload.persona}</p>
        <p className="text-blue-600 font-bold">
          {data.name}: {data.value.toFixed(2)}
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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/supplier-buckets');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        
        // Extract unique personas and sort
        const uniquePersonas = [...new Set(jsonData.map(item => item.persona))].sort((a, b) => {
          if (a === 'All') return -1;
          if (b === 'All') return 1;
          return a.localeCompare(b);
        });
        
        setPersonas(uniquePersonas);
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected persona
  const filteredData = selectedPersona === 'All' 
    ? data 
    : data.filter(item => item.persona === selectedPersona);

  // Blue color palette - monochrome shades
  const blueColors = [
    '#0F2A4D',  // Dark blue
    '#1A3A5C',
    '#254A6B',
    '#305A7A',
    '#3B6A89',
    '#467A98',
    '#518AA7',
    '#5C9AB6',
    '#67AAC5',
    '#72BAD4',
    '#7DCAE3',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading histogram data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-semibold">Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Persona Analytics</h1>
          <p className="text-gray-600 mt-1">Cost & Billing Distribution Across Personas</p>
        </div>

        {/* Dropdown Filter */}
        <select
          value={selectedPersona}
          onChange={(e) => setSelectedPersona(e.target.value)}
          className="px-4 py-2 rounded-lg border-2 border-blue-300 bg-white text-gray-700 font-semibold focus:outline-none focus:border-blue-600 hover:border-blue-400 transition-all shadow-md"
        >
          {personas.map((persona) => (
            <option key={persona} value={persona}>
              {persona}
            </option>
          ))}
        </select>
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Total Cost Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800"></div>
            Total Cost
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="persona" type="category" stroke="#6B7280" width={180} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <Bar dataKey="total_cost" fill="#3B82F6" radius={[0, 8, 8, 0]}>
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={blueColors[index % blueColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Total Bill Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"></div>
            Total Bill
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="persona" type="category" stroke="#6B7280" width={180} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <Bar dataKey="total_bill" fill="#1E40AF" radius={[0, 8, 8, 0]}>
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={blueColors[index % blueColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-600 text-sm font-semibold">Total Personas</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{personas.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-600 text-sm font-semibold">Avg Cost</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            ${(filteredData.reduce((sum, d) => sum + d.total_cost, 0) / filteredData.length).toFixed(0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-600 text-sm font-semibold">Avg Bill</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            ${(filteredData.reduce((sum, d) => sum + d.total_bill, 0) / filteredData.length).toFixed(0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-600 text-sm font-semibold">Records</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{filteredData.length}</p>
        </div>
      </div>
    </div>
  );
};

export default HistogramChart;
