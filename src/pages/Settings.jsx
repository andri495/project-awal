import { User, Moon, Lock, Tag, ChevronRight, LogOut, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{"name": "Pengguna", "email": "user@example.com"}');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola preferensi dan akun Anda</p>
        </div>
      </header>

      {/* Profile Summary */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-50 flex items-center justify-center overflow-hidden shadow-sm">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} alt="User" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
          <p className="text-gray-500 font-medium mt-1 mb-3">{userData.email}</p>
          <button className="text-sm font-bold text-emerald-600 bg-emerald-50 px-5 py-2 rounded-xl hover:bg-emerald-100 transition border border-emerald-100">
            Edit Profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Akun & Keamanan */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Akun & Keamanan</h3>
          </div>
          <div className="p-3">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Detail Personal</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Email, Telepon, Alamat</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Ganti Password</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Perbarui kata sandi Anda</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Perangkat Terhubung</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">iPhone, Mac, Windows</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
            </button>
          </div>
        </div>

        {/* Preferensi Sistem */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Preferensi Sistem</h3>
            </div>
            <div className="p-3">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Tema Gelap (Dark Mode)</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Kurangi silau pada layar</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer border border-gray-300">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-[1px] left-[2px] shadow-sm transition-transform"></div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Kategori Transaksi</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Kelola jenis pemasukan & pengeluaran</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
              </button>
            </div>
          </div>
          <div className="p-6 mt-auto">
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3.5 rounded-xl font-bold hover:bg-red-100 transition border border-red-100 shadow-sm">
              <LogOut className="w-5 h-5" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
