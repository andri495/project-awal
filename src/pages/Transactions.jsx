import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, MoreVertical, Search, ChevronLeft, ChevronRight, Edit2, Trash2, X, DollarSign, FileText, CalendarDays, Tag as TagIcon, Plus } from 'lucide-react';

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('Pemasukan');

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({ title: '', amount: '', category: '', date: '' });
  const [selectedMonth, setSelectedMonth] = useState('April');
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const filteredTransactions = activeTab === 'Semua' 
    ? transactions 
    : transactions.filter(t => t.type === (activeTab === 'Masuk' ? 'income' : 'expense'));

  const handleSave = () => {
    if(!formData.title || !formData.amount) return;
    const newTx = {
      id: Date.now(),
      title: formData.title,
      category: formData.category || 'Lainnya',
      date: formData.date || new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}),
      amount: parseInt(formData.amount),
      type: transactionType === 'Pemasukan' ? 'income' : 'expense'
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ title: '', amount: '', category: '', date: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-800">Pencatatan Keuangan</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola dan pantau setiap arus kas Anda dengan rapi.</p>
        </div>
        <button 
          onClick={() => { setTransactionType('Pengeluaran'); setShowModal(true); }}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Catat Transaksi</span>
        </button>
      </header>

      {/* Period Selector & Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4 bg-gray-50/50 rounded-2xl p-2 w-full md:w-auto justify-center md:justify-start">
          <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition text-gray-500 hover:text-emerald-600"><ChevronLeft className="w-5 h-5" /></button>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent font-extrabold text-gray-800 text-center tracking-wide outline-none cursor-pointer p-2 appearance-none"
          >
            {months.map(m => (
              <option key={m} value={m}>{m} 2026</option>
            ))}
          </select>
          <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition text-gray-500 hover:text-emerald-600"><ChevronRight className="w-5 h-5" /></button>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={() => { setTransactionType('Pemasukan'); setShowModal(true); }}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 px-6 py-3.5 rounded-2xl font-bold hover:bg-emerald-100 transition shadow-sm"
          >
            <ArrowUpCircle className="w-5 h-5" />
            <span>Pemasukan</span>
          </button>
          <button 
            onClick={() => { setTransactionType('Pengeluaran'); setShowModal(true); }}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-red-50 text-red-700 px-6 py-3.5 rounded-2xl font-bold hover:bg-red-100 transition shadow-sm"
          >
            <ArrowDownCircle className="w-5 h-5" />
            <span>Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari transaksi (ex: Gaji, Makan)..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-sm font-medium transition-all"
          />
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 w-full md:w-auto shadow-sm">
          {['Semua', 'Masuk', 'Keluar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab 
                ? 'bg-emerald-500 text-white shadow-md transform scale-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Riwayat Transaksi</h3>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">{filteredTransactions.length} Transaksi</span>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredTransactions.map((t) => (
            <div key={t.id} className="p-5 md:p-6 flex items-center justify-between hover:bg-gray-50/80 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform ${
                  t.type === 'income' ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600' : 'bg-gradient-to-br from-red-100 to-red-50 text-red-500'
                }`}>
                  {t.type === 'income' ? <ArrowUpCircle className="w-7 h-7" /> : <ArrowDownCircle className="w-7 h-7" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">{t.title}</h4>
                  <div className="flex items-center text-sm font-medium text-gray-500 mt-1 space-x-3">
                    <span className="flex items-center"><TagIcon className="w-3.5 h-3.5 mr-1 text-gray-400" /> {t.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1 text-gray-400" /> {t.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className={`font-extrabold text-xl ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-gray-900'
                }`}>
                  {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString()}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 absolute right-6 md:relative translate-x-4 group-hover:translate-x-0">
                  <button onClick={() => alert('Fitur edit akan segera hadir!')} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"><Trash2 className="w-4 h-4" /></button>
                </div>
                <button className="md:hidden p-2 text-gray-400"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
             <div className="p-16 text-center flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 font-bold text-lg">Belum ada transaksi ditemukan.</p>
             </div>
          )}
        </div>
      </div>

      {/* Glassmorphism Modal Tambah Transaksi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-white/50">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`p-8 text-white relative overflow-hidden ${transactionType === 'Pemasukan' ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-red-500 to-red-700'}`}>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-3xl font-extrabold mb-2 relative z-10">Catat {transactionType}</h3>
              <p className="text-emerald-50/90 text-sm font-medium relative z-10">Masukkan detail data keuangan dengan akurat.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-extrabold text-gray-700">Judul Transaksi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-gray-900 transition-colors" 
                    placeholder="Contoh: Beli Makan Siang" 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-extrabold text-gray-700">Nominal Uang</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="font-extrabold text-gray-500">Rp</span>
                  </div>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-black text-2xl text-gray-900 transition-colors" 
                    placeholder="0" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-extrabold text-gray-700">Kategori</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full pl-9 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-gray-700 transition-colors appearance-none"
                    >
                      <option value="">Pilih...</option>
                      <option>Makanan</option>
                      <option>Transportasi</option>
                      <option>Utilitas</option>
                      <option>Gaji</option>
                      <option>Hiburan</option>
                      <option>Investasi</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-extrabold text-gray-700">Tanggal</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full pl-9 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-gray-700 transition-colors" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleSave}
                  className={`w-full py-4 text-white font-extrabold rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 ${
                    transactionType === 'Pemasukan' 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-emerald-500/40' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/40'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
