import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Save, 
  MapPin, 
  Image as ImageIcon, 
  Clock, 
  Ticket, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { HeritageItem, HeritageCategory, Region, VerificationStatus } from '../types';
import { storageService } from '../services/storageService';
import { languageService, SUPPORTED_LANGUAGES } from '../services/languageService';

interface HeritageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  heritage: HeritageItem | null;
  language?: string;
  onSaveSuccess?: (savedItem: HeritageItem) => void;
}

const CATEGORY_OPTIONS: { id: HeritageCategory; label: string }[] = [
  { id: 'monument', label: 'Di tích Lịch sử' },
  { id: 'palace', label: 'Cung điện & Hoàng thành' },
  { id: 'temple', label: 'Đền miếu & Chùa cổ' },
  { id: 'citadel', label: 'Thành lũy & Pháo đài' },
  { id: 'ancient_house', label: 'Đô thị Cổ & Nhà cổ' },
  { id: 'architecture', label: 'Kiến trúc Cổ & Tháp Chăm' },
  { id: 'craft_village', label: 'Làng nghề truyền thống' },
  { id: 'artifact', label: 'Bảo vật & Cổ vật quốc gia' },
  { id: 'folk_art', label: 'Nghệ thuật Dân gian' },
  { id: 'culinary', label: 'Ẩm thực Di sản' }
];

export const HeritageEditModal: React.FC<HeritageEditModalProps> = ({
  isOpen,
  onClose,
  heritage,
  language,
  onSaveSuccess
}) => {
  const isNew = !heritage || !heritage.id;
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const formRef = useRef<HTMLFormElement>(null);
  const [editLang, setEditLang] = useState<string>(() => language || languageService.getCurrentLanguage() || 'vi');

  useEffect(() => {
    if (language) {
      setEditLang(language);
    }
  }, [language, isOpen]);

  // Body scroll lock to prevent background scroll on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll form container to top when changing steps
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeStep]);

  const [formData, setFormData] = useState<Partial<HeritageItem>>({
    id: '',
    name: '',
    vietnameseName: '',
    englishName: '',
    category: 'monument',
    categoryLabel: 'Di tích Lịch sử',
    region: 'central',
    province: '',
    period: '',
    dynasty: '',
    address: '',
    lat: 16.0544,
    lng: 108.2022,
    imageUrl: '',
    visitingHours: '07:30 - 17:30 hàng ngày',
    ticketPrice: 'Miễn phí hoặc mua vé tại cổng',
    googleMapsUri: 'https://maps.google.com',
    history: '',
    overview: '',
    culturalSignificance: '',
    interestingFacts: [''],
    verifiedStatus: 'verified',
    tags: ['Di sản', 'Lịch sử'],
    suggestedQuestions: [],
    translations: {}
  });

  const [factInput, setFactInput] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (heritage) {
      setFormData({
        ...heritage,
        interestingFacts: heritage.interestingFacts && heritage.interestingFacts.length > 0
          ? [...heritage.interestingFacts]
          : [''],
        tags: heritage.tags ? [...heritage.tags] : ['Di sản'],
        translations: heritage.translations ? { ...heritage.translations } : {}
      });
    } else {
      setFormData({
        id: 'heritage-' + Date.now(),
        name: '',
        vietnameseName: '',
        englishName: '',
        category: 'monument',
        categoryLabel: 'Di tích Lịch sử',
        region: 'central',
        province: '',
        period: 'Thế kỷ XIX',
        dynasty: 'Triều Nguyễn',
        address: '',
        lat: 16.0,
        lng: 108.0,
        imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        visitingHours: '07:30 - 17:30',
        ticketPrice: '100.000 VNĐ / khách',
        googleMapsUri: 'https://maps.google.com',
        history: '',
        overview: '',
        culturalSignificance: '',
        interestingFacts: ['Công trình được UNESCO vinh danh'],
        verifiedStatus: 'verified',
        tags: ['Di sản'],
        suggestedQuestions: [],
        translations: {}
      });
    }
    setActiveStep(1);
    setSuccessMessage(null);
    setErrorMessage(null);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, 50);
  }, [heritage, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof HeritageItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getLangValue = (field: 'name' | 'categoryLabel' | 'period' | 'dynasty' | 'history' | 'culturalSignificance' | 'overview' | 'address' | 'visitingHours' | 'ticketPrice'): string => {
    if (editLang === 'vi') {
      return (formData[field] as string) || '';
    }
    const val = formData.translations?.[editLang]?.[field];
    if (val !== undefined && val !== null && val !== '') return val;
    if (editLang === 'en' && field === 'name' && formData.englishName) return formData.englishName;
    return '';
  };

  const getLangFacts = (): string[] => {
    if (editLang === 'vi') {
      return formData.interestingFacts || [];
    }
    return formData.translations?.[editLang]?.interestingFacts || [];
  };

  const handleLangFieldChange = (field: string, val: any) => {
    if (editLang === 'vi') {
      setFormData(prev => ({ ...prev, [field]: val }));
    } else {
      setFormData(prev => ({
        ...prev,
        translations: {
          ...(prev.translations || {}),
          [editLang]: {
            ...(prev.translations?.[editLang] || {}),
            [field]: val
          }
        },
        ...(editLang === 'en' && field === 'name' ? { englishName: val } : {})
      }));
    }
  };

  const handleAutoTranslateToEditLang = () => {
    if (editLang === 'vi') return;
    const translatedItem = languageService.translateHeritageItem(formData as HeritageItem, editLang);
    setFormData(prev => ({
      ...prev,
      translations: {
        ...(prev.translations || {}),
        [editLang]: {
          name: translatedItem.name || prev.englishName || prev.name,
          categoryLabel: translatedItem.categoryLabel || prev.categoryLabel,
          period: translatedItem.period || prev.period,
          dynasty: translatedItem.dynasty || prev.dynasty,
          history: translatedItem.history || prev.history,
          culturalSignificance: translatedItem.culturalSignificance || prev.culturalSignificance,
          overview: translatedItem.overview || prev.overview,
          visitingHours: translatedItem.visitingHours || prev.visitingHours,
          ticketPrice: translatedItem.ticketPrice || prev.ticketPrice,
          interestingFacts: translatedItem.interestingFacts || prev.interestingFacts
        }
      },
      ...(editLang === 'en' ? { englishName: translatedItem.name || prev.name } : {})
    }));
    const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name || editLang;
    setSuccessMessage(`Đã tự động điền gợi ý bản dịch sang ${targetLangName}!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CATEGORY_OPTIONS.find(c => c.id === e.target.value);
    setFormData(prev => ({
      ...prev,
      category: e.target.value as HeritageCategory,
      categoryLabel: selected ? selected.label : prev.categoryLabel
    }));
  };

  const handleAddFact = () => {
    if (!factInput.trim()) return;
    const text = factInput.trim();
    if (editLang === 'vi') {
      setFormData(prev => ({
        ...prev,
        interestingFacts: [...(prev.interestingFacts || []), text]
      }));
    } else {
      const currentList = formData.translations?.[editLang]?.interestingFacts || [];
      setFormData(prev => ({
        ...prev,
        translations: {
          ...(prev.translations || {}),
          [editLang]: {
            ...(prev.translations?.[editLang] || {}),
            interestingFacts: [...currentList, text]
          }
        }
      }));
    }
    setFactInput('');
  };

  const handleRemoveFact = (index: number) => {
    if (editLang === 'vi') {
      setFormData(prev => ({
        ...prev,
        interestingFacts: (prev.interestingFacts || []).filter((_, i) => i !== index)
      }));
    } else {
      const currentList = formData.translations?.[editLang]?.interestingFacts || [];
      setFormData(prev => ({
        ...prev,
        translations: {
          ...(prev.translations || {}),
          [editLang]: {
            ...(prev.translations?.[editLang] || {}),
            interestingFacts: currentList.filter((_, i) => i !== index)
          }
        }
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name?.trim()) {
      setActiveStep(1);
      setErrorMessage('Vui lòng nhập tên di sản ở Bước 1.');
      return;
    }
    if (!formData.province?.trim()) {
      setActiveStep(1);
      setErrorMessage('Vui lòng nhập tỉnh thành ở Bước 1.');
      return;
    }
    if (!formData.history?.trim()) {
      setActiveStep(3);
      setErrorMessage('Vui lòng nhập phần mô tả / lịch sử di sản ở Bước 3.');
      return;
    }

    const currentUser = storageService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    const itemToSave: HeritageItem = {
      id: formData.id || 'heritage-' + Date.now(),
      name: formData.name?.trim() || '',
      vietnameseName: formData.vietnameseName?.trim() || formData.name?.trim() || '',
      englishName: formData.englishName?.trim() || formData.translations?.en?.name || '',
      category: formData.category || 'monument',
      categoryLabel: formData.categoryLabel?.trim() || 'Di sản Văn hóa',
      region: (formData.region as Region) || 'central',
      province: formData.province?.trim() || '',
      period: formData.period?.trim() || 'Lịch sử Việt Nam',
      dynasty: formData.dynasty?.trim() || '',
      address: formData.address?.trim() || formData.province?.trim() || '',
      lat: Number(formData.lat) || 16.0,
      lng: Number(formData.lng) || 108.0,
      imageUrl: formData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
      visitingHours: formData.visitingHours?.trim() || '08:00 - 17:00',
      ticketPrice: formData.ticketPrice?.trim() || 'Miễn phí',
      googleMapsUri: formData.googleMapsUri?.trim() || `https://maps.google.com/?q=${encodeURIComponent(formData.name?.trim() || '')}`,
      history: formData.history?.trim() || '',
      overview: formData.overview?.trim() || (formData.history?.trim().slice(0, 180) + '...'),
      culturalSignificance: formData.culturalSignificance?.trim() || 'Bảo tồn giá trị văn hóa và lịch sử ngàn năm của dân tộc.',
      interestingFacts: (formData.interestingFacts || []).filter(f => f.trim().length > 0),
      verifiedStatus: (formData.verifiedStatus as VerificationStatus) || 'verified',
      approvalStatus: isAdmin ? 'approved' : 'pending',
      tags: formData.tags && formData.tags.length > 0 ? formData.tags : ['Di sản'],
      suggestedQuestions: formData.suggestedQuestions || [
        `Ý nghĩa lịch sử của ${formData.name} là gì?`,
        `Thời điểm nào tham quan ${formData.name} đẹp nhất?`
      ],
      translations: formData.translations
    };

    await storageService.updateHeritage(itemToSave);
    if (isAdmin) {
      setSuccessMessage('Đã lưu thay đổi nội dung di sản thành công!');
    } else {
      setSuccessMessage('Đã gửi đề xuất di sản! Vui lòng chờ Admin phê duyệt trước khi đăng tải.');
    }

    if (onSaveSuccess) {
      onSaveSuccess(itemToSave);
    }

    setTimeout(() => {
      onClose();
    }, 900);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="bg-stone-900 border-t sm:border border-amber-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl h-[94vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="w-12 h-1.5 bg-stone-700/80 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              ✏️
            </div>
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-sm sm:text-lg text-amber-100 truncate">
                {isNew ? 'Thêm Điểm Di Sản Mới' : 'Chỉnh Sửa Thông Tin Di Sản'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-stone-400 truncate">
                {languageService.t('Hỗ trợ biên tập đa ngôn ngữ (Việt, Anh, Pháp, Nhật, Hàn, Trung)', editLang, 'Hỗ trợ biên tập đa ngôn ngữ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors shrink-0"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Multi-Language Selector Bar */}
        <div className="px-3 sm:px-5 py-2 bg-stone-950 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs text-stone-300">{languageService.t('Ngôn ngữ biên tập:', editLang, 'Ngôn ngữ:')}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setEditLang(lang.code)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  editLang === lang.code
                    ? 'bg-amber-500 text-stone-950 shadow font-bold'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700/60'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {editLang === lang.code && (
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                )}
              </button>
            ))}

            {editLang !== 'vi' && (
              <button
                type="button"
                onClick={handleAutoTranslateToEditLang}
                className="ml-auto px-2 py-0.5 sm:py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] sm:text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                title="Tự động điền bản dịch từ tiếng Việt bằng AI/Từ điển"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Tự động dịch sang {SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Step Indicator Bar - Responsive for Mobile */}
        <div className="px-3 sm:px-5 py-2 bg-stone-950/60 border-b border-stone-800 flex items-center justify-between text-xs shrink-0 gap-1.5">
          {/* Mobile view step summary bar */}
          <div className="sm:hidden flex items-center justify-between w-full px-1">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[10px] flex items-center justify-center font-extrabold">
                {activeStep}
              </span>
              <span>
                {activeStep === 1 && '1. Thông tin chung'}
                {activeStep === 2 && '2. Vị trí & Giờ mở'}
                {activeStep === 3 && '3. Lịch sử & Nổi bật'}
              </span>
            </span>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(step as 1 | 2 | 3)}
                  className={`h-2 rounded-full transition-all ${
                    activeStep === step 
                      ? 'w-6 bg-amber-500' 
                      : 'w-2 bg-stone-700 hover:bg-stone-600'
                  }`}
                  title={`Chuyển sang bước ${step}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop full view step buttons */}
          <div className="hidden sm:flex items-center justify-between w-full gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`flex-1 py-1.5 px-2 text-center rounded-xl font-medium transition-all cursor-pointer ${
                activeStep === 1 
                  ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                  : 'text-stone-400 hover:bg-stone-800/60'
              }`}
            >
              1. Thông tin chung
            </button>
            <div className="w-4 h-0.5 bg-stone-800 shrink-0" />
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={`flex-1 py-1.5 px-2 text-center rounded-xl font-medium transition-all cursor-pointer ${
                activeStep === 2 
                  ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                  : 'text-stone-400 hover:bg-stone-800/60'
              }`}
            >
              2. Vị trí & Giờ mở
            </button>
            <div className="w-4 h-0.5 bg-stone-800 shrink-0" />
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={`flex-1 py-1.5 px-2 text-center rounded-xl font-medium transition-all cursor-pointer ${
                activeStep === 3 
                  ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                  : 'text-stone-400 hover:bg-stone-800/60'
              }`}
            >
              3. Lịch sử & Nổi bật
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form ref={formRef} onSubmit={handleSave} className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-xs overflow-y-auto overscroll-contain">
          <div className="space-y-3.5">
            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Thông tin cơ bản */}
            {activeStep === 1 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-stone-300 text-xs">
                        Tên Di sản (*)
                        {editLang !== 'vi' && (
                          <span className="ml-1 text-[10px] text-amber-400 font-normal">
                            ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                          </span>
                        )}
                      </label>
                      {editLang !== 'vi' && formData.name && (
                        <span className="text-[10px] text-stone-400 truncate max-w-[140px]" title={formData.name}>
                          Gốc: {formData.name}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={getLangValue('name')}
                      onChange={(e) => handleLangFieldChange('name', e.target.value)}
                      placeholder={editLang === 'vi' ? "VD: Đô thị Cổ Hội An (Phố Cổ Hội An)" : (formData.name || "Tên di sản theo ngôn ngữ được chọn")}
                      required={editLang === 'vi'}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-medium text-xs sm:text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 text-xs">Tỉnh / Thành phố (*)</label>
                    <input
                      type="text"
                      value={formData.province || ''}
                      onChange={(e) => handleChange('province', e.target.value)}
                      placeholder="VD: Quảng Nam, Hà Nội, Thừa Thiên Huế..."
                      required
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-300 flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ảnh đại diện Di sản (URL)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.imageUrl || ''}
                      onChange={(e) => handleChange('imageUrl', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    />
                    {formData.imageUrl && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-700 shrink-0 bg-stone-950">
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 text-xs">Phân loại Di sản</label>
                    <select
                      value={formData.category || 'monument'}
                      onChange={handleCategoryChange}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-200 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    >
                      {CATEGORY_OPTIONS.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 text-xs">
                      Nhãn hiển thị thẻ
                      {editLang !== 'vi' && (
                        <span className="ml-1 text-[10px] text-amber-400 font-normal">
                          ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={getLangValue('categoryLabel')}
                      onChange={(e) => handleLangFieldChange('categoryLabel', e.target.value)}
                      placeholder={editLang === 'vi' ? "VD: Di sản Đô thị Cổ" : (formData.categoryLabel || "Category Label")}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 text-xs">Vùng miền</label>
                    <select
                      value={formData.region || 'central'}
                      onChange={(e) => handleChange('region', e.target.value as Region)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-200 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    >
                      <option value="north">Miền Bắc</option>
                      <option value="central">Miền Trung</option>
                      <option value="south">Miền Nam</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Vị trí & Giờ tham quan */}
            {activeStep === 2 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 text-xs">
                      Niên đại / Thời kỳ
                      {editLang !== 'vi' && (
                        <span className="ml-1 text-[10px] text-amber-400 font-normal">
                          ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={getLangValue('period')}
                      onChange={(e) => handleLangFieldChange('period', e.target.value)}
                      placeholder={editLang === 'vi' ? "VD: Thế kỷ XVI - XIX" : (formData.period || "Period / Era")}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 text-xs">
                      Triều đại liên quan
                      {editLang !== 'vi' && (
                        <span className="ml-1 text-[10px] text-amber-400 font-normal">
                          ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={getLangValue('dynasty')}
                      onChange={(e) => handleLangFieldChange('dynasty', e.target.value)}
                      placeholder={editLang === 'vi' ? "VD: Triều Nguyễn / Chúa Nguyễn" : (formData.dynasty || "Dynasty")}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 text-xs">
                      Địa chỉ cụ thể
                      {editLang !== 'vi' && (
                        <span className="ml-1 text-[10px] text-amber-400 font-normal">
                          ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={getLangValue('address')}
                      onChange={(e) => handleLangFieldChange('address', e.target.value)}
                      placeholder={editLang === 'vi' ? "VD: Phường Minh An, TP. Hội An" : (formData.address || "Address")}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2">
                  <span className="font-semibold text-stone-300 flex items-center gap-1.5 text-xs">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tọa độ GPS (Vĩ độ & Kinh độ trên Bản Đồ)</span>
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400">Vĩ độ (Lat)</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.lat ?? 16.0}
                        onChange={(e) => handleChange('lat', parseFloat(e.target.value))}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 sm:py-1.5 text-stone-100 focus:outline-none focus:border-amber-500 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400">Kinh độ (Lng)</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.lng ?? 108.0}
                        onChange={(e) => handleChange('lng', parseFloat(e.target.value))}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 sm:py-1.5 text-stone-100 focus:outline-none focus:border-amber-500 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Giờ tham quan
                        {editLang !== 'vi' && (
                          <span className="ml-1 text-[10px] text-amber-400 font-normal">
                            ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                          </span>
                        )}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={getLangValue('visitingHours')}
                      onChange={(e) => handleLangFieldChange('visitingHours', e.target.value)}
                      placeholder={editLang === 'vi' ? "VD: 07:30 - 17:30 hàng ngày" : (formData.visitingHours || "Visiting Hours")}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-300 flex items-center gap-1.5 text-xs">
                      <Ticket className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Giá vé tham quan
                        {editLang !== 'vi' && (
                          <span className="ml-1 text-[10px] text-amber-400 font-normal">
                            ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                          </span>
                        )}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={getLangValue('ticketPrice')}
                      onChange={(e) => handleLangFieldChange('ticketPrice', e.target.value)}
                      placeholder={editLang === 'vi' ? "VD: 120.000 VNĐ / vé" : (formData.ticketPrice || "Ticket Price")}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 sm:py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs sm:text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Lịch sử & Nổi bật */}
            {activeStep === 3 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-stone-300 text-xs">
                      Mô tả Lịch sử & Câu chuyện Di sản (*)
                      {editLang !== 'vi' && (
                        <span className="ml-1 text-[10px] text-amber-400 font-normal">
                          ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                        </span>
                      )}
                    </label>
                    {editLang !== 'vi' && formData.history && (
                      <span className="text-[10px] text-amber-400/80 font-mono">
                        Bản dịch ngôn ngữ {editLang.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={getLangValue('history')}
                    onChange={(e) => handleLangFieldChange('history', e.target.value)}
                    placeholder={editLang === 'vi' ? "Nhập nội dung lịch sử hình thành, giá trị kiến trúc..." : (formData.history || "History & architectural narrative in " + editLang)}
                    required={editLang === 'vi'}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-serif leading-relaxed text-xs sm:text-xs"
                  />
                  {editLang !== 'vi' && formData.history && (
                    <div className="p-2 rounded-lg bg-stone-950 border border-stone-800/80 text-[10px] text-stone-400 font-serif leading-relaxed line-clamp-2">
                      <span className="text-amber-400 font-sans font-bold mr-1">Bản gốc tiếng Việt:</span>
                      {formData.history}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-300 text-xs">
                    Ý nghĩa Văn hóa & Tầm vóc Di sản
                    {editLang !== 'vi' && (
                      <span className="ml-1 text-[10px] text-amber-400 font-normal">
                        ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                      </span>
                    )}
                  </label>
                  <textarea
                    rows={2}
                    value={getLangValue('culturalSignificance')}
                    onChange={(e) => handleLangFieldChange('culturalSignificance', e.target.value)}
                    placeholder={editLang === 'vi' ? "VD: Được UNESCO công nhận Di sản Văn hóa Thế giới năm 1999..." : (formData.culturalSignificance || "Cultural Significance")}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-serif text-xs sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-300 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Điểm nổi bật / Sự thật thú vị
                      {editLang !== 'vi' && (
                        <span className="ml-1 text-[10px] text-amber-400 font-normal">
                          ({SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name})
                        </span>
                      )}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={factInput}
                      onChange={(e) => setFactInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFact();
                        }
                      }}
                      placeholder={`Thêm điểm nổi bật mới (${SUPPORTED_LANGUAGES.find(l => l.code === editLang)?.name || editLang})...`}
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 sm:py-1.5 text-stone-300 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddFact}
                      className="px-3.5 py-2 sm:py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {getLangFacts().map((fact, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px]">
                        <span>• {fact}</span>
                        <button type="button" onClick={() => handleRemoveFact(idx)} className="text-stone-400 hover:text-red-400 ml-1 cursor-pointer">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer Actions - Mobile optimized */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2 shrink-0 mt-3 pb-safe sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>

            <div className="flex items-center gap-2">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((activeStep - 1) as 1 | 2)}
                  className="px-3.5 py-2.5 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  ← Quay lại
                </button>
              )}

              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((activeStep + 1) as 2 | 3)}
                  className="px-4 py-2.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  Tiếp theo →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 shrink-0" />
                  <span>Gửi Đề Xuất</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
