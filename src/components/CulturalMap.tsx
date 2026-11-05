import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  MapPin,
  Search,
  Globe,
  Volume2,
  Utensils,
  Clock,
  Ticket,
  LocateFixed,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Info,
  ListFilter,
  Edit3,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { HeritageItem, UserProfile, UserLocation } from '../types';
import { storageService } from '../services/storageService';
import { handleImageError, getSafeHeritageImageUrl } from '../utils/imageUtils';
import { geolocationService, calculateDistanceKm } from '../services/geolocationService';
import {
  VIETNAM_34_ADMINISTRATIVE_UNITS,
  AdministrativeUnit,
  getCurrentAdministrativeUnitByName
} from '../data/administrativeUnits';
import { languageService } from '../services/languageService';
import { HeritageEditModal } from './HeritageEditModal';
import { getProvinceIntroText, getHeritageIntroText } from '../data/guideIntroData';
import {
  triggerGuideNarration,
  notifyMapSheetState,
  notifyMapInteractionActive
} from '../services/guideVoiceService';

/**
 * ============================================================================
 * CẤU HÌNH THAM SỐ BẢN ĐỒ DI SẢN (CÓ THỂ TINH CHỈNH DỄ DÀNG)
 * ============================================================================
 */
export const MAP_TUNABLE_PARAMS = {
  // 1. Ngưỡng Zoom theo từng cấp độ chi tiết (Level of Detail - LOD)
  ZOOM_INITIAL_MOBILE: 5.5,
  ZOOM_INITIAL_DESKTOP: 6.0,
  ZOOM_MIN: 5.0,
  ZOOM_MAX: 18.0,
  ZOOM_CLUSTER_MAX: 7.3,      // Dưới mức này: gom cụm (cluster) vùng dày đặc (ĐB Bắc Bộ, TP.HCM & lân cận)
  ZOOM_LOD_MEDIUM: 6.8,       // Từ 6.8 đến < 8.2: hiện tên rút gọn cho tỉnh nhiều di sản (nếu không va chạm)
  ZOOM_LOD_FULL: 8.2,         // Từ 8.2 trở lên: hiện tên đầy đủ của tỉnh + tách điểm di sản chi tiết
  ZOOM_INDIVIDUAL_PINS: 8.4,  // Mức zoom bắt đầu hiển thị từng ghim di sản riêng lẻ trên toàn vùng

  // 2. Kích thước Chấm Tròn & Vùng Chạm (px)
  DOT_SIZE_DEFAULT: 22,       // Chấm tròn mặc định (20-24px) chứa số lượng di sản
  DOT_SIZE_SELECTED: 28,      // Chấm tròn khi tỉnh đang được chọn
  CLUSTER_SIZE_PX: 28,        // Chấm tròn cụm (cluster) vùng dày đặc
  TOUCH_TARGET_MIN_PX: 44,    // Vùng chạm thực tế tối thiểu chuẩn WCAG / Mobile UX (44x44px)
  CLUSTER_DISTANCE_PX: 42,    // Khoảng cách màn hình (px) để tự động gom cụm các tỉnh gần nhau
  COLLISION_PADDING_PX: 6,    // Khoảng đệm an toàn giữa các hộp bao nhãn (px)

  // 3. Màu Sắc Đất Liền, Biển & Đường Viền ( Phong cách Tối - Vàng Hoàng Gia )
  OCEAN_COLOR: '#07142b',
  OCEAN_GRADIENT: 'radial-gradient(ellipse at 65% 45%, #0d2347 0%, #07142b 70%, #040c1a 100%)',
  LAND_COLOR_DEFAULT: '#1d2f4f',
  LAND_COLOR_HOVER: '#27416b',
  LAND_COLOR_SELECTED: '#2e4d7d',
  LAND_OPACITY_DEFAULT: 0.92,
  LAND_OPACITY_DIMMED: 0.42,  // Độ mờ của các tỉnh khác khi đang có 1 tỉnh được chọn
  LAND_OPACITY_SELECTED: 0.98,
  PROVINCE_BORDER_COLOR: '#f59e0b',
  PROVINCE_BORDER_WEIGHT: 0.8,
  PROVINCE_BORDER_OPACITY: 0.5, // Viền ranh giới tỉnh vàng mảnh ~50%
  NATIONAL_BORDER_COLOR: '#fbbf24',
  NATIONAL_BORDER_WEIGHT: 2.2,  // Viền quốc gia đậm hơn để nổi bật hình chữ S
  NATIONAL_BORDER_OPACITY: 0.78,
  SELECTED_BORDER_COLOR: '#fde047',
  SELECTED_BORDER_WEIGHT: 2.5,

  // 4. Chiều Cao Bottom Sheet 3 Trạng Thái trên Mobile
  SHEET_COLLAPSED_PX: 76,     // Thu nhỏ: chỉ tay nắm + tên tỉnh/vùng đang chọn (px)
  SHEET_HALF_DVH: 48,         // Nửa màn hình: danh sách di sản của tỉnh (% dvh)
  SHEET_FULL_DVH: 86,         // Toàn màn hình: chi tiết di sản (% dvh)

  // 5. Hiệu năng & Debounce
  VIEWPORT_DEBOUNCE_MS: 80,   // Thời gian debounce khi kéo/zoom bản đồ (ms)
};

export type MapBaseMode = 'vietnam_only' | 'satellite' | 'topo' | 'streets';
export type BoxSideMode = 'right' | 'left';
export type BoxPositionMode = BoxSideMode;
export type MapColorTheme = 'multi' | 'imperial' | 'jade' | 'vintage' | 'night' | 'ocean';
export type BottomSheetState = 'collapsed' | 'half' | 'full';
export type RegionFilterType = 'all' | 'north' | 'central' | 'south' | 'islands';

interface CulturalMapProps {
  currentUser?: UserProfile;
  language?: string;
  embedded?: boolean;
  onNavigateToStory: (heritageName: string, history?: string, period?: string) => void;
  onNavigateToFood: (heritageId: string) => void;
  onSelectHeritage?: (heritage: HeritageItem) => void;
}

interface ProvinceProperties {
  Name?: string;
  vietnameseName?: string;
  name?: string;
  NAME_1?: string;
  TinhThanh?: string;
  tinh_thanh?: string;
  Ten_Tinh?: string;
  TEN_TINH?: string;
  TenTinh?: string;
  tenTinh?: string;
  ten_tinh?: string;
  province?: string;
  Province?: string;
  province_name?: string;
  PROV_NAME?: string;
  name_vi?: string;
  isIsland?: boolean;
  Note?: string | null;
  center?: [number, number];
  [key: string]: unknown;
}

const LOCAL_BOUNDARIES_URL = '/data/vietnam-provinces.geojson';
const REMOTE_BOUNDARIES_URL =
  'https://raw.githubusercontent.com/nguyenduy1133/Free-GIS-Data/main/Vietnam%20Administrative%20Divisions%20(Post-2025)%20-%20%C4%90%C6%A1n%20v%E1%BB%8B%20h%C3%A0nh%20ch%C3%ADnh%20Vi%E1%BB%87t%20Nam%20(T%E1%BB%AB%202025)/Provinces.geojson';

const CURRENT_PROVINCE_ALIASES: Record<string, string[]> = {
  'Tuyên Quang': ['Tuyên Quang', 'Hà Giang'],
  'Lào Cai': ['Lào Cai', 'Yên Bái'],
  'Thái Nguyên': ['Thái Nguyên', 'Bắc Kạn'],
  'Phú Thọ': ['Phú Thọ', 'Vĩnh Phúc', 'Hòa Bình'],
  'Bắc Ninh': ['Bắc Ninh', 'Bắc Giang'],
  'Hải Phòng': ['Hải Phòng', 'Hải Dương'],
  'Hưng Yên': ['Hưng Yên', 'Thái Bình'],
  'Ninh Bình': ['Ninh Bình', 'Hà Nam', 'Nam Định'],
  'Quảng Trị': ['Quảng Trị', 'Quảng Bình'],
  'Huế': ['Huế', 'Thừa Thiên Huế'],
  'Đà Nẵng': ['Đà Nẵng', 'Quảng Nam'],
  'Quảng Ngãi': ['Quảng Ngãi', 'Kon Tum'],
  'Gia Lai': ['Gia Lai', 'Bình Định'],
  'Khánh Hòa': ['Khánh Hòa', 'Ninh Thuận'],
  'Đắk Lắk': ['Đắk Lắk', 'Phú Yên'],
  'Lâm Đồng': ['Lâm Đồng', 'Đắk Nông', 'Bình Thuận'],
  'Đồng Nai': ['Đồng Nai', 'Bình Phước'],
  'Hồ Chí Minh': ['Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Thành phố Hồ Chí Minh', 'Bình Dương', 'Bà Rịa - Vũng Tàu'],
  'Tây Ninh': ['Tây Ninh', 'Long An'],
  'Đồng Tháp': ['Đồng Tháp', 'Tiền Giang'],
  'Vĩnh Long': ['Vĩnh Long', 'Bến Tre', 'Trà Vinh'],
  'An Giang': ['An Giang', 'Kiên Giang'],
  'Cần Thơ': ['Cần Thơ', 'Hậu Giang', 'Sóc Trăng'],
  'Cà Mau': ['Cà Mau', 'Bạc Liêu']
};

const ISLAND_KEYWORDS = [
  'hoàng sa',
  'trường sa',
  'phú quốc',
  'côn đảo',
  'lý sơn',
  'cát bà',
  'hạ long',
  'cô tô',
  'vân đồn',
  'bạch long vĩ',
  'cồn cỏ',
  'phú quý',
  'cù lao chàm',
  'hòn khoai',
  'nam du',
  'hòn mun',
  'bình ba',
  'đảo',
  'biển',
  'vịnh'
];

const ISLAND_PROVINCES = new Set([
  'Quảng Ninh',
  'Hải Phòng',
  'Quảng Trị',
  'Đà Nẵng',
  'Quảng Ngãi',
  'Khánh Hòa',
  'Lâm Đồng',
  'Hồ Chí Minh',
  'An Giang',
  'Cà Mau'
]);

const normalizeProvinceName = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .replace(/^(tỉnh|thành phố|tp\.|province|city)\s+/i, '')
    .toLocaleLowerCase('vi');

const getGeoJSONProvinceName = (properties: ProvinceProperties): string => {
  const raw =
    properties.TinhThanh ||
    properties.tinh_thanh ||
    properties.vietnameseName ||
    properties.Name ||
    properties.name ||
    properties.Ten_Tinh ||
    properties.TEN_TINH ||
    properties.TenTinh ||
    properties.tenTinh ||
    properties.ten_tinh ||
    properties.province_name ||
    properties.PROV_NAME ||
    properties.name_vi ||
    properties.province ||
    properties.Province ||
    properties.NAME_1;
  const name = String(raw || '').trim();
  const cleanName = name.replace(/\([^)]*\)/g, '').trim();
  return cleanName.replace(/^(tỉnh|thành phố|tp\.)\s+/i, '').trim();
};

export const provinceNameMatches = (heritageProvince: string, selectedProvince: string): boolean => {
  const heritage = normalizeProvinceName(heritageProvince);
  const requested = normalizeProvinceName(selectedProvince);
  if (!heritage || !requested) return false;
  if (heritage === requested) return true;

  // Handle Hoàng Sa & Trường Sa special selections
  if (requested.includes('hoàng sa')) {
    return heritage.includes('đà nẵng') || heritage.includes('hoàng sa');
  }
  if (requested.includes('trường sa')) {
    return heritage.includes('khánh hòa') || heritage.includes('trường sa');
  }

  const selected =
    Object.keys(CURRENT_PROVINCE_ALIASES).find(name => normalizeProvinceName(name) === requested) ||
    selectedProvince;
  const aliases = CURRENT_PROVINCE_ALIASES[selected] || [selected];
  return aliases.some(alias => {
    const normalizedAlias = normalizeProvinceName(alias);
    return (
      normalizedAlias !== '' &&
      (heritage === normalizedAlias ||
        heritage.includes(normalizedAlias) ||
        normalizedAlias.includes(heritage))
    );
  });
};

const isIslandRelatedHeritage = (item: HeritageItem): boolean => {
  if (item.category === 'island_beach') return true;
  const text = [
    item.name,
    item.province,
    item.address,
    item.culturalSignificance,
    ...(item.tags || [])
  ]
    .join(' ')
    .toLowerCase();
  return ISLAND_KEYWORDS.some(kw => text.includes(kw));
};

const getCategoryEmoji = (category?: string): string => {
  switch (category) {
    case 'palace':
    case 'citadel':
      return '🏰';
    case 'temple':
      return '⛩️';
    case 'craft_village':
    case 'ancient_house':
      return '🏺';
    case 'scenic_landscape':
    case 'ecotourism':
    case 'island_beach':
      return '🏞️';
    case 'culinary':
      return '🍜';
    case 'costume':
      return '👘';
    case 'instrument':
    case 'folk_art':
      return '🎶';
    case 'museum':
    case 'artifact':
      return '🪷';
    default:
      return '🏛️';
  }
};

interface PositionedHeritage extends HeritageItem {
  displayLat: number;
  displayLng: number;
}

const computePositionedHeritages = (items: HeritageItem[]): PositionedHeritage[] => {
  const grid: Record<string, HeritageItem[]> = {};
  items.forEach(item => {
    if (!item.lat || !item.lng) return;
    const key = `${Math.round(item.lat * 250)}_${Math.round(item.lng * 250)}`;
    if (!grid[key]) grid[key] = [];
    grid[key].push(item);
  });

  const result: PositionedHeritage[] = [];
  Object.values(grid).forEach(group => {
    if (group.length === 1) {
      result.push({
        ...group[0],
        displayLat: group[0].lat,
        displayLng: group[0].lng
      });
    } else {
      const radius = 0.004;
      group.forEach((item, index) => {
        const angle = (index * 2 * Math.PI) / group.length - Math.PI / 2;
        result.push({
          ...item,
          displayLat: item.lat + radius * Math.cos(angle),
          displayLng: item.lng + radius * 1.15 * Math.sin(angle)
        });
      });
    }
  });
  return result;
};

// Bounds for regions
const REGION_BOUNDS: Record<RegionFilterType, L.LatLngBoundsExpression> = {
  all: [
    [8.2, 102.1],
    [23.4, 114.6]
  ],
  north: [
    [19.8, 102.1],
    [23.4, 108.1]
  ],
  central: [
    [10.8, 105.2],
    [19.9, 112.5]
  ],
  south: [
    [8.3, 104.2],
    [12.3, 107.7]
  ],
  islands: [
    [8.3, 103.8],
    [21.4, 115.2]
  ]
};

const VIETNAM_MAX_BOUNDS: L.LatLngBoundsExpression = [
  [5.5, 99.0],
  [25.5, 118.5]
];

const VIETNAM_CENTER: L.LatLngExpression = [16.0, 107.8];

const TILE_PROVIDERS: Record<
  'satellite' | 'topo' | 'streets',
  { name: string; url: string; attribution: string; maxZoom: number }
> = {
  satellite: {
    name: 'Vệ Tinh',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    maxZoom: 18
  },
  topo: {
    name: 'Địa Hình',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    maxZoom: 18
  },
  streets: {
    name: 'Giao Thông',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    maxZoom: 18
  }
};

interface ScreenBBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const boxesOverlap = (a: ScreenBBox, b: ScreenBBox, pad = MAP_TUNABLE_PARAMS.COLLISION_PADDING_PX): boolean => {
  return !(
    a.x2 + pad < b.x1 ||
    a.x1 - pad > b.x2 ||
    a.y2 + pad < b.y1 ||
    a.y1 - pad > b.y2
  );
};

// Memoized Heritage Row Item for 60fps list scrolling on mid-range mobile phones
interface HeritageListRowProps {
  rawItem: HeritageItem;
  language: string;
  isSelected: boolean;
  distanceKm: number | null;
  isAdmin: boolean;
  onSelect: (item: HeritageItem) => void;
  onEdit: (item: HeritageItem) => void;
}

const HeritageListRow = React.memo<HeritageListRowProps>(
  ({ rawItem, language, isSelected, distanceKm, isAdmin, onSelect, onEdit }) => {
    const item = useMemo(() => languageService.translateHeritageItem(rawItem, language), [rawItem, language]);

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`Xem di sản ${item.name} tại ${item.province}`}
        onClick={() => onSelect(rawItem)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(rawItem);
          }
        }}
        className={`min-h-[68px] p-3 rounded-2xl border transition-transform duration-150 cursor-pointer flex gap-3 items-center active:scale-[0.98] ${
          isSelected
            ? 'bg-amber-950/60 border-amber-400 shadow-md'
            : 'bg-stone-900/90 hover:bg-stone-800/90 border-stone-800'
        }`}
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-950 border border-stone-800">
          <img
            src={getSafeHeritageImageUrl(item.imageUrl, item.id)}
            alt={item.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{item.province}</span>
            {distanceKm !== null && (
              <>
                <span aria-hidden="true" className="text-stone-500">·</span>
                <span className="text-xs text-emerald-300 font-mono tabular-nums shrink-0">
                  {distanceKm.toFixed(0)} km
                </span>
              </>
            )}
          </div>

          <h4 className="font-serif font-bold text-stone-100 text-sm sm:text-base truncate">
            {item.name}
          </h4>

          <p className="text-xs sm:text-sm text-stone-300 line-clamp-1 mt-0.5">
            {item.culturalSignificance}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            aria-label={`Chỉnh sửa di sản ${item.name}`}
            onClick={e => {
              e.stopPropagation();
              onEdit(rawItem);
            }}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-stone-950 hover:bg-amber-500/20 text-amber-300 border border-stone-800 flex items-center justify-center shrink-0 active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}

        <ChevronRight className="w-5 h-5 text-amber-400/80 shrink-0" />
      </div>
    );
  }
);
HeritageListRow.displayName = 'HeritageListRow';

export const CulturalMap: React.FC<CulturalMapProps> = ({
  currentUser,
  language = 'vi',
  embedded = false,
  onNavigateToStory,
  onNavigateToFood,
  onSelectHeritage
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const nationalOutlineRef = useRef<L.GeoJSON | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const seaWatermarksLayerRef = useRef<L.LayerGroup | null>(null);
  const sovereigntyLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const [heritages, setHeritages] = useState<HeritageItem[]>(() => storageService.getHeritages());
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [loadingGeo, setLoadingGeo] = useState<boolean>(true);
  const [geoLoadError, setGeoLoadError] = useState<string | null>(null);
  const [geoRetry, setGeoRetry] = useState<number>(0);

  // Viewport & LOD state
  const [currentZoom, setCurrentZoom] = useState<number>(MAP_TUNABLE_PARAMS.ZOOM_INITIAL_MOBILE);
  const [viewportTick, setViewportTick] = useState<number>(0);

  // Map Mode & Selection
  const [baseMode, setBaseMode] = useState<MapBaseMode>('vietnam_only');
  const [selectedProvinceName, setSelectedProvinceName] = useState<string | null>(null);
  const [activeHeritage, setActiveHeritage] = useState<HeritageItem | null>(null);
  const [editingHeritage, setEditingHeritage] = useState<HeritageItem | null>(null);

  // Search & Autocomplete
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionFilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mobile UI Modals & Bottom Sheet (3 states: 'collapsed' | 'half' | 'full')
  const [sheetState, setSheetState] = useState<BottomSheetState>('collapsed');

  // Notify <GuideCharacter /> whenever bottom sheet state changes on fullscreen map so it automatically shifts above the sheet edge
  useEffect(() => {
    if (embedded) return;
    const heightVh =
      sheetState === 'full'
        ? MAP_TUNABLE_PARAMS.SHEET_FULL_DVH
        : sheetState === 'half'
        ? MAP_TUNABLE_PARAMS.SHEET_HALF_DVH
        : 0;
    notifyMapSheetState(sheetState, heightVh);
    return () => {
      notifyMapSheetState('collapsed', 0);
    };
  }, [sheetState, embedded]);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [isProvinceDrawerOpen, setIsProvinceDrawerOpen] = useState<boolean>(false);
  const [provinceDrawerSearch, setProvinceDrawerSearch] = useState<string>('');
  const [provinceDrawerRegion, setProvinceDrawerRegion] = useState<'all' | 'north' | 'central' | 'south'>('all');

  // Drag Gesture Refs for Bottom Sheet
  const dragStartYRef = useRef<number | null>(null);
  const dragCurrentDeltaYRef = useRef<number>(0);
  const [dragOffsetPx, setDragOffsetPx] = useState<number>(0);

  // GPS State
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationMessage, setLocationMessage] = useState<string>('');

  // Precompute heritage counts per 34 administrative unit for fast O(1) lookup
  const provinceHeritageStats = useMemo(() => {
    const map = new Map<
      string,
      { unit: AdministrativeUnit; count: number; items: HeritageItem[] }
    >();

    VIETNAM_34_ADMINISTRATIVE_UNITS.forEach(unit => {
      map.set(unit.shortName, { unit, count: 0, items: [] });
    });

    heritages.forEach(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return;
      if (selectedRegion === 'islands' && !isIslandRelatedHeritage(item)) return;
      if (
        selectedRegion !== 'all' &&
        selectedRegion !== 'islands' &&
        item.region !== selectedRegion
      ) {
        return;
      }

      const matchedUnit =
        VIETNAM_34_ADMINISTRATIVE_UNITS.find(u =>
          provinceNameMatches(item.province, u.shortName)
        ) ||
        VIETNAM_34_ADMINISTRATIVE_UNITS.find(u =>
          provinceNameMatches(item.province, u.name)
        );

      if (matchedUnit) {
        const entry = map.get(matchedUnit.shortName);
        if (entry) {
          entry.count += 1;
          entry.items.push(item);
        }
      }
    });

    return map;
  }, [heritages, selectedCategory, selectedRegion]);

  // Filtered heritages for the Bottom Sheet / Side List
  const heritagesInView = useMemo(() => {
    return heritages.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedRegion === 'islands') {
        if (!isIslandRelatedHeritage(item)) return false;
      } else if (selectedRegion !== 'all' && item.region !== selectedRegion) {
        return false;
      }
      if (selectedProvinceName) {
        if (!provinceNameMatches(item.province, selectedProvinceName)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = [
          item.name,
          item.province,
          item.address,
          item.culturalSignificance,
          item.categoryLabel,
          ...(item.tags || [])
        ]
          .join(' ')
          .toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [heritages, selectedCategory, selectedRegion, selectedProvinceName, searchQuery]);

  // Search Suggestions (Provinces + Heritages) when user types in floating search bar
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { provinces: [] as AdministrativeUnit[], heritages: [] as HeritageItem[] };

    const matchingProvinces = VIETNAM_34_ADMINISTRATIVE_UNITS.filter(u => {
      const aliases = CURRENT_PROVINCE_ALIASES[u.shortName] || [u.shortName];
      return (
        u.shortName.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        aliases.some(a => a.toLowerCase().includes(q))
      );
    }).slice(0, 5);

    const matchingHeritages = heritages
      .filter(h => {
        const translated = languageService.translateHeritageItem(h, language);
        return (
          translated.name.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q) ||
          h.province.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);

    return { provinces: matchingProvinces, heritages: matchingHeritages };
  }, [searchQuery, heritages, language]);

  // 1. Load Vietnam 34-Province GeoJSON (local-first for <1s load on 4G)
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    const fetchGeoJSON = async () => {
      setLoadingGeo(true);
      setGeoLoadError(null);
      try {
        let data: GeoJSON.FeatureCollection | null = null;

        try {
          const localRes = await fetch(LOCAL_BOUNDARIES_URL, {
            signal: controller.signal,
            headers: { Accept: 'application/geo+json, application/json' }
          });
          if (localRes.ok) {
            const parsed = (await localRes.json()) as GeoJSON.FeatureCollection;
            if (parsed?.type === 'FeatureCollection' && Array.isArray(parsed.features) && parsed.features.length > 0) {
              data = parsed;
            }
          }
        } catch {
          // Fallback to remote GIS
        }

        if (!data) {
          const remoteRes = await fetch(REMOTE_BOUNDARIES_URL, {
            signal: controller.signal,
            headers: { Accept: 'application/geo+json, application/json' }
          });
          if (remoteRes.ok) {
            const parsed = (await remoteRes.json()) as GeoJSON.FeatureCollection;
            if (parsed?.type === 'FeatureCollection' && Array.isArray(parsed.features) && parsed.features.length > 0) {
              data = parsed;
            }
          }
        }

        if (!data || !Array.isArray(data.features) || data.features.length === 0) {
          throw new Error('Không tìm thấy dữ liệu ranh giới 34 tỉnh/thành.');
        }

        if (isMounted) {
          setGeoData(data);
          setGeoLoadError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setGeoLoadError(err instanceof Error ? err.message : 'Không thể tải dữ liệu bản đồ.');
      } finally {
        window.clearTimeout(timeoutId);
        if (isMounted) setLoadingGeo(false);
      }
    };

    fetchGeoJSON();
    const handleDataUpdated = () => setHeritages(storageService.getHeritages());
    window.addEventListener('heritage-data-updated', handleDataUpdated);
    const savedLoc = geolocationService.getLastKnownLocation();
    if (savedLoc) setUserLocation(savedLoc);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearTimeout(timeoutId);
      window.removeEventListener('heritage-data-updated', handleDataUpdated);
    };
  }, [geoRetry]);

  // Schedule debounced + requestAnimationFrame viewport recalculation for 60fps LOD & collision avoidance
  const scheduleViewportUpdate = useCallback((map: L.Map) => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        setCurrentZoom(map.getZoom());
        setViewportTick(t => t + 1);
      });
    }, MAP_TUNABLE_PARAMS.VIEWPORT_DEBOUNCE_MS);
  }, []);

  // 2. Initialize Leaflet Map with Custom Panes for Sea Watermarks & Sovereignty
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const isMobileViewport = window.innerWidth < 768;
    const map = L.map(mapContainerRef.current, {
      center: VIETNAM_CENTER,
      zoom: isMobileViewport
        ? MAP_TUNABLE_PARAMS.ZOOM_INITIAL_MOBILE
        : MAP_TUNABLE_PARAMS.ZOOM_INITIAL_DESKTOP,
      minZoom: MAP_TUNABLE_PARAMS.ZOOM_MIN,
      maxZoom: MAP_TUNABLE_PARAMS.ZOOM_MAX,
      zoomControl: false,
      attributionControl: false,
      maxBounds: VIETNAM_MAX_BOUNDS,
      maxBoundsViscosity: 0.92,
      tapTolerance: 15,
      bounceAtZoomLimits: false
    });

    mapInstanceRef.current = map;

    // Create dedicated panes to enforce strict z-index layering:
    // 1) National Outline Pane (zIndex: 380 - beneath provinces, with outer coastline drop-shadow)
    const nationalPane = map.createPane('nationalOutlinePane');
    nationalPane.style.zIndex = '380';
    nationalPane.style.pointerEvents = 'none';
    nationalPane.style.filter =
      'drop-shadow(0 0 1.5px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 3.5px rgba(245, 158, 11, 0.45))';

    // 2) Sea Watermarks Pane ("Biển Đông", "Vịnh Thái Lan" - zIndex: 350, strictly under markers!)
    const seaPane = map.createPane('seaWatermarksPane');
    seaPane.style.zIndex = '350';
    seaPane.style.pointerEvents = 'none';

    // 3) Sovereignty Pane (Hoàng Sa & Trường Sa - zIndex: 680, always visible on top, never overlapped!)
    const sovereigntyPane = map.createPane('sovereigntyPane');
    sovereigntyPane.style.zIndex = '680';

    const seaGroup = L.layerGroup().addTo(map);
    seaWatermarksLayerRef.current = seaGroup;

    const sovGroup = L.layerGroup().addTo(map);
    sovereigntyLayerRef.current = sovGroup;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    renderSeaAndSovereigntyLayers(seaGroup, sovGroup, map);

    // Fit full Vietnam S-shape with mobile safe padding
    const fitPadding: [number, number] = isMobileViewport ? [24, 24] : [36, 36];
    map.fitBounds(REGION_BOUNDS.all, { padding: fitPadding });

    map.on('movestart zoomstart', () => {
      notifyMapInteractionActive(true);
    });

    map.on('zoomend moveend', () => {
      notifyMapInteractionActive(false);
      scheduleViewportUpdate(map);
    });

    // Close open popovers/search or collapse sheet when tapping empty map canvas
    map.on('click', () => {
      setIsSearchFocused(false);
      setIsLegendOpen(false);
      setSheetState(prev => (prev === 'full' ? 'half' : prev === 'half' ? 'collapsed' : prev));
    });

    const t1 = window.setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(REGION_BOUNDS.all, { padding: fitPadding });
      scheduleViewportUpdate(map);
    }, 180);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
      scheduleViewportUpdate(map);
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      window.clearTimeout(t1);
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [scheduleViewportUpdate]);

  // 3. Manage External Tile Layer (when user switches away from 'vietnam_only')
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    if (baseMode === 'vietnam_only') return;

    const provider = TILE_PROVIDERS[baseMode];
    if (provider) {
      const tile = L.tileLayer(provider.url, {
        attribution: provider.attribution,
        maxZoom: provider.maxZoom
      }).addTo(map);
      tileLayerRef.current = tile;
      tile.bringToBack();
    }
  }, [baseMode]);

  // Render Sea Watermarks (under markers) & Hoàng Sa / Trường Sa Sovereignty Layer (always visible)
  const renderSeaAndSovereigntyLayers = (
    seaGroup: L.LayerGroup,
    sovGroup: L.LayerGroup,
    map: L.Map
  ) => {
    seaGroup.clearLayers();
    sovGroup.clearLayers();

    // --- SEA WATERMARKS (Pane: seaWatermarksPane, zIndex: 350, underneath all markers) ---
    const bienDongIcon = L.divIcon({
      className: 'custom-sea-watermark',
      html: `
        <div class="flex flex-col items-center justify-center pointer-events-none select-none text-center">
          <span class="text-[13px] sm:text-[16px] font-serif font-bold tracking-[0.28em] text-sky-200/55 uppercase">
            BIỂN ĐÔNG
          </span>
          <span class="text-[11px] font-sans font-semibold tracking-[0.18em] text-amber-300/50 uppercase mt-0.5">
            VIỆT NAM
          </span>
        </div>
      `,
      iconSize: [200, 44],
      iconAnchor: [100, 22]
    });
    seaGroup.addLayer(
      L.marker([14.0, 112.4], {
        icon: bienDongIcon,
        interactive: false,
        pane: 'seaWatermarksPane'
      })
    );

    const vinhThaiLanIcon = L.divIcon({
      className: 'custom-sea-watermark',
      html: `
        <div class="pointer-events-none select-none text-center">
          <span class="text-[12px] font-serif font-semibold tracking-[0.16em] text-sky-200/50 uppercase whitespace-nowrap">
            VỊNH THÁI LAN
          </span>
        </div>
      `,
      iconSize: [140, 28],
      iconAnchor: [70, 14]
    });
    seaGroup.addLayer(
      L.marker([9.1, 103.3], {
        icon: vinhThaiLanIcon,
        interactive: false,
        pane: 'seaWatermarksPane'
      })
    );

    const vinhBacBoIcon = L.divIcon({
      className: 'custom-sea-watermark',
      html: `
        <div class="pointer-events-none select-none text-center">
          <span class="text-[12px] font-serif font-semibold tracking-[0.16em] text-sky-200/50 uppercase whitespace-nowrap">
            VỊNH BẮC BỘ
          </span>
        </div>
      `,
      iconSize: [140, 28],
      iconAnchor: [70, 14]
    });
    seaGroup.addLayer(
      L.marker([19.7, 107.6], {
        icon: vinhBacBoIcon,
        interactive: false,
        pane: 'seaWatermarksPane'
      })
    );

    // --- HOÀNG SA & TRƯỜNG SA SOVEREIGNTY MARKERS (Pane: sovereigntyPane, zIndex: 680, 44px touch target) ---
    const createSovereigntyIcon = (title: string, subtitle: string) =>
      L.divIcon({
        className: 'custom-sovereignty-marker',
        html: `
          <div
            role="button"
            tabindex="0"
            aria-label="Chủ quyền Việt Nam: ${title} (${subtitle})"
            class="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer select-none group"
          >
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b1930]/95 border-[1.5px] border-amber-400 text-amber-200 shadow-lg transition-transform duration-150 group-active:scale-95 group-hover:scale-105">
              <span class="w-4 h-4 rounded-full bg-red-600 border border-amber-300 flex items-center justify-center text-[10px] leading-none shrink-0 shadow-sm">★</span>
              <span class="text-[12px] font-bold font-sans whitespace-nowrap tracking-tight text-amber-200">${title}</span>
            </div>
          </div>
        `,
        iconSize: [136, 44],
        iconAnchor: [68, 22]
      });

    const hoangSaMarker = L.marker([16.5, 112.0], {
      icon: createSovereigntyIcon('Hoàng Sa', 'TP. Đà Nẵng'),
      pane: 'sovereigntyPane'
    });
    hoangSaMarker.on('click', e => {
      L.DomEvent.stopPropagation(e);
      setSelectedProvinceName('Đà Nẵng');
      setSheetState('half');
      const clientEvt = e.originalEvent as MouseEvent | undefined;
      map.flyTo([16.3, 110.2], 7.2, { duration: 0.8 });
      triggerGuideNarration({
        id: 'sovereignty-hoang-sa',
        title: 'Quần Đảo Hoàng Sa (TP. Đà Nẵng)',
        introText: getProvinceIntroText('Hoàng Sa'),
        targetType: 'sovereignty',
        provinceName: 'Đà Nẵng',
        screenX: clientEvt?.clientX,
        screenY: clientEvt?.clientY
      });
    });
    sovGroup.addLayer(hoangSaMarker);

    const truongSaMarker = L.marker([9.8, 114.2], {
      icon: createSovereigntyIcon('Trường Sa', 'Khánh Hòa'),
      pane: 'sovereigntyPane'
    });
    truongSaMarker.on('click', e => {
      L.DomEvent.stopPropagation(e);
      setSelectedProvinceName('Khánh Hòa');
      setSheetState('half');
      const clientEvt = e.originalEvent as MouseEvent | undefined;
      map.flyTo([11.2, 111.8], 7.0, { duration: 0.8 });
      triggerGuideNarration({
        id: 'sovereignty-truong-sa',
        title: 'Quần Đảo Trường Sa (Tỉnh Khánh Hòa)',
        introText: getProvinceIntroText('Trường Sa'),
        targetType: 'sovereignty',
        provinceName: 'Khánh Hòa',
        screenX: clientEvt?.clientX,
        screenY: clientEvt?.clientY
      });
    });
    sovGroup.addLayer(truongSaMarker);
  };

  // Select a province, fly smoothly to its bounds/center, open bottom sheet to 'half', and narrate via <GuideCharacter />
  const handleSelectProvince = useCallback(
    (provinceName: string, bounds?: L.LatLngBounds) => {
      const clean = provinceName.replace(/^(Tỉnh|Thành phố|TP\.)\s+/i, '').trim();
      const matchedUnit =
        getCurrentAdministrativeUnitByName(clean) ||
        VIETNAM_34_ADMINISTRATIVE_UNITS.find(u => provinceNameMatches(u.shortName, clean));
      const targetName = matchedUnit ? matchedUnit.shortName : clean;

      setSelectedProvinceName(targetName);
      setActiveHeritage(null);
      setSheetState('half');
      setIsSearchFocused(false);
      setIsProvinceDrawerOpen(false);

      const map = mapInstanceRef.current;
      let screenX: number | undefined;
      let screenY: number | undefined;
      if (map && mapContainerRef.current && matchedUnit?.center) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        const pt = map.latLngToContainerPoint(matchedUnit.center);
        screenX = rect.left + pt.x;
        screenY = rect.top + pt.y;
      }

      const provStats = provinceHeritageStats.get(targetName);
      triggerGuideNarration({
        id: `province-${targetName}`,
        title: matchedUnit ? matchedUnit.name : targetName,
        introText: getProvinceIntroText(
          targetName,
          matchedUnit?.historicalNotes,
          provStats?.count
        ),
        targetType: 'province',
        provinceName: targetName,
        screenX,
        screenY
      });

      if (!map) return;

      if (bounds && bounds.isValid()) {
        map.flyToBounds(bounds, {
          paddingTopLeft: [24, 110],
          paddingBottomRight: [24, Math.round(window.innerHeight * 0.45)],
          maxZoom: 9.2,
          duration: 0.75
        });
      } else if (matchedUnit?.center) {
        // Offset latitude slightly south so province appears centered above the half-open bottom sheet
        const latOffset = window.innerWidth < 768 ? -0.35 : 0;
        map.flyTo([matchedUnit.center[0] + latOffset, matchedUnit.center[1]], 8.8, {
          duration: 0.75
        });
      }
    },
    [provinceHeritageStats]
  );

  // Select an individual heritage item, fly to its coordinates, open bottom sheet to 'full', and narrate via <GuideCharacter />
  const handleSelectHeritageItem = useCallback((item: HeritageItem) => {
    setActiveHeritage(item);
    setSheetState('full');
    setIsSearchFocused(false);

    const map = mapInstanceRef.current;
    let screenX: number | undefined;
    let screenY: number | undefined;
    if (map && mapContainerRef.current && item.lat && item.lng) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const pt = map.latLngToContainerPoint([item.lat, item.lng]);
      screenX = rect.left + pt.x;
      screenY = rect.top + pt.y;
    }

    triggerGuideNarration({
      id: `heritage-${item.id}`,
      title: item.name,
      subtitleBadge: item.province,
      introText: getHeritageIntroText(item),
      targetType: 'heritage',
      provinceName: item.province,
      heritageId: item.id,
      screenX,
      screenY
    });

    if (map && item.lat && item.lng) {
      const targetZoom = Math.max(map.getZoom(), 11);
      const latOffset = window.innerWidth < 768 ? -0.02 : 0;
      map.flyTo([item.lat + latOffset, item.lng], targetZoom, { duration: 0.7 });
    }
  }, []);

  // Reset to full nationwide view
  const handleResetVietnamView = useCallback(() => {
    setSelectedProvinceName(null);
    setActiveHeritage(null);
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedCategory('all');
    setSheetState('collapsed');
    setIsSearchFocused(false);

    const map = mapInstanceRef.current;
    if (map) {
      const isMobile = window.innerWidth < 768;
      map.flyToBounds(REGION_BOUNDS.all, {
        paddingTopLeft: [20, 110],
        paddingBottomRight: [20, isMobile ? 90 : 30],
        duration: 0.8
      });
    }
  }, []);

  // Select region chip & zoom to fit that region
  const handleSelectRegionChip = useCallback((region: RegionFilterType) => {
    setSelectedRegion(region);
    setSelectedProvinceName(null);
    setActiveHeritage(null);
    setSheetState(region === 'all' ? 'collapsed' : 'half');

    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = REGION_BOUNDS[region] || REGION_BOUNDS.all;
    const isMobile = window.innerWidth < 768;
    map.flyToBounds(bounds, {
      paddingTopLeft: [24, 115],
      paddingBottomRight: [24, isMobile && region !== 'all' ? Math.round(window.innerHeight * 0.42) : 90],
      duration: 0.8
    });
  }, []);

  // 4. Render Vietnam Land Polygons with Distinct Land (#1d2f4f) vs Ocean (#07142b) & Highlighted Selection
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (nationalOutlineRef.current) {
      map.removeLayer(nationalOutlineRef.current);
      nationalOutlineRef.current = null;
    }
    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
      geojsonLayerRef.current = null;
    }

    if (!geoData) return;

    // Layer A: Solid National Silhouette on nationalOutlinePane (drop-shadow creates crisp outer coastline without thickening internal province borders)
    const nationalOutline = L.geoJSON(geoData, {
      pane: 'nationalOutlinePane',
      interactive: false,
      style: () => ({
        fillColor: MAP_TUNABLE_PARAMS.LAND_COLOR_DEFAULT,
        fillOpacity: 1,
        color: MAP_TUNABLE_PARAMS.LAND_COLOR_DEFAULT,
        weight: 1.2,
        opacity: 1
      })
    }).addTo(map);
    nationalOutlineRef.current = nationalOutline;

    // Layer B: Interactive 34 Provincial Polygons
    const getProvinceStyle = (feature: any): L.PathOptions => {
      const displayName = getGeoJSONProvinceName((feature?.properties || {}) as ProvinceProperties);
      const isSelected =
        selectedProvinceName !== null &&
        provinceNameMatches(displayName, selectedProvinceName);
      const isIslandHighlighted =
        selectedRegion === 'islands' && ISLAND_PROVINCES.has(displayName);
      const hasAnySelection = selectedProvinceName !== null;

      if (isSelected) {
        return {
          fillColor: MAP_TUNABLE_PARAMS.LAND_COLOR_SELECTED,
          fillOpacity: MAP_TUNABLE_PARAMS.LAND_OPACITY_SELECTED,
          color: MAP_TUNABLE_PARAMS.SELECTED_BORDER_COLOR,
          weight: MAP_TUNABLE_PARAMS.SELECTED_BORDER_WEIGHT,
          opacity: 1
        };
      }

      if (isIslandHighlighted) {
        return {
          fillColor: '#25426b',
          fillOpacity: 0.94,
          color: '#38bdf8',
          weight: 1.4,
          opacity: 0.85
        };
      }

      return {
        fillColor: MAP_TUNABLE_PARAMS.LAND_COLOR_DEFAULT,
        fillOpacity: hasAnySelection
          ? MAP_TUNABLE_PARAMS.LAND_OPACITY_DIMMED
          : baseMode === 'vietnam_only'
          ? MAP_TUNABLE_PARAMS.LAND_OPACITY_DEFAULT
          : 0.55,
        color: MAP_TUNABLE_PARAMS.PROVINCE_BORDER_COLOR,
        weight: MAP_TUNABLE_PARAMS.PROVINCE_BORDER_WEIGHT,
        opacity: MAP_TUNABLE_PARAMS.PROVINCE_BORDER_OPACITY
      };
    };

    const geoLayer = L.geoJSON(geoData, {
      style: getProvinceStyle,
      onEachFeature: (feature, layer) => {
        const props = (feature.properties || {}) as ProvinceProperties;
        const displayName = getGeoJSONProvinceName(props);

        layer.on({
          click: e => {
            L.DomEvent.stopPropagation(e);
            handleSelectProvince(displayName, (layer as L.Polygon).getBounds());
          }
        });
      }
    }).addTo(map);

    geojsonLayerRef.current = geoLayer;
  }, [geoData, selectedProvinceName, selectedRegion, baseMode, handleSelectProvince]);

  // 5. Render LOD Markers, Dense Region Clustering & Bounding-Box Collision Avoidance
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const mapBounds = map.getBounds().pad(0.22);
    const zoom = map.getZoom();

    // Decide whether to show individual heritage pins or province LOD markers:
    // Show individual heritage pins when:
    // - A specific province is selected, OR
    // - User is searching by text, OR
    // - Zoom >= ZOOM_INDIVIDUAL_PINS (8.4)
    const showIndividualPins =
      Boolean(selectedProvinceName) ||
      Boolean(searchQuery.trim()) ||
      zoom >= MAP_TUNABLE_PARAMS.ZOOM_INDIVIDUAL_PINS;

    if (showIndividualPins) {
      // Viewport culling: only render pins inside current visible bounds
      const visibleHeritages = heritagesInView.filter(
        h => h.lat && h.lng && mapBounds.contains([h.lat, h.lng])
      );
      const positioned = computePositionedHeritages(visibleHeritages);

      // Track occupied label boxes so heritage labels don't overlap each other
      const occupiedBoxes: ScreenBBox[] = [];

      // Sort so active heritage is processed first
      positioned.sort((a, b) => {
        if (activeHeritage?.id === a.id) return -1;
        if (activeHeritage?.id === b.id) return 1;
        return 0;
      });

      positioned.forEach(rawItem => {
        const item = languageService.translateHeritageItem(rawItem, language);
        const isSelected = activeHeritage?.id === item.id;
        const emoji = getCategoryEmoji(item.category);
        const pt = map.latLngToContainerPoint([rawItem.displayLat, rawItem.displayLng]);

        // Check if label fits without colliding (always show label for activeHeritage or at high zoom >= 10)
        const labelWidth = Math.min(160, item.name.length * 7 + 20);
        const labelBox: ScreenBBox = {
          x1: pt.x - labelWidth / 2,
          y1: pt.y - 42,
          x2: pt.x + labelWidth / 2,
          y2: pt.y - 18
        };
        const dotBox: ScreenBBox = {
          x1: pt.x - 16,
          y1: pt.y - 16,
          x2: pt.x + 16,
          y2: pt.y + 16
        };

        const canShowLabel =
          isSelected ||
          (zoom >= 9.5 && !occupiedBoxes.some(b => boxesOverlap(labelBox, b, 4)));

        occupiedBoxes.push(dotBox);
        if (canShowLabel) {
          occupiedBoxes.push(labelBox);
        }

        const pinIcon = L.divIcon({
          className: 'custom-heritage-lod-pin',
          html: `
            <div
              role="button"
              tabindex="0"
              aria-label="Di sản ${item.name} (${item.province})"
              class="w-[44px] h-[44px] flex items-center justify-center cursor-pointer select-none relative group"
            >
              ${
                canShowLabel
                  ? `<div class="absolute bottom-full mb-0.5 px-2 py-0.5 rounded-md text-[12px] font-semibold whitespace-nowrap shadow-md pointer-events-none ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 font-bold border border-white z-50'
                        : 'bg-[#0b1930]/95 text-amber-100 border border-amber-400/50 z-30'
                    }">${item.name}</div>`
                  : ''
              }
              <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-md border-[1.5px] transition-transform duration-150 ${
                isSelected
                  ? 'bg-amber-400 border-white text-stone-950 scale-125 ring-2 ring-amber-300/60'
                  : 'bg-[#102240] border-amber-400 text-amber-200 group-hover:scale-110 group-active:scale-95'
              }">
                <span class="text-[13px] leading-none">${emoji}</span>
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker([rawItem.displayLat, rawItem.displayLng], {
          icon: pinIcon,
          zIndexOffset: isSelected ? 1000 : 100
        });

        marker.on('click', e => {
          L.DomEvent.stopPropagation(e);
          handleSelectHeritageItem(rawItem);
        });

        markersGroup.addLayer(marker);
      });

      return;
    }

    // ========================================================================
    // PROVINCE LEVEL OF DETAIL (LOD) + DENSE REGION CLUSTERING + COLLISION AVOIDANCE
    // ========================================================================
    // 1. Collect visible provinces with heritage counts
    interface ProvinceNode {
      unit: AdministrativeUnit;
      count: number;
      lat: number;
      lng: number;
      pt: L.Point;
      isSelected: boolean;
    }

    const visibleNodes: ProvinceNode[] = [];
    VIETNAM_34_ADMINISTRATIVE_UNITS.forEach(unit => {
      if (
        selectedRegion !== 'all' &&
        selectedRegion !== 'islands' &&
        unit.region !== selectedRegion
      ) {
        return;
      }
      if (selectedRegion === 'islands' && !ISLAND_PROVINCES.has(unit.shortName)) {
        return;
      }

      const [lat, lng] = unit.center;
      if (!mapBounds.contains([lat, lng])) return;

      const stat = provinceHeritageStats.get(unit.shortName);
      const count = stat ? stat.count : 0;
      if (count === 0 && selectedCategory !== 'all') return;

      const pt = map.latLngToContainerPoint([lat, lng]);
      const isSelected =
        selectedProvinceName !== null &&
        provinceNameMatches(unit.shortName, selectedProvinceName);

      visibleNodes.push({
        unit,
        count,
        lat,
        lng,
        pt,
        isSelected
      });
    });

    // Sort by priority: Selected first, then highest heritage count descending
    visibleNodes.sort((a, b) => {
      if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
      return b.count - a.count;
    });

    // 2. Dense Region Clustering (at zoom < ZOOM_CLUSTER_MAX = 7.3)
    // Automatically merges tightly packed provinces in Đồng bằng Bắc Bộ & Đông Nam Bộ / ĐBSCL
    interface ClusterGroup {
      id: string;
      nodes: ProvinceNode[];
      totalCount: number;
      lat: number;
      lng: number;
      pt: L.Point;
    }

    const clusters: ClusterGroup[] = [];
    const shouldClusterDense = zoom < MAP_TUNABLE_PARAMS.ZOOM_CLUSTER_MAX;
    const clusterThresholdPx = MAP_TUNABLE_PARAMS.CLUSTER_DISTANCE_PX;

    visibleNodes.forEach(node => {
      if (!shouldClusterDense || node.isSelected) {
        clusters.push({
          id: node.unit.code,
          nodes: [node],
          totalCount: node.count,
          lat: node.lat,
          lng: node.lng,
          pt: node.pt
        });
        return;
      }

      // Find existing cluster within clusterThresholdPx
      let merged = false;
      for (const cluster of clusters) {
        const dx = cluster.pt.x - node.pt.x;
        const dy = cluster.pt.y - node.pt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < clusterThresholdPx) {
          cluster.nodes.push(node);
          cluster.totalCount += node.count;
          merged = true;
          break;
        }
      }

      if (!merged) {
        clusters.push({
          id: node.unit.code,
          nodes: [node],
          totalCount: node.count,
          lat: node.lat,
          lng: node.lng,
          pt: node.pt
        });
      }
    });

    // 3. Pre-populate occupied screen bounding boxes with Sovereignty Badges (Hoàng Sa & Trường Sa)
    // and all circular dot markers so no province name label ever overlaps any dot or sovereignty badge!
    const occupiedBoxes: ScreenBBox[] = [];

    [
      [16.5, 112.0],
      [9.8, 114.2]
    ].forEach(([sLat, sLng]) => {
      const sPt = map.latLngToContainerPoint([sLat, sLng]);
      occupiedBoxes.push({
        x1: sPt.x - 72,
        y1: sPt.y - 24,
        x2: sPt.x + 72,
        y2: sPt.y + 24
      });
    });

    // Register every dot/cluster circle's bounding box first
    clusters.forEach(cluster => {
      const r = cluster.nodes.length > 1 ? 15 : 12;
      occupiedBoxes.push({
        x1: cluster.pt.x - r,
        y1: cluster.pt.y - r,
        x2: cluster.pt.x + r,
        y2: cluster.pt.y + r
      });
    });

    // 4. Render Clusters & Individual Province Dots with LOD Label Collision Check
    clusters.forEach(cluster => {
      const isMultiCluster = cluster.nodes.length > 1;
      const primaryNode = cluster.nodes[0];

      if (isMultiCluster) {
        // Render Dense Region Cluster Dot (e.g., Đồng bằng Bắc Bộ or TP.HCM & lân cận)
        const provinceNames = cluster.nodes.map(n => n.unit.shortName).join(', ');
        const clusterIcon = L.divIcon({
          className: 'custom-dense-cluster-dot',
          html: `
            <div
              role="button"
              tabindex="0"
              aria-label="Cụm ${cluster.nodes.length} tỉnh thành (${provinceNames}): ${cluster.totalCount} điểm di sản. Chạm để phóng to tách cụm."
              class="w-[44px] h-[44px] flex items-center justify-center cursor-pointer select-none group"
            >
              <div class="w-[28px] h-[28px] rounded-full bg-amber-500 text-stone-950 border-2 border-amber-200 shadow-lg flex items-center justify-center font-mono font-extrabold text-[12px] tabular-nums ring-2 ring-amber-400/40 transition-transform duration-150 group-active:scale-90 group-hover:scale-110">
                ${cluster.totalCount}
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker([cluster.lat, cluster.lng], {
          icon: clusterIcon,
          zIndexOffset: 300
        });

        marker.on('click', e => {
          L.DomEvent.stopPropagation(e);
          const groupBounds = L.latLngBounds(cluster.nodes.map(n => [n.lat, n.lng]));
          map.flyToBounds(groupBounds.pad(0.35), {
            padding: [40, 40],
            maxZoom: Math.max(zoom + 1.8, MAP_TUNABLE_PARAMS.ZOOM_CLUSTER_MAX + 0.5),
            duration: 0.65
          });
        });

        markersGroup.addLayer(marker);
        return;
      }

      // Single Province Marker: Determine LOD Label Visibility
      // - Default national zoom (< 6.8): ONLY 22px circular dot with heritage count, NO province name!
      // - Medium zoom (6.8 <= zoom < 8.2): shortName if count >= 2 and no bounding-box collision
      // - Close zoom (>= 8.2): full province name (or shortName) if no bounding-box collision
      let labelText: string | null = null;
      if (primaryNode.isSelected) {
        labelText =
          zoom >= MAP_TUNABLE_PARAMS.ZOOM_LOD_FULL
            ? primaryNode.unit.name
            : primaryNode.unit.shortName;
      } else if (zoom >= MAP_TUNABLE_PARAMS.ZOOM_LOD_FULL) {
        labelText = primaryNode.unit.name;
      } else if (zoom >= MAP_TUNABLE_PARAMS.ZOOM_LOD_MEDIUM && primaryNode.count >= 1) {
        labelText = primaryNode.unit.shortName;
      }

      let showLabel = false;
      if (labelText) {
        const approxWidth = labelText.length * 7.2 + 16;
        const approxHeight = 22;
        // Place label right below the 22px dot
        const candidateBox: ScreenBBox = {
          x1: cluster.pt.x - approxWidth / 2,
          y1: cluster.pt.y + 13,
          x2: cluster.pt.x + approxWidth / 2,
          y2: cluster.pt.y + 13 + approxHeight
        };

        const hasCollision = occupiedBoxes.some(box => boxesOverlap(candidateBox, box));
        if (!hasCollision || primaryNode.isSelected) {
          showLabel = true;
          occupiedBoxes.push(candidateBox);
        }
      }

      const dotSize = primaryNode.isSelected
        ? MAP_TUNABLE_PARAMS.DOT_SIZE_SELECTED
        : MAP_TUNABLE_PARAMS.DOT_SIZE_DEFAULT;

      const dotIcon = L.divIcon({
        className: 'custom-province-lod-dot',
        html: `
          <div
            role="button"
            tabindex="0"
            aria-label="${primaryNode.unit.name}: ${primaryNode.count} điểm di sản"
            class="w-[44px] h-[44px] flex items-center justify-center cursor-pointer select-none relative group"
          >
            <div
              style="width: ${dotSize}px; height: ${dotSize}px;"
              class="rounded-full flex items-center justify-center font-mono font-bold text-[12px] tabular-nums shadow-md transition-transform duration-150 group-active:scale-90 group-hover:scale-110 ${
                primaryNode.isSelected
                  ? 'bg-amber-400 text-stone-950 border-2 border-white ring-2 ring-amber-300'
                  : 'bg-[#0f2342] text-amber-300 border-[1.5px] border-amber-400/90'
              }"
            >
              ${primaryNode.count}
            </div>
            ${
              showLabel && labelText
                ? `<div class="absolute top-[34px] left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[12px] font-sans font-semibold whitespace-nowrap pointer-events-none shadow-md ${
                    primaryNode.isSelected
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-[#07142b]/95 text-amber-100 border border-amber-500/40'
                  }">
                    ${labelText}
                  </div>`
                : ''
            }
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([primaryNode.lat, primaryNode.lng], {
        icon: dotIcon,
        zIndexOffset: primaryNode.isSelected ? 800 : primaryNode.count * 5
      });

      marker.on('click', e => {
        L.DomEvent.stopPropagation(e);
        handleSelectProvince(primaryNode.unit.shortName);
      });

      markersGroup.addLayer(marker);
    });
  }, [
    heritagesInView,
    provinceHeritageStats,
    selectedProvinceName,
    selectedRegion,
    selectedCategory,
    searchQuery,
    activeHeritage,
    currentZoom,
    viewportTick,
    language,
    handleSelectProvince,
    handleSelectHeritageItem
  ]);

  // GPS Request Handler
  const handleRequestGPS = async () => {
    setIsLocating(true);
    setLocationMessage('');
    const res = await geolocationService.requestCurrentPosition();
    setIsLocating(false);

    if (res.success && res.location) {
      setUserLocation(res.location);
      setLocationMessage(`Đã định vị: ${res.location.cityName || 'Vị trí của bạn'}`);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([res.location.lat, res.location.lng], 10.5, {
          duration: 0.8
        });
      }
      window.setTimeout(() => setLocationMessage(''), 4000);
    } else {
      setLocationMessage('Chưa lấy được GPS. Đã chuyển về Hà Nội.');
      const preset = geolocationService.setPresetLocation('hanoi');
      if (preset && mapInstanceRef.current) {
        setUserLocation(preset);
        mapInstanceRef.current.flyTo([preset.lat, preset.lng], 9.5, { duration: 0.8 });
      }
      window.setTimeout(() => setLocationMessage(''), 4000);
    }
  };

  // Touch / Pointer Drag Handlers for the 3-State Mobile Bottom Sheet
  const handleSheetTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartYRef.current = clientY;
    dragCurrentDeltaYRef.current = 0;
  };

  const handleSheetTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartYRef.current === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartYRef.current;
    dragCurrentDeltaYRef.current = deltaY;
    setDragOffsetPx(Math.max(-180, Math.min(180, deltaY)));
  };

  const handleSheetTouchEnd = () => {
    if (dragStartYRef.current === null) return;
    const deltaY = dragCurrentDeltaYRef.current;
    dragStartYRef.current = null;
    dragCurrentDeltaYRef.current = 0;
    setDragOffsetPx(0);

    // Swipe Up (deltaY < -40)
    if (deltaY < -40) {
      setSheetState(prev => (prev === 'collapsed' ? 'half' : 'full'));
    }
    // Swipe Down (deltaY > 40)
    else if (deltaY > 40) {
      setSheetState(prev => (prev === 'full' ? 'half' : 'collapsed'));
    }
  };

  const cycleSheetState = () => {
    setSheetState(prev =>
      prev === 'collapsed' ? 'half' : prev === 'half' ? 'full' : 'collapsed'
    );
  };

  const categories = [
    { id: 'all', label: languageService.t('Tất cả', language, 'Tất cả') },
    { id: 'monument', label: languageService.t('Di tích lịch sử', language, 'Di tích lịch sử') },
    { id: 'palace', label: languageService.t('Hoàng thành', language, 'Hoàng thành') },
    { id: 'temple', label: languageService.t('Đền chùa', language, 'Đền chùa') },
    { id: 'ancient_house', label: languageService.t('Đô thị cổ', language, 'Đô thị cổ') },
    { id: 'craft_village', label: languageService.t('Làng nghề', language, 'Làng nghề') },
    { id: 'scenic_landscape', label: languageService.t('Danh thắng', language, 'Danh thắng') },
    { id: 'island_beach', label: languageService.t('Biển đảo', language, 'Biển đảo') },
    { id: 'museum', label: languageService.t('Bảo tàng', language, 'Bảo tàng') },
    { id: 'culinary', label: languageService.t('Ẩm thực', language, 'Ẩm thực') }
  ];

  const regionChips: { id: RegionFilterType; label: string }[] = [
    { id: 'all', label: languageService.t('Tất cả', language, 'Tất cả') },
    { id: 'north', label: languageService.t('Miền Bắc', language, 'Miền Bắc') },
    { id: 'central', label: languageService.t('Miền Trung', language, 'Miền Trung') },
    { id: 'south', label: languageService.t('Miền Nam', language, 'Miền Nam') },
    { id: 'islands', label: languageService.t('Biển đảo', language, 'Biển đảo') }
  ];

  // Filtered provinces for the "Xem danh sách tỉnh" modal
  const filteredProvincesForDrawer = useMemo(() => {
    const q = provinceDrawerSearch.trim().toLowerCase();
    return VIETNAM_34_ADMINISTRATIVE_UNITS.filter(u => {
      if (provinceDrawerRegion !== 'all' && u.region !== provinceDrawerRegion) return false;
      if (!q) return true;
      const aliases = CURRENT_PROVINCE_ALIASES[u.shortName] || [u.shortName];
      return (
        u.shortName.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        aliases.some(a => a.toLowerCase().includes(q))
      );
    });
  }, [provinceDrawerSearch, provinceDrawerRegion]);

  // Compute CSS translateY for the mobile 3-state bottom sheet (using compositor transform only!)
  const getSheetTranslateStyle = (): React.CSSProperties => {
    let baseTranslate = 'calc(100% - 76px)';
    if (sheetState === 'half') {
      baseTranslate = `${100 - MAP_TUNABLE_PARAMS.SHEET_HALF_DVH}%`;
    } else if (sheetState === 'full') {
      baseTranslate = `${100 - MAP_TUNABLE_PARAMS.SHEET_FULL_DVH}%`;
    }

    if (dragOffsetPx !== 0) {
      return {
        transform: `translate3d(0, calc(${baseTranslate} + ${dragOffsetPx}px), 0)`,
        transition: 'none'
      };
    }
    return {
      transform: `translate3d(0, ${baseTranslate}, 0)`
    };
  };

  const displayActiveHeritage = useMemo(
    () => (activeHeritage ? languageService.translateHeritageItem(activeHeritage, language) : null),
    [activeHeritage, language]
  );

  const activeSelectionTitle = selectedProvinceName
    ? `${selectedProvinceName}`
    : selectedRegion === 'north'
    ? 'Miền Bắc Việt Nam'
    : selectedRegion === 'central'
    ? 'Miền Trung & Tây Nguyên'
    : selectedRegion === 'south'
    ? 'Miền Nam Việt Nam'
    : selectedRegion === 'islands'
    ? 'Biển Đảo & Chủ Quyền Việt Nam'
    : 'Toàn Quốc (34 Tỉnh/Thành)';

  return (
    <div
      className={`relative w-full overflow-hidden select-none text-stone-100 ${
        embedded
          ? 'h-[80dvh] min-h-[540px] max-h-[780px] rounded-3xl border border-amber-500/30 shadow-2xl'
          : 'h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4.5rem)]'
      }`}
      style={{
        backgroundColor: MAP_TUNABLE_PARAMS.OCEAN_COLOR,
        paddingTop: embedded ? undefined : 'env(safe-area-inset-top, 0px)'
      }}
    >
      {/* =====================================================================
          1. FULLSCREEN LEAFLET MAP CANVAS (touch-action: none, isolated z-stack)
      ===================================================================== */}
      <div
        ref={mapContainerRef}
        role="application"
        aria-label="Bản đồ di sản văn hóa Việt Nam tương tác"
        className="hdv-map-touch-canvas isolate absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: MAP_TUNABLE_PARAMS.OCEAN_GRADIENT
        }}
      />

      {/* =====================================================================
          2. TOP FLOATING SEARCH BAR + PROVINCE LIST TRIGGER + REGION CHIPS
      ===================================================================== */}
      <div className="absolute top-0 inset-x-0 z-20 p-2 sm:p-4 pointer-events-none flex flex-col gap-1.5 sm:gap-2 max-w-3xl lg:max-w-[calc(100%-380px)]">
        {/* Row 1: Search Input + "Danh sách tỉnh" Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              placeholder={languageService.t(
                'Tìm tỉnh, thành, di sản...',
                language,
                'Tìm tỉnh, thành, di sản...'
              )}
              aria-label="Tìm kiếm tỉnh thành hoặc tên di sản"
              className="w-full min-h-[44px] pl-9 pr-8 py-2 rounded-2xl bg-stone-950/90 backdrop-blur-md border border-amber-500/40 text-stone-100 placeholder-stone-400 text-[13px] sm:text-sm focus:outline-none focus:border-amber-400 shadow-lg"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Xóa từ khóa tìm kiếm"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className="w-9 h-9 rounded-xl text-stone-400 hover:text-stone-100 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Live Autocomplete Suggestions Dropdown */}
            {isSearchFocused &&
              searchQuery.trim().length > 0 &&
              (searchSuggestions.provinces.length > 0 ||
                searchSuggestions.heritages.length > 0) && (
                <div
                  role="listbox"
                  aria-label="Gợi ý tìm kiếm tỉnh thành và di sản"
                  className="absolute left-0 right-0 top-full mt-1.5 bg-stone-950/95 backdrop-blur-md border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden z-40 max-h-[60dvh] overflow-y-auto divide-y divide-stone-800/80"
                >
                  {searchSuggestions.provinces.length > 0 && (
                    <div className="p-2">
                      <div className="px-2.5 py-1 text-xs font-semibold text-amber-300">
                        Tỉnh / Thành phố
                      </div>
                      {searchSuggestions.provinces.map(prov => {
                        const count = provinceHeritageStats.get(prov.shortName)?.count || 0;
                        return (
                          <button
                            key={prov.code}
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              handleSelectProvince(prov.shortName);
                            }}
                            className="w-full min-h-[44px] px-3 py-2 rounded-xl hover:bg-stone-800/90 active:bg-amber-500/20 flex items-center justify-between text-left transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                              <div className="truncate">
                                <span className="text-sm font-bold text-stone-100">
                                  {prov.name}
                                </span>
                                {prov.historicalNames && prov.historicalNames.length > 0 && (
                                  <span className="text-xs text-stone-400 ml-1.5">
                                    ({prov.historicalNames.join(', ')})
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-amber-300 tabular-nums shrink-0 ml-2">
                              {count} điểm
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {searchSuggestions.heritages.length > 0 && (
                    <div className="p-2">
                      <div className="px-2.5 py-1 text-xs font-semibold text-amber-300">
                        Di sản văn hóa & Địa danh
                      </div>
                      {searchSuggestions.heritages.map(rawH => {
                        const h = languageService.translateHeritageItem(rawH, language);
                        return (
                          <button
                            key={rawH.id}
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              handleSelectHeritageItem(rawH);
                            }}
                            className="w-full min-h-[44px] px-3 py-2 rounded-xl hover:bg-stone-800/90 active:bg-amber-500/20 flex items-center justify-between gap-2 text-left transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-stone-100 truncate">
                                {h.name}
                              </div>
                              <div className="text-xs text-stone-400 truncate">
                                {h.province} · {h.categoryLabel}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Accessible "Xem danh sách tỉnh" Button (44x44px minimum) */}
          <button
            type="button"
            onClick={() => setIsProvinceDrawerOpen(true)}
            aria-label="Mở danh sách 34 tỉnh thành phố"
            className="min-h-[44px] min-w-[44px] px-2.5 sm:px-3 rounded-2xl bg-stone-950/90 hover:bg-stone-900 active:scale-95 active:bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shrink-0 transition-transform duration-150 cursor-pointer"
          >
            <ListFilter className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">34 Tỉnh</span>
          </button>
        </div>

        {/* Row 2: Horizontally Scrollable Region Filter Chips */}
        <div
          role="tablist"
          aria-label="Lọc bản đồ theo vùng miền"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-0.5"
        >
          {regionChips.map(chip => {
            const isActive = selectedRegion === chip.id && !selectedProvinceName;
            return (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Vùng ${chip.label}`}
                onClick={() => handleSelectRegionChip(chip.id)}
                className={`min-h-[44px] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-transform duration-150 active:scale-95 cursor-pointer shadow-md border ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 font-bold border-amber-200'
                    : 'bg-stone-950/85 text-stone-200 border-stone-800 hover:border-amber-500/40 backdrop-blur-md'
                }`}
              >
                {chip.label}
              </button>
            );
          })}

          {selectedProvinceName && (
            <button
              type="button"
              aria-label={`Bỏ chọn tỉnh ${selectedProvinceName}, quay về toàn quốc`}
              onClick={handleResetVietnamView}
              className="min-h-[44px] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 bg-amber-500 text-stone-950 border border-white flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <span>📍 {selectedProvinceName}</span>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Optional GPS Status Toast */}
        {locationMessage && (
          <div className="pointer-events-auto self-start px-3.5 py-2 rounded-xl bg-stone-950/95 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{locationMessage}</span>
          </div>
        )}
      </div>

      {/* =====================================================================
          3. RIGHT-SIDE THUMB-ZONE CONTROLS (+, -, Về toàn quốc, GPS, Chú giải (i))
             Minimum 44x44px each, >= 8px (gap-2) spacing
      ===================================================================== */}
      <div
        aria-label="Điều khiển phóng to, thu nhỏ và chú giải bản đồ"
        className="absolute right-2.5 sm:right-3 lg:right-[364px] bottom-[84px] sm:bottom-28 z-20 flex flex-col gap-2 pointer-events-auto"
      >
        <button
          type="button"
          aria-label="Phóng to bản đồ"
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl bg-stone-950/90 hover:bg-stone-900 active:scale-95 active:bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg backdrop-blur-md transition-transform duration-150 cursor-pointer"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Thu nhỏ bản đồ"
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl bg-stone-950/90 hover:bg-stone-900 active:scale-95 active:bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg backdrop-blur-md transition-transform duration-150 cursor-pointer"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Về toàn cảnh bản đồ Việt Nam"
          onClick={handleResetVietnamView}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl bg-stone-950/90 hover:bg-stone-900 active:scale-95 active:bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg backdrop-blur-md transition-transform duration-150 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Định vị tọa độ GPS của bạn"
          disabled={isLocating}
          onClick={handleRequestGPS}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl bg-stone-950/90 hover:bg-stone-900 active:scale-95 active:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shadow-lg backdrop-blur-md transition-transform duration-150 cursor-pointer disabled:opacity-50"
        >
          <LocateFixed className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
        </button>

        <button
          type="button"
          aria-label="Mở bảng chú giải và lớp bản đồ"
          aria-expanded={isLegendOpen}
          onClick={() => setIsLegendOpen(prev => !prev)}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl border flex items-center justify-center shadow-lg backdrop-blur-md transition-transform duration-150 active:scale-95 cursor-pointer ${
            isLegendOpen
              ? 'bg-amber-400 text-stone-950 border-white font-bold'
              : 'bg-stone-950/90 text-amber-300 border-amber-500/40 hover:bg-stone-900'
          }`}
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* =====================================================================
          4. COMPACT LEGEND POPOVER (Mở khi bấm nút (i), bấm ra ngoài để đóng)
      ===================================================================== */}
      {isLegendOpen && (
        <div
          className="absolute inset-0 z-30 bg-black/30"
          onClick={() => setIsLegendOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Chú giải bản đồ di sản Việt Nam"
            onClick={e => e.stopPropagation()}
            className="absolute right-16 lg:right-[420px] bottom-24 w-72 rounded-2xl bg-stone-950/95 backdrop-blur-md border border-amber-500/50 p-4 shadow-2xl space-y-3 text-xs text-stone-200"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="font-serif font-bold text-sm text-amber-300">
                Chú Giải Bản Đồ
              </span>
              <button
                type="button"
                aria-label="Đóng chú giải"
                onClick={() => setIsLegendOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0f2342] border-[1.5px] border-amber-400 text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                  8
                </span>
                <span>Chấm tỉnh/thành & số điểm di sản</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 border border-amber-200 font-mono text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  24
                </span>
                <span>Cụm tỉnh dày đặc (chạm để tách)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-600 border border-amber-300 text-white text-[10px] flex items-center justify-center shrink-0">
                  ★
                </span>
                <span className="text-amber-200 font-medium">
                  Quần đảo Hoàng Sa & Trường Sa (VN)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5 h-0.5 bg-amber-400 shrink-0" />
                <span>Ranh giới 34 tỉnh/thành & Quốc gia</span>
              </div>
            </div>

            {/* Map Base Layer Switcher inside (i) popover */}
            <div className="pt-2 border-t border-stone-800 space-y-1.5">
              <div className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Nền bản đồ:</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'vietnam_only', label: 'Chữ S VN' },
                    { id: 'satellite', label: 'Vệ Tinh' },
                    { id: 'streets', label: 'Giao Thông' }
                  ] as { id: MapBaseMode; label: string }[]
                ).map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setBaseMode(mode.id)}
                    className={`min-h-[38px] px-2 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      baseMode === mode.id
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. LOADING / ERROR OVERLAY FOR GEOJSON
      ===================================================================== */}
      {(loadingGeo || geoLoadError) && (
        <div className="absolute inset-x-4 top-32 z-20 flex justify-center pointer-events-none">
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-amber-400/40 bg-stone-950/95 px-4 py-3 text-center text-xs sm:text-sm text-stone-100 shadow-2xl backdrop-blur-md">
            {loadingGeo ? (
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                <span>Đang tải bản đồ 34 tỉnh/thành…</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-amber-300">Chưa tải được ranh giới bản đồ</p>
                <p className="text-xs text-stone-300">{geoLoadError}</p>
                <button
                  type="button"
                  onClick={() => setGeoRetry(v => v + 1)}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 font-bold text-stone-950 hover:bg-amber-300 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Thử tải lại</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          6. MOBILE 3-STATE DRAGGABLE BOTTOM SHEET (< lg) & DESKTOP SIDE PANEL (lg+)
      ===================================================================== */}
      {/* Mobile Bottom Sheet (< 1024px) */}
      <section
        aria-label="Thông tin di sản văn hóa"
        style={getSheetTranslateStyle()}
        className="lg:hidden absolute inset-x-0 bottom-0 h-[88dvh] z-30 bg-stone-950/95 backdrop-blur-md border-t border-amber-500/40 rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-200 ease-out will-change-transform pb-[env(safe-area-inset-bottom,0px)]"
      >
        {/* Drag Handle + Header Bar (Always visible in all 3 states, 76px tall) */}
        <div
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
          onMouseDown={handleSheetTouchStart}
          onMouseMove={handleSheetTouchMove}
          onMouseUp={handleSheetTouchEnd}
          onClick={cycleSheetState}
          role="button"
          tabIndex={0}
          aria-label={`Thanh kéo thông tin di sản (${
            sheetState === 'collapsed'
              ? 'Đang thu nhỏ, chạm hoặc vuốt lên để mở danh sách'
              : sheetState === 'half'
              ? 'Đang mở nửa màn hình, vuốt lên để mở rộng hoặc vuốt xuống để thu gọn'
              : 'Đang mở toàn màn hình, vuốt xuống để thu gọn'
          })`}
          className="min-h-[76px] px-4 pt-2.5 pb-3 border-b border-stone-800/80 flex flex-col justify-between cursor-grab active:cursor-grabbing shrink-0 select-none"
        >
          {/* Pill Handle */}
          <div className="w-11 h-1.5 rounded-full bg-amber-400/50 mx-auto mb-2" />

          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-stone-100 text-base truncate">
                  {sheetState === 'full' && displayActiveHeritage
                    ? displayActiveHeritage.name
                    : activeSelectionTitle}
                </h3>
                <span className="text-xs font-mono font-bold text-amber-300 tabular-nums shrink-0">
                  · {heritagesInView.length} di sản
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate mt-0.5">
                {sheetState === 'collapsed'
                  ? 'Vuốt lên hoặc chạm để xem danh sách di sản'
                  : sheetState === 'half'
                  ? 'Chạm vào một di sản để xem chi tiết đầy đủ'
                  : displayActiveHeritage
                  ? `${displayActiveHeritage.province} · ${displayActiveHeritage.categoryLabel}`
                  : 'Danh sách di sản văn hóa'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {selectedProvinceName && (
                <button
                  type="button"
                  aria-label="Quay về toàn quốc"
                  onClick={e => {
                    e.stopPropagation();
                    handleResetVietnamView();
                  }}
                  className="min-h-[44px] px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-700 text-xs font-semibold flex items-center gap-1 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Toàn quốc</span>
                </button>
              )}

              <button
                type="button"
                aria-label={sheetState === 'collapsed' ? 'Mở rộng bảng di sản' : 'Thu gọn bảng di sản'}
                onClick={e => {
                  e.stopPropagation();
                  cycleSheetState();
                }}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 flex items-center justify-center active:scale-95"
              >
                {sheetState === 'collapsed' ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sheet Body: Either FULL Heritage Detail OR Scrollable Heritage List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
          {sheetState === 'full' && activeHeritage && displayActiveHeritage ? (
            /* STATE 3: FULL SCREEN HERITAGE DETAIL */
            <div className="space-y-4 pb-8">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveHeritage(null);
                    setSheetState('half');
                  }}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 text-sm font-semibold flex items-center gap-1.5 active:scale-95"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  <span>Quay lại danh sách ({heritagesInView.length})</span>
                </button>

                {onSelectHeritage && (
                  <button
                    type="button"
                    onClick={() => onSelectHeritage(activeHeritage)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Mở hồ sơ lớn</span>
                  </button>
                )}
              </div>

              <div className="relative h-52 sm:h-64 w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
                <img
                  src={getSafeHeritageImageUrl(activeHeritage.imageUrl, activeHeritage.id)}
                  alt={displayActiveHeritage.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-amber-300 font-semibold">
                  {displayActiveHeritage.province} · {displayActiveHeritage.categoryLabel}
                  {displayActiveHeritage.period ? ` · ${displayActiveHeritage.period}` : ''}
                </div>
                <h4 className="font-serif font-bold text-xl text-stone-100">
                  {displayActiveHeritage.name}
                </h4>
              </div>

              <div className="space-y-2">
                <h5 className="font-serif font-bold text-amber-300 text-sm">
                  Ý nghĩa Văn hóa & Lịch sử
                </h5>
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                  {displayActiveHeritage.culturalSignificance}
                </p>
              </div>

              {displayActiveHeritage.history && (
                <div className="space-y-2">
                  <h5 className="font-serif font-bold text-amber-300 text-sm">
                    Lịch sử Hình thành
                  </h5>
                  <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                    {displayActiveHeritage.history}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs text-stone-400 block">Giờ mở cửa</span>
                    <span className="text-stone-100 font-medium">
                      {displayActiveHeritage.visitingHours || '07:30 - 17:30 hàng ngày'}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs text-stone-400 block">Giá vé tham khảo</span>
                    <span className="text-stone-100 font-medium">
                      {displayActiveHeritage.ticketPrice || 'Mở cửa tự do / Theo quy định'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    onNavigateToStory(
                      displayActiveHeritage.name,
                      displayActiveHeritage.history,
                      displayActiveHeritage.period
                    )
                  }
                  className="min-h-[48px] px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 shrink-0" />
                  <span>Nghe Kể Chuyện</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToFood(activeHeritage.id)}
                  className="min-h-[48px] px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                >
                  <Utensils className="w-4 h-4 shrink-0" />
                  <span>Ẩm Thực Gần Đây</span>
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: HALF / FULL SCROLLABLE HERITAGE LIST */
            <>
              {/* Category Filter Strip inside sheet */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {heritagesInView.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <Compass className="w-9 h-9 text-stone-600 mx-auto" />
                  <p className="text-sm text-stone-300">
                    Chưa có di sản nào khớp với bộ lọc hiện tại.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetVietnamView}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-sm inline-flex items-center gap-2 active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Xem toàn bộ di sản Việt Nam</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 pb-10">
                  {heritagesInView.map(rawItem => {
                    const dist = userLocation
                      ? calculateDistanceKm(
                          userLocation.lat,
                          userLocation.lng,
                          rawItem.lat,
                          rawItem.lng
                        )
                      : null;
                    return (
                      <HeritageListRow
                        key={rawItem.id}
                        rawItem={rawItem}
                        language={language}
                        isSelected={activeHeritage?.id === rawItem.id}
                        distanceKm={dist}
                        isAdmin={currentUser?.role === 'admin'}
                        onSelect={handleSelectHeritageItem}
                        onEdit={setEditingHeritage}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =====================================================================
          7. DESKTOP ADAPTIVE SIDE PANEL (lg:flex, >= 1024px)
      ===================================================================== */}
      <aside
        aria-label="Danh sách và chi tiết di sản trên máy tính"
        className="hidden lg:flex flex-col absolute top-3 bottom-3 right-3 w-[340px] z-20 bg-stone-950/95 backdrop-blur-md border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-stone-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-serif font-bold text-base text-stone-100 truncate">
              {activeSelectionTitle}
            </h3>
            <p className="text-xs text-amber-300 font-mono tabular-nums mt-0.5">
              {heritagesInView.length} điểm di sản văn hóa
            </p>
          </div>
          {selectedProvinceName && (
            <button
              type="button"
              onClick={handleResetVietnamView}
              className="min-h-[40px] px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Toàn quốc</span>
            </button>
          )}
        </div>

        {/* Category Filter Strip */}
        <div className="px-3 py-2 border-b border-stone-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-300 hover:text-amber-300 border border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
          {activeHeritage && displayActiveHeritage ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveHeritage(null)}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  <span>Danh sách ({heritagesInView.length})</span>
                </button>
                {onSelectHeritage && (
                  <button
                    type="button"
                    onClick={() => onSelectHeritage(activeHeritage)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Xem rộng</span>
                  </button>
                )}
              </div>

              <div className="h-44 w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
                <img
                  src={getSafeHeritageImageUrl(activeHeritage.imageUrl, activeHeritage.id)}
                  alt={displayActiveHeritage.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="text-xs text-amber-300 font-semibold">
                  {displayActiveHeritage.province} · {displayActiveHeritage.categoryLabel}
                </div>
                <h4 className="font-serif font-bold text-lg text-stone-100 mt-0.5">
                  {displayActiveHeritage.name}
                </h4>
              </div>

              <p className="text-sm text-stone-200 leading-relaxed">
                {displayActiveHeritage.culturalSignificance}
              </p>

              {displayActiveHeritage.history && (
                <p className="text-xs text-stone-300 leading-relaxed border-t border-stone-800 pt-2">
                  {displayActiveHeritage.history}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onNavigateToStory(
                      displayActiveHeritage.name,
                      displayActiveHeritage.history,
                      displayActiveHeritage.period
                    )
                  }
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Kể chuyện</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToFood(activeHeritage.id)}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Ẩm thực</span>
                </button>
              </div>
            </div>
          ) : (
            heritagesInView.map(rawItem => {
              const dist = userLocation
                ? calculateDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    rawItem.lat,
                    rawItem.lng
                  )
                : null;
              return (
                <HeritageListRow
                  key={rawItem.id}
                  rawItem={rawItem}
                  language={language}
                  isSelected={activeHeritage?.id === rawItem.id}
                  distanceKm={dist}
                  isAdmin={currentUser?.role === 'admin'}
                  onSelect={handleSelectHeritageItem}
                  onEdit={setEditingHeritage}
                />
              );
            })
          )}
        </div>
      </aside>

      {/* =====================================================================
          8. ACCESSIBLE "XEM DANH SÁCH 34 TỈNH/THÀNH" DRAWER MODAL
             (Allows choosing any province without touching the map)
      ===================================================================== */}
      {isProvinceDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setIsProvinceDrawerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Danh sách 34 tỉnh thành phố Việt Nam"
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[85dvh] bg-stone-950 border-t sm:border border-amber-500/50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
          >
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-100">
                  Danh Sách 34 Tỉnh / Thành Phố
                </h3>
                <p className="text-xs text-stone-400">
                  Chọn tỉnh thành bất kỳ để xem danh sách di sản mà không cần chạm bản đồ
                </p>
              </div>
              <button
                type="button"
                aria-label="Đóng danh sách tỉnh thành"
                onClick={() => setIsProvinceDrawerOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-stone-800 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={provinceDrawerSearch}
                  onChange={e => setProvinceDrawerSearch(e.target.value)}
                  placeholder="Nhập tên tỉnh/thành (kể cả tên cũ trước sáp nhập)..."
                  aria-label="Lọc tên tỉnh thành"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'all', label: 'Tất cả (34)' },
                    { id: 'north', label: 'Miền Bắc' },
                    { id: 'central', label: 'Miền Trung' },
                    { id: 'south', label: 'Miền Nam' }
                  ] as const
                ).map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setProvinceDrawerRegion(r.id)}
                    className={`min-h-[40px] px-2 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      provinceDrawerRegion === r.id
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredProvincesForDrawer.map(unit => {
                const count = provinceHeritageStats.get(unit.shortName)?.count || 0;
                const isSelected =
                  selectedProvinceName !== null &&
                  provinceNameMatches(unit.shortName, selectedProvinceName);

                return (
                  <button
                    key={unit.code}
                    type="button"
                    onClick={() => handleSelectProvince(unit.shortName)}
                    className={`w-full min-h-[56px] p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-transform active:scale-[0.98] cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-stone-900/80 hover:bg-stone-900 border-stone-800 text-stone-100'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-bold text-stone-100 truncate">
                        {unit.name}
                      </div>
                      <div className="text-xs text-stone-400 truncate mt-0.5">
                        {unit.regionName}
                        {unit.historicalNames && unit.historicalNames.length > 0
                          ? ` · Kế thừa: ${unit.historicalNames.join(', ')}`
                          : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-stone-950 border border-amber-400/50 text-amber-300 font-mono text-xs font-bold tabular-nums">
                        {count} di sản
                      </span>
                      <ChevronRight className="w-4 h-4 text-amber-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          9. ADMIN IN-MAP HERITAGE EDIT MODAL
      ===================================================================== */}
      {editingHeritage && (
        <HeritageEditModal
          isOpen={!!editingHeritage}
          heritage={editingHeritage}
          language={language}
          onClose={() => setEditingHeritage(null)}
          onSaveSuccess={savedItem => {
            setEditingHeritage(null);
            setActiveHeritage(savedItem);
            setHeritages(storageService.getHeritages());
          }}
        />
      )}
    </div>
  );
};
