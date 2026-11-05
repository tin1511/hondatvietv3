/**
 * ============================================================================
 * LỚP TRỪU TƯỢNG GIỌNG ĐỌC & NHỊP NHÉP MIỆNG HƯỚNG DẪN VIÊN 3D (VOICE PROVIDER)
 * ============================================================================
 * Thiết kế theo chuẩn Strategy / Interface (`IGuideVoiceProvider`) sử dụng
 * Web Speech API (`window.speechSynthesis`, `lang: "vi-VN"`), tích hợp bộ
 * phân tích nguyên âm tiếng Việt để điều khiển `mouthOpen` theo từng từ/nhịp
 * (`onboundary`) kèm bộ tạo nhịp dự phòng 5-8 nhịp/giây (tạm dừng ở dấu câu).
 */

export type GuideSpeechRate = 0.8 | 1 | 1.2;

export interface WordBoundaryPulse {
  word: string;
  charIndex: number;
  vowelOpenness: number; // 0..1 (ước lượng độ mở miệng theo nguyên âm tiếng Việt)
  isClauseBreak: boolean; // Có dấu chấm/phẩy ngay sau hoặc trước để nhân vật gật đầu nhẹ
}

export interface GuideVoiceCallbacks {
  onStart?: () => void;
  onProgress?: (charIndex: number, totalLength: number) => void;
  onWordBoundary?: (pulse: WordBoundaryPulse) => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (reason: string) => void;
}

export interface IGuideVoiceProvider {
  speak(text: string, callbacks?: GuideVoiceCallbacks): void;
  pause(): void;
  resume(): void;
  stop(): void;
  setRate(rate: GuideSpeechRate): void;
  setMuted(muted: boolean): void;
  getRate(): GuideSpeechRate;
  isMuted(): boolean;
  isSupported(): boolean;
  hasVietnameseVoice(): boolean;
  unlockAudioOnUserGesture(): void;
}

export interface GuideNarrationPayload {
  id: string;
  title: string;
  subtitleBadge?: string;
  introText: string;
  targetType: 'province' | 'heritage' | 'sovereignty' | 'greeting';
  provinceName?: string;
  heritageId?: string;
  /** Tọa độ màn hình nơi người dùng vừa bấm để nhân vật quay đầu nhìn về hướng đó */
  screenX?: number;
  screenY?: number;
}

export const GUIDE_NARRATE_EVENT = 'hdv:guide-narrate';
export const GUIDE_MAP_SHEET_EVENT = 'hdv:map-sheet-state';
export const GUIDE_MAP_INTERACTION_EVENT = 'hdv:map-interaction-active';

// Nhóm nguyên âm mở rộng (a, ă, â, o, ô, ơ và các dấu thanh)
const WIDE_VOWEL_REGEX = /[aăâoôơáàảãạắằẳẵặấầẩẫậóòỏõọốồổỗộớờởỡợ]/i;
// Nhóm nguyên âm tròn môi / vừa (u, ư, y và các dấu thanh)
const ROUND_VOWEL_REGEX = /[uưyúùủũụứừửữựýỳỷỹỵ]/i;
// Nhóm nguyên âm hẹp (e, ê, i và các dấu thanh)
const NARROW_VOWEL_REGEX = /[eêiéèẻẽẹếềểễệíìỉĩị]/i;

/**
 * Ước lượng độ mở miệng (0..1) dựa trên nguyên âm chính của từ tiếng Việt:
 * - a, ă, â, o, ô, ơ: mở rộng (0.76 - 0.94)
 * - u, ư, y: tròn chúm vừa (0.46 - 0.62)
 * - e, ê, i: mở nhỏ (0.30 - 0.46)
 * Có cộng dao động ngẫu nhiên nhẹ để chuyển động môi tự nhiên.
 */
export function estimateVietnameseVowelOpenness(rawWord: string): number {
  const clean = (rawWord || '').trim();
  if (!clean) return 0.15;

  const jitter = (Math.random() - 0.5) * 0.12;

  if (WIDE_VOWEL_REGEX.test(clean)) {
    return Math.min(1, Math.max(0.65, 0.84 + jitter));
  }
  if (ROUND_VOWEL_REGEX.test(clean)) {
    return Math.min(0.75, Math.max(0.38, 0.54 + jitter));
  }
  if (NARROW_VOWEL_REGEX.test(clean)) {
    return Math.min(0.58, Math.max(0.24, 0.38 + jitter));
  }
  return Math.min(0.65, Math.max(0.25, 0.45 + jitter));
}

/**
 * Trích xuất từ tại vị trí charIndex trong chuỗi văn bản và kiểm tra dấu ngắt câu.
 */
export function extractWordAtCharIndex(
  text: string,
  charIndex: number
): { word: string; isPunctuationPause: boolean; isClauseBreak: boolean } {
  if (!text || charIndex < 0 || charIndex >= text.length) {
    return { word: '', isPunctuationPause: false, isClauseBreak: false };
  }

  const sliceAround = text.slice(Math.max(0, charIndex - 2), Math.min(text.length, charIndex + 18));
  const currentChar = text[charIndex] || '';
  const isPunctuationPause = /[.,;:!?…—\-()]/.test(currentChar);

  const rest = text.slice(charIndex).trimStart();
  const match = rest.match(/^([^\s.,;:!?…—\-()]+)([.,;:!?…—\-]?)/);
  const word = match ? match[1] : '';
  const trailingPunct = match ? Boolean(match[2]) : /[.,;:!?…]/.test(sliceAround);

  return {
    word,
    isPunctuationPause,
    isClauseBreak: isPunctuationPause || trailingPunct,
  };
}

/**
 * Phát sự kiện để nhân vật 3D `<GuideCharacter />` đọc lời giới thiệu ngay lập tức.
 */
export function triggerGuideNarration(payload: GuideNarrationPayload): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<GuideNarrationPayload>(GUIDE_NARRATE_EVENT, { detail: payload }));
}

/**
 * Phát sự kiện khi bottom sheet của bản đồ thay đổi trạng thái để `<GuideCharacter />`
 * tự động dịch chuyển lên trên mép sheet, không che nội dung.
 */
export function notifyMapSheetState(
  sheetState: 'collapsed' | 'half' | 'full',
  sheetHeightVh: number
): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<{ sheetState: 'collapsed' | 'half' | 'full'; sheetHeightVh: number }>(
      GUIDE_MAP_SHEET_EVENT,
      {
        detail: { sheetState, sheetHeightVh },
      }
    )
  );
}

/**
 * Báo cho `<GuideCharacter />` biết người dùng đang kéo/zoom bản đồ để tạm tắt hành động rảnh.
 */
export function notifyMapInteractionActive(active: boolean): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<{ active: boolean }>(GUIDE_MAP_INTERACTION_EVENT, {
      detail: { active },
    })
  );
}

/**
 * Triển khai bằng Web Speech API (`window.speechSynthesis`, `vi-VN`).
 * Kết hợp sự kiện `onboundary` thực tế và bộ tạo nhịp mô phỏng 5-8 nhịp/giây
 * (tự động tạm dừng khi gặp dấu chấm, phẩy) khi trình duyệt không bắn `onboundary`.
 */
export class WebSpeechGuideVoiceProvider implements IGuideVoiceProvider {
  private rate: GuideSpeechRate = 1;
  private muted: boolean = false;
  private currentText: string = '';
  private currentCallbacks?: GuideVoiceCallbacks;
  private progressTimer: number | null = null;
  private simulatedCharIndex: number = 0;
  private isPausedState: boolean = false;
  private isSpeakingState: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private unlocked: boolean = false;
  private lastBoundaryTimeMs: number = 0;
  private pauseTicksRemaining: number = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      try {
        window.speechSynthesis.addEventListener?.('voiceschanged', () => this.loadVoices());
      } catch {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
          this.cachedVoices = list;
        }
      }
    } catch {
      // ignore
    }
  }

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined'
    );
  }

  private pickBestVietnameseVoice(): SpeechSynthesisVoice | null {
    this.loadVoices();
    if (!this.cachedVoices.length) return null;

    const viVoices = this.cachedVoices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('vi') ||
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('tiếng việt') ||
        v.name.toLowerCase().includes('linh') ||
        v.name.toLowerCase().includes('hoaimy') ||
        v.name.toLowerCase().includes('an')
    );

    if (viVoices.length === 0) return null;

    const preferred = viVoices.find(
      (v) =>
        v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Linh') ||
        v.name.includes('HoaiMy') ||
        v.localService
    );
    return preferred || viVoices[0];
  }

  public hasVietnameseVoice(): boolean {
    if (!this.isSupported()) return false;
    if (this.cachedVoices.length === 0) return true;
    return this.pickBestVietnameseVoice() !== null;
  }

  public unlockAudioOnUserGesture(): void {
    if (this.unlocked || !this.isSupported()) return;
    try {
      const silent = new SpeechSynthesisUtterance('');
      silent.volume = 0;
      silent.lang = 'vi-VN';
      window.speechSynthesis.speak(silent);
      this.unlocked = true;
    } catch {
      // ignore
    }
  }

  private clearProgressTimer(): void {
    if (this.progressTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  /**
   * Bộ tạo nhịp mô phỏng 5-8 nhịp/giây (khoảng 140-165ms mỗi nhịp ở tốc độ 1x),
   * tự động tạm dừng mở miệng khi gặp dấu chấm, dấu phẩy và ước lượng độ mở miệng
   * theo nguyên âm của từ hiện tại nếu trình duyệt không phát sự kiện `onboundary`.
   */
  private startSimulatedProgress(
    text: string,
    callbacks?: GuideVoiceCallbacks,
    finishOnTimerEnd: boolean = false
  ): void {
    this.clearProgressTimer();
    const totalLen = text.length;
    if (totalLen === 0) return;

    // 6.5 nhịp/giây ở tốc độ 1x (~150ms/nhịp), điều chỉnh theo tốc độ đọc (0.8x / 1x / 1.2x)
    const intervalMs = Math.round(150 / this.rate);
    const charsPerStep = Math.max(2, Math.round(2.3 * this.rate));

    this.progressTimer = window.setInterval(() => {
      if (this.isPausedState || !this.isSpeakingState) return;

      const now = performance.now();
      const nativeBoundaryActive = now - this.lastBoundaryTimeMs < 420;

      // Nếu đang tạm nghỉ ở dấu câu (dấu chấm, dấu phẩy)
      if (this.pauseTicksRemaining > 0) {
        this.pauseTicksRemaining -= 1;
        if (!nativeBoundaryActive) {
          callbacks?.onWordBoundary?.({
            word: '',
            charIndex: this.simulatedCharIndex,
            vowelOpenness: 0.04,
            isClauseBreak: true,
          });
        }
        return;
      }

      const prevIdx = this.simulatedCharIndex;
      this.simulatedCharIndex = Math.min(totalLen, this.simulatedCharIndex + charsPerStep);
      callbacks?.onProgress?.(this.simulatedCharIndex, totalLen);

      // Kiểm tra xem đoạn vừa qua có dấu chấm/phẩy không để tạo nhịp nghỉ tự nhiên
      const segment = text.slice(prevIdx, this.simulatedCharIndex);
      if (/[.!?…]/.test(segment)) {
        this.pauseTicksRemaining = 2; // Nghỉ ~300ms ở cuối câu
      } else if (/[,;:]/.test(segment)) {
        this.pauseTicksRemaining = 1; // Nghỉ ~150ms ở dấu phẩy
      }

      // Nếu trình duyệt không bắn onboundary, phát xung nhép miệng theo nguyên âm từ hiện tại
      if (!nativeBoundaryActive) {
        const { word, isPunctuationPause, isClauseBreak } = extractWordAtCharIndex(
          text,
          prevIdx
        );
        const rateScale = this.rate === 0.8 ? 0.82 : this.rate === 1.2 ? 1.05 : 1.0;
        const openness = isPunctuationPause
          ? 0.05
          : estimateVietnameseVowelOpenness(word) * rateScale;

        callbacks?.onWordBoundary?.({
          word,
          charIndex: prevIdx,
          vowelOpenness: openness,
          isClauseBreak,
        });
      }

      if (this.simulatedCharIndex >= totalLen && finishOnTimerEnd) {
        this.clearProgressTimer();
        this.isSpeakingState = false;
        callbacks?.onEnd?.();
      }
    }, intervalMs);
  }

  public speak(text: string, callbacks?: GuideVoiceCallbacks): void {
    this.stop();

    const cleanText = (text || '').trim();
    if (!cleanText) return;

    this.currentText = cleanText;
    this.currentCallbacks = callbacks;
    this.simulatedCharIndex = 0;
    this.isPausedState = false;
    this.isSpeakingState = true;
    this.lastBoundaryTimeMs = 0;
    this.pauseTicksRemaining = 0;

    const canUseSpeech = this.isSupported() && !this.muted;
    const viVoice = this.pickBestVietnameseVoice();

    if (!canUseSpeech || (this.cachedVoices.length > 0 && !viVoice)) {
      callbacks?.onStart?.();
      if (this.cachedVoices.length > 0 && !viVoice && !this.muted) {
        callbacks?.onError?.(
          'Thiết bị chưa cài đặt gói giọng đọc Tiếng Việt (vi-VN). Đang hiển thị phụ đề thuyết minh.'
        );
      }
      this.startSimulatedProgress(cleanText, callbacks, true);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = this.rate;
      utterance.pitch = 1.02;
      utterance.volume = this.muted ? 0 : 1;

      if (viVoice) {
        utterance.voice = viVoice;
      }

      utterance.onstart = () => {
        this.isSpeakingState = true;
        callbacks?.onStart?.();
        this.startSimulatedProgress(cleanText, callbacks, false);
      };

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (typeof event.charIndex === 'number') {
          this.lastBoundaryTimeMs = performance.now();
          this.simulatedCharIndex = Math.max(this.simulatedCharIndex, event.charIndex);
          callbacks?.onProgress?.(this.simulatedCharIndex, cleanText.length);

          const { word, isPunctuationPause, isClauseBreak } = extractWordAtCharIndex(
            cleanText,
            event.charIndex
          );
          const rateScale = this.rate === 0.8 ? 0.82 : this.rate === 1.2 ? 1.05 : 1.0;
          const openness = isPunctuationPause
            ? 0.06
            : estimateVietnameseVowelOpenness(word) * rateScale;

          callbacks?.onWordBoundary?.({
            word,
            charIndex: event.charIndex,
            vowelOpenness: openness,
            isClauseBreak,
          });
        }
      };

      utterance.onend = () => {
        this.clearProgressTimer();
        this.isSpeakingState = false;
        this.isPausedState = false;
        callbacks?.onProgress?.(cleanText.length, cleanText.length);
        callbacks?.onEnd?.();
      };

      utterance.onerror = () => {
        if (this.isSpeakingState) {
          this.startSimulatedProgress(cleanText, callbacks, true);
        }
      };

      callbacks?.onStart?.();
      this.startSimulatedProgress(cleanText, callbacks, true);

      window.speechSynthesis.speak(utterance);
    } catch {
      callbacks?.onStart?.();
      this.startSimulatedProgress(cleanText, callbacks, true);
    }
  }

  public pause(): void {
    if (!this.isSpeakingState || this.isPausedState) return;
    this.isPausedState = true;
    try {
      if (this.isSupported() && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
    } catch {
      // ignore
    }
    this.currentCallbacks?.onPause?.();
  }

  public resume(): void {
    if (!this.isSpeakingState || !this.isPausedState) return;
    this.isPausedState = false;
    try {
      if (this.isSupported() && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // ignore
    }
    this.currentCallbacks?.onResume?.();
  }

  public stop(): void {
    this.clearProgressTimer();
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.simulatedCharIndex = 0;
    this.pauseTicksRemaining = 0;
    try {
      if (this.isSupported()) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // ignore
    }
  }

  public setRate(rate: GuideSpeechRate): void {
    this.rate = rate;
  }

  public getRate(): GuideSpeechRate {
    return this.rate;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      if (this.isSpeakingState && this.currentText) {
        this.startSimulatedProgress(this.currentText, this.currentCallbacks, true);
      }
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }
}

export const guideVoiceService: IGuideVoiceProvider = new WebSpeechGuideVoiceProvider();
