import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, CreditCard, ChevronLeft, ChevronRight, X, Share2, Loader2, Save, Image as ImageIcon, Settings as SettingsIcon
} from 'lucide-react';

// IMPORT COMPONENT ADMIN TỪ FILE RIÊNG
import AdminDashboard from './AdminDashboard';

// --- TÀI NGUYÊN MẶC ĐỊNH ---
const DEFAULT_ASSETS = {
  bg: "https://images.unsplash.com/photo-1548625361-987707755361?q=80&w=600&auto=format&fit=crop", 
  homeBg: "https://tranhdecors.com/wp-content/uploads/2025/11/Mau-hinh-nen-chuc-mung-nam-moi-2026-Binh-Ngo-dep-724x1024.jpg",
  defaultEnvelope: "https://orientalmestore.com/cdn/shop/files/Personalizable_Year_of_Horse_2026_Red_Envelopes_1.jpg?v=1761089591&width=486",
};

const BANKS = [
  { code: 'MB', name: 'MB Bank', bin: '970422' },
  { code: 'VCB', name: 'Vietcombank', bin: '970436' },
  { code: 'ICB', name: 'VietinBank', bin: '970415' },
  { code: 'TCB', name: 'Techcombank', bin: '970407' },
  { code: 'ACB', name: 'ACB', bin: '970416' },
  { code: 'VPB', name: 'VPBank', bin: '970432' },
  { code: 'TPB', name: 'TPBank', bin: '970423' },
  { code: 'BIDV', name: 'BIDV', bin: '970418' },
  { code: 'VIB', name: 'VIB', bin: '970441' },
];

/* =========================================
   USER VIEW COMPONENTS
   ========================================= */

const EnvelopeCarousel = ({ onSelect, count = 8, envelopeImages, defaultEnvelope }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handlePaginate(1);
    if (distance < -minSwipeDistance) handlePaginate(-1);
  };

  const handlePaginate = (dir) => {
    let next = currentIndex + dir;
    if (next < 0) next = count - 1;
    if (next >= count) next = 0;
    setCurrentIndex(next);
  };

  const currentImage = envelopeImages?.[currentIndex] || defaultEnvelope;

  return (
    <div 
      className="relative flex-1 flex flex-col items-center justify-end w-full max-w-4xl mx-auto py-2 pb-10 sm:pb-12"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button onClick={() => handlePaginate(-1)} className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 transition-all text-white p-2 sm:p-4 rounded-full backdrop-blur-sm hidden md:block">
        <ChevronLeft size={28} className="sm:w-9 sm:h-9" />
      </button>
      <button onClick={() => handlePaginate(1)} className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 transition-all text-white p-2 sm:p-4 rounded-full backdrop-blur-sm hidden md:block">
        <ChevronRight size={28} className="sm:w-9 sm:h-9" />
      </button>
      
      <div className="relative w-full flex-1 flex items-end justify-center">
        <motion.div 
          key={currentIndex} 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.3 }} 
          className="flex flex-col items-center justify-end cursor-pointer w-full h-full px-2 sm:px-4" 
          onClick={() => onSelect(currentIndex)}
        >
           <img 
             src={currentImage} 
             className="h-[60dvh] sm:h-[70dvh] max-h-[750px] w-auto max-w-[90vw] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] sm:drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)] filter brightness-110 rounded-xl hover:scale-105 transition-transform duration-300" 
             alt="Lixi Envelope" 
           />
           <div className="mt-6 sm:mt-10 shrink-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-red-900 px-8 py-3 sm:px-12 sm:py-4 rounded-full font-black text-xl sm:text-3xl uppercase shadow-[0_10px_30px_rgba(245,158,11,0.5)] animate-bounce">
             Mở Bao #{currentIndex + 1}
           </div>
        </motion.div>
      </div>
    </div>
  );
};

const ResultScreen = ({ amount, onNext, envelopeImg, moneyImg }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleShare = async () => {
    if (cardRef.current && window.html2canvas) {
      try {
        const canvas = await window.html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
        const image = canvas.toDataURL("image/png");
        if (navigator.share) {
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], "loc-tet.png", { type: "image/png" });
          await navigator.share({ title: 'Lộc Tết', text: `Mình nhận được ${amount.toLocaleString()}đ!`, files: [file] });
        } else {
          const link = document.createElement('a');
          link.href = image; link.download = 'loc-tet.png'; link.click();
        }
      } catch (e) { alert("Lỗi chia sẻ, vui lòng thử lại."); }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 text-center overflow-y-auto h-[100dvh]">
      <div className="max-w-lg w-full my-auto pb-6">
        <div ref={cardRef} className="bg-red-800 p-5 sm:p-8 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.5)] border-2 sm:border-4 border-amber-400 text-center relative overflow-hidden flex flex-col items-center">
            <h3 className="text-amber-200 font-serif text-3xl sm:text-4xl mb-4 sm:mb-8 font-bold relative z-10 drop-shadow-md">XUÂN NHƯ Ý</h3>
            <div className="relative z-10 w-full h-44 sm:h-64 mb-4 sm:mb-6 flex justify-center items-center">
                <img src={envelopeImg} className="absolute left-0 sm:left-4 w-24 sm:w-40 h-auto transform -rotate-12 z-10 rounded-md shadow-lg object-contain" alt="E" />
                <img src={moneyImg} className="absolute right-0 sm:right-4 w-40 sm:w-64 h-auto transform rotate-6 shadow-xl sm:shadow-2xl rounded-sm border border-white/50 z-20 object-contain" alt="M" />
            </div>
            <div className="bg-white/95 p-3 sm:p-4 rounded-xl z-10 w-full shadow-inner"><p className="text-red-600 font-black text-3xl sm:text-5xl">{amount.toLocaleString()} <span className="text-base sm:text-xl">VND</span></p></div>
        </div>
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 w-full mx-auto">
            <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-colors"><Share2 size={20} /> Khoe Lộc Ngay</button>
            <button onClick={onNext} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-red-900 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-colors"><CreditCard size={20} /> Rút Tiền Về Ngân Hàng</button>
        </div>
      </div>
    </div>
  );
};

const BankForm = ({ onSubmit, amount }) => {
  const [formData, setFormData] = useState({ name: '', bank: BANKS[0].code, account: '' });
  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] text-white">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-400 text-center drop-shadow-md">Thông tin nhận Lộc</h3>
      <div className="space-y-4 sm:space-y-5">
        <input type="text" className="w-full p-3 sm:p-4 rounded-lg text-black font-bold uppercase text-base sm:text-lg" placeholder="TÊN CHỦ TÀI KHOẢN" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} />
        <select className="w-full p-3 sm:p-4 rounded-lg text-black font-bold text-base sm:text-lg" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})}>
          {BANKS.map(b => <option key={b.code} value={b.code}>{b.code} - {b.name}</option>)}
        </select>
        <input type="number" className="w-full p-3 sm:p-4 rounded-lg text-black font-bold text-base sm:text-lg" placeholder="SỐ TÀI KHOẢN" value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} />
        <button onClick={() => onSubmit(formData)} className="w-full mt-4 sm:mt-6 bg-green-600 hover:bg-green-500 font-black py-3 sm:py-4 rounded-lg shadow-xl uppercase text-lg sm:text-xl transition-transform hover:scale-105">Xác Nhận Nhận {amount.toLocaleString()}đ</button>
      </div>
    </div>
  );
};

/* =========================================
   MAIN APP CONTROLLER
   ========================================= */

export default function App() {
  const [view, setView] = useState('home');
  const [campaign, setCampaign] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appAssets, setAppAssets] = useState(DEFAULT_ASSETS);
  
  // States cho tính năng Đăng nhập Admin
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const campaignId = new URLSearchParams(window.location.search).get('c') || '1';

  useEffect(() => {
    const init = async () => {
      try {
        const savedAssets = localStorage.getItem('lixi_assets');
        if (savedAssets) setAppAssets(JSON.parse(savedAssets));

        const res = await fetch(`/api/lixi/campaign/${campaignId}`);
        if (res.ok) {
          const data = await res.json();
          setCampaign(data);
        }

        const assetRes = await fetch('/api/admin/settings/app_assets');
        if (assetRes.ok) {
           const assetData = await assetRes.json();
           if (assetData && !assetData.error) setAppAssets(assetData);
        }
      } catch (e) { console.error("Lỗi tải dữ liệu"); }
      setLoading(false);
    };
    init();
  }, [campaignId]);

  const handleSpin = async (idx) => {
    try {
      const res = await fetch('/api/lixi/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      }).catch(() => ({ ok: true, json: () => Promise.resolve({ id: 1, amount: 50000 }) }));

      if (!res.ok) throw new Error("Hết quà");
      const prize = await res.json();
      const openedEnvelopeImg = campaign?.envelope_images?.[idx] || appAssets.defaultEnvelope;
      setResult({ ...prize, envelopeIdx: idx, envelopeImg: openedEnvelopeImg });
      setView('reveal');
    } catch (e) {
      alert("Oops! Có lỗi xảy ra hoặc đợt lì xì này đã hết giải thưởng.");
    }
  };

  const handleConfirmBank = async (bankInfo) => {
    try {
      await fetch('/api/lixi/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          prizeId: result.id,
          amount: result.amount,
          user_name: bankInfo.name,
          bank_code: bankInfo.bank,
          bank_account: bankInfo.account
        })
      });
      setView('done');
    } catch (e) { alert("Lỗi khi lưu thông tin"); }
  };

  // Xử lý xác thực Admin
  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPassword === 'Lixi@2026') {
      setShowAdminAuth(false);
      setAdminPassword('');
      setAdminError('');
      setView('admin');
    } else {
      setAdminError('Mật khẩu không chính xác!');
    }
  };

  if (loading) return <div className="min-h-[100dvh] bg-red-900 flex items-center justify-center"><Loader2 className="animate-spin text-amber-400" size={64}/></div>;
  
  if (view === 'admin') return <AdminDashboard onBack={() => setView('home')} appAssets={appAssets} setAppAssets={setAppAssets} />;

  const bgStyle = {
    backgroundImage: view === 'home' ? `url(${appAssets.homeBg})` : `url(${appAssets.bg})`,
    backgroundSize: 'auto 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#652222',
    transition: 'all 0.7s ease-in-out'
  };

  return (
    <div className="min-h-[100vh] font-sans relative overflow-hidden flex flex-col">
      <div className="fixed top-0 left-0 z-0 w-full h-[100vh]" style={bgStyle} />
      {view === 'home' && <div className="fixed top-0 left-0 bg-black/10 z-0 pointer-events-none w-full h-[100vh]" />}
      
      {/* Nút Admin được cập nhật để mở Modal Auth thay vì vào thẳng */}
      <button 
        onClick={() => setShowAdminAuth(true)} 
        className="fixed bottom-3 right-3 z-50 bg-black/40 hover:bg-black/60 text-white/50 hover:text-white text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 transition-all uppercase tracking-widest"
      >
        Admin
      </button>

      {/* MODAL NHẬP MẬT KHẨU ADMIN */}
      <AnimatePresence>
        {showAdminAuth && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          >
            <motion.form 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onSubmit={handleAdminAuth} 
              className="bg-red-900 border-2 border-amber-400 p-6 rounded-2xl w-full max-w-sm shadow-[0_0_40px_rgba(245,158,11,0.4)] relative"
            >
              <button 
                type="button" 
                onClick={() => { setShowAdminAuth(false); setAdminPassword(''); setAdminError(''); }}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center mb-6 mt-2">
                <SettingsIcon size={40} className="text-amber-400 mb-2" />
                <h3 className="text-amber-400 text-2xl font-black uppercase text-center">Quản Trị Viên</h3>
              </div>
              
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-4 rounded-xl text-black font-bold text-lg mb-2 focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all text-center"
                autoFocus
              />
              
              {adminError && (
                <p className="text-red-300 text-sm mb-4 font-medium text-center">{adminError}</p>
              )}
              
              <button 
                type="submit" 
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-red-950 font-black py-4 rounded-xl shadow-lg uppercase transition-transform hover:scale-105 active:scale-95 text-lg"
              >
                Xác nhận
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8 flex-1 flex flex-col h-[100dvh] box-border">
        {view === 'home' && (
          <div className="flex-1 flex flex-col justify-end items-center pb-10 sm:pb-12">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setView('game')} className="bg-amber-500 text-red-900 text-xl sm:text-3xl font-black px-12 py-4 sm:px-20 sm:py-6 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.6)] sm:shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-pulse uppercase">
              Nhận Lì Xì
            </motion.button>
          </div>
        )}

        {view === 'game' && (
          <div className="flex flex-col h-full pb-2">
            <div className="flex justify-between items-center text-amber-200 mb-4 sm:mb-6">
              <button onClick={() => setView('home')} className="p-2 sm:p-3 bg-black/30 hover:bg-black/50 rounded-full transition-colors"><X size={24} /></button>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-center flex-1 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">Chọn Phong Bao</h2>
              <div className="w-10 sm:w-14"></div>
            </div>
            <EnvelopeCarousel 
               onSelect={handleSpin} 
               count={campaign?.envelope_count || 8} 
               envelopeImages={campaign?.envelope_images || []} 
               defaultEnvelope={appAssets.defaultEnvelope} 
            />
          </div>
        )}

        {view === 'reveal' && (
           <ResultScreen amount={Number(result.amount)} onNext={() => setView('input')} envelopeImg={result.envelopeImg} moneyImg={result.image_url || 'https://via.placeholder.com/640x300?text=Money'} />
        )}

        {view === 'input' && (
          <div className="flex flex-col items-center justify-center h-full">
             <BankForm onSubmit={handleConfirmBank} amount={Number(result.amount)} />
          </div>
        )}

        {view === 'done' && (
          <div className="text-center mt-20 sm:mt-32 text-white px-4">
            <div className="flex justify-center mb-6 sm:mb-8"><CheckCircle size={80} className="sm:w-[120px] sm:h-[120px] text-green-400 drop-shadow-lg" /></div>
            <h2 className="text-3xl sm:text-5xl font-black text-amber-400 mb-4 sm:mb-6 uppercase drop-shadow-md">Thành Công!</h2>
            <p className="text-lg sm:text-2xl drop-shadow-sm">Lộc xuân sẽ được chuyển tới bạn trong ít phút!</p>
            <button onClick={() => setView('home')} className="mt-10 sm:mt-16 bg-white/20 px-8 py-3 sm:px-10 sm:py-4 rounded-full font-bold text-lg sm:text-xl hover:bg-white/30 transition shadow-lg">Về Trang Chủ</button>
          </div>
        )}
      </div>
    </div>
  );
}