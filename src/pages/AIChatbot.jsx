import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, TrendingUp, Clock } from 'lucide-react';

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { 
      text: "Halo! Saya Asisten Keuangan AI Mindfase. Saya bisa membantu Anda konsultasi keuangan, menganalisis pengeluaran, atau mengestimasi waktu untuk mencapai tujuan finansial Anda. Ada yang ingin didiskusikan?", 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let reply = "Maaf, saya belum memahami pertanyaan Anda. Bisa jelaskan lebih detail atau sebutkan 'target tabungan', 'estimasi waktu', atau 'tips hemat'?";
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('target') || lowerInput.includes('estimasi') || lowerInput.includes('waktu')) {
        // Simple logic to extract numbers if possible, otherwise generic
        const numbers = userMessage.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const target = parseInt(numbers[0]) > parseInt(numbers[1]) ? parseInt(numbers[0]) : parseInt(numbers[1]);
            const perMonth = parseInt(numbers[0]) < parseInt(numbers[1]) ? parseInt(numbers[0]) : parseInt(numbers[1]);
            const months = Math.ceil(target / perMonth);
            reply = `Berdasarkan perhitungan real-time, jika Anda menabung Rp${perMonth.toLocaleString()} per bulan untuk mencapai target Rp${target.toLocaleString()}, estimasi waktu yang dibutuhkan adalah sekitar **${months} bulan**. Tetap konsisten dan hindari pengeluaran tidak perlu!`;
        } else {
            reply = "Untuk mengestimasi waktu tercapai, mohon sebutkan jumlah **Target Tabungan** Anda dan berapa yang bisa Anda **sisihkan per bulan**. Contoh: 'Target saya 10000000 dan saya nabung 1000000 per bulan'.";
        }
      } else if (lowerInput.includes('boros') || lowerInput.includes('hemat') || lowerInput.includes('tips')) {
        reply = "Untuk mengontrol keuangan, terapkan rasio 50/30/20:\n- 50% Kebutuhan Pokok\n- 30% Keinginan/Hiburan\n- 20% Tabungan/Investasi.\nJangan lupa atur anggaran di menu **Budgeting** ya!";
      } else if (lowerInput.includes('laporan') || lowerInput.includes('analisis')) {
        reply = "Anda bisa melihat visualisasi keuangan Anda di menu **Laporan**. Di sana tersedia grafik Pie, Bar, dan Line, serta fitur untuk export laporan per bulan ke PDF.";
      } else if (lowerInput.includes('halo') || lowerInput.includes('hai')) {
        reply = "Halo! Silakan tanyakan apapun seputar keuangan Anda.";
      }

      setMessages(prev => [...prev, { text: reply, sender: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 h-[calc(100vh-80px)] flex flex-col">
      <header className="flex justify-between items-center mb-2 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            AI Financial Advisor <Sparkles className="w-6 h-6 text-yellow-500" />
          </h1>
          <p className="text-gray-500 font-medium mt-1">Konsultasi keuangan dan estimasi pencapaian target (Real-time)</p>
        </div>
      </header>

      {/* Suggested Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-2 flex-shrink-0 scrollbar-hide">
        <button onClick={() => setInput('Berapa lama estimasi waktu target tabungan saya tercapai?')} className="whitespace-nowrap flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100 hover:bg-emerald-100 transition">
          <Clock className="w-4 h-4" /> Estimasi Target
        </button>
        <button onClick={() => setInput('Beri saya tips agar tidak boros')} className="whitespace-nowrap flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100 hover:bg-blue-100 transition">
          <TrendingUp className="w-4 h-4" /> Tips Hemat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-emerald-100 text-emerald-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  <p className="whitespace-pre-wrap font-medium leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex flex-row items-end gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-sm flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya seputar keuangan atau estimasi target..."
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none p-4 font-medium transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-emerald-600 text-white px-6 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-emerald-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
