import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Smartphone, QrCode, X, Settings, Copy, Save, Plus, Trash2, Edit3, 
  History, Wallet, Users, Loader2, Image as ImageIcon, Banknote, Gift,
  Maximize2, Share2, Download // Các icon mới được thêm vào
} from 'lucide-react';

// --- UTILS DÀNH CHO ADMIN ---
const copyToClipboard = (text) => {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    return false;
  }
};

const handleFileUpload = (e, callback) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
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

const PAYING_APPS = [
  { code: 'mb', name: 'MB Bank' },
  { code: 'vcb', name: 'Vietcombank' },
  { code: 'tcb', name: 'Techcombank' },
  { code: 'acb', name: 'ACB' },
  { code: 'vp', name: 'VPBank' },
  { code: 'tp', name: 'TPBank' },
  { code: 'bidv', name: 'BIDV SmartBanking' },
  { code: 'momo', name: 'MoMo' },
  { code: 'zalopay', name: 'ZaloPay' },
];

const DEFAULT_MONEY_TYPES = [
  { id: 'm1', amount: 10000, image_url: "https://upload.wikimedia.org/wikipedia/vi/thumb/e/e6/10000_dong_front.jpg/640px-10000_dong_front.jpg" },
  { id: 'm2', amount: 20000, image_url: "https://upload.wikimedia.org/wikipedia/vi/thumb/6/62/20000_dong_front.jpg/640px-20000_dong_front.jpg" },
  { id: 'm3', amount: 50000, image_url: "https://upload.wikimedia.org/wikipedia/vi/6/6f/50000_dong_front.jpg" }
];

const DEFAULT_ENVELOPE_TYPES = [
  { id: 'env1', name: 'Phong bao Đỏ truyền thống', image_url: "https://orientalmestore.com/cdn/shop/files/Personalizable_Year_of_Horse_2026_Red_Envelopes_1.jpg?v=1761089591&width=486" },
  { id: 'env2', name: 'Phong bao Vàng tài lộc', image_url: "https://img.pikbest.com/png-images/20190117/happy-new-year-red-envelopes-and-gold-coins-for-commercial-use_2707259.png!w700wp" }
];

/* =========================================
   THÀNH PHẦN QUẢN LÝ LOẠI TIỀN (MONEY TYPES)
   ========================================= */
const AdminMoneyTypes = ({ moneyTypes, setMoneyTypes }) => {
  const [types, setTypes] = useState(moneyTypes);
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => setTypes([...types, { id: `m-${Date.now()}`, amount: 0, image_url: '' }]);
  const handleRemove = (id) => setTypes(types.filter(t => t.id !== id));
  const handleChange = (id, field, value) => setTypes(types.map(t => t.id === id ? { ...t, [field]: value } : t));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'money_types', value: types })
      });
      setMoneyTypes(types);
      alert("Đã lưu danh sách loại tiền vào Database!");
    } catch (e) {
      alert("Lỗi khi lưu loại tiền!");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Loại tiền (Mệnh giá)</h2>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 font-bold text-sm"><Plus size={16}/> Thêm mệnh giá</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4 border">
        <div className="grid grid-cols-12 gap-4 text-sm font-bold text-gray-600 mb-2 border-b pb-2">
          <div className="col-span-3">Mệnh giá (VND)</div>
          <div className="col-span-8">URL Hình ảnh hoặc Upload (Lưu Base64)</div>
          <div className="col-span-1 text-center">Xóa</div>
        </div>
        {types.length === 0 && <div className="text-center text-gray-400 py-4">Chưa có loại tiền nào. Hãy thêm mới.</div>}
        {types.map(t => (
          <div key={t.id} className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-3"><input type="number" className="w-full border p-2 rounded font-bold text-green-700 mt-1" value={t.amount} onChange={e => handleChange(t.id, 'amount', Number(e.target.value))} /></div>
            <div className="col-span-8 flex gap-3 items-start">
              <img src={t.image_url || 'https://via.placeholder.com/60x30?text=Image'} className="w-20 h-12 object-contain border rounded bg-gray-50 mt-1" alt="preview" />
              <div className="flex-1 flex flex-col gap-2">
                <input type="text" className="w-full border p-2 rounded text-sm" placeholder="Paste link online hoặc chuỗi Base64..." value={t.image_url} onChange={e => handleChange(t.id, 'image_url', e.target.value)} />
                <input type="file" accept="image/*" className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleFileUpload(e, (base64) => handleChange(t.id, 'image_url', base64))} />
              </div>
            </div>
            <div className="col-span-1 text-center mt-1"><button onClick={() => handleRemove(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button></div>
          </div>
        ))}
        <div className="pt-6 border-t flex justify-end mt-4">
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>} Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   THÀNH PHẦN QUẢN LÝ PHONG BAO (ENVELOPE TYPES)
   ========================================= */
const AdminEnvelopeTypes = ({ envelopeTypes, setEnvelopeTypes }) => {
  const [types, setTypes] = useState(envelopeTypes);
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => setTypes([...types, { id: `env-${Date.now()}`, name: 'Phong bao mới', image_url: '' }]);
  const handleRemove = (id) => setTypes(parseFloat(types.filter(t => t.id !== id)));
  const handleChange = (id, field, value) => setTypes(types.map(t => t.id === id ? { ...t, [field]: value } : t));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'envelope_types', value: types })
      });
      setEnvelopeTypes(types);
      alert("Đã lưu danh sách Phong bao vào Database!");
    } catch (e) {
      alert("Lỗi khi lưu phong bao!");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Hình ảnh Phong bao</h2>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 font-bold text-sm"><Plus size={16}/> Thêm phong bao</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4 border">
        <div className="grid grid-cols-12 gap-4 text-sm font-bold text-gray-600 mb-2 border-b pb-2">
          <div className="col-span-3">Tên gợi nhớ</div>
          <div className="col-span-8">URL Hình ảnh hoặc Upload (Lưu Base64)</div>
          <div className="col-span-1 text-center">Xóa</div>
        </div>
        {types.length === 0 && <div className="text-center text-gray-400 py-4">Chưa có phong bao nào. Hãy thêm mới.</div>}
        {types.map(t => (
          <div key={t.id} className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-3"><input type="text" className="w-full border p-2 rounded font-bold text-gray-700 mt-1" placeholder="Vd: Phong bao Tết" value={t.name} onChange={e => handleChange(t.id, 'name', e.target.value)} /></div>
            <div className="col-span-8 flex gap-3 items-start">
              <img src={t.image_url || 'https://via.placeholder.com/60x80?text=Bao'} className="w-16 h-20 object-contain border rounded bg-gray-50 mt-1" alt="preview" />
              <div className="flex-1 flex flex-col gap-2">
                <input type="text" className="w-full border p-2 rounded text-sm" placeholder="Paste link online hoặc chuỗi Base64..." value={t.image_url} onChange={e => handleChange(t.id, 'image_url', e.target.value)} />
                <input type="file" accept="image/*" className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleFileUpload(e, (base64) => handleChange(t.id, 'image_url', base64))} />
              </div>
            </div>
            <div className="col-span-1 text-center mt-1"><button onClick={() => handleRemove(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button></div>
          </div>
        ))}
        <div className="pt-6 border-t flex justify-end mt-4">
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>} Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};


/* =========================================
   THÀNH PHẦN QUẢN LÝ CÀI ĐẶT (SETTINGS)
   ========================================= */
const AdminSettings = ({ appAssets, setAppAssets }) => {
  const [formData, setFormData] = useState(appAssets);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'app_assets', value: formData })
      });
      setAppAssets(formData);
      alert("Đã áp dụng thay đổi và lưu vào Database!");
    } catch (e) {
      alert("Lỗi khi lưu giao diện!");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold">Tùy chỉnh Giao diện Khác</h2>
      <div className="bg-white p-6 rounded-lg shadow space-y-6 border">
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Hình nền Trang chủ</label>
          <div className="flex gap-4 items-start">
             <img src={formData.homeBg || 'https://via.placeholder.com/100x150'} className="w-24 h-32 object-cover rounded border bg-gray-50" alt="Home Bg" />
             <div className="flex-1 flex flex-col gap-2">
               <input type="text" className="w-full border p-2 rounded text-sm" value={formData.homeBg} onChange={e => setFormData({...formData, homeBg: e.target.value})} placeholder="URL hình ảnh hoặc Base64..." />
               <input type="file" accept="image/*" className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleFileUpload(e, (base64) => setFormData({...formData, homeBg: base64}))} />
             </div>
          </div>
        </div>
        <hr/>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Hình nền Màn hình Bốc Lì Xì</label>
          <div className="flex gap-4 items-start">
             <img src={formData.bg || 'https://via.placeholder.com/100x150'} className="w-24 h-32 object-cover rounded border bg-gray-50" alt="App Bg" />
             <div className="flex-1 flex flex-col gap-2">
               <input type="text" className="w-full border p-2 rounded text-sm" value={formData.bg} onChange={e => setFormData({...formData, bg: e.target.value})} placeholder="URL hình ảnh hoặc Base64..." />
               <input type="file" accept="image/*" className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleFileUpload(e, (base64) => setFormData({...formData, bg: base64}))} />
             </div>
          </div>
        </div>
        <div className="pt-4 border-t flex justify-end">
           <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
             {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>} Áp dụng
           </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   THÀNH PHẦN QUẢN LÝ CHIẾN DỊCH
   ========================================= */
const CampaignEditModal = ({ campaign, onClose, onSave, moneyTypes, envelopeTypes }) => {
  const [form, setForm] = useState({ 
    ...campaign, 
    prizes: campaign.prizes || [],
    envelope_images: campaign.envelope_images || Array(campaign.envelope_count || 8).fill(envelopeTypes.length > 0 ? envelopeTypes[0].image_url : '')
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (campaign.id.startsWith('new-')) {
        setLoading(false);
        return;
    }
    fetch(`/api/lixi/campaign/${campaign.id}`)
      .then(res => res.json())
      .then(data => {
         const parsedImages = data.envelope_images ? (typeof data.envelope_images === 'string' ? JSON.parse(data.envelope_images) : data.envelope_images) : Array(data.envelope_count || 8).fill(envelopeTypes.length > 0 ? envelopeTypes[0].image_url : '');
         setForm(prev => ({ 
           ...prev, 
           prizes: data.prizes || [],
           envelope_count: data.envelope_count || 8,
           envelope_images: parsedImages
         }));
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [campaign.id, envelopeTypes]);

  const handleCountChange = (e) => {
    const newCount = Number(e.target.value);
    const newImages = [...(form.envelope_images || [])];
    if (newCount > newImages.length) {
       newImages.push(...Array(newCount - newImages.length).fill(envelopeTypes.length > 0 ? envelopeTypes[0].image_url : ''));
    } else {
       newImages.splice(newCount);
    }
    setForm({...form, envelope_count: newCount, envelope_images: newImages});
  };

  const handleEnvelopeImageChange = (index, url) => {
    const newImages = [...form.envelope_images];
    newImages[index] = url;
    setForm({...form, envelope_images: newImages});
  };

  const updatePrize = (index, field, value) => {
    const newPrizes = [...form.prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setForm({ ...form, prizes: newPrizes });
  };

  const handleMoneyTypeChange = (index, selectedAmount) => {
    const selectedType = moneyTypes.find(t => t.amount === selectedAmount);
    if (selectedType) {
      const newPrizes = [...form.prizes];
      newPrizes[index] = { ...newPrizes[index], amount: selectedType.amount, image_url: selectedType.image_url };
      setForm({ ...form, prizes: newPrizes });
    }
  };

  const addPrize = () => {
    const defaultType = moneyTypes[0] || { amount: 0, image_url: '' };
    setForm({ ...form, prizes: [...form.prizes, { amount: defaultType.amount, quantity: 10, image_url: defaultType.image_url }] });
  };

  const removePrize = (index) => setForm({ ...form, prizes: form.prizes.filter((_, i) => i !== index) });

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(form);
    setIsSaving(false);
  }

  if (loading) return <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={40}/></div>;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold">{campaign.id.startsWith('new-') ? 'Tạo Chiến Dịch Mới' : `Sửa Chiến Dịch: ${form.name}`}</h3>
          <button onClick={onClose} disabled={isSaving} className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-6 flex-1">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tên chiến dịch</label>
                <input type="text" className="w-full border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Số lượng phong bao hiển thị</label>
                <input type="number" className="w-full border p-2 rounded" value={form.envelope_count || 8} onChange={handleCountChange}/>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
             <h4 className="font-bold text-lg text-gray-800 mb-4">Hình ảnh từng Phong bao</h4>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto p-2 border bg-white rounded">
               {Array.from({length: form.envelope_count || 8}).map((_, i) => (
                  <div key={i} className="border p-3 rounded-lg bg-gray-50 flex flex-col items-center">
                    <span className="font-bold text-sm mb-2 text-red-700">Bao #{i + 1}</span>
                    <img src={form.envelope_images?.[i] || 'https://via.placeholder.com/60x80?text=Bao'} className="w-16 h-24 object-contain shadow-sm mb-3 border bg-white rounded" alt={`Bao ${i+1}`}/>
                    <select 
                      className="w-full text-xs font-bold text-gray-700 border p-2 rounded cursor-pointer"
                      value={form.envelope_images?.[i] || ''}
                      onChange={(e) => handleEnvelopeImageChange(i, e.target.value)}
                    >
                      <option value="" disabled>Chọn mẫu...</option>
                      {envelopeTypes.map(env => (
                        <option key={env.id} value={env.image_url}>{env.name}</option>
                      ))}
                    </select>
                  </div>
               ))}
             </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg text-gray-800">Cơ cấu giải thưởng</h4>
              <button onClick={addPrize} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline"><Plus size={16}/> Thêm mức tiền</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase">
                <div className="col-span-5">Loại Tiền</div>
                <div className="col-span-3">Số lượng</div>
                <div className="col-span-3">Hình ảnh xem trước</div>
                <div className="col-span-1"></div>
              </div>
              {form.prizes.map((prize, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 border rounded shadow-sm">
                  <div className="col-span-5">
                    <select className="w-full border p-2 rounded font-bold text-green-700 bg-white" value={prize.amount || ''} onChange={e => handleMoneyTypeChange(idx, Number(e.target.value))}>
                      <option value="" disabled>Chọn mệnh giá...</option>
                      {moneyTypes.map(t => <option key={t.id} value={t.amount}>{t.amount.toLocaleString()} đ</option>)}
                    </select>
                  </div>
                  <div className="col-span-3"><input type="number" className="w-full border p-2 rounded text-center" value={prize.quantity !== undefined ? prize.quantity : (prize.remaining_qty || 0)} onChange={e => updatePrize(idx, 'quantity', Number(e.target.value))}/></div>
                  <div className="col-span-3 flex justify-center"><img src={prize.image_url || 'https://via.placeholder.com/60x30?text=Money'} className="w-16 h-8 object-cover border rounded bg-gray-100" alt="preview"/></div>
                  <div className="col-span-1 text-center"><button onClick={() => removePrize(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button onClick={onClose} disabled={isSaving} className="px-5 py-2 text-gray-600 bg-white border hover:bg-gray-100 rounded font-bold disabled:opacity-50">Hủy</button>
          <button onClick={handleSaveClick} disabled={isSaving} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-md flex items-center gap-2">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {isSaving ? 'Đang lưu...' : 'Lưu Chiến Dịch'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCampaignConfig = ({ campaigns, setCampaigns, onRefresh, moneyTypes, envelopeTypes }) => {
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [zoomedCampaign, setZoomedCampaign] = useState(null); // State quản lý zoom QR

  const handleSaveCampaign = async (campaignData) => {
    try {
      const calculatedBudget = campaignData.prizes.reduce((sum, prize) => {
        const qty = Number(prize.quantity !== undefined ? prize.quantity : (prize.remaining_qty || 0));
        return sum + (Number(prize.amount) * qty);
      }, 0);

      const payload = { ...campaignData, budget: calculatedBudget };
      let url = '', method = '';

      if (campaignData.id.startsWith('new-')) {
        url = '/api/admin/campaigns'; method = 'POST'; payload.id = `camp-${Date.now()}`;
      } else {
        url = `/api/admin/campaigns/${campaignData.id}`; method = 'PUT';
      }

      const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();

      if (!response.ok || result.error) throw new Error(result.error || 'Lỗi server khi lưu chiến dịch');

      alert("Lưu chiến dịch vào Database thành công!");
      setEditingCampaign(null);
      if (onRefresh) onRefresh();

    } catch (error) {
      console.error("Lỗi khi lưu chiến dịch:", error);
      alert("Đã xảy ra lỗi khi lưu: " + error.message);
    }
  };

  const handleCreateNew = () => setEditingCampaign({ 
    id: `new-${Date.now()}`, 
    name: 'Chiến dịch Mới', 
    budget: 0, 
    spent: 0, 
    envelope_count: 8, 
    prizes: [],
    envelope_images: Array(8).fill(envelopeTypes.length > 0 ? envelopeTypes[0].image_url : '')
  });

  // Chức năng tải ảnh QR
  const handleDownloadQR = async (campaign) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(window.location.origin + '?c=' + campaign.id)}`;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_Lixi_${campaign.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Lỗi khi tải mã QR!");
    }
  };

  // Chức năng chia sẻ Social/Native
  const handleShareSocial = async (campaign) => {
    const shareUrl = window.location.origin + '?c=' + campaign.id;
    const shareTitle = `Nhận lì xì: ${campaign.name}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: 'Quét mã QR hoặc nhấn vào link này để nhận lì xì ngay!',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Hủy chia sẻ', error);
      }
    } else {
      // Fallback nếu trình duyệt không hỗ trợ (VD PC cũ)
      copyToClipboard(shareUrl);
      alert("Đã copy link chiến dịch vào khay nhớ tạm để bạn chia sẻ!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chiến dịch Lì xì</h2>
        <button onClick={handleCreateNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 font-bold text-sm"><Plus size={16}/> Tạo mới</button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-lg shadow border relative group">
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => setEditingCampaign(c)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><Edit3 size={16}/></button>
            </div>
            <h3 className="font-bold text-lg pr-12">{c.name}</h3>
            <div className="mt-4 flex gap-4">
               {/* Click vào QR sẽ mở Modal Zoom */}
               <div 
                 className="relative w-20 h-20 shrink-0 cursor-pointer group/qr"
                 onClick={() => setZoomedCampaign(c)}
                 title="Nhấn để phóng to QR"
               >
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin + '?c=' + c.id)}`} className="w-full h-full border rounded" alt="QR Link"/>
                 <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity">
                    <Maximize2 className="text-white" size={24} />
                 </div>
               </div>
               
               <div className="text-sm space-y-1 flex-1">
                  <p className="flex justify-between text-gray-500"><span>Ngân sách:</span><b className="text-black">{Number(c.budget || c.total_budget || 0).toLocaleString()} đ</b></p>
                  <p className="flex justify-between text-gray-500"><span>Đã chi:</span><b className="text-red-600">{Number(c.spent || c.current_spent || 0).toLocaleString()} đ</b></p>
                  <p className="flex justify-between text-gray-500 mt-1"><span>Số phong bao:</span><b>{c.envelope_count || 8}</b></p>
                  <button onClick={() => { copyToClipboard(window.location.origin + '?c=' + c.id); alert("Đã copy Link chiến dịch!"); }} className="text-blue-600 flex items-center gap-1 text-xs font-bold uppercase mt-2 hover:underline"><Copy size={12}/> Copy Link</button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Zoom & Share QR */}
      {zoomedCampaign && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setZoomedCampaign(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col items-center relative animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setZoomedCampaign(null)} className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
            
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800 border-b pb-2 w-full">{zoomedCampaign.name}</h3>
            
            <div className="bg-gray-50 p-4 rounded-xl border mb-6">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '?c=' + zoomedCampaign.id)}`} className="w-64 h-64 mix-blend-multiply" alt="Zoomed QR"/>
            </div>

            <div className="w-full space-y-3">
              <button onClick={() => handleDownloadQR(zoomedCampaign)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                <Download size={18} /> Tải mã QR về máy
              </button>
              <button onClick={() => handleShareSocial(zoomedCampaign)} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                <Share2 size={18} /> Chia sẻ Link (Native)
              </button>
              
              <div className="flex justify-center gap-3 pt-4 mt-2 border-t">
                 <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '?c=' + zoomedCampaign.id)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-full">
                    Chia sẻ Facebook
                 </a>
                 <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '?c=' + zoomedCampaign.id)}&text=${encodeURIComponent('Nhận lì xì Tết ngay: ' + zoomedCampaign.name)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full">
                    Chia sẻ X (Twitter)
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingCampaign && <CampaignEditModal campaign={editingCampaign} onClose={() => setEditingCampaign(null)} onSave={handleSaveCampaign} moneyTypes={moneyTypes} envelopeTypes={envelopeTypes} />}
    </div>
  );
};

/* =========================================
   THÀNH PHẦN QUẢN LÝ HÀNG ĐỢI
   ========================================= */
const AdminQueueList = ({ queue, onMarkPaid }) => {
  const [adminBankApp, setAdminBankApp] = useState('bidv');
  const [loadingId, setLoadingId] = useState(null);

  const handleSaveQR = (tx) => {
    setLoadingId(tx.id);
    const content = encodeURIComponent(`Lixi Tet`);
    const imgUrl = `https://img.vietqr.io/image/${tx.bank_code}-${tx.bank_account}-compact.png?amount=${tx.amount}&addInfo=${content}&accountName=${encodeURIComponent(tx.user_name)}`;
    fetch(imgUrl).then(r => r.blob()).then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `QR_${tx.user_name.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.click();
      setLoadingId(null);
    });
  };

  const handleOpenApp = (tx) => {
    const bankInfo = BANKS.find(b => b.code === tx.bank_code) || { bin: tx.bank_code };
    const content = encodeURIComponent(`Lixi Tet`);
    window.location.href = `https://dl.vietqr.io/pay?app=${adminBankApp}&b=${bankInfo.bin}&n=${tx.bank_account}&a=${tx.amount}&c=${content}&tn=${encodeURIComponent(tx.user_name)}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-center">
        <h2 className="text-lg font-bold flex-1 text-red-700">Hàng đợi thanh toán</h2>
        <div className="flex items-center gap-2 text-sm">
          <span>App thanh toán:</span>
          <select value={adminBankApp} onChange={(e) => setAdminBankApp(e.target.value)} className="border p-1 rounded font-bold text-blue-600">
            {PAYING_APPS.map(app => <option key={app.code} value={app.code}>{app.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-3">
        {queue.length === 0 ? <p className="text-center py-10 text-gray-400">Không có yêu cầu nào.</p> : 
          queue.map(tx => (
            <div key={tx.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-bold text-lg">{tx.user_name}</span><span className="bg-gray-100 text-xs px-2 py-1 rounded">{tx.bank_code}</span></div>
                <div className="text-gray-500 font-mono">{tx.bank_account}</div>
                <div className="text-green-600 font-bold text-xl">{Number(tx.amount).toLocaleString()} đ</div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => handleSaveQR(tx)} className="flex-1 md:flex-none bg-indigo-600 text-white px-3 py-2 rounded text-sm font-bold flex items-center gap-1 justify-center disabled:opacity-50" disabled={loadingId === tx.id}><Save size={16} /> {loadingId === tx.id ? '...' : 'Lưu QR'}</button>
                <button onClick={() => handleOpenApp(tx)} className="flex-1 md:flex-none bg-red-600 text-white px-3 py-2 rounded text-sm font-bold flex items-center gap-1 justify-center"><Smartphone size={16} /> Mở App</button>
                <button onClick={() => onMarkPaid(tx.id)} className="bg-green-500 text-white p-2 rounded hover:bg-green-600"><CheckCircle size={20}/></button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

// EXPORT COMPONENT CHÍNH CỦA ADMIN
export default function AdminDashboardComponent({ onBack, appAssets, setAppAssets }) {
  const [tab, setTab] = useState('queue');
  const [queue, setQueue] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [moneyTypes, setMoneyTypes] = useState([]);
  const [envelopeTypes, setEnvelopeTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/admin/queue');
      const data = await res.json();
      setQueue(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/campaigns');
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    setLoading(true);
    
    // Đọc các cài đặt trực tiếp từ Database API thay vì LocalStorage
    const loadSettings = async () => {
      try {
        const [mRes, eRes] = await Promise.all([
          fetch('/api/admin/settings/money_types').then(r => r.json()),
          fetch('/api/admin/settings/envelope_types').then(r => r.json())
        ]);
        
        if (mRes && !mRes.error) setMoneyTypes(mRes);
        else setMoneyTypes(DEFAULT_MONEY_TYPES);

        if (eRes && !eRes.error) setEnvelopeTypes(eRes);
        else setEnvelopeTypes(DEFAULT_ENVELOPE_TYPES);
      } catch (e) {
        setMoneyTypes(DEFAULT_MONEY_TYPES);
        setEnvelopeTypes(DEFAULT_ENVELOPE_TYPES);
      }
    };

    Promise.all([fetchQueue(), fetchCampaigns(), loadSettings()]).finally(() => setLoading(false));
  }, []);

  const handleMarkPaid = async (id) => {
    try {
      await fetch(`/api/admin/pay/${id}`, { method: 'POST' });
      fetchQueue();
    } catch (e) { alert("Lỗi khi cập nhật trạng thái"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Loader2 className="animate-spin text-red-600" size={48} /></div>;

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-white shadow-lg p-4 flex flex-col gap-2 z-20">
        <div className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2 cursor-pointer" onClick={onBack}><Settings /> Admin Panel</div>
        <button onClick={() => setTab('queue')} className={`p-3 rounded-lg flex items-center gap-2 font-medium ${tab === 'queue' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}><Users size={20} /> Hàng đợi xử lý {queue.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">{queue.length}</span>}</button>
        <button onClick={() => setTab('campaigns')} className={`p-3 rounded-lg flex items-center gap-2 font-medium ${tab === 'campaigns' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}><Wallet size={20} /> Quản lý Chiến dịch</button>
        <button onClick={() => setTab('moneyTypes')} className={`p-3 rounded-lg flex items-center gap-2 font-medium ${tab === 'moneyTypes' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}><Banknote size={20} /> Quản lý Loại tiền</button>
        <button onClick={() => setTab('envelopeTypes')} className={`p-3 rounded-lg flex items-center gap-2 font-medium ${tab === 'envelopeTypes' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}><Gift size={20} /> Quản lý Phong bao</button>
        <button onClick={() => setTab('settings')} className={`p-3 rounded-lg flex items-center gap-2 font-medium ${tab === 'settings' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}><ImageIcon size={20} /> Cài đặt Giao diện</button>
        <button onClick={onBack} className="mt-auto p-3 text-gray-500 text-sm hover:underline flex items-center gap-1"><X size={14}/> Thoát Admin</button>
      </div>
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {tab === 'queue' && <AdminQueueList queue={queue} onMarkPaid={handleMarkPaid} />}
        {tab === 'campaigns' && <AdminCampaignConfig campaigns={campaigns} setCampaigns={setCampaigns} onRefresh={fetchCampaigns} moneyTypes={moneyTypes} envelopeTypes={envelopeTypes} />}
        {tab === 'moneyTypes' && <AdminMoneyTypes moneyTypes={moneyTypes} setMoneyTypes={setMoneyTypes} />}
        {tab === 'envelopeTypes' && <AdminEnvelopeTypes envelopeTypes={envelopeTypes} setEnvelopeTypes={setEnvelopeTypes} />}
        {tab === 'settings' && <AdminSettings appAssets={appAssets} setAppAssets={setAppAssets} />}
      </div>
    </div>
  );
}