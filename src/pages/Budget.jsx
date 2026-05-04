import { useState } from 'react';
import { Target, AlertCircle, Plus, Wallet, Trash2 } from 'lucide-react';

export default function Budget() {
  const [budgets, setBudgets] = useState(() => JSON.parse(localStorage.getItem('budgets') || '[]'));
  const [transactions] = useState(() => JSON.parse(localStorage.getItem('transactions') || '[]'));
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!newCategory || !newAmount) return;
    
    const updated = [...budgets.filter(b => b.category !== newCategory), { category: newCategory, limit: Number(newAmount) }];
    setBudgets(updated);
    localStorage.setItem('budgets', JSON.stringify(updated));
    setShowAddForm(false);
    setNewCategory('');
    setNewAmount('');
  };

  const handleDeleteBudget = (category) => {
    const updated = budgets.filter(b => b.category !== category);
    setBudgets(updated);
    localStorage.setItem('budgets', JSON.stringify(updated));
  };

  const getSpentAmount = (category) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && t.category === category && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    }).reduce((acc, curr) => acc + curr.amount, 0);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Anggaran & Tracking</h1>
          <p className="text-gray-500 font-medium mt-1">Set anggaran per kategori dan pantau pengeluaran Anda</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
        >
          <Plus className="w-5 h-5" />
          <span>Set Anggaran</span>
        </button>
      </header>

      {showAddForm && (
        <form onSubmit={handleAddBudget} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Set Anggaran Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
              <select 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3"
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Belanja">Belanja</option>
                <option value="Tagihan">Tagihan</option>
                <option value="Hiburan">Hiburan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Batas Anggaran (Rp)</label>
              <input 
                type="number" 
                value={newAmount} 
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3"
                placeholder="Contoh: 1500000"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition">Simpan Anggaran</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => {
          const spent = getSpentAmount(budget.category);
          const remaining = budget.limit - spent;
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          const isOverBudget = spent > budget.limit;
          const isWarning = percentage >= 80 && percentage < 100;

          let progressColor = 'bg-emerald-500';
          if (isWarning) progressColor = 'bg-orange-500';
          if (isOverBudget) progressColor = 'bg-red-500';

          return (
            <div key={index} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{budget.category}</h3>
                </div>
                <button onClick={() => handleDeleteBudget(budget.category)} className="text-gray-400 hover:text-red-500 transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Terpakai: <span className="font-bold text-gray-900">Rp {spent.toLocaleString()}</span></span>
                  <span className="text-gray-500 font-medium">Batas: <span className="font-bold text-gray-900">Rp {budget.limit.toLocaleString()}</span></span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className={`${progressColor} h-3 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-gray-600">
                    Sisa: <span className={isOverBudget ? 'text-red-600' : 'text-emerald-600'}>Rp {remaining.toLocaleString()}</span>
                  </span>
                  <span className="text-sm font-bold text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
              </div>

              {/* Notifications */}
              {isOverBudget && (
                <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-start space-x-2 border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-xs font-bold text-red-700">Peringatan: Pengeluaran Anda melebihi anggaran!</p>
                </div>
              )}
              {isWarning && !isOverBudget && (
                <div className="mt-4 p-3 bg-orange-50 rounded-xl flex items-start space-x-2 border border-orange-100">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <p className="text-xs font-bold text-orange-700">Awas: Pengeluaran hampir mencapai batas anggaran.</p>
                </div>
              )}
            </div>
          );
        })}

        {budgets.length === 0 && !showAddForm && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <Wallet className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-4">Belum ada anggaran yang diatur.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
            >
              Mulai Set Anggaran
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
