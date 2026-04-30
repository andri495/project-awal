import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { Filter, Calendar } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Reports() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netSavings = totalIncome - totalExpense;

  const yearlyData = [
    { name: 'Jan', income: 0, expense: 0 },
    { name: 'Feb', income: 0, expense: 0 },
    { name: 'Mar', income: 0, expense: 0 },
    { name: 'Apr', income: totalIncome, expense: totalExpense },
    { name: 'May', income: 0, expense: 0 },
    { name: 'Jun', income: 0, expense: 0 },
    { name: 'Jul', income: 0, expense: 0 },
    { name: 'Aug', income: 0, expense: 0 },
    { name: 'Sep', income: 0, expense: 0 },
    { name: 'Oct', income: 0, expense: 0 },
    { name: 'Nov', income: 0, expense: 0 },
    { name: 'Dec', income: 0, expense: 0 },
  ];

  const expenses = transactions.filter(t => t.type === 'expense');
  const catMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  const categoryData = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan & Analisis</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau performa keuangan tahunanmu</p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select className="bg-transparent border-none focus:ring-0 text-gray-700 font-bold outline-none cursor-pointer py-1 w-full md:w-auto">
            <option>Tahun 2026</option>
            <option>Tahun 2025</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select className="bg-transparent border-none focus:ring-0 text-gray-700 font-bold outline-none cursor-pointer py-1 w-full md:w-auto">
            <option>Semua Kategori</option>
            <option>Makanan</option>
            <option>Transportasi</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500">Saldo Awal Tahun</p>
          <p className="text-xl font-extrabold text-gray-900 mt-1">Rp 0</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-emerald-600">Total Pemasukan</p>
          <p className="text-xl font-extrabold text-gray-900 mt-1">Rp {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-red-600">Total Pengeluaran</p>
          <p className="text-xl font-extrabold text-gray-900 mt-1">Rp {totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-[1.5rem] border border-emerald-100 shadow-sm">
          <p className="text-sm font-bold text-emerald-800">Tabungan Bersih</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">Rp {netSavings.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Arus Kas Tahunan</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dx={-10} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Pemasukan" />
                <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Analisis Kategori</h3>
          <p className="text-sm text-gray-500 mb-4">Pengeluaran berdasarkan kategori</p>
          <div className="h-[200px] w-full flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-xs font-bold text-gray-400">Total</span>
               <span className="text-lg font-extrabold text-gray-900">{totalExpense > 0 ? `${(totalExpense/1000)}k` : '0'}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryData.map((entry, index) => (
              <div key={index} className="flex items-center text-xs font-bold text-gray-600">
                <div className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
