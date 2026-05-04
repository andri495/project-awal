import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Filter, Calendar, Download } from 'lucide-react';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Reports() {
  const reportRef = useRef(null);
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netSavings = totalIncome - totalExpense;

  // Monthly Data calculation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yearlyData = months.map(m => ({ name: m, income: 0, expense: 0, savings: 0 }));
  
  transactions.forEach(t => {
    const tDate = new Date(t.date);
    const mIndex = tDate.getMonth();
    if(t.type === 'income') {
        yearlyData[mIndex].income += t.amount;
    } else {
        yearlyData[mIndex].expense += t.amount;
    }
    yearlyData[mIndex].savings = yearlyData[mIndex].income - yearlyData[mIndex].expense;
  });

  const expenses = transactions.filter(t => t.type === 'expense');
  const catMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  const categoryData = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));

  const exportToPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    
    // Add a temporary class to hide the export button during capture if needed
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Laporan_Keuangan.pdf');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500" ref={reportRef}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Laporan & Visualisasi</h1>
          <p className="text-gray-500 font-medium mt-1">Analisis performa keuangan bulanan dan tahunan</p>
        </div>
        <button 
          onClick={exportToPDF}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          <Download className="w-5 h-5" />
          <span>Export PDF</span>
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6" data-html2canvas-ignore>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select className="bg-transparent border-none focus:ring-0 text-gray-700 font-bold outline-none cursor-pointer py-1 w-full md:w-auto">
            <option>Tahun 2026</option>
            <option>Tahun 2025</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Saldo Awal Tahun</p>
          <p className="text-2xl font-black text-gray-900 mt-2">Rp 0</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Total Pemasukan</p>
          <p className="text-2xl font-black text-gray-900 mt-2">Rp {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Total Pengeluaran</p>
          <p className="text-2xl font-black text-gray-900 mt-2">Rp {totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-[1.5rem] border border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Tabungan Bersih</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">Rp {netSavings.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
          <h3 className="text-xl font-extrabold text-gray-900 mb-6">Arus Kas Tahunan</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} dx={-10} tickFormatter={(value) => `Rp${value/1000}k`} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Pemasukan" />
                <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Distribusi Kategori</h3>
          <p className="text-sm text-gray-500 font-medium mb-4">Pengeluaran berdasarkan kategori</p>
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
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
               <span className="text-xl font-black text-gray-900">{totalExpense > 0 ? `${(totalExpense/1000).toLocaleString()}k` : '0'}</span>
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

        {/* Line Chart - Monthly Analysis */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-3">
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Tren Pertumbuhan Tabungan (Per Bulan)</h3>
          <p className="text-sm text-gray-500 font-medium mb-6">Analisis tabungan bersih setiap bulan</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} dx={-10} tickFormatter={(value) => `Rp${value/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} name="Tabungan Bersih" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
