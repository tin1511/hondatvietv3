/**
 * Weather Forecast Service for HỒN ĐẤT VIỆT
 * Integrates real-time Open-Meteo Weather Forecast API with accurate WMO codes,
 * geographic coordinates for all 63 Vietnamese provinces & key heritage destinations,
 * bilingual Vietnamese/English localization, and smart cultural activity suggestions.
 */

import { CityWeatherData, DailyWeatherForecast } from '../types';
import { VIETNAM_63_ADMINISTRATIVE_UNITS } from '../data/administrativeUnits';

export interface WeatherConditionInfo {
  vi: string;
  en: string;
  icon: string;
  isRainy: boolean;
  isHot: boolean;
  isStormy: boolean;
  category: 'clear' | 'partly_cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'thunderstorm' | 'snow';
}

/**
 * Standard WMO Weather interpretation codes (WW)
 */
export const WMO_WEATHER_MAP: Record<number, WeatherConditionInfo> = {
  0: { vi: 'Trời quang đãng, nắng đẹp', en: 'Clear sky, sunny', icon: '☀️', isRainy: false, isHot: false, isStormy: false, category: 'clear' },
  1: { vi: 'Trời ít mây, nắng dịu', en: 'Mainly clear, mild sun', icon: '🌤️', isRainy: false, isHot: false, isStormy: false, category: 'clear' },
  2: { vi: 'Mây rải rác, râm mát', en: 'Partly cloudy, pleasant', icon: '⛅', isRainy: false, isHot: false, isStormy: false, category: 'partly_cloudy' },
  3: { vi: 'Nhiều mây, âm u', en: 'Overcast, cloudy', icon: '☁️', isRainy: false, isHot: false, isStormy: false, category: 'cloudy' },
  45: { vi: 'Sương mù nhẹ', en: 'Foggy', icon: '🌫️', isRainy: false, isHot: false, isStormy: false, category: 'fog' },
  48: { vi: 'Sương mù dày đặc', en: 'Depositing rime fog', icon: '🌫️', isRainy: false, isHot: false, isStormy: false, category: 'fog' },
  51: { vi: 'Mưa phùn nhẹ', en: 'Light drizzle', icon: '🌦️', isRainy: true, isHot: false, isStormy: false, category: 'drizzle' },
  53: { vi: 'Mưa phùn rải rác', en: 'Moderate drizzle', icon: '🌦️', isRainy: true, isHot: false, isStormy: false, category: 'drizzle' },
  55: { vi: 'Mưa phùn hạt dày', en: 'Dense drizzle', icon: '🌧️', isRainy: true, isHot: false, isStormy: false, category: 'drizzle' },
  56: { vi: 'Mưa phùn lạnh buốt', en: 'Light freezing drizzle', icon: '🌧️', isRainy: true, isHot: false, isStormy: false, category: 'drizzle' },
  57: { vi: 'Mưa phùn dày lạnh', en: 'Dense freezing drizzle', icon: '🌧️', isRainy: true, isHot: false, isStormy: false, category: 'drizzle' },
  61: { vi: 'Mưa rào nhẹ', en: 'Slight rain showers', icon: '🌦️', isRainy: true, isHot: false, isStormy: false, category: 'rain' },
  63: { vi: 'Mưa vừa', en: 'Moderate rain', icon: '🌧️', isRainy: true, isHot: false, isStormy: false, category: 'rain' },
  65: { vi: 'Mưa to nặng hạt', en: 'Heavy rain', icon: '🌧️', isRainy: true, isHot: false, isStormy: false, category: 'rain' },
  66: { vi: 'Mưa lạnh giá', en: 'Freezing rain', icon: '🌧️', isRainy: true, isHot: false, isStormy: false, category: 'rain' },
  67: { vi: 'Mưa lớn lạnh giá', en: 'Heavy freezing rain', icon: '🌧️', isRainy: true, isHot: false, isStormy: false, category: 'rain' },
  71: { vi: 'Tuyết rơi nhẹ (khu vực núi cao)', en: 'Slight snow fall', icon: '🌨️', isRainy: false, isHot: false, isStormy: false, category: 'snow' },
  73: { vi: 'Tuyết rơi vừa', en: 'Moderate snow fall', icon: '❄️', isRainy: false, isHot: false, isStormy: false, category: 'snow' },
  75: { vi: 'Tuyết rơi dày', en: 'Heavy snow fall', icon: '❄️', isRainy: false, isHot: false, isStormy: false, category: 'snow' },
  77: { vi: 'Mưa hạt tuyết', en: 'Snow grains', icon: '🌨️', isRainy: false, isHot: false, isStormy: false, category: 'snow' },
  80: { vi: 'Mưa rào ngắt quãng', en: 'Slight rain showers', icon: '🌦️', isRainy: true, isHot: false, isStormy: false, category: 'rain' },
  81: { vi: 'Mưa rào từng cơn', en: 'Moderate rain showers', icon: '🌧️', isRainy: true, isHot: false, isStormy: false, category: 'rain' },
  82: { vi: 'Mưa rào xối xả', en: 'Violent rain showers', icon: '⛈️', isRainy: true, isHot: false, isStormy: true, category: 'rain' },
  85: { vi: 'Mưa tuyết nhẹ', en: 'Slight snow showers', icon: '🌨️', isRainy: true, isHot: false, isStormy: false, category: 'snow' },
  86: { vi: 'Mưa tuyết nặng hạt', en: 'Heavy snow showers', icon: '❄️', isRainy: true, isHot: false, isStormy: false, category: 'snow' },
  95: { vi: 'Dông sét, sấm chớp', en: 'Thunderstorm', icon: '⛈️', isRainy: true, isHot: false, isStormy: true, category: 'thunderstorm' },
  96: { vi: 'Dông kèm mưa đá nhẹ', en: 'Thunderstorm with slight hail', icon: '⛈️', isRainy: true, isHot: false, isStormy: true, category: 'thunderstorm' },
  99: { vi: 'Dông kèm mưa đá lớn nguy hiểm', en: 'Thunderstorm with heavy hail', icon: '⛈️', isRainy: true, isHot: false, isStormy: true, category: 'thunderstorm' },
};

/**
 * Key Vietnam Tourism & Heritage Hubs Coordinate Presets
 */
export const POPULAR_TOURISM_DESTINATIONS: { nameVi: string; nameEn: string; queryKey: string; lat: number; lng: number }[] = [
  { nameVi: 'Thành phố Huế (Cố đô)', nameEn: 'Hue Imperial City', queryKey: 'Thành phố Huế', lat: 16.4637, lng: 107.5909 },
  { nameVi: 'Thủ đô Hà Nội', nameEn: 'Hanoi (Capital)', queryKey: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { nameVi: 'Phố cổ Hội An (Quảng Nam)', nameEn: 'Hoi An Ancient Town', queryKey: 'Phố cổ Hội An', lat: 15.8801, lng: 108.3380 },
  { nameVi: 'Ninh Bình (Tràng An - Bái Đính)', nameEn: 'Ninh Binh (Trang An)', queryKey: 'Ninh Bình', lat: 20.2506, lng: 105.9744 },
  { nameVi: 'TP. Hồ Chí Minh (Sài Gòn)', nameEn: 'Ho Chi Minh City', queryKey: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297 },
  { nameVi: 'Đà Nẵng (Bà Nà - Ngũ Hành Sơn)', nameEn: 'Da Nang City', queryKey: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
  { nameVi: 'Vịnh Hạ Long (Quảng Ninh)', nameEn: 'Ha Long Bay (Quang Ninh)', queryKey: 'Quảng Ninh', lat: 20.9505, lng: 107.0734 },
  { nameVi: 'Sa Pa & Fansipan (Lào Cai)', nameEn: 'Sa Pa (Lao Cai)', queryKey: 'Lào Cai', lat: 22.3364, lng: 103.8438 },
  { nameVi: 'Hà Giang (Cao nguyên đá Đồng Văn)', nameEn: 'Ha Giang Geopark', queryKey: 'Hà Giang', lat: 22.8233, lng: 104.9839 },
  { nameVi: 'Cao Bằng (Thác Bản Giốc - Pác Bó)', nameEn: 'Cao Bang (Ban Gioc)', queryKey: 'Cao Bằng', lat: 22.6666, lng: 106.2639 },
  { nameVi: 'Đà Lạt (Lâm Đồng)', nameEn: 'Da Lat (Lam Dong)', queryKey: 'Lâm Đồng', lat: 11.9404, lng: 108.4583 },
  { nameVi: 'Nha Trang (Khánh Hòa)', nameEn: 'Nha Trang (Khanh Hoa)', queryKey: 'Khánh Hòa', lat: 12.2388, lng: 109.1967 },
  { nameVi: 'Đảo Phú Quốc (Kiên Giang)', nameEn: 'Phu Quoc Island', queryKey: 'Kiên Giang', lat: 10.2289, lng: 103.9572 },
  { nameVi: 'Cần Thơ (Miền Tây sông nước)', nameEn: 'Can Tho (Mekong Delta)', queryKey: 'Cần Thơ', lat: 10.0452, lng: 105.7469 },
  { nameVi: 'Côn Đảo (Bà Rịa - Vũng Tàu)', nameEn: 'Con Dao Islands', queryKey: 'Bà Rịa - Vũng Tàu', lat: 8.6835, lng: 106.6087 },
  { nameVi: 'Mũi Né - Phan Thiết (Bình Thuận)', nameEn: 'Mui Ne - Phan Thiet', queryKey: 'Bình Thuận', lat: 10.9333, lng: 108.1000 },
  { nameVi: 'Tây Ninh (Núi Bà Đen - Tòa Thánh)', nameEn: 'Tay Ninh (Ba Den Mountain)', queryKey: 'Tây Ninh', lat: 11.3100, lng: 106.0983 }
];

// In-memory cache for fast responsive tab switching
const weatherMemoryCache = new Map<string, { timestamp: number; data: CityWeatherData }>();
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

/**
 * Resolves destination or city string to coordinates and standardized city name
 */
export function resolveCityCoordinates(query: string): { name: string; lat: number; lng: number } {
  const q = (query || '').toLowerCase().trim();

  // 1. Direct match with popular tourism destinations
  for (const item of POPULAR_TOURISM_DESTINATIONS) {
    if (
      q.includes(item.queryKey.toLowerCase()) || 
      item.queryKey.toLowerCase().includes(q) || 
      q.includes(item.nameVi.toLowerCase()) ||
      q.includes(item.nameEn.toLowerCase())
    ) {
      return { name: item.nameVi, lat: item.lat, lng: item.lng };
    }
  }

  // 2. Specific landmark keywords
  if (q.includes('huế') || q.includes('cố đô') || q.includes('đại nội') || q.includes('hương giang')) {
    return { name: 'Thành phố Huế', lat: 16.4637, lng: 107.5909 };
  }
  if (q.includes('hà nội') || q.includes('thăng long') || q.includes('hồ gươm') || q.includes('ba đình')) {
    return { name: 'Hà Nội', lat: 21.0285, lng: 105.8542 };
  }
  if (q.includes('hội an') || q.includes('mỹ sơn') || q.includes('chùa cầu')) {
    return { name: 'Hội An (Quảng Nam)', lat: 15.8801, lng: 108.3380 };
  }
  if (q.includes('ninh bình') || q.includes('tràng an') || q.includes('bái đính') || q.includes('tam cốc') || q.includes('hoa lư')) {
    return { name: 'Ninh Bình', lat: 20.2506, lng: 105.9744 };
  }
  if (q.includes('hồ chí minh') || q.includes('sài gòn') || q.includes('bến thành') || q.includes('chợ lớn')) {
    return { name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297 };
  }
  if (q.includes('đà nẵng') || q.includes('bà nà') || q.includes('ngũ hành sơn') || q.includes('cầu rồng')) {
    return { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 };
  }
  if (q.includes('hạ long') || q.includes('quảng ninh') || q.includes('yên tử') || q.includes('cô tô')) {
    return { name: 'Quảng Ninh', lat: 20.9505, lng: 107.0734 };
  }
  if (q.includes('sa pa') || q.includes('sapa') || q.includes('fansipan') || q.includes('lào cai')) {
    return { name: 'Sa Pa (Lào Cai)', lat: 22.3364, lng: 103.8438 };
  }
  if (q.includes('đà lạt') || q.includes('lâm đồng') || q.includes('langbiang')) {
    return { name: 'Đà Lạt (Lâm Đồng)', lat: 11.9404, lng: 108.4583 };
  }
  if (q.includes('phú quốc') || q.includes('kiên giang')) {
    return { name: 'Phú Quốc (Kiên Giang)', lat: 10.2289, lng: 103.9572 };
  }

  // 3. Search in all 63 Vietnam administrative units
  for (const unit of VIETNAM_63_ADMINISTRATIVE_UNITS) {
    const sName = unit.shortName.toLowerCase();
    const fName = unit.name.toLowerCase();
    if (q.includes(sName) || sName.includes(q) || q.includes(fName) || fName.includes(q)) {
      return { name: unit.shortName, lat: unit.center[0], lng: unit.center[1] };
    }
  }

  // Fallback to Hue (Cultural heartland of Vietnam)
  return { name: 'Thành phố Huế', lat: 16.4637, lng: 107.5909 };
}

/**
 * Format day of week in Vietnamese or English
 */
export function formatDayOfWeek(dateStr: string, language: string = 'vi'): string {
  try {
    const date = new Date(dateStr + 'T12:00:00');
    if (language === 'en') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    }
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return days[date.getDay()];
  } catch {
    return dateStr;
  }
}

/**
 * Format date display (e.g. 18/10 or Oct 18)
 */
export function formatDateDisplay(dateStr: string, language: string = 'vi'): string {
  try {
    const [year, month, day] = dateStr.split('-');
    if (language === 'en') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
    }
    return `${parseInt(day, 10)}/${parseInt(month, 10)}`;
  } catch {
    return dateStr;
  }
}

/**
 * Generates tailored cultural activity suggestions and warnings based on weather parameters
 */
export function generateActivitySuggestions(params: {
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  cityName: string;
}): { suggestionVi: string; suggestionEn: string; warningVi?: string; warningEn?: string } {
  const { weatherCode, tempMax, tempMin, precipitationSum, precipitationProbability, windSpeedMax, uvIndexMax, cityName } = params;

  const isStormy = weatherCode >= 95 || windSpeedMax > 38;
  const isRainy = precipitationProbability >= 50 || precipitationSum > 2 || (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isHot = tempMax >= 33 || uvIndexMax >= 8;
  const isCold = tempMax <= 17;

  let warningVi: string | undefined;
  let warningEn: string | undefined;

  if (isStormy) {
    warningVi = `⚠️ Cảnh báo thời tiết: Dự báo có dông sét mạnh (gió giật ${Math.round(windSpeedMax)} km/h). Quý khách nên tạm hoãn các hoạt động du thuyền sông/biển hoặc leo núi dã ngoại.`;
    warningEn = `⚠️ Weather Alert: Severe thunderstorm forecast (gusts up to ${Math.round(windSpeedMax)} km/h). Avoid river/boat excursions or high mountain hikes.`;
  } else if (isHot && uvIndexMax >= 9) {
    warningVi = `☀️ Cảnh báo nắng nóng: Chỉ số UV cực cao (${uvIndexMax.toFixed(1)}/11+). Hạn chế phơi nắng từ 11:00 đến 14:30; trang bị nón lá, kem chống nắng và nước bù điện giải.`;
    warningEn = `☀️ Heat & UV Alert: Very high UV index (${uvIndexMax.toFixed(1)}/11+). Minimize direct sun exposure between 11:00 AM - 2:30 PM; use sunscreen and stay well-hydrated.`;
  }

  let suggestionVi = '';
  let suggestionEn = '';

  if (isRainy) {
    suggestionVi = `🌧️ Trời mưa: Ưu tiên tham quan bảo tàng di sản trong nhà, các gian cung điện có mái che, trải nghiệm workshop làng nghề truyền thống (làm gốm, thêu ren, in tranh Đông Hồ) hoặc thưởng thức trà chiều, cà phê văn hóa tại ${cityName}. Mang theo ô/dù gấp và túi chống nước cho thiết bị.`;
    suggestionEn = `🌧️ Rainy day: Prioritize indoor museums, covered royal palace halls, traditional craft workshops (pottery, embroidery, folk painting), or cultural tea houses in ${cityName}. Carry a compact umbrella and water-resistant bags.`;
  } else if (isHot) {
    suggestionVi = `☀️ Nắng nhiều & nhiệt độ cao (${Math.round(tempMax)}°C): Khám phá các quần thể di tích ngoài trời vào sáng sớm (07:00 - 09:30) hoặc cuối chiều hoàng hôn (16:00 - 18:00) để có ánh sáng đẹp nhất và thời tiết mát mẻ. Buổi trưa ghé nghỉ ngơi tại các quán ăn đặc sản bản địa hoặc bảo tàng có bóng râm mát.`;
    suggestionEn = `☀️ Sunny & warm (${Math.round(tempMax)}°C): Visit outdoor landmarks in early morning (7:00 - 9:30 AM) or late afternoon golden hour (4:00 - 6:00 PM). Spend midday enjoying local cuisine or visiting sheltered museums and scenic cafes.`;
  } else if (isCold) {
    suggestionVi = `🧥 Thời tiết se lạnh (${Math.round(tempMin)}°C - ${Math.round(tempMax)}°C): Mặc thêm áo khoác nhẹ hoặc khăn choàng khi dạo quanh di tích. Rất thích hợp thưởng thức các món ăn nóng hổi (bún bò, phở truyền thống, bánh nóng) và uống trà thảo mộc cung đình.`;
    suggestionEn = `🧥 Cool & crisp (${Math.round(tempMin)}°C - ${Math.round(tempMax)}°C): Wear a light jacket or scarf when strolling historical sites. Ideal for enjoying hot heritage soups and traditional Vietnamese royal tea.`;
  } else {
    suggestionVi = `✨ Thời tiết lý tưởng (${Math.round(tempMin)}°C - ${Math.round(tempMax)}°C): Điều kiện tuyệt vời cho mọi hoạt động ngoài trời: dạo bộ phố cổ, đạp xe quanh thành quách, chụp ảnh cổ phục hoàng gia và khám phá các làng nghề ven sông tại ${cityName}.`;
    suggestionEn = `✨ Ideal weather (${Math.round(tempMin)}°C - ${Math.round(tempMax)}°C): Perfect conditions for walking tours, cycling around ancient ramparts, royal costume photo shoots, and exploring artisan craft villages in ${cityName}.`;
  }

  return { suggestionVi, suggestionEn, warningVi, warningEn };
}

/**
 * Main function: Fetch real-time weather from backend proxy /api/weather
 * with fallback to client-side Open-Meteo API and local caching.
 */
export async function fetchWeatherData(destinationQuery: string): Promise<CityWeatherData> {
  const resolved = resolveCityCoordinates(destinationQuery);
  const cacheKey = `weather_${resolved.lat.toFixed(2)}_${resolved.lng.toFixed(2)}`;

  // 1. Check in-memory cache
  const cached = weatherMemoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // 2. Check localStorage cache
  try {
    const localSaved = localStorage.getItem(cacheKey);
    if (localSaved) {
      const parsed = JSON.parse(localSaved);
      if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        weatherMemoryCache.set(cacheKey, { timestamp: parsed.timestamp, data: parsed.data });
        return parsed.data;
      }
    }
  } catch {
    // Ignore storage parse error
  }

  // 3. Try server-side API proxy first
  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(resolved.name)}&lat=${resolved.lat}&lng=${resolved.lng}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        const weatherData: CityWeatherData = json.data;
        weatherMemoryCache.set(cacheKey, { timestamp: Date.now(), data: weatherData });
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: weatherData }));
        } catch {}
        return weatherData;
      }
    }
  } catch (err) {
    console.warn('[Weather Service] Backend proxy error, falling back to direct Open-Meteo:', err);
  }

  // 4. Fallback directly to Open-Meteo Client-Side Call
  const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${resolved.lat}&longitude=${resolved.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max&timezone=Asia%2FHo_Chi_Minh`;

  const openMeteoRes = await fetch(openMeteoUrl);
  if (!openMeteoRes.ok) {
    throw new Error(`Không thể kết nối Open-Meteo API (${openMeteoRes.status})`);
  }

  const raw = await openMeteoRes.json();
  const current = raw.current || {};
  const daily = raw.daily || {};

  const currentWmo = WMO_WEATHER_MAP[current.weather_code] || WMO_WEATHER_MAP[0];

  const dailyList: DailyWeatherForecast[] = [];
  const times: string[] = daily.time || [];

  for (let i = 0; i < times.length; i++) {
    const dateStr = times[i];
    const code = daily.weather_code?.[i] ?? 0;
    const wmo = WMO_WEATHER_MAP[code] || WMO_WEATHER_MAP[0];
    const tempMax = daily.temperature_2m_max?.[i] ?? 30;
    const tempMin = daily.temperature_2m_min?.[i] ?? 24;
    const precipSum = daily.precipitation_sum?.[i] ?? 0;
    const precipProb = daily.precipitation_probability_max?.[i] ?? 20;
    const uvMax = daily.uv_index_max?.[i] ?? 6;
    const windMax = daily.wind_speed_10m_max?.[i] ?? 12;

    const { suggestionVi, suggestionEn, warningVi, warningEn } = generateActivitySuggestions({
      weatherCode: code,
      tempMax,
      tempMin,
      precipitationSum: precipSum,
      precipitationProbability: precipProb,
      windSpeedMax: windMax,
      uvIndexMax: uvMax,
      cityName: resolved.name
    });

    dailyList.push({
      date: dateStr,
      dayOfWeek: formatDayOfWeek(dateStr, 'vi'),
      dayIndex: i + 1,
      weatherCode: code,
      conditionText: wmo.vi,
      conditionIcon: wmo.icon,
      tempMax: Math.round(tempMax),
      tempMin: Math.round(tempMin),
      precipitationSum: Math.round(precipSum * 10) / 10,
      precipitationProbability: Math.round(precipProb),
      uvIndexMax: Math.round(uvMax * 10) / 10,
      windSpeedMax: Math.round(windMax),
      isRainy: wmo.isRainy || precipProb >= 50,
      isHot: wmo.isHot || tempMax >= 33,
      isStormy: wmo.isStormy,
      activitySuggestionVi: suggestionVi,
      activitySuggestionEn: suggestionEn,
      warningNoticeVi: warningVi,
      warningNoticeEn: warningEn
    });
  }

  const result: CityWeatherData = {
    cityName: resolved.name,
    destinationKey: destinationQuery,
    latitude: resolved.lat,
    longitude: resolved.lng,
    current: {
      temperature: Math.round(current.temperature_2m ?? 28),
      apparentTemperature: Math.round(current.apparent_temperature ?? 30),
      weatherCode: current.weather_code ?? 0,
      conditionText: currentWmo.vi,
      conditionIcon: currentWmo.icon,
      humidity: Math.round(current.relative_humidity_2m ?? 75),
      windSpeed: Math.round(current.wind_speed_10m ?? 8),
      precipitation: Math.round((current.precipitation ?? 0) * 10) / 10,
      isDay: current.is_day === 1
    },
    daily: dailyList,
    updatedAt: new Date().toISOString(),
    source: 'Open-Meteo WMO'
  };

  weatherMemoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: result }));
  } catch {}

  return result;
}

export const weatherService = {
  fetchWeatherData,
  resolveCityCoordinates,
  formatDayOfWeek,
  formatDateDisplay,
  POPULAR_TOURISM_DESTINATIONS,
  WMO_WEATHER_MAP
};
