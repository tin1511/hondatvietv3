import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  AlertTriangle, 
  MapPin, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Sparkles, 
  ShieldAlert, 
  Info, 
  Umbrella, 
  Check, 
  Search,
  ExternalLink
} from 'lucide-react';
import { CityWeatherData, DailyWeatherForecast } from '../types';
import { 
  weatherService, 
  POPULAR_TOURISM_DESTINATIONS, 
  formatDayOfWeek, 
  formatDateDisplay 
} from '../services/weatherService';

interface ItineraryWeatherCardProps {
  destination: string;
  onCityChange?: (newCity: string) => void;
  language?: string;
  selectedDate?: string; // Optional target date YYYY-MM-DD
  durationDays?: number; // 1, 2, 3 days
  className?: string;
}

export const ItineraryWeatherCard: React.FC<ItineraryWeatherCardProps> = ({
  destination,
  onCityChange,
  language = 'vi',
  selectedDate,
  durationDays = 1,
  className = ''
}) => {
  const isEn = language === 'en';

  const [weatherData, setWeatherData] = useState<CityWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);
  const [searchCityQuery, setSearchCityQuery] = useState<string>('');

  // Fetch weather data whenever destination changes
  const loadWeather = async (dest: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.fetchWeatherData(dest);
      setWeatherData(data);

      // If selectedDate is provided, find corresponding day index
      if (selectedDate && data.daily?.length > 0) {
        const foundIdx = data.daily.findIndex(d => d.date === selectedDate);
        if (foundIdx !== -1) {
          setSelectedDayIndex(foundIdx);
        } else {
          setSelectedDayIndex(0);
        }
      } else {
        setSelectedDayIndex(0);
      }
    } catch (err: any) {
      console.warn('[ItineraryWeatherCard] Load weather failed:', err);
      setError(isEn ? 'Unable to load real-time weather. Please check connection.' : 'Không thể tải dữ liệu thời tiết thực tế. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(destination);
  }, [destination]);

  // Handle city selection
  const handleSelectCity = (cityName: string) => {
    setShowCityPicker(false);
    setSearchCityQuery('');
    if (onCityChange) {
      onCityChange(cityName);
    } else {
      loadWeather(cityName);
    }
  };

  // Filtered cities list for city search
  const filteredCities = POPULAR_TOURISM_DESTINATIONS.filter(item => {
    if (!searchCityQuery.trim()) return true;
    const q = searchCityQuery.toLowerCase();
    return item.nameVi.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q) || item.queryKey.toLowerCase().includes(q);
  });

  // Active day forecast
  const activeDay: DailyWeatherForecast | null = weatherData?.daily?.[selectedDayIndex] || weatherData?.daily?.[0] || null;

  // Format last updated time
  const formatUpdateTime = (isoStr?: string) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${mins}`;
    } catch {
      return '';
    }
  };

  // UV index category label & color
  const getUvBadge = (uv: number) => {
    if (uv >= 11) return { label: isEn ? 'Extreme' : 'Cực độ', color: 'bg-purple-900/40 text-purple-300 border-purple-500/40' };
    if (uv >= 8) return { label: isEn ? 'Very High' : 'Rất cao', color: 'bg-red-900/40 text-red-300 border-red-500/40' };
    if (uv >= 6) return { label: isEn ? 'High' : 'Cao', color: 'bg-orange-900/40 text-orange-300 border-orange-500/40' };
    if (uv >= 3) return { label: isEn ? 'Moderate' : 'Trung bình', color: 'bg-yellow-900/40 text-yellow-300 border-yellow-500/40' };
    return { label: isEn ? 'Low' : 'Thấp', color: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40' };
  };

  return (
    <div className={`relative bg-gradient-to-br from-stone-900 via-stone-900/95 to-amber-950/20 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl shadow-stone-950/40 transition-all ${className}`}>
      
      {/* Top Header: Badge, City Selector, Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800/80">
        
        {/* Title & City Pill */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <CloudSun className="w-4 h-4 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {isEn ? 'Destination Weather Forecast' : 'Dự Báo Thời Tiết Điểm Đến'}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                {isEn ? 'Live 7-Day' : 'Trực tiếp 7 ngày'}
              </span>
            </div>

            {/* City Dropdown Button */}
            <div className="relative mt-0.5">
              <button
                type="button"
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="group flex items-center gap-1.5 text-stone-100 hover:text-amber-300 font-serif font-bold text-base sm:text-lg transition-colors cursor-pointer"
                title={isEn ? 'Click to change destination' : 'Bấm để đổi thành phố khác'}
              >
                <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="underline decoration-amber-500/40 decoration-dotted underline-offset-4">
                  {weatherData?.cityName || destination}
                </span>
                <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-amber-300 transition-transform" />
              </button>

              {/* City Selection Popover */}
              {showCityPicker && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-stone-900 border border-amber-500/40 rounded-2xl p-3 shadow-2xl z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                    <span className="text-xs font-bold text-amber-300">
                      {isEn ? 'Select Destination City' : 'Chọn thành phố du lịch'}
                    </span>
                    <button 
                      onClick={() => setShowCityPicker(false)}
                      className="text-stone-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-stone-800"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchCityQuery}
                      onChange={(e) => setSearchCityQuery(e.target.value)}
                      placeholder={isEn ? 'Search city (Hue, Hanoi...)' : 'Tìm thành phố (Huế, Hà Nội...)'}
                      className="w-full bg-stone-950 border border-stone-700 text-stone-100 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Quick Cities Grid */}
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                    {filteredCities.map((item) => (
                      <button
                        key={item.queryKey}
                        type="button"
                        onClick={() => handleSelectCity(item.nameVi)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          (weatherData?.cityName || destination).includes(item.queryKey)
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                            : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{isEn ? item.nameEn : item.nameVi}</span>
                        </div>
                        {(weatherData?.cityName || destination).includes(item.queryKey) && (
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right tools: Refresh button & last updated */}
        <div className="flex items-center gap-2">
          {weatherData?.updatedAt && (
            <span className="text-[10px] text-stone-400 hidden sm:inline">
              {isEn ? 'Updated:' : 'Cập nhật:'} {formatUpdateTime(weatherData.updatedAt)}
            </span>
          )}

          <button
            type="button"
            onClick={() => loadWeather(weatherData?.cityName || destination)}
            disabled={loading}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 border border-stone-700 transition-all cursor-pointer disabled:opacity-50"
            title={isEn ? 'Refresh real-time weather' : 'Cập nhật dữ liệu thời tiết mới nhất'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

      </div>

      {/* Loading Skeleton */}
      {loading && !weatherData && (
        <div className="py-8 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
          <p className="text-xs text-stone-300">
            {isEn ? 'Connecting to Open-Meteo for real-time destination weather...' : 'Đang kết nối Open-Meteo lấy dữ liệu thời tiết thực tế...'}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !weatherData && (
        <div className="py-6 text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <p className="text-xs text-stone-300">{error}</p>
          <button
            type="button"
            onClick={() => loadWeather(destination)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            {isEn ? 'Retry' : 'Thử lại'}
          </button>
        </div>
      )}

      {/* Main Weather Content */}
      {weatherData && (
        <div className="space-y-4 pt-3">
          
          {/* Active Day Overview Card */}
          {activeDay && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Primary Temp & Status (Cols 1-5) */}
              <div className="md:col-span-5 flex items-center gap-3 sm:gap-4">
                <span className="text-4xl sm:text-5xl select-none" role="img" aria-label={activeDay.conditionText}>
                  {activeDay.conditionIcon}
                </span>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-100 tracking-tight">
                      {selectedDayIndex === 0 ? `${weatherData.current.temperature}°C` : `${activeDay.tempMax}°C`}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      {isEn ? 'High:' : 'Cao:'} <strong className="text-stone-200">{activeDay.tempMax}°</strong> / {isEn ? 'Low:' : 'Thấp:'} <strong className="text-stone-400">{activeDay.tempMin}°</strong>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-amber-300 mt-0.5">
                    {activeDay.conditionText}
                  </p>

                  <p className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>
                      {selectedDayIndex === 0 
                        ? (isEn ? 'Today • ' : 'Hôm nay • ') 
                        : `${formatDayOfWeek(activeDay.date, language)} • `}
                      {formatDateDisplay(activeDay.date, language)}
                    </span>
                  </p>
                </div>
              </div>

              {/* 4 Essential Metrics (Cols 6-12) */}
              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* 1. Rain Chance */}
                <div className="p-2.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 text-[10px]">
                    <span>{isEn ? 'Rain Prob' : 'Xác suất mưa'}</span>
                    <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-bold text-sky-300">
                      {activeDay.precipitationProbability}%
                    </span>
                    {activeDay.precipitationSum > 0 && (
                      <span className="text-[9px] text-stone-400 ml-1">
                        ({activeDay.precipitationSum} mm)
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Humidity */}
                <div className="p-2.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 text-[10px]">
                    <span>{isEn ? 'Humidity' : 'Độ ẩm'}</span>
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-bold text-blue-300">
                      {weatherData.current.humidity}%
                    </span>
                  </div>
                </div>

                {/* 3. Wind Speed */}
                <div className="p-2.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 text-[10px]">
                    <span>{isEn ? 'Wind Speed' : 'Tốc độ gió'}</span>
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-bold text-teal-300">
                      {activeDay.windSpeedMax} <span className="text-[9px] font-normal">km/h</span>
                    </span>
                  </div>
                </div>

                {/* 4. UV Index */}
                <div className="p-2.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 text-[10px]">
                    <span>{isEn ? 'UV Index' : 'Chỉ số UV'}</span>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-sm font-bold text-amber-300">
                      {activeDay.uvIndexMax}
                    </span>
                    {(() => {
                      const badge = getUvBadge(activeDay.uvIndexMax);
                      return (
                        <span className={`text-[8px] px-1 py-0.2 rounded border font-semibold ${badge.color}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Severe Weather Warning Banner (If applicable) */}
          {(activeDay?.warningNoticeVi || activeDay?.warningNoticeEn) && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {isEn ? activeDay.warningNoticeEn : activeDay.warningNoticeVi}
              </p>
            </div>
          )}

          {/* Smart Cultural Activity Suggestions */}
          {activeDay && (
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/25 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {isEn ? 'Smart Activity Recommendations for this Weather:' : 'Gợi Ý Hoạt Động Di Sản Phù Hợp Thời Tiết:'}
                </span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                {isEn ? activeDay.activitySuggestionEn : activeDay.activitySuggestionVi}
              </p>
            </div>
          )}

          {/* Multi-Day Itinerary / Forecast Timeline Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>
                  {isEn ? 'Daily Forecast for Your Trip:' : 'Dự Báo Từng Ngày Trong Chuyến Đi:'}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <span>{isExpanded ? (isEn ? 'Collapse' : 'Thu gọn') : (isEn ? 'View 7 Days' : 'Xem trọn 7 ngày')}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Daily Forecast Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {weatherData.daily.slice(0, isExpanded ? 7 : Math.max(3, durationDays)).map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                const isToday = idx === 0;

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/40'
                        : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/50 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-stone-300 block">
                      {isToday ? (isEn ? 'Today' : 'Hôm nay') : formatDayOfWeek(day.date, language)}
                    </span>
                    <span className="text-[9px] text-stone-500 block mb-1">
                      {formatDateDisplay(day.date, language)}
                    </span>

                    <span className="text-xl my-1 select-none" role="img" aria-label={day.conditionText}>
                      {day.conditionIcon}
                    </span>

                    <div className="text-[10px] font-bold text-stone-200 mt-1">
                      <span>{day.tempMax}°</span>
                      <span className="text-stone-500 font-normal"> / {day.tempMin}°</span>
                    </div>

                    {day.precipitationProbability > 20 && (
                      <span className="text-[9px] text-sky-400 font-medium mt-0.5">
                        💧{day.precipitationProbability}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Source Credit */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-800/60">
            <span>
              {isEn ? 'Real-time meteorological model: ' : 'Mô hình khí tượng thực tế: '} 
              <strong className="text-stone-300">Open-Meteo WMO</strong> ({weatherData.latitude.toFixed(2)}°N, {weatherData.longitude.toFixed(2)}°E)
            </span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {isEn ? 'Sync active' : 'Đồng bộ thời tiết'}
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
