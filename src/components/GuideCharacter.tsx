import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  EyeOff,
  Sparkles,
  RotateCcw,
  Compass,
  Utensils,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  guideVoiceService,
  GuideNarrationPayload,
  GuideSpeechRate,
  GUIDE_NARRATE_EVENT,
  GUIDE_MAP_SHEET_EVENT,
  GUIDE_MAP_INTERACTION_EVENT,
  triggerGuideNarration,
} from '../services/guideVoiceService';
import { VIETNAM_34_ADMINISTRATIVE_UNITS } from '../data/administrativeUnits';
import { getProvinceIntroText, getHeritageIntroText } from '../data/guideIntroData';
import { storageService } from '../services/storageService';

/**
 * ============================================================================
 * CẤU HÌNH HẰNG SỐ NHÂN VẬT 3D (<GuideCharacter />) — BIỂU CẢM & TƯƠNG TÁC
 * ============================================================================
 * Mô hình tải từ `MODEL_URL` (mặc định dùng `/models/vietnamese_man_packed.glb`
 * từ repository `https://github.com/tin1511/tour-guide-3d`, kèm fallback CDN
 * và nhân vật 3D hình khối nếu ngoại tuyến).
 */
export const MODEL_URL: string = '/models/vietnamese_man_packed.glb';
export const FALLBACK_REMOTE_MODEL_URL: string =
  'https://raw.githubusercontent.com/tin1511/tour-guide-3d/main/vietnamese_man_packed.glb';

export type GuideCharacterStateMode =
  | 'idle'
  | 'greeting'
  | 'speaking'
  | 'reacting'
  | 'dragged';

export type IdleRandomActionType = 'none' | 'look_around' | 'stretch' | 'wave';

export const GUIDE_CHARACTER_CONFIG = {
  /** Chiều rộng nhân vật trên mobile (px) — gọn trên màn hình 360-430px */
  MOBILE_WIDTH_PX: 96,
  /** Chiều rộng nhân vật trên máy tính / tablet (px) */
  DESKTOP_WIDTH_PX: 140,
  /** Tỉ lệ khung hình dọc (chiều cao / chiều rộng) */
  ASPECT_RATIO: 1.24,
  /** Hệ số phóng to khi người dùng bấm "Phóng to nhân vật" */
  LARGE_SCALE_MULTIPLIER: 1.25,
  /** Ngưỡng phân biệt chạm (tap) và kéo (drag) tính bằng pixel */
  DRAG_THRESHOLD_PX: 6,
  /** Khoảng cách lề trái/phải khi tự hít vào cạnh màn hình (px) */
  EDGE_MARGIN_PX: 8,
  /** Khoảng cách đáy mặc định trên mobile để nằm ngay trên thanh điều hướng dưới (px) */
  DEFAULT_BOTTOM_MOBILE_PX: 76,
  /** Khoảng cách đáy mặc định trên màn hình lớn (px) */
  DEFAULT_BOTTOM_DESKTOP_PX: 24,
  /** Thời gian tự ẩn bong bóng phụ đề sau khi đọc xong (ms) — đủ lâu để bấm chip gợi ý */
  SUBTITLE_AUTO_HIDE_MS: 8500,
  /** Giới hạn tỉ lệ điểm ảnh (DPR) tối đa để tiết kiệm GPU/pin */
  MAX_PIXEL_RATIO: 1.75,
  /** Đường dẫn bộ giải mã Draco (nếu mô hình .glb nén Draco) */
  DRACO_DECODER_PATH: 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/',
  /** Khóa lưu vị trí và cài đặt trong localStorage */
  STORAGE_KEY: 'hdv_guide_character_prefs_v2',

  // --- CÁC THAM SỐ BIỂU CẢM, NHÉP MIỆNG & TƯƠNG TÁC CÓ THỂ TINH CHỈNH ---
  /** Độ mở miệng tối đa khi nói ở tốc độ 1x (0..1) */
  MAX_MOUTH_OPEN: 0.92,
  /** Khoảng thời gian ngẫu nhiên giữa 2 lần chớp mắt tự động (giây) */
  BLINK_INTERVAL_MIN_SEC: 2.0,
  BLINK_INTERVAL_MAX_SEC: 5.0,
  /** Xác suất chớp mắt đôi (double blink) trong mỗi chu kỳ chớp mắt (0..1) */
  DOUBLE_BLINK_CHANCE: 0.24,
  /** Thời lượng 1 lần nhắm-mở mi mắt (giây) */
  BLINK_DURATION_SEC: 0.15,
  /** Góc quay đầu & đồng tử tối đa theo con trỏ/ngón tay (độ, ±25°) */
  MAX_LOOK_ANGLE_DEG: 25,
  /** Thời gian tự quay đầu/mắt về chính giữa khi không có thao tác con trỏ (giây) */
  LOOK_RETURN_CENTER_SEC: 3.2,
  /** Khoảng thời gian rảnh trước khi kích hoạt hành động ngẫu nhiên nhẹ (giây) */
  IDLE_ACTION_MIN_SEC: 10.5,
  IDLE_ACTION_MAX_SEC: 15.0,
  /** Tốc độ nội suy (lerp/damping) cho Face Controller */
  FACE_LERP_SPEED: 15.0,
  /** Tốc độ nội suy (slerp/damping) cho xương Rigify */
  BONE_LERP_SPEED: 8.5,
} as const;

const GREETING_MESSAGES: readonly string[] = [
  'Xin chào! Bạn muốn khám phá vùng đất hay di sản nào hôm nay?',
  'Chào bạn! Hãy chạm vào một tỉnh thành trên bản đồ để mình thuyết minh nhé!',
  'Rất vui được đồng hành cùng bạn trên hành trình khám phá Hồn Đất Việt!',
  'Xin chào! Cùng mình tìm hiểu vẻ đẹp văn hóa 34 tỉnh thành Việt Nam nhé!',
];

const DOUBLE_TAP_GREETINGS: readonly string[] = [
  'Xin kính chào quý khách! Chúc bạn có chuyến du ngoạn di sản thật thú vị!',
  'Chào mừng bạn! Mình luôn sẵn sàng kể chuyện lịch sử và văn hóa Việt Nam!',
];

interface StoredPrefs {
  dockSide: 'left' | 'right';
  yRatio: number;
  muted: boolean;
  rate: GuideSpeechRate;
  isLargeSize: boolean;
  isHidden: boolean;
}

const DEFAULT_PREFS: StoredPrefs = {
  dockSide: 'right',
  yRatio: 0.82,
  muted: false,
  rate: 1,
  isLargeSize: false,
  isHidden: false,
};

function loadStoredPrefs(): StoredPrefs {
  try {
    const raw = localStorage.getItem(GUIDE_CHARACTER_CONFIG.STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return {
      dockSide: parsed.dockSide === 'left' ? 'left' : 'right',
      yRatio:
        typeof parsed.yRatio === 'number'
          ? Math.max(0.12, Math.min(0.88, parsed.yRatio))
          : DEFAULT_PREFS.yRatio,
      muted: Boolean(parsed.muted),
      rate: parsed.rate === 0.8 || parsed.rate === 1.2 ? parsed.rate : 1,
      isLargeSize: Boolean(parsed.isLargeSize),
      isHidden: Boolean(parsed.isHidden),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function saveStoredPrefs(prefs: StoredPrefs): void {
  try {
    localStorage.setItem(GUIDE_CHARACTER_CONFIG.STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota or private mode errors
  }
}

function checkWebGLAndDeviceSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Chuẩn hóa tên xương để tìm theo tiền tố (bỏ dấu chấm '.' do GLTFLoader sanitize
 * và không phân biệt hoa thường, ví dụ 'spine.006' khớp cả 'spine.006_0' và 'spine006_0').
 */
function normalizeBoneName(name: string): string {
  return (name || '').replace(/\./g, '').toLowerCase();
}

function matchesBonePrefix(boneName: string, prefix: string): boolean {
  return normalizeBoneName(boneName).startsWith(normalizeBoneName(prefix));
}

export interface FaceControllerValues {
  smile: number;     // 0..1
  mouthOpen: number; // 0..1
  blink: number;     // 0..1
  browRaise: number; // 0..1
}

interface FollowUpChip {
  id: string;
  label: string;
  icon: 'replay' | 'next' | 'neighbor' | 'food';
  onClick: () => void;
}

// Pre-allocated math helpers at module scope to prevent GC in the render loop
const _tmpVec3 = new THREE.Vector3();
const _tmpEuler = new THREE.Euler(0, 0, 0, 'XYZ');
const _tmpQuat = new THREE.Quaternion();
const _tmpTargetQuat = new THREE.Quaternion();

interface GuideCharacterProps {
  isPeekingBackground?: boolean;
}

export const GuideCharacter: React.FC<GuideCharacterProps> = ({
  isPeekingBackground = false,
}) => {
  const [prefs, setPrefs] = useState<StoredPrefs>(() => loadStoredPrefs());
  const [isMobileView, setIsMobileView] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : true
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Lazy load & WebGL fallback state
  const [isSceneReady, setIsSceneReady] = useState<boolean>(false);
  const [use2DFallback, setUse2DFallback] = useState<boolean>(false);

  // Máy trạng thái (State Machine): idle, greeting, speaking, reacting, dragged
  const [characterState, setCharacterState] = useState<GuideCharacterStateMode>('idle');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeNarration, setActiveNarration] = useState<GuideNarrationPayload | null>(null);
  const [revealedCharCount, setRevealedCharCount] = useState<number>(0);
  const [showSubtitle, setShowSubtitle] = useState<boolean>(false);
  const [isNarrationFinished, setIsNarrationFinished] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [isControlMenuOpen, setIsControlMenuOpen] = useState<boolean>(false);

  // Vị trí kéo & né bottom sheet
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [mapSheetState, setMapSheetState] = useState<{
    sheetState: 'collapsed' | 'half' | 'full';
    sheetHeightVh: number;
  }>({ sheetState: 'collapsed', sheetHeightVh: 0 });

  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const subtitleHideTimeoutRef = useRef<number | null>(null);
  const stateTransitionTimeoutRef = useRef<number | null>(null);
  const lastTapTimestampRef = useRef<number>(0);

  // Pointer drag tracking refs
  const pointerDownInfoRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    hasMovedBeyondThreshold: boolean;
  } | null>(null);

  // Mutable animation & expression state read directly by the 60fps Three.js loop
  const runtimeRef = useRef<{
    mode: GuideCharacterStateMode;
    isPaused: boolean;
    isDragging: boolean;
    reducedMotion: boolean;
    rate: GuideSpeechRate;
    // Word boundary lip-sync target
    speechVowelOpenness: number;
    speechPulseTimestamp: number;
    clauseNodPulse: number;
    // Greeting gesture sub-mode ('wave' | 'bow')
    greetingGesture: 'wave' | 'bow';
    greetingEndTimestamp: number;
    // Post-speech or post-drop warm smile timer
    warmSmileUntil: number;
    headNodUntil: number;
    // Pointer / Map click gaze tracking (-1..1 normalized, converted to ±25 deg)
    lookTargetYaw: number;   // radians (-0.436 .. +0.436)
    lookTargetPitch: number; // radians (-0.35 .. +0.35)
    lastLookInputTime: number;
    // Map drag/zoom suppression flag
    isMapInteracting: boolean;
    // Character screen center for computing gaze direction
    charScreenCenterX: number;
    charScreenCenterY: number;
  }>({
    mode: 'idle',
    isPaused: false,
    isDragging: false,
    reducedMotion: prefersReducedMotion,
    rate: prefs.rate,
    speechVowelOpenness: 0,
    speechPulseTimestamp: 0,
    clauseNodPulse: 0,
    greetingGesture: 'wave',
    greetingEndTimestamp: 0,
    warmSmileUntil: 0,
    headNodUntil: 0,
    lookTargetYaw: 0,
    lookTargetPitch: 0,
    lastLookInputTime: 0,
    isMapInteracting: false,
    charScreenCenterX: 300,
    charScreenCenterY: 500,
  });

  useEffect(() => {
    runtimeRef.current.mode = isDragging ? 'dragged' : characterState;
    runtimeRef.current.isPaused = isPaused;
    runtimeRef.current.isDragging = isDragging;
    runtimeRef.current.reducedMotion = prefersReducedMotion;
    runtimeRef.current.rate = prefs.rate;
  }, [characterState, isPaused, isDragging, prefersReducedMotion, prefs.rate]);

  const updatePrefs = useCallback((updater: (prev: StoredPrefs) => StoredPrefs) => {
    setPrefs((prev) => {
      const next = updater(prev);
      saveStoredPrefs(next);
      return next;
    });
  }, []);

  // Hướng ánh mắt & đầu của nhân vật về một tọa độ màn hình (x, y) trong giới hạn ±25°
  const aimCharacterGazeAtScreenPoint = useCallback((clientX: number, clientY: number) => {
    const rt = runtimeRef.current;
    const dx = clientX - rt.charScreenCenterX;
    const dy = clientY - rt.charScreenCenterY;
    const vw = Math.max(320, window.innerWidth);
    const vh = Math.max(480, window.innerHeight);

    const maxRad = THREE.MathUtils.degToRad(GUIDE_CHARACTER_CONFIG.MAX_LOOK_ANGLE_DEG);
    // Khi nhìn từ camera đối diện nhân vật: điểm bên phải màn hình (+dx) là bên phải khung nhìn (+yaw world)
    const normX = Math.max(-1, Math.min(1, dx / (vw * 0.45)));
    const normY = Math.max(-1, Math.min(1, dy / (vh * 0.45)));

    rt.lookTargetYaw = normX * maxRad;
    rt.lookTargetPitch = normY * maxRad * 0.72;
    rt.lastLookInputTime = performance.now();
  }, []);

  // Lắng nghe con trỏ chuột / chạm trên toàn trang để nhân vật dõi theo nhẹ nhàng
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (runtimeRef.current.reducedMotion) return;
      aimCharacterGazeAtScreenPoint(e.clientX, e.clientY);
    };
    const handleGlobalPointerDown = (e: PointerEvent) => {
      if (runtimeRef.current.reducedMotion) return;
      aimCharacterGazeAtScreenPoint(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointerdown', handleGlobalPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerdown', handleGlobalPointerDown);
    };
  }, [aimCharacterGazeAtScreenPoint]);

  // Lắng nghe kích thước màn hình và prefers-reduced-motion
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery?.addEventListener?.('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery?.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  // Tải trễ (Lazy-load) 3D sau khi trang hiển thị xong
  useEffect(() => {
    let timerId: number | null = null;
    const initLazy = () => {
      const canUseWebGL = checkWebGLAndDeviceSupport();
      setUse2DFallback(!canUseWebGL);
      setIsSceneReady(true);
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(initLazy, { timeout: 800 });
      return () => win.cancelIdleCallback?.(idleId);
    } else {
      timerId = window.setTimeout(initLazy, 300);
      return () => {
        if (timerId !== null) window.clearTimeout(timerId);
      };
    }
  }, []);

  // Đồng bộ tốc độ đọc và trạng thái tắt tiếng với guideVoiceService
  useEffect(() => {
    guideVoiceService.setRate(prefs.rate);
    guideVoiceService.setMuted(prefs.muted);
  }, [prefs.rate, prefs.muted]);

  // Mở khóa âm thanh iOS/Safari ở tương tác chạm đầu tiên của người dùng
  useEffect(() => {
    const unlockOnce = () => {
      guideVoiceService.unlockAudioOnUserGesture();
    };
    window.addEventListener('pointerdown', unlockOnce, { once: true, passive: true });
    return () => window.removeEventListener('pointerdown', unlockOnce);
  }, []);

  // Hàm bắt đầu đọc một payload (có chuyển qua trạng thái reacting -> speaking)
  const startNarrationWithReaction = useCallback(
    (payload: GuideNarrationPayload, skipReactionDelay: boolean = false) => {
      if (!payload || !payload.introText) return;

      if (subtitleHideTimeoutRef.current !== null) {
        window.clearTimeout(subtitleHideTimeoutRef.current);
        subtitleHideTimeoutRef.current = null;
      }
      if (stateTransitionTimeoutRef.current !== null) {
        window.clearTimeout(stateTransitionTimeoutRef.current);
        stateTransitionTimeoutRef.current = null;
      }

      // Nếu có tọa độ vị trí bấm trên bản đồ, quay đầu nhìn về vị trí đó ngay lập tức
      if (typeof payload.screenX === 'number' && typeof payload.screenY === 'number') {
        aimCharacterGazeAtScreenPoint(payload.screenX, payload.screenY);
      }

      setVoiceNotice(null);
      setActiveNarration(payload);
      setRevealedCharCount(0);
      setIsNarrationFinished(false);
      setShowSubtitle(true);
      setIsPaused(false);

      // Chuyển sang trạng thái 'reacting' (quay đầu nhìn vị trí bấm, cười, nhướn mày) rồi đọc
      if (!skipReactionDelay && payload.targetType !== 'greeting') {
        setCharacterState('reacting');
        runtimeRef.current.mode = 'reacting';
        stateTransitionTimeoutRef.current = window.setTimeout(() => {
          setCharacterState('speaking');
          runtimeRef.current.mode = 'speaking';
        }, 420);
      } else {
        setCharacterState(payload.targetType === 'greeting' ? 'greeting' : 'speaking');
        runtimeRef.current.mode = payload.targetType === 'greeting' ? 'greeting' : 'speaking';
      }

      guideVoiceService.speak(payload.introText, {
        onStart: () => {
          setIsPaused(false);
        },
        onProgress: (charIndex) => {
          setRevealedCharCount(charIndex);
        },
        onWordBoundary: (pulse) => {
          runtimeRef.current.speechVowelOpenness = pulse.vowelOpenness;
          runtimeRef.current.speechPulseTimestamp = performance.now();
          if (pulse.isClauseBreak) {
            runtimeRef.current.clauseNodPulse = performance.now();
          }
        },
        onPause: () => {
          setIsPaused(true);
          runtimeRef.current.speechVowelOpenness = 0;
        },
        onResume: () => {
          setIsPaused(false);
        },
        onError: (notice) => {
          setVoiceNotice(notice);
        },
        onEnd: () => {
          const now = performance.now();
          runtimeRef.current.speechVowelOpenness = 0;
          runtimeRef.current.warmSmileUntil = now + 2600;
          runtimeRef.current.headNodUntil = now + 950;
          runtimeRef.current.mode = 'idle';

          setCharacterState('idle');
          setIsPaused(false);
          setRevealedCharCount(payload.introText.length);
          setIsNarrationFinished(true);

          subtitleHideTimeoutRef.current = window.setTimeout(() => {
            setShowSubtitle(false);
          }, GUIDE_CHARACTER_CONFIG.SUBTITLE_AUTO_HIDE_MS);
        },
      });
    },
    [aimCharacterGazeAtScreenPoint]
  );

  // Lắng nghe sự kiện đọc thuyết minh từ bản đồ
  useEffect(() => {
    const handleNarrate = (event: Event) => {
      const custom = event as CustomEvent<GuideNarrationPayload>;
      if (custom.detail) {
        startNarrationWithReaction(custom.detail, false);
      }
    };

    window.addEventListener(GUIDE_NARRATE_EVENT, handleNarrate);
    return () => {
      window.removeEventListener(GUIDE_NARRATE_EVENT, handleNarrate);
    };
  }, [startNarrationWithReaction]);

  // Lắng nghe sự kiện đóng/mở Bottom Sheet và trạng thái kéo/zoom của Bản đồ
  useEffect(() => {
    const handleSheetState = (event: Event) => {
      const custom = event as CustomEvent<{
        sheetState: 'collapsed' | 'half' | 'full';
        sheetHeightVh: number;
      }>;
      if (custom.detail) {
        setMapSheetState(custom.detail);
      }
    };

    const handleMapInteraction = (event: Event) => {
      const custom = event as CustomEvent<{ active: boolean }>;
      if (custom.detail) {
        runtimeRef.current.isMapInteracting = Boolean(custom.detail.active);
      }
    };

    window.addEventListener(GUIDE_MAP_SHEET_EVENT, handleSheetState);
    window.addEventListener(GUIDE_MAP_INTERACTION_EVENT, handleMapInteraction);
    return () => {
      window.removeEventListener(GUIDE_MAP_SHEET_EVENT, handleSheetState);
      window.removeEventListener(GUIDE_MAP_INTERACTION_EVENT, handleMapInteraction);
    };
  }, []);

  // ============================================================================
  // KHỞI TẠO SCENE THREE.JS, FACE CONTROLLER (MORPH + SPINE.006 OVERLAYS) & RIGIFY BONES
  // ============================================================================
  useEffect(() => {
    if (!isSceneReady || use2DFallback || prefs.isHidden || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth || GUIDE_CHARACTER_CONFIG.MOBILE_WIDTH_PX;
    const height =
      container.clientHeight || Math.round(width * GUIDE_CHARACTER_CONFIG.ASPECT_RATIO);

    const scene = new THREE.Scene();
    // Khung hình bán thân trên (từ thắt lưng lên đỉnh nón/đầu) để thấy rõ khuôn mặt cười, nhép miệng, chớp mắt và hai tay
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.05, 30);
    camera.position.set(0, 1.33, 1.55);
    camera.lookAt(0, 1.27, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setUse2DFallback(true);
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, GUIDE_CHARACTER_CONFIG.MAX_PIXEL_RATIO)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setUse2DFallback(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ánh sáng 3 điểm ấm áp + viền vàng hoàng gia (Gold Rim Light)
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x1e293b, 1.55);
    hemiLight.position.set(0, 4, 1);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfef3c7, 1.75);
    keyLight.position.set(1.8, 3.2, 3.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.65);
    fillLight.position.set(-2.0, 1.5, 2.0);
    scene.add(fillLight);

    const goldRimLight = new THREE.PointLight(0xf59e0b, 2.2, 6);
    goldRimLight.position.set(0, 1.65, -1.35);
    scene.add(goldRimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Cấu trúc lưu trữ xương Rigify tìm theo tiền tố
    interface RigifyBones {
      spine?: THREE.Bone;
      spine001?: THREE.Bone;
      spine002?: THREE.Bone;
      spine003?: THREE.Bone;
      spine004?: THREE.Bone; // Cổ dưới
      spine005?: THREE.Bone; // Cổ trên
      spine006?: THREE.Bone; // Đầu (Head)
      shoulderL?: THREE.Bone;
      upperArmL?: THREE.Bone;
      forearmL?: THREE.Bone;
      handL?: THREE.Bone;
      shoulderR?: THREE.Bone;
      upperArmR?: THREE.Bone;
      forearmR?: THREE.Bone;
      handR?: THREE.Bone;
    }

    const rigBones: RigifyBones = {};
    const restQuats = new Map<THREE.Bone, THREE.Quaternion>();

    // Cấu trúc lưu Morph Targets (nếu mô hình có)
    interface MorphBinding {
      mesh: THREE.Mesh;
      smileIdx: number;
      mouthOpenIdx: number;
      blinkIdx: number;
      browRaiseIdx: number;
    }
    const morphBindings: MorphBinding[] = [];

    // Cấu trúc lưu các lớp phủ biểu cảm dự phòng gắn vào xương đầu `spine.006`
    interface HeadFaceOverlays {
      overlayGroup: THREE.Group;
      mouthCavity: THREE.Mesh;
      mouthTongue: THREE.Mesh;
      upperLipArc: THREE.Mesh;
      lowerLipSmileArc: THREE.Mesh;
      leftEyelid: THREE.Mesh;
      rightEyelid: THREE.Mesh;
      leftBrowOverlay: THREE.Mesh;
      rightBrowOverlay: THREE.Mesh;
      mouthBaseY: number;
      eyeHeightRatio: number;
      eyebrowSkinnedMesh?: THREE.SkinnedMesh;
      eyebrowBaseBindMatrix?: THREE.Matrix4;
      pupilSkinnedMesh?: THREE.SkinnedMesh;
      pupilBaseBindMatrix?: THREE.Matrix4;
      originalMouthMesh?: THREE.Mesh;
    }
    let faceOverlays: HeadFaceOverlays | null = null;

    // Cấu trúc cho nhân vật dự phòng hình khối (nếu không tải được file GLB)
    let proceduralParts: {
      bodyGroup: THREE.Group;
      headGroup: THREE.Group;
      rightArmGroup: THREE.Group;
      leftArmGroup: THREE.Group;
      leftEye: THREE.Mesh;
      rightEye: THREE.Mesh;
      leftBrow: THREE.Mesh;
      rightBrow: THREE.Mesh;
      mouthCavity: THREE.Mesh;
      smileArc: THREE.Mesh;
    } | null = null;

    /**
     * Hàm tính hộp bao (Bounding Box) của một Mesh mặt trong hệ tọa độ cục bộ của xương đầu `spine.006`
     */
    const computeMeshBoxInHeadBoneSpace = (
      mesh: THREE.Mesh,
      headBone: THREE.Bone
    ): {
      fullBox: THREE.Box3;
      leftBox: THREE.Box3;
      rightBox: THREE.Box3;
    } => {
      const fullBox = new THREE.Box3();
      const leftBox = new THREE.Box3();
      const rightBox = new THREE.Box3();
      const posAttr = mesh.geometry.attributes.position;
      const skinned = (mesh as THREE.SkinnedMesh).isSkinnedMesh
        ? (mesh as THREE.SkinnedMesh)
        : null;

      for (let i = 0; i < posAttr.count; i++) {
        if (skinned) {
          skinned.getVertexPosition(i, _tmpVec3);
        } else {
          _tmpVec3.fromBufferAttribute(posAttr, i);
        }
        _tmpVec3.applyMatrix4(mesh.matrixWorld);
        headBone.worldToLocal(_tmpVec3);
        fullBox.expandByPoint(_tmpVec3);
        if (_tmpVec3.x < 0) {
          leftBox.expandByPoint(_tmpVec3);
        } else {
          rightBox.expandByPoint(_tmpVec3);
        }
      }
      return { fullBox, leftBox, rightBox };
    };

    /**
     * Thiết lập Rigify Bones, kiểm tra Morph Targets và khởi tạo Face Overlays trên xương `spine.006`
     */
    const setupGLTFCharacter = (model: THREE.Group) => {
      // 1. Tìm tất cả xương theo tiền tố Rigify
      model.traverse((obj) => {
        if ((obj as THREE.Bone).isBone) {
          const bone = obj as THREE.Bone;
          restQuats.set(bone, bone.quaternion.clone());

          if (matchesBonePrefix(bone.name, 'spine.006')) rigBones.spine006 = bone;
          else if (matchesBonePrefix(bone.name, 'spine.005')) rigBones.spine005 = bone;
          else if (matchesBonePrefix(bone.name, 'spine.004')) rigBones.spine004 = bone;
          else if (matchesBonePrefix(bone.name, 'spine.003')) rigBones.spine003 = bone;
          else if (matchesBonePrefix(bone.name, 'spine.002')) rigBones.spine002 = bone;
          else if (matchesBonePrefix(bone.name, 'spine.001')) rigBones.spine001 = bone;
          else if (matchesBonePrefix(bone.name, 'spine_')) rigBones.spine = bone;
          else if (matchesBonePrefix(bone.name, 'shoulder.L')) rigBones.shoulderL = bone;
          else if (matchesBonePrefix(bone.name, 'upper_arm.L')) rigBones.upperArmL = bone;
          else if (matchesBonePrefix(bone.name, 'forearm.L')) rigBones.forearmL = bone;
          else if (matchesBonePrefix(bone.name, 'hand.L')) rigBones.handL = bone;
          else if (matchesBonePrefix(bone.name, 'shoulder.R')) rigBones.shoulderR = bone;
          else if (matchesBonePrefix(bone.name, 'upper_arm.R')) rigBones.upperArmR = bone;
          else if (matchesBonePrefix(bone.name, 'forearm.R')) rigBones.forearmR = bone;
          else if (matchesBonePrefix(bone.name, 'hand.R')) rigBones.handR = bone;
        }
      });

      // 2. Hạ hai cánh tay từ T-pose về tư thế đứng tự nhiên trước khi đo khung bao
      if (rigBones.upperArmL) {
        const rest = restQuats.get(rigBones.upperArmL)!;
        _tmpEuler.set(0.12, 0, -1.18, 'XYZ');
        rigBones.upperArmL.quaternion.copy(rest).multiply(_tmpQuat.setFromEuler(_tmpEuler));
      }
      if (rigBones.forearmL) {
        const rest = restQuats.get(rigBones.forearmL)!;
        _tmpEuler.set(0.32, 0, 0.32, 'XYZ');
        rigBones.forearmL.quaternion.copy(rest).multiply(_tmpQuat.setFromEuler(_tmpEuler));
      }
      if (rigBones.upperArmR) {
        const rest = restQuats.get(rigBones.upperArmR)!;
        _tmpEuler.set(0.12, 0, 1.18, 'XYZ');
        rigBones.upperArmR.quaternion.copy(rest).multiply(_tmpQuat.setFromEuler(_tmpEuler));
      }
      if (rigBones.forearmR) {
        const rest = restQuats.get(rigBones.forearmR)!;
        _tmpEuler.set(0.32, 0, -0.32, 'XYZ');
        rigBones.forearmR.quaternion.copy(rest).multiply(_tmpQuat.setFromEuler(_tmpEuler));
      }

      model.updateMatrixWorld(true);

      // 3. Căn chỉnh tỷ lệ & đặt chân nhân vật chạm đất, đầu/ngực khớp khung camera bán thân
      const rawBox = new THREE.Box3().setFromObject(model);
      const rawSize = rawBox.getSize(new THREE.Vector3());
      const rawCenter = rawBox.getCenter(new THREE.Vector3());
      const targetHeight = 1.68;
      const scale = targetHeight / (rawSize.y || 1);
      model.scale.setScalar(scale);
      model.position.set(-rawCenter.x * scale, -rawBox.min.y * scale + 0.04, -rawCenter.z * scale);
      model.updateMatrixWorld(true);

      // 4. Dò (traverse) tất cả Mesh để đọc morphTargetDictionary và nhận diện các mesh mặt theo tên vật liệu
      let eyebrowMesh: THREE.Mesh | undefined;
      let eyeSingleMesh: THREE.Mesh | undefined;
      let eyePupilMesh: THREE.Mesh | undefined;
      let mouthMesh: THREE.Mesh | undefined;
      let sampledSkinColor = new THREE.Color(0xd99b78);
      let sampledLipColor = new THREE.Color(0x9e1b1b);

      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          mesh.frustumCulled = false;

          const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          const matName = mat?.name || '';

          if (/^Skin\.000/i.test(matName)) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            if (stdMat.color) {
              sampledSkinColor = stdMat.color.clone();
            }
          } else if (/^Eyebrow\.000/i.test(matName)) {
            eyebrowMesh = mesh;
          } else if (/^Eye_Single\.000/i.test(matName)) {
            eyeSingleMesh = mesh;
          } else if (/^Eye_Pupil\.000/i.test(matName)) {
            eyePupilMesh = mesh;
          } else if (/^Mouth\.000/i.test(matName)) {
            mouthMesh = mesh;
            const stdMat = mat as THREE.MeshStandardMaterial;
            if (stdMat.color) {
              sampledLipColor = stdMat.color.clone();
            }
          }

          // Kiểm tra morphTargetDictionary (ưu tiên nếu có)
          const dict = mesh.morphTargetDictionary;
          if (dict && mesh.morphTargetInfluences) {
            const keys = Object.keys(dict);
            const findMorphIdx = (pattern: RegExp): number => {
              const foundKey = keys.find((k) => pattern.test(k));
              return foundKey !== undefined ? dict[foundKey] : -1;
            };
            const smileIdx = findMorphIdx(/smile|happy|mouthsmile/i);
            const mouthOpenIdx = findMorphIdx(/mouthopen|mouth_open|jawopen|viseme_aa|open|speak/i);
            const blinkIdx = findMorphIdx(/blink|eyeblink|eye_close|eyesclosed/i);
            const browRaiseIdx = findMorphIdx(/browraise|brow_raise|browinnerup|browouterup|browup/i);

            if (smileIdx >= 0 || mouthOpenIdx >= 0 || blinkIdx >= 0 || browRaiseIdx >= 0) {
              morphBindings.push({
                mesh,
                smileIdx,
                mouthOpenIdx,
                blinkIdx,
                browRaiseIdx,
              });
            }
          }
        }
      });

      // 5. DỰ PHÒNG (Nếu không có Morph Target): Tạo các hình phủ 3D gắn trực tiếp vào xương đầu `spine.006`
      if (morphBindings.length === 0 && rigBones.spine006) {
        const headBone = rigBones.spine006;
        headBone.updateMatrixWorld(true);

        const overlayGroup = new THREE.Group();
        overlayGroup.name = 'HeadFaceOverlays_spine006';
        headBone.add(overlayGroup);

        // Tính hộp bao cục bộ của Miệng, Mắt, Lông mày trong không gian `spine.006`
        const mouthBoxInfo = mouthMesh
          ? computeMeshBoxInHeadBoneSpace(mouthMesh, headBone)
          : null;
        const eyeBoxInfo = eyeSingleMesh
          ? computeMeshBoxInHeadBoneSpace(eyeSingleMesh, headBone)
          : null;
        const browBoxInfo = eyebrowMesh
          ? computeMeshBoxInHeadBoneSpace(eyebrowMesh, headBone)
          : null;

        // Tọa độ mặc định chuẩn xác trong không gian cục bộ `spine.006` nếu bất kỳ mesh nào thiếu
        const mCenter = mouthBoxInfo
          ? mouthBoxInfo.fullBox.getCenter(new THREE.Vector3())
          : new THREE.Vector3(0, -0.0426, 0.1074);
        const mSize = mouthBoxInfo
          ? mouthBoxInfo.fullBox.getSize(new THREE.Vector3())
          : new THREE.Vector3(0.079, 0.0204, 0.0627);
        const mFrontZ = (mouthBoxInfo ? mouthBoxInfo.fullBox.max.z : 0.1387) + 0.0022;

        // Ẩn mesh Mouth.000 gốc để không bị trùng hình khi lớp phủ miệng hoạt động
        if (mouthMesh) {
          mouthMesh.visible = false;
        }

        // 5A. MIỆNG: Hình elip tối bên trong khoang miệng + lưỡi hồng nhẹ + vòng cung môi cười
        const mouthHalfW = Math.max(0.026, mSize.x * 0.44);
        const cavityGeo = new THREE.CircleGeometry(mouthHalfW, 24);
        const cavityMat = new THREE.MeshBasicMaterial({
          color: 0x240507,
          side: THREE.DoubleSide,
        });
        const mouthCavity = new THREE.Mesh(cavityGeo, cavityMat);
        mouthCavity.position.set(mCenter.x, mCenter.y, mFrontZ);
        mouthCavity.scale.set(1, 0.08, 1);
        overlayGroup.add(mouthCavity);

        const tongueGeo = new THREE.CircleGeometry(mouthHalfW * 0.58, 16, Math.PI, Math.PI);
        const tongueMat = new THREE.MeshBasicMaterial({
          color: 0xd9383a,
          side: THREE.DoubleSide,
        });
        const mouthTongue = new THREE.Mesh(tongueGeo, tongueMat);
        mouthTongue.position.set(mCenter.x, mCenter.y - 0.002, mFrontZ + 0.0006);
        mouthTongue.scale.set(1, 0.05, 1);
        overlayGroup.add(mouthTongue);

        // Vòng cung môi trên & môi dưới (TorusGeometry cung màu môi, độ cong tăng theo `smile`)
        const lipMat = new THREE.MeshStandardMaterial({
          color: sampledLipColor.clone().lerp(new THREE.Color(0xb91c1c), 0.35),
          roughness: 0.42,
          metalness: 0.05,
        });

        const lipArcRadius = mouthHalfW * 0.95;
        const lipTubeRadius = 0.0038;
        const upperLipGeo = new THREE.TorusGeometry(
          lipArcRadius,
          lipTubeRadius,
          10,
          24,
          Math.PI * 0.82
        );
        const upperLipArc = new THREE.Mesh(upperLipGeo, lipMat);
        upperLipArc.position.set(mCenter.x, mCenter.y + 0.002, mFrontZ + 0.0012);
        upperLipArc.rotation.z = Math.PI + Math.PI * 0.09;
        upperLipArc.scale.set(1, 0.22, 0.65);
        overlayGroup.add(upperLipArc);

        const lowerLipGeo = new THREE.TorusGeometry(
          lipArcRadius,
          lipTubeRadius * 1.08,
          10,
          24,
          Math.PI * 0.84
        );
        const lowerLipSmileArc = new THREE.Mesh(lowerLipGeo, lipMat);
        lowerLipSmileArc.position.set(mCenter.x, mCenter.y + 0.003, mFrontZ + 0.0015);
        lowerLipSmileArc.rotation.z = Math.PI + Math.PI * 0.08;
        lowerLipSmileArc.scale.set(1, 0.35, 0.65);
        overlayGroup.add(lowerLipSmileArc);

        // 5B. CHỚP MẮT: Hai nắp mi bằng da (lấy mẫu màu từ vật liệu Skin.000), scaleY từ 0 đến 1 theo `blink`
        const leftEyeCenter = eyeBoxInfo
          ? eyeBoxInfo.leftBox.getCenter(new THREE.Vector3())
          : new THREE.Vector3(-0.0678, 0.0411, 0.0822);
        const rightEyeCenter = eyeBoxInfo
          ? eyeBoxInfo.rightBox.getCenter(new THREE.Vector3())
          : new THREE.Vector3(0.0678, 0.0411, 0.0822);
        const leftEyeSize = eyeBoxInfo
          ? eyeBoxInfo.leftBox.getSize(new THREE.Vector3())
          : new THREE.Vector3(0.0586, 0.0492, 0.0474);
        const eyeFrontZ = (eyeBoxInfo ? eyeBoxInfo.fullBox.max.z : 0.1059) + 0.0035;

        const eyelidRadius = Math.max(0.028, leftEyeSize.x * 0.56);
        // Dịch tâm hình học xuống dưới 1 bán kính để khi scaleY từ 0 -> 1 nắp mi kéo từ mí trên xuống mí dưới
        const eyelidGeo = new THREE.SphereGeometry(eyelidRadius, 16, 12);
        eyelidGeo.translate(0, -eyelidRadius, 0);

        const eyelidSkinMat = new THREE.MeshStandardMaterial({
          color: sampledSkinColor,
          roughness: 0.52,
          metalness: 0.04,
        });

        const topEyelidY = leftEyeCenter.y + leftEyeSize.y * 0.52;
        const leftEyelid = new THREE.Mesh(eyelidGeo, eyelidSkinMat);
        leftEyelid.position.set(leftEyeCenter.x, topEyelidY, eyeFrontZ);
        leftEyelid.scale.set(1.08, 0.001, 0.32);
        leftEyelid.visible = false;
        overlayGroup.add(leftEyelid);

        const rightEyelid = new THREE.Mesh(eyelidGeo, eyelidSkinMat);
        rightEyelid.position.set(rightEyeCenter.x, topEyelidY, eyeFrontZ);
        rightEyelid.scale.set(1.08, 0.001, 0.32);
        rightEyelid.visible = false;
        overlayGroup.add(rightEyelid);

        // 5C. LÔNG MÀY & ĐỒNG TỬ: Kết hợp dịch chuyển ma trận bindMatrix của Eyebrow.000 / Eye_Pupil.000
        // và thanh lông mày phủ nhẹ trên `spine.006`
        const leftBrowCenter = browBoxInfo
          ? browBoxInfo.leftBox.getCenter(new THREE.Vector3())
          : new THREE.Vector3(-0.0711, 0.0458, 0.0897);
        const rightBrowCenter = browBoxInfo
          ? browBoxInfo.rightBox.getCenter(new THREE.Vector3())
          : new THREE.Vector3(0.0711, 0.0458, 0.0897);
        const browFrontZ = (browBoxInfo ? browBoxInfo.fullBox.max.z : 0.112) + 0.002;

        const browGeo = new THREE.CapsuleGeometry(0.0045, 0.038, 6, 8);
        const browMat = new THREE.MeshBasicMaterial({ color: 0x171717 });
        const leftBrowOverlay = new THREE.Mesh(browGeo, browMat);
        leftBrowOverlay.rotation.z = Math.PI / 2 - 0.08;
        leftBrowOverlay.position.set(leftBrowCenter.x, leftBrowCenter.y + 0.018, browFrontZ);
        overlayGroup.add(leftBrowOverlay);

        const rightBrowOverlay = new THREE.Mesh(browGeo, browMat);
        rightBrowOverlay.rotation.z = Math.PI / 2 + 0.08;
        rightBrowOverlay.position.set(rightBrowCenter.x, rightBrowCenter.y + 0.018, browFrontZ);
        overlayGroup.add(rightBrowOverlay);

        const eyebrowSkinned =
          eyebrowMesh && (eyebrowMesh as THREE.SkinnedMesh).isSkinnedMesh
            ? (eyebrowMesh as THREE.SkinnedMesh)
            : undefined;
        const pupilSkinned =
          eyePupilMesh && (eyePupilMesh as THREE.SkinnedMesh).isSkinnedMesh
            ? (eyePupilMesh as THREE.SkinnedMesh)
            : undefined;

        faceOverlays = {
          overlayGroup,
          mouthCavity,
          mouthTongue,
          upperLipArc,
          lowerLipSmileArc,
          leftEyelid,
          rightEyelid,
          leftBrowOverlay,
          rightBrowOverlay,
          mouthBaseY: mCenter.y,
          eyeHeightRatio: (leftEyeSize.y / eyelidRadius) * 0.62,
          eyebrowSkinnedMesh: eyebrowSkinned,
          eyebrowBaseBindMatrix: eyebrowSkinned ? eyebrowSkinned.bindMatrix.clone() : undefined,
          pupilSkinnedMesh: pupilSkinned,
          pupilBaseBindMatrix: pupilSkinned ? pupilSkinned.bindMatrix.clone() : undefined,
          originalMouthMesh: mouthMesh,
        };
      }

      // Điều chỉnh camera tự động bám sát vùng đầu + ngực của mô hình sau khi scale
      if (rigBones.spine006) {
        const headWorldPos = rigBones.spine006.getWorldPosition(new THREE.Vector3());
        camera.position.set(0, headWorldPos.y - 0.1, 1.48);
        camera.lookAt(0, headWorldPos.y - 0.16, 0);
      }

      rootGroup.add(model);
    };

    const buildPlaceholderCharacter = () => {
      const charGroup = new THREE.Group();
      const bodyGroup = new THREE.Group();
      bodyGroup.position.y = 0.42;
      charGroup.add(bodyGroup);

      const torsoGeo = new THREE.CylinderGeometry(0.22, 0.34, 0.82, 20);
      const torsoMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.35,
        metalness: 0.15,
      });
      const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
      torsoMesh.position.y = 0.42;
      bodyGroup.add(torsoMesh);

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.25,
        metalness: 0.65,
      });

      const collarGeo = new THREE.CylinderGeometry(0.13, 0.17, 0.08, 16);
      const collarMesh = new THREE.Mesh(collarGeo, goldMat);
      collarMesh.position.y = 0.85;
      bodyGroup.add(collarMesh);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.08, 0);
      bodyGroup.add(headGroup);

      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xfde68a,
        roughness: 0.42,
      });
      const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
      const headMesh = new THREE.Mesh(headGeo, skinMat);
      headGroup.add(headMesh);

      const eyeGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.075, 0.025, 0.2);
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.075, 0.025, 0.2);
      headGroup.add(leftEye, rightEye);

      const browGeo = new THREE.CapsuleGeometry(0.008, 0.045, 6, 8);
      const leftBrow = new THREE.Mesh(browGeo, eyeMat);
      leftBrow.rotation.z = Math.PI / 2;
      leftBrow.position.set(-0.075, 0.075, 0.2);
      const rightBrow = new THREE.Mesh(browGeo, eyeMat);
      rightBrow.rotation.z = Math.PI / 2;
      rightBrow.position.set(0.075, 0.075, 0.2);
      headGroup.add(leftBrow, rightBrow);

      const mouthCavityGeo = new THREE.CircleGeometry(0.042, 20);
      const mouthCavityMat = new THREE.MeshBasicMaterial({ color: 0x280507 });
      const mouthCavity = new THREE.Mesh(mouthCavityGeo, mouthCavityMat);
      mouthCavity.position.set(0, -0.062, 0.208);
      mouthCavity.scale.set(1, 0.1, 1);
      headGroup.add(mouthCavity);

      const smileArcGeo = new THREE.TorusGeometry(0.042, 0.007, 8, 20, Math.PI * 0.8);
      const smileArcMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
      const smileArc = new THREE.Mesh(smileArcGeo, smileArcMat);
      smileArc.position.set(0, -0.056, 0.21);
      smileArc.rotation.z = Math.PI + Math.PI * 0.1;
      headGroup.add(smileArc);

      const hatGeo = new THREE.ConeGeometry(0.46, 0.3, 28);
      const hatMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.5,
      });
      const hatMesh = new THREE.Mesh(hatGeo, hatMat);
      hatMesh.position.set(0, 0.24, 0);
      headGroup.add(hatMesh);

      const leftArmGroup = new THREE.Group();
      leftArmGroup.position.set(-0.25, 0.76, 0);
      bodyGroup.add(leftArmGroup);
      const armGeo = new THREE.CapsuleGeometry(0.048, 0.28, 8, 12);
      const leftArmMesh = new THREE.Mesh(armGeo, torsoMat);
      leftArmMesh.position.set(-0.05, -0.14, 0);
      leftArmGroup.add(leftArmMesh);
      leftArmGroup.rotation.z = 0.24;

      const rightArmGroup = new THREE.Group();
      rightArmGroup.position.set(0.25, 0.76, 0);
      bodyGroup.add(rightArmGroup);
      const rightArmMesh = new THREE.Mesh(armGeo, torsoMat);
      rightArmMesh.position.set(0.05, -0.14, 0);
      rightArmGroup.add(rightArmMesh);
      rightArmGroup.rotation.z = -0.24;

      rootGroup.add(charGroup);
      proceduralParts = {
        bodyGroup,
        headGroup,
        rightArmGroup,
        leftArmGroup,
        leftEye,
        rightEye,
        leftBrow,
        rightBrow,
        mouthCavity,
        smileArc,
      };
    };

    let isDisposed = false;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(GUIDE_CHARACTER_CONFIG.DRACO_DECODER_PATH);
    loader.setDRACOLoader(dracoLoader);
    try {
      loader.setMeshoptDecoder(MeshoptDecoder);
    } catch {
      // ignore
    }

    const loadModelWithFallback = (url: string, allowRemoteRetry: boolean) => {
      loader.load(
        url,
        (gltf) => {
          if (isDisposed) return;
          setupGLTFCharacter(gltf.scene);
          dracoLoader.dispose();
        },
        undefined,
        () => {
          if (isDisposed) return;
          if (allowRemoteRetry && FALLBACK_REMOTE_MODEL_URL && url !== FALLBACK_REMOTE_MODEL_URL) {
            loadModelWithFallback(FALLBACK_REMOTE_MODEL_URL, false);
          } else {
            buildPlaceholderCharacter();
            dracoLoader.dispose();
          }
        }
      );
    };

    if (MODEL_URL && MODEL_URL.trim().length > 0) {
      loadModelWithFallback(MODEL_URL.trim(), true);
    } else {
      buildPlaceholderCharacter();
    }

    // ========================================================================
    // VÒNG LẶP HOẠT ẢNH & BIỂU CẢM (FACE CONTROLLER + RIGIFY BONES + IDLE AI)
    // ========================================================================
    const faceCurrent: FaceControllerValues = {
      smile: 0.25,
      mouthOpen: 0,
      blink: 0,
      browRaise: 0,
    };
    const faceTarget: FaceControllerValues = {
      smile: 0.25,
      mouthOpen: 0,
      blink: 0,
      browRaise: 0,
    };

    // Bộ hẹn giờ chớp mắt tự động (mỗi 2-5 giây, thỉnh thoảng chớp đôi)
    let nextBlinkTime =
      2.2 +
      Math.random() *
        (GUIDE_CHARACTER_CONFIG.BLINK_INTERVAL_MAX_SEC -
          GUIDE_CHARACTER_CONFIG.BLINK_INTERVAL_MIN_SEC);
    let blinkEndTime = 0;
    let secondBlinkStartTime = 0;
    let secondBlinkEndTime = 0;

    // Bộ hẹn giờ hành động rảnh ngẫu nhiên (mỗi 10.5 - 15 giây khi không thao tác bản đồ)
    let nextIdleActionTime = 11.0 + Math.random() * 4.0;
    let currentIdleAction: IdleRandomActionType = 'none';
    let idleActionStartTime = 0;
    let idleActionEndTime = 0;

    // Góc nhìn hiện tại (được làm mượt hướng tới lookTargetYaw / lookTargetPitch)
    let currentLookYaw = 0;
    let currentLookPitch = 0;

    let rafId: number | null = null;
    let lastFrameTime = performance.now();
    let elapsed = 0;

    const renderLoop = (now: number) => {
      rafId = window.requestAnimationFrame(renderLoop);

      if (document.hidden) {
        lastFrameTime = now;
        return;
      }

      const rt = runtimeRef.current;
      const isActiveSpeaking = rt.mode === 'speaking' && !rt.isPaused;
      const isGreeting = rt.mode === 'greeting';
      const isReacting = rt.mode === 'reacting';
      const isDragged = rt.mode === 'dragged' || rt.isDragging;

      const deltaMs = now - lastFrameTime;
      const targetInterval = isActiveSpeaking || isDragged || isGreeting || isReacting ? 16 : 30;
      if (deltaMs < targetInterval) return;

      const dt = Math.min(deltaMs / 1000, 0.1);
      lastFrameTime = now;
      const motionScale = rt.reducedMotion ? 0.22 : 1.0;
      elapsed += dt;

      // 1. TÍNH TOÁN CHỚP MẮT TỰ ĐỘNG (2-5s, hỗ trợ chớp đôi)
      if (elapsed >= nextBlinkTime) {
        const dur = GUIDE_CHARACTER_CONFIG.BLINK_DURATION_SEC;
        blinkEndTime = elapsed + dur;
        if (Math.random() < GUIDE_CHARACTER_CONFIG.DOUBLE_BLINK_CHANCE) {
          secondBlinkStartTime = blinkEndTime + 0.09;
          secondBlinkEndTime = secondBlinkStartTime + dur;
        } else {
          secondBlinkStartTime = 0;
          secondBlinkEndTime = 0;
        }
        nextBlinkTime =
          elapsed +
          GUIDE_CHARACTER_CONFIG.BLINK_INTERVAL_MIN_SEC +
          Math.random() *
            (GUIDE_CHARACTER_CONFIG.BLINK_INTERVAL_MAX_SEC -
              GUIDE_CHARACTER_CONFIG.BLINK_INTERVAL_MIN_SEC);
      }

      const inFirstBlink = elapsed < blinkEndTime;
      const inSecondBlink =
        secondBlinkStartTime > 0 &&
        elapsed >= secondBlinkStartTime &&
        elapsed < secondBlinkEndTime;
      faceTarget.blink = inFirstBlink || inSecondBlink ? 1.0 : 0.0;

      // 2. CẬP NHẬT MỤC TIÊU FACE CONTROLLER THEO MÁY TRẠNG THÁI (STATE MACHINE)
      const timeSinceSpeechPulse = now - rt.speechPulseTimestamp;
      const hasWarmSmile = now < rt.warmSmileUntil;

      if (isDragged) {
        // Khi bị kéo: biểu cảm ngạc nhiên nhẹ (nhướn mày, miệng hơi mở)
        faceTarget.smile = 0.08;
        faceTarget.mouthOpen = 0.36;
        faceTarget.browRaise = 0.85;
      } else if (isReacting) {
        // Khi vừa bấm tỉnh/di sản trên bản đồ: cười tươi, nhướn mày
        faceTarget.smile = 0.84;
        faceTarget.mouthOpen = 0.12;
        faceTarget.browRaise = 0.72;
      } else if (isGreeting) {
        // Khi chào: cười rạng rỡ, nhướn mày thân thiện + nhép miệng nếu đang đọc câu chào
        faceTarget.smile = 0.88;
        faceTarget.browRaise = 0.48;
        if (!rt.isPaused && timeSinceSpeechPulse < 260) {
          const osc = 0.65 + 0.35 * Math.sin(elapsed * 24);
          faceTarget.mouthOpen =
            rt.speechVowelOpenness * osc * GUIDE_CHARACTER_CONFIG.MAX_MOUTH_OPEN;
        } else {
          faceTarget.mouthOpen = 0.08;
        }
      } else if (isActiveSpeaking) {
        // Khi đang thuyết minh: nhép miệng theo nguyên âm từng từ, cười nhẹ thân thiện
        faceTarget.smile = 0.42;
        faceTarget.browRaise = 0.22 + 0.18 * Math.sin(elapsed * 3.5);
        if (timeSinceSpeechPulse < 280) {
          // Tạo dao động đóng-mở âm tiết mượt mà quanh độ mở nguyên âm của từ hiện tại
          const syllableWave = 0.58 + 0.42 * Math.sin(elapsed * 26);
          faceTarget.mouthOpen = Math.min(
            GUIDE_CHARACTER_CONFIG.MAX_MOUTH_OPEN,
            rt.speechVowelOpenness * syllableWave * GUIDE_CHARACTER_CONFIG.MAX_MOUTH_OPEN
          );
        } else {
          faceTarget.mouthOpen = 0.04;
        }
      } else {
        // Trạng thái Idle (hoặc vừa đọc xong / vừa thả tay sau khi kéo)
        faceTarget.mouthOpen = 0.0;
        faceTarget.smile = hasWarmSmile ? 0.85 : 0.26;
        faceTarget.browRaise = hasWarmSmile ? 0.35 : 0.05;
      }

      // Nội suy mượt (Lerp/Damping) cho Face Controller (không bao giờ nhảy cứng)
      const faceAlpha = Math.min(1, dt * GUIDE_CHARACTER_CONFIG.FACE_LERP_SPEED);
      const blinkAlpha = Math.min(1, dt * 28); // Chớp mắt nhanh và dứt khoát hơn
      faceCurrent.smile = THREE.MathUtils.lerp(faceCurrent.smile, faceTarget.smile, faceAlpha);
      faceCurrent.mouthOpen = THREE.MathUtils.lerp(
        faceCurrent.mouthOpen,
        faceTarget.mouthOpen,
        faceAlpha
      );
      faceCurrent.browRaise = THREE.MathUtils.lerp(
        faceCurrent.browRaise,
        faceTarget.browRaise,
        faceAlpha
      );
      faceCurrent.blink = THREE.MathUtils.lerp(faceCurrent.blink, faceTarget.blink, blinkAlpha);

      // 3. ÁP DỤNG FACE CONTROLLER VÀO MORPH TARGETS (ƯU TIÊN) HOẶC LỚP PHỦ SPINE.006 (DỰ PHÒNG)
      if (morphBindings.length > 0) {
        for (const b of morphBindings) {
          const inf = b.mesh.morphTargetInfluences;
          if (!inf) continue;
          if (b.smileIdx >= 0) inf[b.smileIdx] = faceCurrent.smile;
          if (b.mouthOpenIdx >= 0) inf[b.mouthOpenIdx] = faceCurrent.mouthOpen;
          if (b.blinkIdx >= 0) inf[b.blinkIdx] = faceCurrent.blink;
          if (b.browRaiseIdx >= 0) inf[b.browRaiseIdx] = faceCurrent.browRaise;
        }
      } else if (faceOverlays) {
        // Điều khiển Miệng (hình elip tối + lưỡi + vòng cung môi cười)
        const openVal = faceCurrent.mouthOpen;
        const smileVal = faceCurrent.smile;

        faceOverlays.mouthCavity.visible = openVal > 0.025;
        faceOverlays.mouthTongue.visible = openVal > 0.14;
        const widthFactor = 0.88 + smileVal * 0.26 - openVal * 0.1;
        const openScaleY = Math.max(0.04, openVal * 0.92);
        faceOverlays.mouthCavity.scale.set(widthFactor, openScaleY, 1);
        faceOverlays.mouthTongue.scale.set(widthFactor * 0.85, openScaleY * 0.65, 1);

        // Đường cong môi cười: độ cong tăng theo `smile`, tách nhẹ theo `mouthOpen`
        const smileArcCurveY = 0.16 + smileVal * 0.82;
        faceOverlays.lowerLipSmileArc.scale.set(widthFactor, smileArcCurveY, 0.7);
        faceOverlays.lowerLipSmileArc.position.y =
          faceOverlays.mouthBaseY + 0.003 - openVal * 0.0085 + smileVal * 0.002;

        faceOverlays.upperLipArc.scale.set(widthFactor, 0.14 + smileVal * 0.36, 0.7);
        faceOverlays.upperLipArc.position.y =
          faceOverlays.mouthBaseY + 0.003 + openVal * 0.0055 + smileVal * 0.0015;

        // Điều khiển Chớp mắt (hai nắp mi bằng da phủ mắt, scaleY từ 0 -> 1 theo blink)
        const showEyelids = faceCurrent.blink > 0.02;
        faceOverlays.leftEyelid.visible = showEyelids;
        faceOverlays.rightEyelid.visible = showEyelids;
        if (showEyelids) {
          const lidScaleY = Math.max(0.01, faceCurrent.blink * faceOverlays.eyeHeightRatio);
          faceOverlays.leftEyelid.scale.y = lidScaleY;
          faceOverlays.rightEyelid.scale.y = lidScaleY;
        }

        // Điều khiển Lông mày (dịch lên xuống nhẹ theo browRaise)
        const browOffsetLocalY = faceCurrent.browRaise * 0.0095;
        faceOverlays.leftBrowOverlay.position.y = 0.063 + browOffsetLocalY;
        faceOverlays.rightBrowOverlay.position.y = 0.063 + browOffsetLocalY;
        faceOverlays.leftBrowOverlay.rotation.z =
          Math.PI / 2 - 0.08 + faceCurrent.browRaise * 0.08;
        faceOverlays.rightBrowOverlay.rotation.z =
          Math.PI / 2 + 0.08 - faceCurrent.browRaise * 0.08;

        if (faceOverlays.eyebrowSkinnedMesh && faceOverlays.eyebrowBaseBindMatrix) {
          faceOverlays.eyebrowSkinnedMesh.bindMatrix.copy(faceOverlays.eyebrowBaseBindMatrix);
          faceOverlays.eyebrowSkinnedMesh.bindMatrix.elements[13] +=
            faceCurrent.browRaise * 0.065;
        }
      }

      // 4. TÍNH TOÁN THEO DÕI CON TRỎ / ÁNH MẮT (±25 độ, tự về giữa sau 3.2s)
      const secondsSinceLookInput = (now - rt.lastLookInputTime) / 1000;
      const shouldReturnCenter =
        secondsSinceLookInput > GUIDE_CHARACTER_CONFIG.LOOK_RETURN_CENTER_SEC ||
        isActiveSpeaking;

      // Khi đang nói: ánh mắt hướng thẳng về người dùng (0, 0)
      let desiredYaw = shouldReturnCenter ? 0 : rt.lookTargetYaw * motionScale;
      let desiredPitch = shouldReturnCenter ? 0 : rt.lookTargetPitch * motionScale;

      // 5. HÀNH ĐỘNG NGẪU NHIÊN KHI RẢNH QUÁ 10-15 GIÂY (Tắt khi đang kéo/zoom bản đồ hoặc reducedMotion)
      const canRunIdleAction =
        rt.mode === 'idle' &&
        !rt.isMapInteracting &&
        !rt.reducedMotion &&
        secondsSinceLookInput > 4.0;

      if (canRunIdleAction) {
        if (currentIdleAction === 'none' && elapsed >= nextIdleActionTime) {
          const actions: IdleRandomActionType[] = ['look_around', 'stretch', 'wave'];
          currentIdleAction = actions[Math.floor(Math.random() * actions.length)];
          idleActionStartTime = elapsed;
          idleActionEndTime = elapsed + 2.6;
        } else if (currentIdleAction !== 'none' && elapsed >= idleActionEndTime) {
          currentIdleAction = 'none';
          nextIdleActionTime =
            elapsed +
            GUIDE_CHARACTER_CONFIG.IDLE_ACTION_MIN_SEC +
            Math.random() *
              (GUIDE_CHARACTER_CONFIG.IDLE_ACTION_MAX_SEC -
                GUIDE_CHARACTER_CONFIG.IDLE_ACTION_MIN_SEC);
        }
      } else {
        currentIdleAction = 'none';
      }

      if (currentIdleAction === 'look_around') {
        const p = elapsed - idleActionStartTime;
        desiredYaw = Math.sin(p * 2.4) * 0.32;
        desiredPitch = Math.sin(p * 1.2) * -0.08;
      }

      const lookAlpha = Math.min(1, dt * 6.5);
      currentLookYaw = THREE.MathUtils.lerp(currentLookYaw, desiredYaw, lookAlpha);
      currentLookPitch = THREE.MathUtils.lerp(currentLookPitch, desiredPitch, lookAlpha);

      // Dịch nhẹ đồng tử (`Eye_Pupil.000`) theo góc nhìn
      if (faceOverlays?.pupilSkinnedMesh && faceOverlays?.pupilBaseBindMatrix) {
        faceOverlays.pupilSkinnedMesh.bindMatrix.copy(faceOverlays.pupilBaseBindMatrix);
        faceOverlays.pupilSkinnedMesh.bindMatrix.elements[12] += currentLookYaw * 0.085;
        faceOverlays.pupilSkinnedMesh.bindMatrix.elements[13] -= currentLookPitch * 0.055;
      }

      // 6. ĐIỀU KHIỂN BỘ XƯƠNG RIGIFY (ĐẦU/CỔ SPINE.004..006 & HAI TAY UPPER_ARM/FOREARM)
      const boneSlerpAlpha = Math.min(1, dt * GUIDE_CHARACTER_CONFIG.BONE_LERP_SPEED);
      const applyBoneOffset = (
        bone: THREE.Bone | undefined,
        rx: number,
        ry: number,
        rz: number
      ) => {
        if (!bone) return;
        const rest = restQuats.get(bone);
        if (!rest) return;
        _tmpEuler.set(rx, ry, rz, 'XYZ');
        _tmpTargetQuat.copy(rest).multiply(_tmpQuat.setFromEuler(_tmpEuler));
        bone.quaternion.slerp(_tmpTargetQuat, boneSlerpAlpha);
      };

      // Nhịp thở & gật đầu theo dấu ngắt câu / khi đọc xong
      const breathWave = Math.sin(elapsed * 2.2) * 0.025 * motionScale;
      const clauseNodAge = (now - rt.clauseNodPulse) / 1000;
      const clauseNodOffset =
        isActiveSpeaking && clauseNodAge >= 0 && clauseNodAge < 0.38
          ? Math.sin((clauseNodAge / 0.38) * Math.PI) * 0.11 * motionScale
          : 0;
      const finishNodOffset =
        now < rt.headNodUntil
          ? Math.sin(((rt.headNodUntil - now) / 950) * Math.PI * 2) * 0.12 * motionScale
          : 0;

      // Cúi chào khi chạm đúp (bow gesture)
      const isBowing =
        isGreeting && rt.greetingGesture === 'bow' && now < rt.greetingEndTimestamp;
      const bowAngle = isBowing ? 0.28 * motionScale : 0;

      // Xương thân trên (spine.002, spine.003)
      const stretchOffset =
        currentIdleAction === 'stretch'
          ? Math.sin((elapsed - idleActionStartTime) * 2.5) * 0.08
          : 0;
      applyBoneOffset(
        rigBones.spine002,
        breathWave * 0.5 + bowAngle * 0.45 - stretchOffset,
        currentLookYaw * 0.15,
        0
      );
      applyBoneOffset(
        rigBones.spine003,
        breathWave * 0.6 + bowAngle * 0.45,
        currentLookYaw * 0.2,
        Math.sin(elapsed * 1.5) * 0.018 * motionScale
      );

      // Xương cổ & đầu (spine.004, spine.005, spine.006)
      const speakHeadRhythmX = isActiveSpeaking
        ? Math.sin(elapsed * 5.2) * 0.045 * motionScale + clauseNodOffset
        : 0;
      const speakHeadRhythmZ = isActiveSpeaking
        ? Math.cos(elapsed * 2.8) * 0.038 * motionScale
        : 0;
      const browHeadLiftX = -faceCurrent.browRaise * 0.045 * motionScale;

      const totalPitchX =
        currentLookPitch +
        speakHeadRhythmX +
        finishNodOffset +
        browAngle(bowAngle) +
        browHeadLiftX;

      applyBoneOffset(
        rigBones.spine004,
        totalPitchX * 0.28,
        currentLookYaw * 0.28,
        speakHeadRhythmZ * 0.3
      );
      applyBoneOffset(
        rigBones.spine005,
        totalPitchX * 0.32,
        currentLookYaw * 0.32,
        speakHeadRhythmZ * 0.3
      );
      applyBoneOffset(
        rigBones.spine006,
        totalPitchX * 0.45,
        currentLookYaw * 0.45,
        speakHeadRhythmZ * 0.4
      );

      // Xương hai tay (upper_arm.L/R, forearm.L/R)
      if (isDragged) {
        // Khi bị kéo: hai tay hơi dang nhẹ ngạc nhiên
        applyBoneOffset(rigBones.upperArmL, 0.25, 0, -0.88);
        applyBoneOffset(rigBones.forearmL, 0.55, 0, 0.5);
        applyBoneOffset(rigBones.upperArmR, 0.25, 0, 0.88);
        applyBoneOffset(rigBones.forearmR, 0.55, 0, -0.5);
      } else if (
        (isGreeting && rt.greetingGesture === 'wave') ||
        currentIdleAction === 'wave'
      ) {
        // Vẫy tay chào thân thiện bằng tay phải
        const waveSwing = Math.sin(elapsed * 11.0) * 0.28 * motionScale;
        applyBoneOffset(rigBones.upperArmR, 0.25, -0.25, 0.38);
        applyBoneOffset(rigBones.forearmR, 0.42, 0, -1.38 + waveSwing);

        applyBoneOffset(rigBones.upperArmL, 0.12, 0, -1.16);
        applyBoneOffset(rigBones.forearmL, 0.34, 0, 0.32);
      } else if (isActiveSpeaking) {
        // Khi nói: hai tay ra điệu thuyết minh luân phiên mượt mà
        const leftPhase = Math.max(0, Math.sin(elapsed * 3.2)) * motionScale;
        const rightPhase = Math.max(0, Math.sin(elapsed * 3.2 + Math.PI)) * motionScale;

        applyBoneOffset(
          rigBones.upperArmL,
          0.16 + leftPhase * 0.28,
          leftPhase * 0.16,
          -1.15 + leftPhase * 0.22
        );
        applyBoneOffset(
          rigBones.forearmL,
          0.35 + leftPhase * 0.48,
          0,
          0.34 + leftPhase * 0.38
        );

        applyBoneOffset(
          rigBones.upperArmR,
          0.16 + rightPhase * 0.28,
          -rightPhase * 0.16,
          1.15 - rightPhase * 0.22
        );
        applyBoneOffset(
          rigBones.forearmR,
          0.35 + rightPhase * 0.48,
          0,
          -0.34 - rightPhase * 0.38
        );
      } else {
        // Tư thế đứng nghỉ tự nhiên (kèm vươn vai nhẹ nếu đang stretch)
        const stretchArmZ =
          currentIdleAction === 'stretch'
            ? Math.sin((elapsed - idleActionStartTime) * 2.5) * 0.18
            : 0;
        const breathArmZ = Math.sin(elapsed * 2.2) * 0.02 * motionScale;

        applyBoneOffset(
          rigBones.upperArmL,
          0.12,
          0,
          -1.18 + breathArmZ + stretchArmZ
        );
        applyBoneOffset(rigBones.forearmL, 0.32, 0, 0.32);

        applyBoneOffset(
          rigBones.upperArmR,
          0.12,
          0,
          1.18 - breathArmZ - stretchArmZ
        );
        applyBoneOffset(rigBones.forearmR, 0.32, 0, -0.32);
      }

      // Cập nhật nhân vật hình khối dự phòng (nếu dùng)
      if (proceduralParts) {
        const {
          bodyGroup,
          headGroup,
          rightArmGroup,
          leftArmGroup,
          leftEye,
          rightEye,
          leftBrow,
          rightBrow,
          mouthCavity,
          smileArc,
        } = proceduralParts;

        bodyGroup.position.y = 0.42 + breathWave * 0.5;
        headGroup.rotation.y = currentLookYaw;
        headGroup.rotation.x = totalPitchX;
        leftEye.scale.y = Math.max(0.1, 1 - faceCurrent.blink * 0.9);
        rightEye.scale.y = Math.max(0.1, 1 - faceCurrent.blink * 0.9);
        leftBrow.position.y = 0.075 + faceCurrent.browRaise * 0.015;
        rightBrow.position.y = 0.075 + faceCurrent.browRaise * 0.015;
        mouthCavity.visible = faceCurrent.mouthOpen > 0.04;
        mouthCavity.scale.y = Math.max(0.08, faceCurrent.mouthOpen * 0.9);
        smileArc.scale.y = 0.2 + faceCurrent.smile * 0.8;

        if (isActiveSpeaking || isGreeting) {
          rightArmGroup.rotation.z = -1.8 + Math.sin(elapsed * 8) * 0.3;
          leftArmGroup.rotation.z = 0.35 + Math.cos(elapsed * 4) * 0.15;
        } else {
          rightArmGroup.rotation.z = -0.24;
          leftArmGroup.rotation.z = 0.24;
        }
      }

      renderer.render(scene, camera);
    };

    function browAngle(bow: number): number {
      return bow * 0.4;
    }

    rafId = window.requestAnimationFrame(renderLoop);

    const handleResizeObserver = () => {
      if (!container) return;
      const newW = container.clientWidth || width;
      const newH = container.clientHeight || height;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResizeObserver) : null;
    resizeObserver?.observe(container);

    return () => {
      isDisposed = true;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [isSceneReady, use2DFallback, prefs.isHidden, prefs.isLargeSize, isMobileView]);

  // Kích thước hiển thị của nhân vật
  const baseWidth = isMobileView
    ? GUIDE_CHARACTER_CONFIG.MOBILE_WIDTH_PX
    : GUIDE_CHARACTER_CONFIG.DESKTOP_WIDTH_PX;
  const charWidth = Math.round(
    baseWidth * (prefs.isLargeSize ? GUIDE_CHARACTER_CONFIG.LARGE_SCALE_MULTIPLIER : 1)
  );
  const charHeight = Math.round(charWidth * GUIDE_CHARACTER_CONFIG.ASPECT_RATIO);

  // Tính toán tọa độ (x, y) trong khung nhìn, tự động dịch lên khi Bottom Sheet của bản đồ mở
  const computeClampedPosition = useCallback(() => {
    if (typeof window === 'undefined') {
      return { x: 240, y: 520 };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = GUIDE_CHARACTER_CONFIG.EDGE_MARGIN_PX;

    const defaultBottomMargin = isMobileView
      ? GUIDE_CHARACTER_CONFIG.DEFAULT_BOTTOM_MOBILE_PX
      : GUIDE_CHARACTER_CONFIG.DEFAULT_BOTTOM_DESKTOP_PX;

    let sheetOffsetPx = 0;
    if (mapSheetState.sheetState === 'half') {
      sheetOffsetPx = Math.round((vh * Math.min(mapSheetState.sheetHeightVh || 46, 52)) / 100) + 8;
    } else if (mapSheetState.sheetState === 'full') {
      sheetOffsetPx = Math.round(vh * 0.58);
    }

    const minY = 82;
    const maxY = Math.max(minY, vh - charHeight - Math.max(defaultBottomMargin, sheetOffsetPx));

    if (dragPos) {
      return {
        x: Math.max(margin, Math.min(vw - charWidth - margin, dragPos.x)),
        y: Math.max(minY, Math.min(vh - charHeight - 16, dragPos.y)),
      };
    }

    const targetX = prefs.dockSide === 'left' ? margin : Math.max(margin, vw - charWidth - margin);
    const desiredY = Math.round(prefs.yRatio * vh);
    const targetY = Math.max(minY, Math.min(maxY, desiredY));

    return { x: targetX, y: targetY };
  }, [charWidth, charHeight, dragPos, isMobileView, mapSheetState, prefs.dockSide, prefs.yRatio]);

  const currentPos = computeClampedPosition();

  // Cập nhật tâm màn hình của nhân vật để tính góc nhìn theo con trỏ
  useEffect(() => {
    runtimeRef.current.charScreenCenterX = currentPos.x + charWidth / 2;
    runtimeRef.current.charScreenCenterY = currentPos.y + charHeight * 0.35;
  }, [currentPos.x, currentPos.y, charWidth, charHeight]);

  // Kích hoạt câu chào khi chạm 1 lần hoặc chạm đúp
  const triggerCharacterGreeting = useCallback(
    (isDoubleTap: boolean) => {
      const now = performance.now();
      runtimeRef.current.greetingGesture = isDoubleTap ? 'bow' : 'wave';
      runtimeRef.current.greetingEndTimestamp = now + 2600;
      runtimeRef.current.warmSmileUntil = now + 3200;

      // Nếu đang đọc dở bài thuyết minh tỉnh/di sản thì chỉ vẫy tay/cúi chào và mở menu, không ngắt lời thuyết minh
      if (characterState === 'speaking' && !isPaused) {
        return;
      }

      const pool = isDoubleTap ? DOUBLE_TAP_GREETINGS : GREETING_MESSAGES;
      const randomGreeting = pool[Math.floor(Math.random() * pool.length)];

      startNarrationWithReaction(
        {
          id: isDoubleTap ? 'greeting-double-tap' : 'greeting-single-tap',
          title: isDoubleTap ? 'Cúi Chào Quý Khách' : 'Hướng Dẫn Viên Hồn Đất Việt',
          introText: randomGreeting,
          targetType: 'greeting',
        },
        true
      );
    },
    [characterState, isPaused, startNarrationWithReaction]
  );

  // Xử lý kéo thả & Chạm đơn / Chạm đúp bằng Pointer Events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();

    guideVoiceService.unlockAudioOnUserGesture();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    pointerDownInfoRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: currentPos.x,
      originY: currentPos.y,
      hasMovedBeyondThreshold: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const info = pointerDownInfoRef.current;
    if (!info || info.pointerId !== e.pointerId) return;

    const dx = e.clientX - info.startX;
    const dy = e.clientY - info.startY;
    const dist = Math.hypot(dx, dy);

    if (!info.hasMovedBeyondThreshold && dist >= GUIDE_CHARACTER_CONFIG.DRAG_THRESHOLD_PX) {
      info.hasMovedBeyondThreshold = true;
      setIsDragging(true);
      runtimeRef.current.mode = 'dragged';
      setIsControlMenuOpen(false);
    }

    if (info.hasMovedBeyondThreshold) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = GUIDE_CHARACTER_CONFIG.EDGE_MARGIN_PX;
      const nextX = Math.max(margin, Math.min(vw - charWidth - margin, info.originX + dx));
      const nextY = Math.max(64, Math.min(vh - charHeight - 16, info.originY + dy));
      setDragPos({ x: nextX, y: nextY });
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const info = pointerDownInfoRef.current;
    if (!info || info.pointerId !== e.pointerId) return;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    pointerDownInfoRef.current = null;

    // Nếu là thao tác Chạm (Tap) chứ không phải kéo: phân biệt chạm đơn vs chạm đúp (<= 320ms)
    if (!info.hasMovedBeyondThreshold) {
      setIsDragging(false);
      setDragPos(null);

      const now = performance.now();
      const isDoubleTap = now - lastTapTimestampRef.current < 320;
      lastTapTimestampRef.current = isDoubleTap ? 0 : now;

      if (isDoubleTap) {
        setIsControlMenuOpen(false);
        triggerCharacterGreeting(true);
      } else {
        setIsControlMenuOpen((prev) => {
          const nextOpen = !prev;
          if (nextOpen) {
            triggerCharacterGreeting(false);
          }
          return nextOpen;
        });
      }
      return;
    }

    // Khi thả tay sau khi kéo: nhân vật cười tươi và tự hít vào cạnh trái/phải gần nhất
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const finalX = dragPos ? dragPos.x : info.originX;
    const finalY = dragPos ? dragPos.y : info.originY;
    const centerCharX = finalX + charWidth / 2;
    const snappedSide: 'left' | 'right' = centerCharX < vw / 2 ? 'left' : 'right';
    const nextYRatio = Math.max(0.12, Math.min(0.88, finalY / Math.max(1, vh)));

    runtimeRef.current.warmSmileUntil = performance.now() + 2200;
    runtimeRef.current.headNodUntil = performance.now() + 700;

    setIsDragging(false);
    setDragPos(null);
    updatePrefs((prev) => ({
      ...prev,
      dockSide: snappedSide,
      yRatio: nextYRatio,
    }));
  };

  const handleTogglePauseResume = () => {
    if (characterState !== 'speaking' && characterState !== 'greeting') {
      const textToRead =
        activeNarration?.introText ||
        GREETING_MESSAGES[0];
      const titleToRead = activeNarration?.title || 'Hướng Dẫn Viên Hồn Đất Việt';

      startNarrationWithReaction(
        {
          id: activeNarration?.id || 'welcome',
          title: titleToRead,
          introText: textToRead,
          targetType: activeNarration?.targetType || 'province',
          provinceName: activeNarration?.provinceName,
          heritageId: activeNarration?.heritageId,
        },
        true
      );
      return;
    }

    if (isPaused) {
      guideVoiceService.resume();
      setIsPaused(false);
    } else {
      guideVoiceService.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    guideVoiceService.stop();
    runtimeRef.current.speechVowelOpenness = 0;
    setCharacterState('idle');
    setIsPaused(false);
    setShowSubtitle(false);
  };

  const handleToggleMute = () => {
    updatePrefs((prev) => ({ ...prev, muted: !prev.muted }));
  };

  const handleSelectRate = (newRate: GuideSpeechRate) => {
    updatePrefs((prev) => ({ ...prev, rate: newRate }));
  };

  const handleToggleSize = () => {
    updatePrefs((prev) => ({ ...prev, isLargeSize: !prev.isLargeSize }));
  };

  const handleHideCharacter = () => {
    handleStopSpeech();
    setIsControlMenuOpen(false);
    updatePrefs((prev) => ({ ...prev, isHidden: true }));
  };

  const handleRestoreCharacter = () => {
    updatePrefs((prev) => ({ ...prev, isHidden: false }));
  };

  // Tạo danh sách các Chip gợi ý sau khi đọc xong ("Nghe lại", "Nghe tiếp", "Tỉnh lân cận", "Món ăn nổi tiếng")
  const followUpChips = React.useMemo<FollowUpChip[]>(() => {
    if (!activeNarration) return [];
    const chips: FollowUpChip[] = [];

    // 1. Nút "Nghe lại" (luôn có)
    chips.push({
      id: 'replay',
      label: 'Nghe lại',
      icon: 'replay',
      onClick: () => {
        startNarrationWithReaction(activeNarration, true);
      },
    });

    const allHeritages = storageService.getHeritages();
    const currentProv = activeNarration.provinceName;

    // 2. "Nghe tiếp" (một di sản tiêu biểu trong cùng tỉnh/thành)
    if (currentProv) {
      const sameProvHeritages = allHeritages.filter(
        (h) =>
          h.id !== activeNarration.heritageId &&
          h.province.toLowerCase().includes(currentProv.toLowerCase())
      );
      if (sameProvHeritages.length > 0) {
        const nextH =
          sameProvHeritages[Math.floor(Math.random() * sameProvHeritages.length)];
        chips.push({
          id: `next-${nextH.id}`,
          label: 'Nghe tiếp',
          icon: 'next',
          onClick: () => {
            triggerGuideNarration({
              id: `heritage-${nextH.id}`,
              title: nextH.name,
              subtitleBadge: nextH.province,
              introText: getHeritageIntroText(nextH),
              targetType: 'heritage',
              provinceName: nextH.province,
              heritageId: nextH.id,
            });
          },
        });
      }

      // 3. "Tỉnh lân cận" (tìm tỉnh/thành gần nhất theo tọa độ địa lý trong 34 tỉnh/thành)
      const currentUnit = VIETNAM_34_ADMINISTRATIVE_UNITS.find(
        (u) => u.shortName.toLowerCase() === currentProv.toLowerCase()
      );
      if (currentUnit) {
        let nearestUnit = VIETNAM_34_ADMINISTRATIVE_UNITS[0];
        let minDist = Infinity;
        for (const u of VIETNAM_34_ADMINISTRATIVE_UNITS) {
          if (u.code === currentUnit.code) continue;
          const d = Math.hypot(
            u.center[0] - currentUnit.center[0],
            u.center[1] - currentUnit.center[1]
          );
          if (d < minDist) {
            minDist = d;
            nearestUnit = u;
          }
        }
        if (nearestUnit) {
          chips.push({
            id: `neighbor-${nearestUnit.code}`,
            label: `Tỉnh lân cận (${nearestUnit.shortName})`,
            icon: 'neighbor',
            onClick: () => {
              triggerGuideNarration({
                id: `province-${nearestUnit.shortName}`,
                title: nearestUnit.name,
                introText: getProvinceIntroText(
                  nearestUnit.shortName,
                  nearestUnit.historicalNotes
                ),
                targetType: 'province',
                provinceName: nearestUnit.shortName,
              });
            },
          });
        }
      }

      // 4. "Món ăn nổi tiếng" (nếu có di sản ẩm thực hoặc giới thiệu đặc sản địa phương)
      const culinaryItem = allHeritages.find(
        (h) =>
          h.category === 'culinary' &&
          h.province.toLowerCase().includes(currentProv.toLowerCase())
      );
      if (culinaryItem && culinaryItem.id !== activeNarration.heritageId) {
        chips.push({
          id: `food-${culinaryItem.id}`,
          label: 'Món ăn nổi tiếng',
          icon: 'food',
          onClick: () => {
            triggerGuideNarration({
              id: `heritage-${culinaryItem.id}`,
              title: culinaryItem.name,
              subtitleBadge: culinaryItem.province,
              introText: getHeritageIntroText(culinaryItem),
              targetType: 'heritage',
              provinceName: culinaryItem.province,
              heritageId: culinaryItem.id,
            });
          },
        });
      }
    }

    return chips.slice(0, 3);
  }, [activeNarration, startNarrationWithReaction]);

  if (isPeekingBackground) return null;

  // Khi nhân vật đang ở trạng thái ẨN: hiển thị nút nhỏ 44x44px ở mép màn hình để mở lại
  if (prefs.isHidden) {
    return (
      <div
        className={`fixed z-[80] pointer-events-none ${
          prefs.dockSide === 'left' ? 'left-0' : 'right-0'
        }`}
        style={{
          bottom: isMobileView
            ? 'calc(env(safe-area-inset-bottom, 0px) + 84px)'
            : '28px',
        }}
      >
        <button
          type="button"
          onClick={handleRestoreCharacter}
          aria-label="Hiện lại nhân vật hướng dẫn viên 3D"
          className={`pointer-events-auto min-w-[44px] min-h-[44px] px-3 py-2.5 bg-stone-950/95 hover:bg-amber-950/90 text-amber-300 border border-amber-400/60 shadow-[0_0_18px_rgba(245,158,11,0.3)] flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95 cursor-pointer ${
            prefs.dockSide === 'left'
              ? 'rounded-r-2xl border-l-0'
              : 'rounded-l-2xl border-r-0'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">HDV 3D</span>
        </button>
      </div>
    );
  }

  const fullSubtitleText = activeNarration?.introText || '';
  const safeRevealIdx = isNarrationFinished
    ? fullSubtitleText.length
    : Math.max(28, Math.min(fullSubtitleText.length, revealedCharCount + 18));
  const visibleSubtitleText = fullSubtitleText.slice(0, safeRevealIdx);
  const isDockedLeft = prefs.dockSide === 'left';
  const isActivelySpeaking =
    (characterState === 'speaking' || characterState === 'greeting') && !isPaused;

  return (
    <div
      className="fixed inset-0 z-[80] pointer-events-none overflow-hidden select-none"
      aria-live="polite"
    >
      <div
        style={{
          transform: `translate3d(${currentPos.x}px, ${currentPos.y}px, 0)`,
          width: `${charWidth}px`,
          height: `${charHeight}px`,
          transition:
            isDragging || prefersReducedMotion
              ? 'none'
              : 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="absolute top-0 left-0 pointer-events-none"
      >
        {/* 1. BONG BÓNG PHỤ ĐỀ THUYẾT MINH & CHIP GỢI Ý SAU KHI ĐỌC XONG */}
        {showSubtitle && activeNarration && (
          <div
            role="status"
            style={{
              width: isMobileView ? 'min(242px, calc(100vw - 114px))' : '304px',
            }}
            className={`pointer-events-auto absolute bottom-1 ${
              isDockedLeft ? 'left-full ml-2' : 'right-full mr-2'
            } bg-[#081528]/95 border border-amber-400/60 rounded-2xl p-3 shadow-[0_10px_32px_rgba(0,0,0,0.85)] text-stone-100 animate-fadeIn`}
          >
            <div className="flex items-center justify-between gap-1.5 mb-1 border-b border-amber-500/25 pb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-amber-300 truncate">
                  {activeNarration.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSubtitle(false)}
                aria-label="Đóng bong bóng phụ đề"
                className="min-w-[28px] min-h-[28px] -mr-1 -mt-1 flex items-center justify-center rounded-lg text-stone-400 hover:text-amber-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[14px] leading-snug text-amber-50 font-normal max-h-32 overflow-y-auto pr-1">
              {visibleSubtitleText}
              {safeRevealIdx < fullSubtitleText.length && (
                <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-0.5 align-middle" />
              )}
            </p>

            {/* Hàng Chip gợi ý tương tác hiện ra khi đọc xong */}
            {isNarrationFinished && followUpChips.length > 0 && (
              <div className="mt-2 pt-2 border-t border-amber-500/25 flex flex-wrap gap-1.5">
                {followUpChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={chip.onClick}
                    className="min-h-[32px] px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 active:scale-95 border border-amber-400/50 text-amber-200 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {chip.icon === 'replay' && <RotateCcw className="w-3 h-3 text-amber-300" />}
                    {chip.icon === 'next' && <ChevronRight className="w-3 h-3 text-amber-300" />}
                    {chip.icon === 'neighbor' && <Compass className="w-3 h-3 text-amber-300" />}
                    {chip.icon === 'food' && <Utensils className="w-3 h-3 text-amber-300" />}
                    <span className="whitespace-nowrap">{chip.label}</span>
                  </button>
                ))}
              </div>
            )}

            {voiceNotice && (
              <p className="mt-1.5 pt-1 border-t border-amber-500/20 text-[11px] text-amber-300/90">
                {voiceNotice}
              </p>
            )}
          </div>
        )}

        {/* 2. MENU ĐIỀU KHIỂN NHỎ GỌN KHI CHẠM VÀO NHÂN VẬT (Mọi nút bấm >= 44x44px) */}
        {isControlMenuOpen && (
          <div
            role="dialog"
            aria-label="Bảng điều khiển hướng dẫn viên 3D"
            className={`pointer-events-auto absolute bottom-full mb-2 ${
              isDockedLeft ? 'left-0' : 'right-0'
            } w-60 sm:w-64 bg-[#081528]/95 border border-amber-400/60 rounded-2xl p-3 shadow-[0_12px_36px_rgba(0,0,0,0.9)] text-stone-100 space-y-2.5 animate-fadeIn`}
          >
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-serif font-bold text-amber-200">
                  Hướng Dẫn Viên 3D
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsControlMenuOpen(false)}
                aria-label="Đóng menu điều khiển"
                className="min-w-[44px] min-h-[44px] -my-2 -mr-2 flex items-center justify-center rounded-xl text-stone-300 hover:text-amber-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hàng 1: Tạm dừng/Tiếp tục, Dừng, Bật/Tắt tiếng */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={handleTogglePauseResume}
                aria-label={
                  isActivelySpeaking
                    ? 'Tạm dừng thuyết minh'
                    : 'Tiếp tục hoặc phát thuyết minh'
                }
                className="min-h-[44px] rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold active:scale-95 transition-all cursor-pointer"
              >
                {isActivelySpeaking ? (
                  <>
                    <Pause className="w-4 h-4 text-amber-300" />
                    <span>Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-amber-300" />
                    <span>{isPaused ? 'Tiếp tục' : 'Đọc'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleStopSpeech}
                aria-label="Dừng đọc thuyết minh"
                className="min-h-[44px] rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-200 flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold active:scale-95 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 text-red-400" />
                <span>Dừng</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={prefs.muted ? 'Bật tiếng thuyết minh' : 'Tắt tiếng thuyết minh'}
                className={`min-h-[44px] rounded-xl border flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold active:scale-95 transition-all cursor-pointer ${
                  prefs.muted
                    ? 'bg-red-950/60 border-red-500/50 text-red-200'
                    : 'bg-stone-900/90 hover:bg-stone-800 border-stone-700 text-stone-200'
                }`}
              >
                {prefs.muted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-red-400" />
                    <span>Đã tắt</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Bật tiếng</span>
                  </>
                )}
              </button>
            </div>

            {/* Hàng 2: Tốc độ đọc (0.8x, 1x, 1.2x) */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 font-medium block">
                Tốc độ giọng đọc:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {([0.8, 1, 1.2] as GuideSpeechRate[]).map((r) => {
                  const active = prefs.rate === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleSelectRate(r)}
                      aria-label={`Tốc độ đọc ${r}x`}
                      className={`min-h-[44px] rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        active
                          ? 'bg-amber-500 text-stone-950 border-amber-300 shadow'
                          : 'bg-stone-900/90 hover:bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      {r}x
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hàng 3: Thu nhỏ/Phóng to nhân vật & Ẩn nhân vật */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-amber-500/20">
              <button
                type="button"
                onClick={handleToggleSize}
                aria-label={prefs.isLargeSize ? 'Thu nhỏ nhân vật 3D' : 'Phóng to nhân vật 3D'}
                className="min-h-[44px] px-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-200 flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
              >
                {prefs.isLargeSize ? (
                  <>
                    <Minimize2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Thu nhỏ</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Phóng to</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleHideCharacter}
                aria-label="Ẩn nhân vật hướng dẫn viên 3D"
                className="min-h-[44px] px-2.5 rounded-xl bg-stone-900/90 hover:bg-red-950/60 border border-stone-700 hover:border-red-500/40 text-stone-300 hover:text-red-200 flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
              >
                <EyeOff className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Ẩn nhân vật</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. VÙNG CHẠM & CANVAS NHÂN VẬT 3D NỀN TRONG SUỐT THỰC SỰ */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Nhân vật hướng dẫn viên 3D Hồn Đất Việt. Chạm một lần để mở menu và chào, chạm đúp để cúi chào, kéo để di chuyển."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsControlMenuOpen((prev) => !prev);
              triggerCharacterGreeting(false);
            }
          }}
          style={{
            touchAction: 'none',
            filter: isActivelySpeaking
              ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.72))'
              : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 4px rgba(245, 158, 11, 0.38))',
          }}
          className="pointer-events-auto relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing bg-transparent"
        >
          {/* Hiển thị Fallback 2D (vẫn đổi biểu cảm cười, ngạc nhiên khi kéo, mở miệng khi nói) nếu thiết bị không có WebGL */}
          {!isSceneReady || use2DFallback ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-1 pointer-events-none">
              <svg
                viewBox="0 0 120 140"
                className={`w-full h-full ${
                  isActivelySpeaking && !prefersReducedMotion ? 'animate-bounce' : ''
                }`}
              >
                <polygon
                  points="60,12 18,46 102,46"
                  fill="#fef08a"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
                <circle cx="60" cy="60" r="18" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
                {/* Lông mày 2D nhướn khi kéo hoặc chào */}
                <path
                  d={
                    isDragging || characterState === 'reacting'
                      ? 'M 48 51 Q 53 47 57 51 M 63 51 Q 67 47 72 51'
                      : 'M 49 53 Q 53 51 57 53 M 63 53 Q 67 51 71 53'
                  }
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="53" cy="58" r="2.3" fill="#0f172a" />
                <circle cx="67" cy="58" r="2.3" fill="#0f172a" />
                {/* Miệng 2D: tròn ngạc nhiên khi kéo, mở khi nói, cong cười khi rảnh/chào */}
                {isDragging ? (
                  <ellipse cx="60" cy="68" rx="3.5" ry="4.5" fill="#7f1d1d" />
                ) : isActivelySpeaking ? (
                  <path
                    d="M 53 66 Q 60 75 67 66 Z"
                    fill="#991b1b"
                    stroke="#dc2626"
                    strokeWidth="1.5"
                  />
                ) : (
                  <path
                    d="M 52 66 Q 60 73 68 66"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                )}
                <path
                  d="M 40 80 L 80 80 L 88 126 L 32 126 Z"
                  fill="#b91c1c"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
                <circle cx="60" cy="96" r="5" fill="#fbbf24" />
              </svg>
            </div>
          ) : (
            <div ref={canvasContainerRef} className="w-full h-full pointer-events-none" />
          )}

          {/* Nhãn gọn dưới chân nhân vật */}
          <div className="pointer-events-none absolute -bottom-1 inset-x-0 flex items-center justify-center">
            <span className="px-2 py-0.5 rounded-full bg-[#081528]/95 border border-amber-400/70 text-[10px] font-bold text-amber-300 whitespace-nowrap shadow-md">
              {isDragging
                ? '😮 Đang kéo'
                : isActivelySpeaking
                ? '🔊 Đang đọc'
                : characterState === 'reacting'
                ? '😊 Khám phá'
                : 'HDV 3D'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
