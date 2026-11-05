import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Eye, 
  Check, 
  AlertCircle, 
  Upload, 
  Search, 
  Globe,
  Wand2
} from 'lucide-react';
import { RecognitionSectionConfig, RecognitionSampleItem } from '../types';
import { storageService } from '../services/storageService';
import { languageService, SUPPORTED_LANGUAGES } from '../services/languageService';
import { AILandmarkImagePickerModal } from './AILandmarkImagePickerModal';
import { LandmarkPhotoItem } from '../data/landmarkImagesDatabase';

interface AdminRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (newConfig: RecognitionSectionConfig) => void;
  language?: string;
}

const QUICK_CATEGORY_SUGGESTIONS = [
  'Hoàng thành & Cung điện',
  'Di tích Lịch sử & Giáo dục',
  'Đô thị Cổ & Kiến trúc gỗ',
  'Làng nghề Thủ công Truyền thống',
  'Trang phục Truyền thống',
  'Chùa cổ & Phật giáo',
  'Danh thắng Thiên nhiên',
  'Khảo cổ & Hiện vật Bảo vật Quốc gia',
  'Nhạc cụ & Dân ca Di sản'
];

export const AdminRecognitionModal: React.FC<AdminRecognitionModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  language
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<RecognitionSectionConfig>(() => storageService.getRecognitionSectionConfig());
  const [activeSubTab, setActiveSubTab] = useState<'samples' | 'header' | 'preview'>('samples');
  
  // Active UI language & targeted editing language
  const [currentLang, setCurrentLang] = useState<string>(() => language || languageService.getCurrentLanguage());
  const [editLang, setEditLang] = useState<string>(() => language || languageService.getCurrentLanguage());
  const [previewLang, setPreviewLang] = useState<string>(() => language || languageService.getCurrentLanguage());

  useEffect(() => {
    if (language) {
      setCurrentLang(language);
      setEditLang(language);
      setPreviewLang(language);
    }
  }, [language]);

  useEffect(() => {
    const handleLangChanged = (e: any) => {
      if (e.detail?.language) {
        setCurrentLang(e.detail.language);
      }
    };
    window.addEventListener('hdv_language_changed', handleLangChanged);
    return () => window.removeEventListener('hdv_language_changed', handleLangChanged);
  }, []);

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

  // Scroll modal container to top on open or sub-tab switch
  useEffect(() => {
    if (isOpen && formRef.current) {
      formRef.current.scrollTop = 0;
    }
  }, [isOpen, activeSubTab]);
  
  // Sample editing state
  const [editingSampleIndex, setEditingSampleIndex] = useState<number | null>(null);
  const [sampleDraft, setSampleDraft] = useState<RecognitionSampleItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Gallery Picker Modal
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  // Feedback status
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(storageService.getRecognitionSectionConfig());
      setEditingSampleIndex(null);
      setSampleDraft(null);
      setIsAddingNew(false);
      setToastMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAll = () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      // Validate base title
      if (!config.title.trim()) {
        setErrorMessage(languageService.t('Tiêu đề chính không được để trống!', currentLang, 'Tiêu đề chính không được để trống!'));
        setIsSaving(false);
        return;
      }
      if (config.samples.length === 0) {
        setErrorMessage(languageService.t('Danh sách ảnh mẫu phải có ít nhất 1 ảnh!', currentLang, 'Danh sách ảnh mẫu phải có ít nhất 1 ảnh!'));
        setIsSaving(false);
        return;
      }

      const currentUser = storageService.getCurrentUser();
      const saved = storageService.saveRecognitionSectionConfig(config, currentUser?.displayName || 'Quản trị viên');
      setConfig(saved);
      showToast(languageService.t('Đã lưu thành công nội dung và danh sách ảnh mẫu!', currentLang, 'Đã lưu thành công nội dung và danh sách ảnh mẫu!'));
      if (onSaved) onSaved(saved);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi lưu cấu hình');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    const confirmMsg = languageService.t(
      'Bạn có chắc chắn muốn khôi phục lại toàn bộ nội dung và ảnh mẫu gốc về di sản chuẩn của Việt Nam?',
      currentLang,
      'Bạn có chắc chắn muốn khôi phục lại toàn bộ nội dung và ảnh mẫu gốc về di sản chuẩn của Việt Nam?'
    );
    if (window.confirm(confirmMsg)) {
      const reset = storageService.resetRecognitionSectionConfig();
      setConfig(reset);
      setEditingSampleIndex(null);
      setSampleDraft(null);
      setIsAddingNew(false);
      showToast(languageService.t('Đã khôi phục về mẫu di sản chuẩn nguyên bản!', currentLang, 'Đã khôi phục về mẫu di sản chuẩn nguyên bản!'));
      if (onSaved) onSaved(reset);
    }
  };

  // Sample Items Management
  const handleStartEditSample = (index: number) => {
    setEditingSampleIndex(index);
    setSampleDraft({ ...config.samples[index] });
    setIsAddingNew(false);
  };

  const handleStartAddNewSample = () => {
    const newSample: RecognitionSampleItem = {
      id: `sample-${Date.now()}`,
      title: '',
      category: 'Di tích Lịch sử & Giáo dục',
      url: '',
      prompt: '',
      description: '',
      source: 'Ban biên tập Di sản'
    };
    setSampleDraft(newSample);
    setEditingSampleIndex(config.samples.length);
    setIsAddingNew(true);
  };

  const handleSaveSampleDraft = () => {
    if (!sampleDraft) return;
    if (!sampleDraft.title.trim()) {
      alert(languageService.t('Vui lòng nhập tên di sản / hiện vật', currentLang, 'Vui lòng nhập tên di sản / hiện vật'));
      return;
    }
    if (!sampleDraft.url.trim()) {
      alert(languageService.t('Vui lòng cung cấp đường dẫn ảnh (URL hoặc chọn từ kho ảnh)', currentLang, 'Vui lòng cung cấp đường dẫn ảnh (URL hoặc chọn từ kho ảnh)'));
      return;
    }

    const updatedSamples = [...config.samples];
    if (isAddingNew || editingSampleIndex === null || editingSampleIndex >= updatedSamples.length) {
      updatedSamples.push(sampleDraft);
    } else {
      updatedSamples[editingSampleIndex] = sampleDraft;
    }

    setConfig({
      ...config,
      samples: updatedSamples
    });

    setEditingSampleIndex(null);
    setSampleDraft(null);
    setIsAddingNew(false);
    showToast(languageService.t('Đã cập nhật ảnh mẫu. Hãy bấm "Lưu Thay Đổi Toàn Hệ Thống" để áp dụng.', currentLang, 'Đã cập nhật ảnh mẫu. Hãy bấm "Lưu Thay Đổi Toàn Hệ Thống" để áp dụng.'));
  };

  const handleCancelSampleEdit = () => {
    setEditingSampleIndex(null);
    setSampleDraft(null);
    setIsAddingNew(false);
  };

  const handleDeleteSample = (index: number) => {
    const sampleToDelete = config.samples[index];
    const confirmText = `${languageService.t('Xóa ảnh mẫu', currentLang, 'Xóa ảnh mẫu')} "${sampleToDelete.title || 'này'}"?`;
    if (window.confirm(confirmText)) {
      const updatedSamples = config.samples.filter((_, idx) => idx !== index);
      setConfig({
        ...config,
        samples: updatedSamples
      });
      if (editingSampleIndex === index) {
        handleCancelSampleEdit();
      }
      showToast(languageService.t('Đã xóa ảnh mẫu.', currentLang, 'Đã xóa ảnh mẫu.'));
    }
  };

  const handleMoveSample = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.samples.length) return;
    const updated = [...config.samples];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setConfig({
      ...config,
      samples: updated
    });
  };

  // Image Upload File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (sampleDraft) {
        setSampleDraft({
          ...sampleDraft,
          url: base64
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectFromPicker = (photo: LandmarkPhotoItem) => {
    if (sampleDraft) {
      setSampleDraft({
        ...sampleDraft,
        title: sampleDraft.title || photo.landmarkName || photo.title,
        category: sampleDraft.category || (photo.tags && photo.tags[0]) || 'Di tích Lịch sử & Giáo dục',
        url: photo.imageUrl,
        prompt: sampleDraft.prompt || `Nhận diện ${photo.landmarkName} tại ${photo.cityName}`,
        source: photo.source || photo.photographer || 'Kho ảnh Di sản'
      });
    }
    setIsPickerOpen(false);
    showToast(`${languageService.t('Đã chọn ảnh', currentLang, 'Đã chọn ảnh')} "${photo.landmarkName || photo.title}"`);
  };

  // Auto-fill translation helper for header banner
  const handleAutoFillHeaderTranslation = () => {
    if (editLang === 'vi') return;
    const translatedBadge = languageService.t(config.badge, editLang, config.badge);
    const translatedTitle = languageService.t(config.title, editLang, config.title);
    const translatedDesc = languageService.t(config.description, editLang, config.description);
    const translatedLabel = languageService.t(config.samplesLabel, editLang, config.samplesLabel);

    setConfig({
      ...config,
      translations: {
        ...(config.translations || {}),
        [editLang]: {
          badge: translatedBadge,
          title: translatedTitle,
          description: translatedDesc,
          samplesLabel: translatedLabel
        }
      }
    });
    showToast(`${languageService.t('Tự động điền bản dịch', currentLang, 'Tự động điền bản dịch')} (${editLang.toUpperCase()})`);
  };

  // Auto-fill translation helper for sample draft
  const handleAutoFillSampleDraftTranslation = () => {
    if (!sampleDraft || editLang === 'vi') return;
    const translatedTitle = languageService.t(sampleDraft.title, editLang, sampleDraft.title);
    const translatedCategory = languageService.t(sampleDraft.category, editLang, sampleDraft.category);
    const translatedPrompt = languageService.t(sampleDraft.prompt, editLang, sampleDraft.prompt);
    const translatedDesc = sampleDraft.description ? languageService.t(sampleDraft.description, editLang, sampleDraft.description) : '';

    setSampleDraft({
      ...sampleDraft,
      translations: {
        ...(sampleDraft.translations || {}),
        [editLang]: {
          title: translatedTitle,
          category: translatedCategory,
          prompt: translatedPrompt,
          description: translatedDesc
        }
      }
    });
    showToast(`${languageService.t('Tự động điền bản dịch', currentLang, 'Tự động điền bản dịch')} (${editLang.toUpperCase()})`);
  };

  // Helper to get active display values according to selected preview or edit language
  const getBannerValue = (field: 'badge' | 'title' | 'description' | 'samplesLabel', lang: string) => {
    if (lang === 'vi') return config[field];
    return config.translations?.[lang]?.[field] || languageService.t(config[field], lang, config[field]);
  };

  const getSampleValue = (sample: RecognitionSampleItem, field: 'title' | 'category' | 'prompt' | 'description', lang: string) => {
    if (lang === 'vi') return sample[field] || '';
    return sample.translations?.[lang]?.[field] || (sample[field] ? languageService.t(sample[field]!, lang, sample[field]!) : '');
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-2 sm:p-4 pt-2 sm:pt-4 bg-black/80 backdrop-blur-sm overflow-hidden animate-fadeIn">
      <div ref={formRef} className="relative w-full max-w-5xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-100">
                  {languageService.t('Biên Tập Nội Dung & Ảnh Mẫu Nhận Diện AI', currentLang, 'Biên Tập Nội Dung & Ảnh Mẫu Nhận Diện AI')}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  {languageService.t('Quyền Quản Trị', currentLang, 'Quyền Quản Trị')}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {languageService.t('Tùy chỉnh tiêu đề, câu lệnh gợi ý và danh sách ảnh mẫu thử nghiệm nhanh một chạm', currentLang, 'Tùy chỉnh tiêu đề, câu lệnh gợi ý và danh sách ảnh mẫu thử nghiệm nhanh một chạm')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Multi-Language Selector Bar */}
        <div className="px-6 py-2.5 bg-stone-950 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{languageService.t('Ngôn ngữ biên tập:', currentLang, 'Ngôn ngữ biên tập:')}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setEditLang(lang.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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
          </div>
        </div>

        {/* Feedback Messages */}
        {toastMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-3 p-3 bg-red-950/90 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-800 bg-stone-900/50 shrink-0">
          <button
            onClick={() => setActiveSubTab('samples')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'samples'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{languageService.t('Danh Sách Ảnh Mẫu', currentLang, 'Danh Sách Ảnh Mẫu')} ({config.samples.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('header')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'header'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{languageService.t('Tiêu Đề & Lời Dẫn Banner', currentLang, 'Tiêu Đề & Lời Dẫn Banner')}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('preview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'preview'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{languageService.t('Xem Trước Giao Diện', currentLang, 'Xem Trước Giao Diện')}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: SAMPLES MANAGEMENT */}
          {activeSubTab === 'samples' && (
            <div className="space-y-6">
              
              {/* Top Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                <div>
                  <h4 className="text-sm font-semibold text-stone-200">
                    {languageService.t('Ảnh mẫu thử nghiệm nhận diện một chạm', currentLang, 'Ảnh mẫu thử nghiệm nhận diện một chạm')}
                  </h4>
                  <p className="text-xs text-stone-400">
                    {languageService.t('Người dùng nhấp vào từng thẻ để AI lập tức phân tích và đưa ra thuyết minh lịch sử.', currentLang, 'Người dùng nhấp vào từng thẻ để AI lập tức phân tích và đưa ra thuyết minh lịch sử.')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartAddNewSample}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{languageService.t('Thêm Ảnh Mẫu Mới', currentLang, 'Thêm Ảnh Mẫu Mới')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title={languageService.t('Khôi phục về 6 di sản văn hóa chuẩn nguyên bản', currentLang, 'Khôi phục về 6 di sản văn hóa chuẩn nguyên bản')}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{languageService.t('Khôi Phục Chuẩn', currentLang, 'Khôi Phục Chuẩn')}</span>
                  </button>
                </div>
              </div>

              {/* CARD DRAFT FORM (IF EDITING OR ADDING) */}
              {sampleDraft && (
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Edit3 className="w-4 h-4" />
                      <span>
                        {isAddingNew 
                          ? languageService.t('Thêm Thẻ Ảnh Mẫu Mới', currentLang, 'Thêm Thẻ Ảnh Mẫu Mới') 
                          : `${languageService.t('Chỉnh Sửa Mẫu:', currentLang, 'Chỉnh Sửa Mẫu:')} ${sampleDraft.title || 'Chưa đặt tên'}`}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        [{editLang.toUpperCase()}]
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {editLang !== 'vi' && (
                        <button
                          type="button"
                          onClick={handleAutoFillSampleDraftTranslation}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Tự động dịch từ nội dung tiếng Việt sang ngôn ngữ đang chọn"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>{languageService.t('Tự động điền bản dịch', currentLang, 'Tự động điền bản dịch')}</span>
                        </button>
                      )}
                      <button
                        onClick={handleCancelSampleEdit}
                        className="text-stone-400 hover:text-stone-200 text-xs p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Left Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {languageService.t('Tên Di sản / Hiện vật / Cổ phục', currentLang, 'Tên Di sản / Hiện vật / Cổ phục')} <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={
                            editLang === 'vi'
                              ? sampleDraft.title
                              : sampleDraft.translations?.[editLang]?.title ?? sampleDraft.title
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editLang === 'vi') {
                              setSampleDraft({ ...sampleDraft, title: val });
                            } else {
                              setSampleDraft({
                                ...sampleDraft,
                                translations: {
                                  ...(sampleDraft.translations || {}),
                                  [editLang]: {
                                    ...(sampleDraft.translations?.[editLang] || {}),
                                    title: val
                                  }
                                }
                              });
                            }
                          }}
                          placeholder={languageService.t('Ví dụ: Đại Nội Huế (Ngọ Môn)', currentLang, 'Ví dụ: Đại Nội Huế (Ngọ Môn)')}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {languageService.t('Thể loại / Nhãn phụ', currentLang, 'Thể loại / Nhãn phụ')} <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={
                            editLang === 'vi'
                              ? sampleDraft.category
                              : sampleDraft.translations?.[editLang]?.category ?? sampleDraft.category
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editLang === 'vi') {
                              setSampleDraft({ ...sampleDraft, category: val });
                            } else {
                              setSampleDraft({
                                ...sampleDraft,
                                translations: {
                                  ...(sampleDraft.translations || {}),
                                  [editLang]: {
                                    ...(sampleDraft.translations?.[editLang] || {}),
                                    category: val
                                  }
                                }
                              });
                            }
                          }}
                          placeholder={languageService.t('Ví dụ: Hoàng thành & Cung điện', currentLang, 'Ví dụ: Hoàng thành & Cung điện')}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 text-xs focus:border-amber-500 focus:outline-none mb-1.5"
                        />
                        {/* Quick Category Chips */}
                        <div className="flex flex-wrap gap-1">
                          {QUICK_CATEGORY_SUGGESTIONS.slice(0, 5).map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                const translatedCat = editLang === 'vi' ? cat : languageService.t(cat, editLang, cat);
                                if (editLang === 'vi') {
                                  setSampleDraft({ ...sampleDraft, category: translatedCat });
                                } else {
                                  setSampleDraft({
                                    ...sampleDraft,
                                    translations: {
                                      ...(sampleDraft.translations || {}),
                                      [editLang]: {
                                        ...(sampleDraft.translations?.[editLang] || {}),
                                        category: translatedCat
                                      }
                                    }
                                  });
                                }
                              }}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 hover:bg-amber-500/20 text-stone-400 hover:text-amber-300 transition-colors"
                            >
                              {languageService.t(cat, currentLang, cat)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {languageService.t('Câu Lệnh Kiểm Thử Cho AI (Prompt)', currentLang, 'Câu Lệnh Kiểm Thử Cho AI (Prompt)')}
                        </label>
                        <input
                          type="text"
                          value={
                            editLang === 'vi'
                              ? sampleDraft.prompt
                              : sampleDraft.translations?.[editLang]?.prompt ?? sampleDraft.prompt
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editLang === 'vi') {
                              setSampleDraft({ ...sampleDraft, prompt: val });
                            } else {
                              setSampleDraft({
                                ...sampleDraft,
                                translations: {
                                  ...(sampleDraft.translations || {}),
                                  [editLang]: {
                                    ...(sampleDraft.translations?.[editLang] || {}),
                                    prompt: val
                                  }
                                }
                              });
                            }
                          }}
                          placeholder={languageService.t('Ví dụ: Nhận diện Cổng Ngọ Môn - Đại Nội Huế triều Nguyễn', currentLang, 'Ví dụ: Nhận diện Cổng Ngọ Môn - Đại Nội Huế triều Nguyễn')}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
                        />
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          {languageService.t('Lời gợi ý giúp AI nhận dạng đúng góc máy hoặc triều đại lịch sử.', currentLang, 'Lời gợi ý giúp AI nhận dạng đúng góc máy hoặc triều đại lịch sử.')}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {languageService.t('Mô tả / Bối cảnh văn hóa', currentLang, 'Mô tả / Bối cảnh văn hóa')}
                        </label>
                        <textarea
                          rows={2}
                          value={
                            editLang === 'vi'
                              ? sampleDraft.description || ''
                              : sampleDraft.translations?.[editLang]?.description ?? sampleDraft.description ?? ''
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editLang === 'vi') {
                              setSampleDraft({ ...sampleDraft, description: val });
                            } else {
                              setSampleDraft({
                                ...sampleDraft,
                                translations: {
                                  ...(sampleDraft.translations || {}),
                                  [editLang]: {
                                    ...(sampleDraft.translations?.[editLang] || {}),
                                    description: val
                                  }
                                }
                              });
                            }
                          }}
                          placeholder={languageService.t('Ghi chú ngắn về bối cảnh xây dựng hoặc giá trị biểu tượng...', currentLang, 'Ghi chú ngắn về bối cảnh xây dựng hoặc giá trị biểu tượng...')}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 text-xs focus:border-amber-500 focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Right Image Input & Preview */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {languageService.t('Đường dẫn ảnh (URL)', currentLang, 'Đường dẫn ảnh (URL)')} <span className="text-amber-400">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={sampleDraft.url}
                            onChange={(e) => setSampleDraft({ ...sampleDraft, url: e.target.value })}
                            placeholder="https://upload.wikimedia.org/..."
                            className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Photo Actions: Gallery Picker & File Upload */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPickerOpen(true)}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>{languageService.t('Chọn từ Kho Ảnh Di Sản', currentLang, 'Chọn từ Kho Ảnh Di Sản')}</span>
                        </button>

                        <label className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{languageService.t('Tải ảnh tệp', currentLang, 'Tải ảnh tệp')}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Live Image Preview */}
                      <div className="relative rounded-xl overflow-hidden bg-stone-950 border border-stone-800 h-40 flex items-center justify-center">
                        {sampleDraft.url ? (
                          <img
                            src={sampleDraft.url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="text-center p-4 text-stone-500">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                            <p className="text-xs">{languageService.t('Chưa có ảnh xem trước', currentLang, 'Chưa có ảnh xem trước')}</p>
                          </div>
                        )}
                        {sampleDraft.url && (
                          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] text-stone-300 truncate">
                            {sampleDraft.url}
                          </div>
                        )}
                      </div>

                      {/* Draft Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleCancelSampleEdit}
                          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                        >
                          {languageService.t('Hủy', currentLang, 'Hủy')}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveSampleDraft}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Check className="w-4 h-4" />
                          <span>{languageService.t('Lưu Thẻ Này', currentLang, 'Lưu Thẻ Này')}</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* SAMPLES GRID LIST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.samples.map((sample, index) => {
                  const sampleTitle = getSampleValue(sample, 'title', editLang);
                  const sampleCategory = getSampleValue(sample, 'category', editLang);
                  const samplePrompt = getSampleValue(sample, 'prompt', editLang);

                  return (
                    <div
                      key={sample.id || index}
                      className={`relative rounded-2xl overflow-hidden border transition-all bg-stone-950 ${
                        editingSampleIndex === index
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {/* Image Preview Container */}
                      <div className="relative h-28 w-full bg-stone-900 overflow-hidden">
                        <img
                          src={sample.url}
                          alt={sampleTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-sm text-[10px] font-bold text-amber-400 border border-stone-700">
                          #{index + 1}
                        </div>

                        {/* Move Up/Down Quick Controls */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-stone-950/80 rounded-lg p-1 border border-stone-800">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveSample(index, 'up')}
                            className="p-1 text-stone-400 hover:text-stone-100 disabled:opacity-30"
                            title={languageService.t('Di chuyển lên trước', currentLang, 'Di chuyển lên trước')}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === config.samples.length - 1}
                            onClick={() => handleMoveSample(index, 'down')}
                            className="p-1 text-stone-400 hover:text-stone-100 disabled:opacity-30"
                            title={languageService.t('Di chuyển xuống sau', currentLang, 'Di chuyển xuống sau')}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Card Content & Action Bar */}
                      <div className="p-3.5 space-y-2">
                        <div>
                          <h5 className="text-xs font-bold text-stone-100 line-clamp-1">
                            {sampleTitle || 'Chưa đặt tiêu đề'}
                          </h5>
                          <p className="text-[11px] text-amber-400 line-clamp-1">
                            {sampleCategory}
                          </p>
                        </div>

                        <p className="text-[10px] text-stone-400 line-clamp-2 italic bg-stone-900/60 p-1.5 rounded-lg border border-stone-800/80">
                          "{samplePrompt || 'Chưa có câu lệnh prompt'}"
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                          <span className="text-[10px] text-stone-500 truncate max-w-[120px]">
                            {sample.source || 'Wikimedia Commons'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditSample(index)}
                              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3 text-amber-400" />
                              <span>{languageService.t('Sửa', currentLang, 'Sửa')}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSample(index)}
                              className="p-1.5 rounded-lg bg-stone-900 hover:bg-red-950/60 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                              title={languageService.t('Xóa mẫu này', currentLang, 'Xóa mẫu này')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: BANNER HEADER CONFIG */}
          {activeSubTab === 'header' && (
            <div className="space-y-5 max-w-2xl mx-auto bg-stone-950/60 p-6 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-stone-100 mb-1">
                    {languageService.t('Cấu hình Tiêu đề & Lời dẫn Banner', currentLang, 'Cấu hình Tiêu đề & Lời dẫn Banner')}
                  </h4>
                  <p className="text-xs text-stone-400">
                    {languageService.t('Nội dung hiển thị ở phần giới thiệu của Mô-đun Nhận Diện Di Sản', currentLang, 'Nội dung hiển thị ở phần giới thiệu của Mô-đun Nhận Diện Di Sản')}
                  </p>
                </div>

                {editLang !== 'vi' && (
                  <button
                    type="button"
                    onClick={handleAutoFillHeaderTranslation}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{languageService.t('Tự động điền bản dịch', currentLang, 'Tự động điền bản dịch')}</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
                  {languageService.t('Huy hiệu / Badge nổi bật', currentLang, 'Huy hiệu / Badge nổi bật')} [{editLang.toUpperCase()}]
                </label>
                <input
                  type="text"
                  value={
                    editLang === 'vi'
                      ? config.badge
                      : config.translations?.[editLang]?.badge ?? config.badge
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editLang === 'vi') {
                      setConfig({ ...config, badge: val });
                    } else {
                      setConfig({
                        ...config,
                        translations: {
                          ...(config.translations || {}),
                          [editLang]: {
                            ...(config.translations?.[editLang] || {}),
                            badge: val
                          }
                        }
                      });
                    }
                  }}
                  placeholder={languageService.t('Thị giác Máy tính & AI Văn hóa Việt Nam', currentLang, 'Thị giác Máy tính & AI Văn hóa Việt Nam')}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
                  {languageService.t('Tiêu đề chính (H2 Heading)', currentLang, 'Tiêu đề chính (H2 Heading)')} [{editLang.toUpperCase()}]
                </label>
                <input
                  type="text"
                  value={
                    editLang === 'vi'
                      ? config.title
                      : config.translations?.[editLang]?.title ?? config.title
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editLang === 'vi') {
                      setConfig({ ...config, title: val });
                    } else {
                      setConfig({
                        ...config,
                        translations: {
                          ...(config.translations || {}),
                          [editLang]: {
                            ...(config.translations?.[editLang] || {}),
                            title: val
                          }
                        }
                      });
                    }
                  }}
                  placeholder={languageService.t('Nhận diện Di sản, Hiện vật & Cổ phục', currentLang, 'Nhận diện Di sản, Hiện vật & Cổ phục')}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 text-xs sm:text-sm focus:border-amber-500 focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
                  {languageService.t('Mô tả / Hướng dẫn thao tác', currentLang, 'Mô tả / Hướng dẫn thao tác')} [{editLang.toUpperCase()}]
                </label>
                <textarea
                  rows={3}
                  value={
                    editLang === 'vi'
                      ? config.description
                      : config.translations?.[editLang]?.description ?? config.description
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editLang === 'vi') {
                      setConfig({ ...config, description: val });
                    } else {
                      setConfig({
                        ...config,
                        translations: {
                          ...(config.translations || {}),
                          [editLang]: {
                            ...(config.translations?.[editLang] || {}),
                            description: val
                          }
                        }
                      });
                    }
                  }}
                  placeholder={languageService.t('Chụp ảnh trực tiếp hoặc tải hình ảnh di tích, đình chùa, làng nghề, nhạc cụ, cổ phục để AI phân tích tức thì.', currentLang, 'Chụp ảnh trực tiếp hoặc tải hình ảnh di tích, đình chùa, làng nghề, nhạc cụ, cổ phục để AI phân tích tức thì.')}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 text-xs sm:text-sm focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
                  {languageService.t('Tiêu đề danh sách mẫu thử nghiệm', currentLang, 'Tiêu đề danh sách mẫu thử nghiệm')} [{editLang.toUpperCase()}]
                </label>
                <input
                  type="text"
                  value={
                    editLang === 'vi'
                      ? config.samplesLabel
                      : config.translations?.[editLang]?.samplesLabel ?? config.samplesLabel
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editLang === 'vi') {
                      setConfig({ ...config, samplesLabel: val });
                    } else {
                      setConfig({
                        ...config,
                        translations: {
                          ...(config.translations || {}),
                          [editLang]: {
                            ...(config.translations?.[editLang] || {}),
                            samplesLabel: val
                          }
                        }
                      });
                    }
                  }}
                  placeholder={languageService.t('ẢNH MẪU THỬ NGHIỆM NHANH MỘT CHẠM:', currentLang, 'ẢNH MẪU THỬ NGHIỆM NHANH MỘT CHẠM:')}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LIVE PREVIEW */}
          {activeSubTab === 'preview' && (
            <div className="space-y-6">
              
              {/* Preview Language Switcher Bar */}
              <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-300 font-medium">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>{languageService.t('Xem trước bằng ngôn ngữ:', currentLang, 'Xem trước bằng ngôn ngữ:')}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setPreviewLang(lang.code)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        previewLang === lang.code
                          ? 'bg-amber-500 text-stone-950 font-bold shadow'
                          : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* MOCK PREVIEW SECTION */}
              <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-inner">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{getBannerValue('badge', previewLang)}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100">
                    {getBannerValue('title', previewLang)}
                  </h2>
                  <p className="text-stone-300 text-sm sm:text-base mt-2">
                    {getBannerValue('description', previewLang)}
                  </p>
                </div>

                {/* Preset Samples */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{getBannerValue('samplesLabel', previewLang)}</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {config.samples.map((sample, idx) => {
                      const sampleTitle = getSampleValue(sample, 'title', previewLang);
                      const sampleCategory = getSampleValue(sample, 'category', previewLang);

                      return (
                        <div
                          key={idx}
                          className="group relative rounded-xl overflow-hidden border border-stone-800 hover:border-amber-400/60 transition-all text-left bg-stone-900 shadow-md"
                        >
                          <div className="h-20 w-full overflow-hidden relative">
                            <img 
                              src={sample.url} 
                              alt={sampleTitle} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                          </div>
                          <div className="p-2 bg-stone-900">
                            <p className="text-xs font-semibold text-stone-200 line-clamp-1 group-hover:text-amber-300">
                              {sampleTitle}
                            </p>
                            <p className="text-[10px] text-stone-400 line-clamp-1">{sampleCategory}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            {config.lastUpdated && (
              <span>{languageService.t('Cập nhật lần cuối:', currentLang, 'Cập nhật lần cuối:')} {new Date(config.lastUpdated).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {languageService.t('Đóng', currentLang, 'Đóng')}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAll}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? languageService.t('Đang lưu...', currentLang, 'Đang lưu...') : languageService.t('Lưu Thay Đổi (Cập Nhật Toàn Web)', currentLang, 'Lưu Thay Đổi (Cập Nhật Toàn Web)')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Embedded Landmark Image Picker Modal */}
      {isPickerOpen && (
        <AILandmarkImagePickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          initialQuery={sampleDraft?.title || ''}
          initialLandmarkName={sampleDraft?.title || ''}
          onSelectPhoto={handleSelectFromPicker}
        />
      )}
    </div>,
    document.body
  );
};
