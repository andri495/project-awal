import { useState } from 'react';
import { Plus, CheckCircle2, Circle, FileText, CalendarDays } from 'lucide-react';

export default function Bills() {
  const [showModal, setShowModal] = useState(false);
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('bills');
    return saved ? JSON.parse(saved) : [];
  });
  const [newBill, setNewBill] = useState({ title: '', amount: '', dueDate: '' });

  const handleSaveBill = () => {
    if (!newBill.title || !newBill.amount) return;
    const b = {
      id: Date.now(),
      title: newBill.title,
      amount: parseInt(newBill.amount),
      dueDate: newBill.dueDate || new Date().toLocaleDateString('id-ID'),
      isPaid: false
    };
    const updated = [...bills, b];
    setBills(updated);
    localStorage.setItem('bills', JSON.stringify(updated));
    setShowModal(false);
    setNewBill({ title: '', amount: '', dueDate: '' });
  };

  const handleTogglePaid = (id) => {
    const updated = bills.map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b);
    setBills(updated);
    localStorage.setItem('bills', JSON.stringify(updated));
  };

  const totalBill = bills.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = bills.filter(b => b.isPaid).reduce((acc, curr) => acc + curr.amount, 0);
  const totalUnpaid = bills.filter(b => !b.isPaid).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tagihan & Pembayaran</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola tagihan bulananmu dengan mudah</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Tagihan</p>
          <p className="text-2xl md:text-3xl font-extrabold text-gray-900">Rp {totalBill.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Sudah Dibayar</p>
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-600">Rp {totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-sm font-bold text-red-700 uppercase tracking-wider mb-2">Belum Dibayar</p>
          <p className="text-2xl md:text-3xl font-extrabold text-red-600">Rp {totalUnpaid.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="text-xl font-bold text-gray-900">Daftar Tagihan April 2026</h3>
        <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm">
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Tambah Tagihan</span>
        </button>
      </div>

      {/* Bill List */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {bills.length === 0 && <div className="p-8 text-center text-gray-500 font-bold">Belum ada tagihan dicatat.</div>}
          {bills.map((b) => (
            <div key={b.id} className="p-5 md:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  b.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'
                }`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{b.title}</h4>
                  <div className="flex items-center text-sm font-medium text-gray-500 mt-1">
                    <CalendarDays className="w-4 h-4 mr-1.5" />
                    Jatuh Tempo: {b.dueDate}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <p className="font-extrabold text-lg text-gray-900">
                  Rp {b.amount.toLocaleString()}
                </p>
                {b.isPaid ? (
                  <button onClick={() => handleTogglePaid(b.id)} className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition cursor-pointer">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Lunas
                  </button>
                ) : (
                  <button onClick={() => handleTogglePaid(b.id)} className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition border border-orange-200">
                    <Circle className="w-4 h-4 mr-1" />
                    Bayar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tambah Tagihan */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-white bg-emerald-600">
              <h3 className="text-2xl font-bold">Tambah Tagihan Baru</h3>
              <p className="opacity-90 text-sm mt-1 font-medium">Catat tagihan yang perlu dibayar</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Tagihan</label>
                <input value={newBill.title} onChange={e => setNewBill({...newBill, title: e.target.value})} type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium bg-gray-50 focus:bg-white transition-colors" placeholder="Contoh: SPP Sekolah" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nominal (Rp)</label>
                <input value={newBill.amount} onChange={e => setNewBill({...newBill, amount: e.target.value})} type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg bg-gray-50 focus:bg-white transition-colors" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
                <input value={newBill.dueDate} onChange={e => setNewBill({...newBill, dueDate: e.target.value})} type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div className="pt-4 flex space-x-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveBill}
                  className="flex-1 py-3.5 text-white font-bold bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md transition"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
