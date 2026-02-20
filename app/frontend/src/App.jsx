import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, CreditCard, ChevronLeft, ChevronRight, X, Share2, Loader2, Save, Image as ImageIcon, Settings as SettingsIcon, ChevronDown, Search
} from 'lucide-react';

// IMPORT COMPONENT ADMIN TỪ FILE RIÊNG
import AdminDashboard from './AdminDashboard';

// --- TÀI NGUYÊN MẶC ĐỊNH ---
const DEFAULT_ASSETS = {
  bg: "https://images.unsplash.com/photo-1548625361-987707755361?q=80&w=600&auto=format&fit=crop", 
  homeBg: "https://tranhdecors.com/wp-content/uploads/2025/11/Mau-hinh-nen-chuc-mung-nam-moi-2026-Binh-Ngo-dep-724x1024.jpg",
  defaultEnvelope: "https://orientalmestore.com/cdn/shop/files/Personalizable_Year_of_Horse_2026_Red_Envelopes_1.jpg?v=1761089591&width=486",
};

// --- DANH SÁCH NGÂN HÀNG ĐẦY ĐỦ TẠI VIỆT NAM ---
const BANKS = [
  { code: 'VCB', name: 'Ngoại thương Việt Nam (Vietcombank)' },
  { code: 'CTG', name: 'Công thương Việt Nam (VietinBank)' },
  { code: 'BIDV', name: 'Đầu tư và Phát triển Việt Nam (BIDV)' },
  { code: 'VBA', name: 'Nông nghiệp và Phát triển Nông thôn (Agribank)' },
  { code: 'TCB', name: 'Kỹ Thương Việt Nam (Techcombank)' },
  { code: 'MB', name: 'Quân đội (MBBank)' },
  { code: 'VPB', name: 'Việt Nam Thịnh Vượng (VPBank)' },
  { code: 'ACB', name: 'Á Châu (ACB)' },
  { code: 'STB', name: 'Sài Gòn Thương Tín (Sacombank)' },
  { code: 'HDB', name: 'Phát triển Thành phố Hồ Chí Minh (HDBank)' },
  { code: 'VIB', name: 'Quốc tế Việt Nam (VIB)' },
  { code: 'TPB', name: 'Tiên Phong (TPBank)' },
  { code: 'SHB', name: 'Sài Gòn - Hà Nội (SHB)' },
  { code: 'EIB', name: 'Xuất Nhập khẩu Việt Nam (Eximbank)' },
  { code: 'MSB', name: 'Hàng Hải Việt Nam (MSB)' },
  { code: 'SSB', name: 'Đông Nam Á (SeABank)' },
  { code: 'OCB', name: 'Phương Đông (OCB)' },
  { code: 'LPB', name: 'Lộc Phát Việt Nam (LPBank)' },
  { code: 'NAB', name: 'Nam Á (Nam A Bank)' },
  { code: 'KLB', name: 'Kiên Long (Kienlongbank)' },
  { code: 'VAB', name: 'Việt Á (VietABank)' },
  { code: 'BAB', name: 'Bắc Á (Bac A Bank)' },
  { code: 'BVB', name: 'Bảo Việt (BaoViet Bank)' },
  { code: 'SGB', name: 'Sài Gòn Công Thương (Saigonbank)' },
  { code: 'PGB', name: 'Thịnh vượng và Phát triển (PGBank)' },
  { code: 'BVBANK', name: 'Bản Việt (BVBank)' },
  { code: 'OCEANBANK', name: 'Đại Dương (OceanBank)' },
  { code: 'CBBANK', name: 'Xây dựng Việt Nam (CBBank)' },
  { code: 'GPBANK', name: 'Dầu Khí Toàn Cầu (GPBank)' },
  { code: 'VRB', name: 'Liên doanh Việt - Nga (VRB)' },
  { code: 'SCB', name: 'Sài Gòn (SCB)' },
  { code: 'ABB', name: 'An Bình (ABBank)' },
  { code: 'NCB', name: 'Quốc dân (NCB)' },
  { code: 'VIETBANK', name: 'Việt Nam Thương Tín (Vietbank)' },
  { code: 'DONGABANK', name: 'Đông Á (DongA Bank)' },
  { code: 'SHINHAN', name: 'Shinhan Bank Việt Nam' },
  { code: 'WOORI', name: 'Woori Bank Việt Nam' },
  { code: 'HSBC', name: 'HSBC Việt Nam' },
  { code: 'SCVN', name: 'Standard Chartered Việt Nam' },
  { code: 'UOB', name: 'UOB Việt Nam' },
  { code: 'CIMB', name: 'CIMB Việt Nam' },
  { code: 'PBVN', name: 'Public Bank Việt Nam' },
  { code: 'HLBVN', name: 'Hong Leong Việt Nam' },
  { code: 'IVB', name: 'Indovina Bank (IVB)' },
  { code: 'TIMO', name: 'Timo Digital Bank' },
  { code: 'CAKE', name: 'Cake by VPBank' },
  { code: 'TNEX', name: 'TNEX by MSB' },
  { code: 'MOMO', name: 'Ví Điện Tử MoMo' },
  { code: 'ZALOPAY', name: 'Ví Điện Tử ZaloPay' },
  { code: 'VIETTEL', name: 'Viettel Money' },
  { code: 'VNPT', name: 'VNPT Money' }
];

/* =========================================
   USER VIEW COMPONENTS
   ========================================= */

const SearchableBankSelect = ({ banks, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Hàm loại bỏ dấu tiếng Việt để tìm kiếm dễ dàng hơn
  const removeAccents = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D') : '';
  };

  const filteredBanks = banks.filter(b => {
    const searchNormalized = removeAccents(searchTerm.toLowerCase());
    const nameNormalized = removeAccents(b.name.toLowerCase());
    const codeNormalized = removeAccents(b.code.toLowerCase());
    return nameNormalized.includes(searchNormalized) || codeNormalized.includes(searchNormalized);
  });

  const selectedBank = banks.find(b => b.code === value);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        className={`w-full p-3 sm:p-4 rounded-lg bg-white font-bold text-base sm:text-lg cursor-pointer flex justify-between items-center ${selectedBank ? 'text-black' : 'text-gray-400'}`}
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
      >
        <span className="truncate pr-2">
          {selectedBank ? `${selectedBank.code} - ${selectedBank.name}` : "Chọn ngân hàng (*)"}
        </span>
        <ChevronDown className={`transform transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] w-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  autoFocus
                  className="w-full pl-10 pr-3 py-3 border rounded-md text-base text-black font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="Nhập tên hoặc mã ngân hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()} 
                />
              </div>
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {filteredBanks.length > 0 ? (
                filteredBanks.map(b => (
                  <li
                    key={b.code}
                    className="px-4 py-3 hover:bg-amber-100 cursor-pointer text-black border-b border-gray-100 last:border-b-0 flex flex-col"
                    onClick={() => {
                      onChange(b.code);
                      setIsOpen(false);
                    }}
                  >
                    <span className="font-bold text-blue-800">{b.code}</span>
                    <span className="text-sm font-medium text-gray-700">{b.name}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-gray-500 text-sm text-center">
                  Không tìm thấy ngân hàng phù hợp
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const [isSharing, setIsSharing] = useState(false);
  
  // State lưu trữ bản sao an toàn (Base64) của ảnh để html2canvas không bị lỗi CORS
  const [safeImages, setSafeImages] = useState({ env: envelopeImg, money: moneyImg });

  useEffect(() => {
    // Tải html2canvas
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Hàm chuyển đổi hình ảnh sang chuỗi Base64
    const convertUrlToBase64 = async (url, key) => {
      if (!url || url.startsWith('data:')) return;
      try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setSafeImages(prev => ({ ...prev, [key]: reader.result }));
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        console.warn(`Không thể chuyển đổi ảnh ${key} sang base64 (lỗi CORS), vẫn sử dụng URL gốc.`, e);
      }
    };

    convertUrlToBase64(envelopeImg, 'env');
    convertUrlToBase64(moneyImg, 'money');
  }, [envelopeImg, moneyImg]);

  const handleShare = async () => {
    if (cardRef.current && window.html2canvas) {
      try {
        setIsSharing(true);
        
        // Đợi 300ms đảm bảo DOM đã được cập nhật bản Base64 đầy đủ
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const element = cardRef.current;
        const canvas = await window.html2canvas(element, { 
          scale: 3, // Tăng độ nét cho ảnh xuất ra
          useCORS: true, 
          backgroundColor: '#991b1b', // Đặt màu nền trùng với bg-red-800 để tránh lỗi nền trong suốt
          width: element.offsetWidth, // Ép cứng chiều rộng để fix lỗi bị cắt dọc ảnh
          height: element.offsetHeight, // Ép cứng chiều cao thực tế của thẻ
          windowWidth: window.innerWidth, // Giúp html2canvas tính toán Flexbox chuẩn xác hơn
          scrollX: 0, // Reset tọa độ cuộn
          scrollY: 0,
          imageTimeout: 15000 // Tăng thời gian chờ load ảnh
        });
        
        const image = canvas.toDataURL("image/png");
        
        // Chuyển DataURL thành File object
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], "loc-tet.png", { type: "image/png" });
        
        // Kiểm tra trình duyệt có hỗ trợ share file (Zalo, Facebook, v.v...) không
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ 
            title: 'Lộc Tết', 
            text: `Mình nhận được ${amount.toLocaleString()}đ!`, 
            files: [file] 
          });
        } else {
          // Fallback: Nếu trình duyệt không hỗ trợ share (như Chrome PC), tự động tải ảnh về
          const link = document.createElement('a');
          link.href = image; 
          link.download = 'loc-tet.png'; 
          link.click();
        }
      } catch (e) { 
        console.error(e);
        alert("Lỗi khi tạo ảnh chia sẻ, vui lòng thử lại."); 
      } finally {
        setIsSharing(false);
      }
    } else {
        alert("Công cụ tạo ảnh đang được tải, vui lòng thử lại sau vài giây.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 text-center overflow-y-auto h-[100dvh]">
      <div className="max-w-lg w-full my-auto pb-6">
        <div ref={cardRef} className="bg-red-800 p-5 sm:p-8 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.5)] border-2 sm:border-4 border-amber-400 text-center relative overflow-hidden flex flex-col items-center">
            <h3 className="text-amber-200 font-serif text-3xl sm:text-4xl mb-4 sm:mb-8 font-bold relative z-10 drop-shadow-md">XUÂN NHƯ Ý</h3>
            <div className="relative z-10 w-full h-44 sm:h-64 mb-4 sm:mb-6 flex justify-center items-center">
                {/* Dùng base64 và thêm crossOrigin="anonymous" */}
                <img src={safeImages.env} crossOrigin="anonymous" className="absolute left-0 sm:left-4 w-24 sm:w-40 h-auto transform -rotate-12 z-10 rounded-md shadow-lg object-contain" alt="Envelope" />
                <img src={safeImages.money} crossOrigin="anonymous" className="absolute right-0 sm:right-4 w-40 sm:w-64 h-auto transform rotate-6 shadow-xl sm:shadow-2xl rounded-sm border border-white/50 z-20 object-contain" alt="Money" />
            </div>
            <div className="bg-white/95 p-3 sm:p-4 rounded-xl z-10 w-full shadow-inner"><p className="text-red-600 font-black text-3xl sm:text-5xl">{amount.toLocaleString()} <span className="text-base sm:text-xl">VND</span></p></div>
        </div>
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 w-full mx-auto">
            <button 
              onClick={handleShare} 
              disabled={isSharing}
              className={`w-full flex items-center justify-center gap-2 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-colors ${isSharing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSharing ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />} 
              {isSharing ? 'Đang tạo ảnh...' : 'Khoe Lộc Ngay'}
            </button>
            <button onClick={onNext} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-red-900 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-colors">
              <CreditCard size={20} /> Rút Tiền Về Ngân Hàng
            </button>
        </div>
      </div>
    </div>
  );
};

cconst BankForm = ({ onSubmit, amount }) => {
  // Sửa bank thành chuỗi rỗng để bắt buộc người dùng phải click chọn
  const [formData, setFormData] = useState({ name: '', bank: '', account: '' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validate Ngân hàng
    if (!formData.bank) {
      setError('Vui lòng chọn ngân hàng nhận tiền!');
      return;
    }
    // Validate Số tài khoản
    if (!formData.account || formData.account.trim() === '') {
      setError('Vui lòng nhập số tài khoản / số điện thoại!');
      return;
    }
    
    // Nếu pass hết điều kiện, xóa lỗi và submit
    setError('');
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] text-white">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-400 text-center drop-shadow-md">Thông tin nhận Lộc</h3>
      <div className="space-y-4 sm:space-y-5">
        <input 
          type="text" 
          className="w-full p-3 sm:p-4 rounded-lg text-black font-bold uppercase text-base sm:text-lg" 
          placeholder="TÊN CHỦ TÀI KHOẢN (Tùy chọn)" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} 
        />
        
        <SearchableBankSelect 
          banks={BANKS} 
          value={formData.bank} 
          onChange={(newBankCode) => {
            setFormData({...formData, bank: newBankCode});
            if (error) setError(''); // Xóa lỗi khi người dùng chọn xong
          }} 
        />

        <input 
          type="text" 
          className="w-full p-3 sm:p-4 rounded-lg text-black font-bold text-base sm:text-lg" 
          placeholder="SỐ TÀI KHOẢN / SĐT (*)" 
          value={formData.account} 
          onChange={e => {
            setFormData({...formData, account: e.target.value});
            if (error) setError(''); // Xóa lỗi khi người dùng gõ
          }} 
        />

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <div className="bg-red-500/80 border border-red-300 text-white px-3 py-2 rounded-lg text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          className="w-full mt-4 sm:mt-6 bg-green-600 hover:bg-green-500 font-black py-3 sm:py-4 rounded-lg shadow-xl uppercase text-lg sm:text-xl transition-transform hover:scale-105"
        >
          Xác Nhận Nhận {amount.toLocaleString()}đ
        </button>
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
      
      <button 
        onClick={() => setShowAdminAuth(true)} 
        className="fixed bottom-3 right-3 z-50 bg-black/40 hover:bg-black/60 text-white/50 hover:text-white text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 transition-all uppercase tracking-widest"
      >
        Admin
      </button>

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