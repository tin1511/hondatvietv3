/**
 * Language & Localization Service for HERITAGEAI / Hồn Đất Việt
 * Provides multi-language support (Vietnamese, English, French, Japanese, Korean, Chinese),
 * interface translation dictionary, persistent preferences, voice preview,
 * and automatic full-page DOM translation engine.
 */

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  bcp47: string;
  greeting: string;
  sampleGreeting: string;
  description: string;
  aiVoiceAccent: string;
  googleTranslateCode: string;
}

export const SUPPORTED_LANGUAGES = [
{
    code: 'vi',
    name: 'Tiếng Việt',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    bcp47: 'vi-VN',
    greeting: 'Xin kính chào quý khách!',
    sampleGreeting: 'Dạ em là Hướng dẫn viên ảo Hồn Đất Việt, xin kính chào quý cô bác anh chị đã đến với hành trình khám phá di sản Việt Nam!',
    description: 'Ngôn ngữ mẹ đẻ với kho tàng tri thức lịch sử và văn hóa bản địa phong phú nhất.',
    aiVoiceAccent: 'Giọng Bắc/Trung/Nam truyền cảm bản xứ',
    googleTranslateCode: 'vi'
  },
{
    code: 'en',
    name: 'Tiếng Anh',
    nativeName: 'English',
    flag: '🇬🇧',
    bcp47: 'en-US',
    greeting: 'Welcome to Vietnam Heritage!',
    sampleGreeting: 'Hello and warm welcome! I am your AI Heritage Guide, ready to help you discover thousands of years of Vietnamese culture and history.',
    description: 'Global international language with full AI tour guide and storytelling support.',
    aiVoiceAccent: 'Natural International English',
    googleTranslateCode: 'en'
  }
];

export const LANGUAGE_STORAGE_KEY = 'heritageai_language';
export const AI_VOICE_LANG_KEY = 'heritageai_ai_voice_lang';
export const AUTO_TRANSLATE_KEY = 'heritageai_auto_translate';

export interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

export const DICTIONARY: Translations = {
  // Navigation tabs
  'nav.home': {
    vi: 'Trang chủ',
    en: 'Home',
    fr: 'Accueil',
    ja: 'ホーム',
    ko: '홈',
    zh: '首页'
  },
  'nav.heritage': {
    vi: 'Di sản',
    en: 'Heritage',
    fr: 'Patrimoine',
    ja: '遺産',
    ko: '문화유산',
    zh: '文化遗产'
  },
  'nav.recognizer': {
    vi: 'Nhận diện AI',
    en: 'AI Vision',
    fr: 'Vision IA',
    ja: 'AI画像認識',
    ko: 'AI 비전 인식',
    zh: 'AI 视觉识别'
  },
  'nav.storyteller': {
    vi: 'Kể chuyện AI',
    en: 'AI Stories',
    fr: 'Récits IA',
    ja: 'AIストーリー',
    ko: 'AI 이야기',
    zh: 'AI 故事讲述'
  },
  'nav.chat': {
    vi: 'Hướng Dẫn Viên AI',
    en: 'AI Tour Guide',
    fr: 'Guide IA',
    ja: 'AIツアーガイド',
    ko: 'AI 가이드',
    zh: 'AI 虚拟导游'
  },
  'nav.map': {
    vi: 'Bản đồ',
    en: 'Map',
    fr: 'Carte',
    ja: '地図',
    ko: '지도',
    zh: '文化地图'
  },
  'nav.food': {
    vi: 'Ăn uống & Vui chơi',
    en: 'Food & Leisure',
    fr: 'Gastronomie & Loisirs',
    ja: 'グルメ・娯楽',
    ko: '음식 & 엔터테인먼트',
    zh: '美食与休闲'
  },
  'nav.itinerary': {
    vi: 'Lịch trình',
    en: 'Itinerary',
    fr: 'Itinéraire',
    ja: '旅行日程',
    ko: '여행 일정',
    zh: '行程规划'
  },
  'nav.crafts': {
    vi: 'Làng nghề & Nghệ thuật',
    en: 'Crafts & Folk Arts',
    fr: 'Artisanat & Arts',
    ja: '工芸・伝統芸能',
    ko: '전통공예 & 예술',
    zh: '传统手工艺与艺术'
  },
  'nav.learning': {
    vi: 'Quiz & Lịch sử',
    en: 'Quiz & History',
    fr: 'Quiz & Histoire',
    ja: 'クイズ・歴史',
    ko: '퀴즈 & 역사',
    zh: '历史问答'
  },
  'nav.profile': {
    vi: 'Hồ sơ & Danh hiệu',
    en: 'Profile & Badges',
    fr: 'Profil & Titres',
    ja: 'プロフィール・バッジ',
    ko: '프로필 & 칭호',
    zh: '个人档案与成就'
  },
  'nav.community': {
    vi: 'Cộng đồng',
    en: 'Community',
    fr: 'Communauté',
    ja: 'コミュニティ',
    ko: '커뮤니티',
    zh: '互动社区'
  },
  'nav.admin': {
    vi: 'Quản trị viên',
    en: 'Admin Dashboard',
    fr: 'Administration',
    ja: '管理者',
    ko: '관리자',
    zh: '管理后台'
  },
  'nav.more': {
    vi: 'Thêm',
    en: 'More',
    fr: 'Plus',
    ja: 'その他',
    ko: '더보기',
    zh: '更多'
  },
  'nav.favorites': {
    vi: 'Yêu thích',
    en: 'Favorites',
    fr: 'Favoris',
    ja: 'お気に入り',
    ko: '즐겨찾기',
    zh: '收藏夹'
  },
  'nav.addHeritage': {
    vi: 'Đề Xuất Mới',
    en: 'Submit Heritage',
    fr: 'Proposer',
    ja: '遺産提案',
    ko: '신규 제안',
    zh: '推荐遗址'
  },
  'nav.offline': {
    vi: 'Ngoại tuyến',
    en: 'Offline',
    fr: 'Hors ligne',
    ja: 'オフライン',
    ko: '오프라인',
    zh: '离线模式'
  },
  'nav.login': {
    vi: 'Đăng nhập',
    en: 'Sign In',
    fr: 'Connexion',
    ja: 'ログイン',
    ko: '로그인',
    zh: '登录'
  },
  'nav.register': {
    vi: 'Đăng ký',
    en: 'Sign Up',
    fr: 'Inscription',
    ja: '登録',
    ko: '회원가입',
    zh: '注册'
  },
  'nav.logout': {
    vi: 'Đăng xuất',
    en: 'Sign Out',
    fr: 'Déconnexion',
    ja: 'ログアウト',
    ko: '로그아웃',
    zh: '退出登录'
  },
  'nav.backToHome': {
    vi: 'Quay lại Trang chủ',
    en: 'Back to Home',
    fr: 'Retour à l\'accueil',
    ja: 'ホームに戻る',
    ko: '홈으로 돌아가기',
    zh: '返回首页'
  },
  'nav.brandTagline': {
    vi: 'Hiểu di sản. Khám phá Việt Nam.',
    en: 'Understand Heritage. Discover Vietnam.',
    fr: 'Comprendre le Patrimoine. Explorer le Vietnam.',
    ja: '遺産を知り、ベトナムを巡る。',
    ko: '역사를 이해하고, 베트남을 탐험하세요.',
    zh: '感悟文化遗产，探索大美越南。'
  },

  // Hero Section
  'hero.platformBadge': {
    vi: 'Nền tảng AI Di sản & Văn hóa Việt Nam Toàn diện',
    en: 'Comprehensive Vietnam Heritage & Cultural AI Platform',
    fr: 'Plateforme IA Complète du Patrimoine et de la Culture du Vietnam',
    ja: 'ベトナムの文化遺産・総合AIプラットフォーム',
    ko: '베트남 문화유산 & 문화 종합 AI 플랫폼',
    zh: '越南文化遗产与历史文明全景AI平台'
  },
  'hero.mainHeading1': {
    vi: 'Khám phá Việt Nam bằng',
    en: 'Discover Vietnam with',
    fr: 'Découvrez le Vietnam avec',
    ja: '最先端の技術で巡る',
    ko: '새롭게 발견하는 베트남',
    zh: '以全新视角探索越南'
  },
  'hero.mainHeading2': {
    vi: 'Trí tuệ Nhân tạo',
    en: 'Artificial Intelligence',
    fr: 'l\'Intelligence Artificielle',
    ja: '人工知能 (AI)',
    ko: '인공지능 (AI)',
    zh: '人工智能 (AI)'
  },
  'hero.subtitle': {
    vi: 'Hiểu lịch sử. Khám phá di sản. Tìm trải nghiệm. Lên lịch trình.',
    en: 'Understand history. Explore heritage. Find experiences. Plan itineraries.',
    fr: 'Comprendre l\'histoire. Explorer le patrimoine. Vivre des expériences. Planifier.',
    ja: '歴史を学び、遺産を巡り、体験を深め、旅を計画する。',
    ko: '역사를 배우고, 유산을 탐험하며, 특별한 여정을 계획하세요.',
    zh: '研读悠久历史，探访千年胜迹，沉浸文化体验，定制智能行程。'
  },
  'hero.searchPlaceholder': {
    vi: 'Tìm di sản, địa danh, món ăn (Huế, Hội An, Phố cổ...)',
    en: 'Search heritage, places, delicacies (Hue, Hoi An, Old Quarter...)',
    fr: 'Rechercher patrimoine, lieux, gastronomie (Hué, Hoi An...)',
    ja: '文化遺産、史跡、郷土料理を検索（フエ、ホイアン、旧市街...）',
    ko: '문화유산, 명소, 향토음식 검색 (후에, 호이안, 하노이 고도...)',
    zh: '搜索文化遗产、历史名胜、特色美食（顺化、会安、古街...）'
  },
  'hero.gpsNearest': {
    vi: 'Gần Bạn Nhất (GPS)',
    en: 'Nearest You (GPS)',
    fr: 'Le Plus Proche (GPS)',
    ja: '最寄りの名所 (GPS)',
    ko: '가장 가까운 곳 (GPS)',
    zh: '离你最近 (GPS)'
  },
  'hero.detectGps': {
    vi: 'Lấy GPS của tôi',
    en: 'Get My GPS',
    fr: 'Localiser mon GPS',
    ja: '現在地を取得',
    ko: '내 GPS 위치',
    zh: '获取当前位置'
  },
  'hero.detectingGps': {
    vi: 'Đang dò GPS...',
    en: 'Locating GPS...',
    fr: 'Localisation GPS...',
    ja: 'GPS測位中...',
    ko: 'GPS 탐색 중...',
    zh: '正在定位...'
  },
  'hero.changeLandmark': {
    vi: 'Đổi danh thắng khác',
    en: 'Change Landmark',
    fr: 'Changer de site',
    ja: '名勝を変更',
    ko: '명소 변경',
    zh: '更换名胜'
  },
  'hero.exploreWallpaper': {
    vi: 'Khám phá di sản này',
    en: 'Explore this heritage',
    fr: 'Explorer ce site',
    ja: 'この遺産を探索',
    ko: '이 유산 탐색',
    zh: '探索此遗址'
  },
  'hero.guestTitle': {
    vi: 'Đăng Nhập / Đăng Ký Tài Khoản',
    en: 'Sign In / Register Account',
    fr: 'Connexion / Inscription',
    ja: 'ログイン / 会員登録',
    ko: '로그인 / 회원가입',
    zh: '登录 / 注册账户'
  },
  'hero.guestDesc': {
    vi: 'Đăng ký miễn phí để nhận điểm văn hóa, lưu hành trình & mở khóa danh hiệu di sản.',
    en: 'Sign up free to earn cultural XP, save trips & unlock heritage badges.',
    fr: 'Inscrivez-vous gratuitement pour gagner des points XP et débloquer des titres.',
    ja: '無料登録で文化XPを獲得し、旅程を保存して名誉ある称号を獲得。',
    ko: '무료 가입으로 문화 XP를 적립하고, 여정을 저장하며 명예 칭호를 획득하세요.',
    zh: '免费注册以积累文化积分，保存历史行程并解锁专属文化成就。'
  },

  // Home Featured Heritage Section
  'home.featuredBadge': {
    vi: 'Di Sản Tiêu Biểu',
    en: 'Featured Heritages',
    fr: 'Patrimoines Remarquables',
    ja: '代表的な世界遺産',
    ko: '대표 문화유산',
    zh: '代表性文化遗产'
  },
  'home.featuredTitle': {
    vi: 'Báu Vật Ngàn Năm Của Dân Tộc',
    en: 'Millennial Treasures of the Nation',
    fr: 'Trésors Millénaires de la Nation',
    ja: '千年の歴史を誇る国の宝',
    ko: '민족의 찬란한 천년 보물',
    zh: '千百年来流传的民族瑰宝'
  },
  'home.viewAllMap': {
    vi: 'Xem tất cả trên bản đồ',
    en: 'View all on map',
    fr: 'Voir tout sur la carte',
    ja: '地図ですべて見る',
    ko: '지도에서 전체 보기',
    zh: '在全景地图中查看'
  },

  // Home Bento Showcase
  'home.archiveBadge': {
    vi: 'Hệ Thống Lưu Trữ Cá Nhân & Điểm Văn Hóa',
    en: 'Personal Archive & Cultural XP System',
    fr: 'Système d\'Archives Personnelles & Points XP',
    ja: '個人アーカイブ＆文化ポイントシステム',
    ko: '개인 보관함 & 문화 포인트 시스템',
    zh: '个人档案与文化积分系统'
  },
  'home.archiveTitle': {
    vi: 'Đồng Hành & Lưu Trữ Mọi Hành Trình Di Sản Của Bạn',
    en: 'Accompanying & Preserving All Your Heritage Journeys',
    fr: 'Accompagner & Préserver Tous Vos Voyages Culturels',
    ja: 'あなたの歴史遺産の旅を記録・共有',
    ko: '당신의 모든 문화유산 여정을 함께 기록합니다',
    zh: '陪伴并记录您的每一段文化遗产之旅'
  },
  'home.archiveDesc': {
    vi: 'Mỗi thao tác nhận diện ảnh chụp bằng AI, nghe kể chuyện lịch sử, hoàn thành câu đố văn hóa hay lập kế hoạch du lịch đều được tự động ghi lại trong hồ sơ cá nhân với hệ thống điểm thưởng XP và danh hiệu di sản.',
    en: 'Every AI image recognition, historical story listened to, cultural quiz completed, and trip plan made is automatically recorded with XP rewards and heritage badges.',
    fr: 'Chaque reconnaissance d\'image IA, histoire écoutée, quiz réussi ou itinéraire planifié est enregistré avec des points XP et des titres patrimoniaux.',
    ja: 'AI画像認識、歴史ストーリーの再生、クイズの挑戦、旅行日程の作成のすべてが個人プロファイルに記録され、XPやバッジが付与されます。',
    ko: 'AI 사진 인식, 역사 이야기 청취, 문화 퀴즈 풀이 및 여행 계획 등 모든 활동이 XP 포인트와 문화유산 칭호로 기록됩니다.',
    zh: '每一次AI视觉识别、倾听历史故事、完成文化问答或规划行程，都将自动记录在个人档案中，并累积XP积分与专属成就。'
  },
  'home.viewBadges': {
    vi: 'Xem Bảng Danh Hiệu & Hồ Sơ',
    en: 'View Badges & Profile',
    fr: 'Voir les Titres & Profil',
    ja: '称号＆プロフィールを見る',
    ko: '칭호 및 프로필 보기',
    zh: '查看成就与档案'
  },
  'home.myAccount': {
    vi: 'Tài Khoản Cá Nhân',
    en: 'Personal Account',
    fr: 'Compte Personnel',
    ja: 'マイアカウント',
    ko: '개인 계정',
    zh: '个人账户'
  },
  'home.loginSignup': {
    vi: 'Đăng Nhập / Đăng Ký',
    en: 'Sign In / Sign Up',
    fr: 'Connexion / Inscription',
    ja: 'ログイン / 新規登録',
    ko: '로그인 / 회원가입',
    zh: '登录 / 注册'
  },

  // Bento mini cards
  'home.visionTitle': {
    vi: 'AI Nhận Diện Thị Giác',
    en: 'AI Visual Recognition',
    fr: 'Vision IA Patrimoniale',
    ja: 'AI視覚・画像認識',
    ko: 'AI 시각 인식',
    zh: 'AI 视觉识别'
  },
  'home.visionDesc': {
    vi: 'Chụp ảnh di tích, đồ cổ, trang phục cổ hay món ăn để biết ngay tên gọi, niên đại và ý nghĩa lịch sử.',
    en: 'Take photos of monuments, antiques, historic costumes or food to discover names, periods and cultural origins.',
    fr: 'Prenez en photo monuments, antiquités, costumes ou plats pour connaître leur histoire et signification.',
    ja: '写真から寺院、古美術品、伝統衣装、郷土料理を瞬時に特定し、時代背景を解説。',
    ko: '유적지, 골동품, 전통 의상 또는 음식을 촬영하여 이름, 연대 및 역사적 의미를 즉시 확인하세요.',
    zh: '拍摄古迹、文物古董、传统服饰或特色菜肴，即时获知其名称、历史年代与文化底蕴。'
  },
  'home.storyTitle': {
    vi: 'AI Kể Chuyện Đa Đối Tượng',
    en: 'Multi-Audience AI Storyteller',
    fr: 'Récits IA Personnalisés',
    ja: 'AI歴史ストーリーテリング',
    ko: '맞춤형 AI 이야기꾼',
    zh: 'AI 多群体故事讲述'
  },
  'home.storyDesc': {
    vi: 'Lắng nghe giọng kể truyền cảm phù hợp với trẻ em, học sinh, nhà nghiên cứu hay du khách quốc tế.',
    en: 'Listen to expressive storytelling crafted for children, students, scholars, or international tourists.',
    fr: 'Écoutez une narration captivante adaptée aux enfants, étudiants, chercheurs ou voyageurs du monde.',
    ja: '子供向け、学生向け、研究者向け、外国人観光客向けに最適化された感情豊かな音声解説。',
    ko: '어린이, 학생, 연구자 및 해외 관광객에 맞춘 감동적인 내레이션을 들어보세요.',
    zh: '倾听针对儿童、青少年、历史学者或国际游客量身定制的生动语音导览。'
  },
  'home.itineraryTitle': {
    vi: 'Lập Lịch Trình Tự Động',
    en: 'Automated Itinerary Planner',
    fr: 'Planificateur d\'Itinéraire',
    ja: 'スマート旅行計画',
    ko: '스마트 일정 플래너',
    zh: '智能行程规划'
  },
  'home.itineraryDesc': {
    vi: 'Lên kế hoạch du lịch văn hóa theo thời gian, ngân sách, tích hợp Google Places lân cận.',
    en: 'Generate customized cultural tour plans by time and budget with nearby Google Places.',
    fr: 'Organisez des circuits culturels selon votre temps et budget avec les lieux Google Places à proximité.',
    ja: '時間や予算に合わせて最適な文化ツアーを自動編成し、周辺の人気スポットも提案。',
    ko: '시간과 예산에 맞추어 맞춤형 문화 여행을 계획하고 주변 장소를 추천받으세요.',
    zh: '根据游玩时间与预算，自动生成深度文化游览路线，并推荐周边精选地标。'
  },

  // Language Modal & Settings
  'lang.title': {
    vi: 'Cài Đặt Ngôn Ngữ & Trợ Lý AI',
    en: 'Language & AI Guide Settings',
    fr: 'Paramètres de Langue & Guide IA',
    ja: '言語およびAIガイドの設定',
    ko: '언어 및 AI 가이드 설정',
    zh: '语言与AI向导设置'
  },
  'lang.subtitle': {
    vi: 'Chuyển đổi toàn bộ ngôn ngữ trang web và giọng thuyết minh của hướng dẫn viên AI ảo.',
    en: 'Instantly translate the entire website and customize the virtual AI guide voice.',
    fr: 'Traduisez instantanément l\'ensemble du site et personnalisez la voix du guide IA.',
    ja: 'ウェブサイト全体の言語を即座に切り替え、AIガイドの音声をカスタマイズします。',
    ko: '웹사이트 전체 언어를 즉시 전환하고 가상 AI 가이드 음성을 설정합니다.',
    zh: '即刻切换全站显示语言，并定制虚拟AI导游的讲解语音。'
  },
  'lang.selectInterface': {
    vi: 'Chọn ngôn ngữ trang web',
    en: 'Select Website Language',
    fr: 'Choisir la langue du site',
    ja: 'ウェブサイトの言語を選択',
    ko: '웹사이트 언어 선택',
    zh: '选择网站语言'
  },
  'lang.active': {
    vi: 'Đang áp dụng',
    en: 'Active',
    fr: 'Actif',
    ja: '適用中',
    ko: '적용 중',
    zh: '当前生效'
  },
  'lang.listenSample': {
    vi: 'Nghe thử giọng đọc AI',
    en: 'Listen to AI Voice Sample',
    fr: 'Écouter un extrait de voix IA',
    ja: 'AI音声サンプルを聴く',
    ko: 'AI 음성 샘플 듣기',
    zh: '试听AI导游发音'
  },
  'lang.apply': {
    vi: 'Áp dụng ngôn ngữ',
    en: 'Apply Language',
    fr: 'Appliquer la langue',
    ja: '言語を適用',
    ko: '언어 적용',
    zh: '应用语言设置'
  },
  'lang.appliedSuccess': {
    vi: 'Đã đổi ngôn ngữ thành công!',
    en: 'Language updated successfully!',
    fr: 'Langue mise à jour avec succès !',
    ja: '言語が正常に変更されました！',
    ko: '언어가 성공적으로 변경되었습니다!',
    zh: '语言已成功切换！'
  },
  'lang.close': {
    vi: 'Đóng',
    en: 'Close',
    fr: 'Fermer',
    ja: '閉じる',
    ko: '닫기',
    zh: '关闭'
  },
  'lang.quickSwitch': {
    vi: 'Đổi ngôn ngữ nhanh',
    en: 'Quick Language Switch',
    fr: 'Changement rapide',
    ja: '言語クイック切替',
    ko: '빠른 언어 전환',
    zh: '快速切换语言'
  },

  // Hero CTAs & Pillars
  'hero.ctaHeritage': {
    vi: 'Khám phá Di sản',
    en: 'Explore Heritage',
    fr: 'Explorer le Patrimoine',
    ja: '遺産を探索',
    ko: '문화유산 탐험',
    zh: '探索文化遗产'
  },
  'hero.ctaRecognizer': {
    vi: 'Nhận diện bằng AI',
    en: 'AI Vision Recognition',
    fr: 'Reconnaissance IA',
    ja: 'AI画像認識',
    ko: 'AI 사진 인식',
    zh: 'AI 视觉识别'
  },
  'hero.ctaChat': {
    vi: 'Hỏi Trợ lý AI',
    en: 'Ask AI Guide',
    fr: 'Demander au Guide IA',
    ja: 'AIガイドに質問',
    ko: 'AI 가이드 질문',
    zh: '向AI导游提问'
  },
  'hero.ctaFood': {
    vi: 'Ăn uống & Vui chơi',
    en: 'Food & Leisure',
    fr: 'Gastronomie & Loisirs',
    ja: 'グルメ＆娯楽',
    ko: '음식 & 즐길거리',
    zh: '美食与休闲'
  },
  'hero.ctaMap': {
    vi: 'Bản đồ Văn hóa',
    en: 'Cultural Map',
    fr: 'Carte Culturelle',
    ja: '文化マップ',
    ko: '문화 지도',
    zh: '全景文化地图'
  },
  'hero.ctaProfile': {
    vi: 'Hồ sơ & Danh hiệu',
    en: 'Profile & Badges',
    fr: 'Profil & Titres',
    ja: 'プロフィール＆称号',
    ko: '프로필 및 칭호',
    zh: '个人档案与成就'
  },
  'hero.pillar1Title': {
    vi: 'Nhận diện Thị giác AI',
    en: 'AI Vision Recognition',
    fr: 'Vision IA Patrimoniale',
    ja: 'AI視覚・画像認識',
    ko: 'AI 시각 인식',
    zh: 'AI 视觉识别'
  },
  'hero.pillar1Desc': {
    vi: 'Nhận diện di tích, hiện vật, cổ phục, nhạc cụ và làng nghề qua ảnh chụp với độ chính xác cao.',
    en: 'Identify monuments, antiques, traditional costumes, instruments, and crafts with high precision.',
    fr: 'Identifiez monuments, antiquités, costumes, instruments et métiers traditionnels avec précision.',
    ja: '写真から寺院、古美術品、伝統衣装、楽器、工芸村を高精度で瞬時に認識・特定。',
    ko: '사진 한 장으로 유적지, 유물, 전통의상, 악기 및 전통 공예마을을 높은 정확도로 분석합니다.',
    zh: '通过照片高精度识别历史古迹、珍贵文物、传统服饰、民族乐器和手工艺村。'
  },
  'hero.pillar2Title': {
    vi: 'Kể chuyện Đa đối tượng',
    en: 'Multi-Audience Storytelling',
    fr: 'Récits Multi-Publics',
    ja: '多角的な物語解説',
    ko: '맞춤형 역사 이야기',
    zh: '多元受众故事讲述'
  },
  'hero.pillar2Desc': {
    vi: '5 phong cách kể chuyện từ thiếu nhi, học sinh đến khách quốc tế, phân biệt rõ lịch sử và huyền tích.',
    en: '5 storytelling styles from kids to international tourists, distinguishing history from myths.',
    fr: '5 styles narratifs adaptés aux enfants comme aux voyageurs internationaux, distinguant histoire et mythes.',
    ja: '子供向けから海外旅行者まで5つの語り口調を用意。史実と伝説を明確に区別して解説。',
    ko: '어린이부터 해외 관광객까지 5가지 맞춤 해설 스타일로 역사와 전설을 명확히 구분해 전달합니다.',
    zh: '提供5种针对不同群体的讲解风格，深入浅出，清晰辨析正史与民间传奇。'
  },
  'hero.pillar3Title': {
    vi: 'Ăn uống & Giải trí Xung quanh',
    en: 'Nearby Food & Entertainment',
    fr: 'Gastronomie & Loisirs Alentours',
    ja: '周辺グルメ＆レジャー',
    ko: '주변 음식 및 오락',
    zh: '周边特色美食与休闲'
  },
  'hero.pillar3Desc': {
    vi: 'Tích hợp Google Places, phân tích review trung thực và tìm địa điểm theo nhu cầu cá nhân.',
    en: 'Google Places integration with authentic review analysis to find tailored local spots.',
    fr: 'Intégration Google Places avec analyse d\'avis pour dénicher les meilleures adresses locales.',
    ja: 'Google Placesと連携し、リアルな口コミ分析でニーズに合った地元の名店を発見。',
    ko: 'Google Places 연동 및 진솔한 리뷰 분석으로 취향에 맞는 현지 명소와 맛집을 추천합니다.',
    zh: '深度整合 Google Places 与真实评价分析，按个人偏好精准推荐周边地道餐馆与景点。'
  },
  'hero.pillar4Title': {
    vi: 'Lịch trình Du lịch Thông minh',
    en: 'Smart Tour Itinerary',
    fr: 'Itinéraires Intelligents',
    ja: 'スマート観光プラン',
    ko: '스마트 여행 일정',
    zh: '智能深度游览行程'
  },
  'hero.pillar4Desc': {
    vi: 'Lên kế hoạch du lịch văn hóa theo thời gian và ngân sách, tối ưu hóa cung đường tham quan.',
    en: 'Plan cultural tours by time and budget with optimized travel routes.',
    fr: 'Planifiez vos visites culturelles selon votre temps et budget avec des trajets optimisés.',
    ja: '所要時間と予算に合わせて文化旅行をスマートに計画し、観光ルートを自動最適化。',
    ko: '소요 시간과 예산에 맞춰 문화 투어를 계획하고 최적의 관람 동선을 설계합니다.',
    zh: '根据游览时长和预算制定深度文化之旅，智能优化交通与参观路线。'
  },

  // Cultural Tools Dashboard
  'tools.badge': {
    vi: 'Định Hướng Khám Phá',
    en: 'Discovery Compass',
    fr: 'Boussole de Découverte',
    ja: '探訪ナビゲーション',
    ko: '탐험 길잡이',
    zh: '探索向导'
  },
  'tools.title': {
    vi: 'Bản Đồ Điều Hướng Tiện Ích Di Sản',
    en: 'Heritage Utilities & Navigation Dashboard',
    fr: 'Tableau de Bord des Services du Patrimoine',
    ja: '遺産ユーティリティ・ダッシュボード',
    ko: '문화유산 편의 도구 대시보드',
    zh: '文化遗产智能工具导航'
  },
  'tools.desc': {
    vi: 'Giao diện tổng quát giúp bạn đi đến bất cứ ứng dụng, bản đồ hay bộ công cụ văn hóa nào trong nháy mắt.',
    en: 'Central portal giving instant access to any heritage app, interactive map, or cultural utility.',
    fr: 'Portail central permettant d\'accéder en un instant à toutes les applications patrimoniales et cartes.',
    ja: 'あらゆる遺産アプリ、インタラクティブ地図、文化ツールに瞬時にアクセスできる総合ポータル。',
    ko: '모든 문화유산 도구, 지도 및 문화 콘텐츠로 한눈에 이동할 수 있는 통합 대시보드입니다.',
    zh: '全能文化门户，助您一键畅达各项遗产识别、全景地图与文化工具。'
  },
  'tools.map': {
    vi: 'Bản Đồ Di Sản',
    en: 'Heritage Map',
    fr: 'Carte du Patrimoine',
    ja: '遺産マップ',
    ko: '문화유산 지도',
    zh: '文化地图'
  },
  'tools.mapDesc': {
    vi: 'Định vị danh lam & dẫn đường',
    en: 'Locate monuments & directions',
    fr: 'Localiser & itinéraires',
    ja: '名勝位置特定＆ルート案内',
    ko: '명소 위치 및 길안내',
    zh: '定位名胜古迹与导航'
  },
  'tools.recognizer': {
    vi: 'Nhận Diện AI',
    en: 'AI Vision',
    fr: 'Vision IA',
    ja: 'AI画像認識',
    ko: 'AI 비전',
    zh: 'AI 识别'
  },
  'tools.recognizerDesc': {
    vi: 'Chụp ảnh phân tích di tích',
    en: 'Capture & analyze monuments',
    fr: 'Analyser monuments par photo',
    ja: '写真を撮影して史跡を分析',
    ko: '사진 촬영 후 유적지 분석',
    zh: '拍摄古迹即时分析'
  },
  'tools.storyteller': {
    vi: 'Kể Chuyện AI',
    en: 'AI Stories',
    fr: 'Récits IA',
    ja: 'AI物語音声',
    ko: 'AI 스토리',
    zh: 'AI 讲述'
  },
  'tools.storytellerDesc': {
    vi: 'Nghe kể chuyện văn hóa xứ sở',
    en: 'Listen to folklore & history',
    fr: 'Écouter légendes & histoire',
    ja: '各地の伝承と歴史を聴く',
    ko: '지역의 역사와 전설 청취',
    zh: '聆听风土文化与历史'
  },
  'tools.chat': {
    vi: 'HDV AI 3D',
    en: '3D AI Guide',
    fr: 'Guide IA 3D',
    ja: '3D AIガイド',
    ko: '3D AI 가이드',
    zh: '3D AI 导游'
  },
  'tools.chatDesc': {
    vi: 'Hỏi đáp tương tác cùng hướng dẫn viên',
    en: 'Interactive Q&A with tour guide',
    fr: 'Discussion interactive avec le guide',
    ja: 'ツアーガイドと対話・質問',
    ko: '가이드와 실시간 질문 답변',
    zh: '与虚拟导游互动问答'
  },
  'tools.food': {
    vi: 'Ăn Uống & Cafe',
    en: 'Food & Cafes',
    fr: 'Restaurants & Cafés',
    ja: 'グルメ＆カフェ',
    ko: '음식 & 카페',
    zh: '美食与咖啡'
  },
  'tools.foodDesc': {
    vi: 'Đặc sản ẩm thực & điểm vui chơi bản địa',
    en: 'Local culinary gems & attractions',
    fr: 'Spécialités culinaires locales',
    ja: '地元名物グルメ＆観光スポット',
    ko: '지역 특산물 및 핫플레이스',
    zh: '地道风味特产与休闲打卡'
  },
  'tools.itinerary': {
    vi: 'Lập Lịch Trình',
    en: 'Tour Planner',
    fr: 'Planificateur',
    ja: '日程プランナー',
    ko: '일정 플래너',
    zh: '规划行程'
  },
  'tools.itineraryDesc': {
    vi: 'Lên tour thông minh theo thời gian',
    en: 'Smart tours optimized by time',
    fr: 'Circuits intelligents optimisés',
    ja: '時間帯別のスマート旅行日程',
    ko: '시간대별 스마트 맞춤 투어',
    zh: '按时间智能规划旅游线路'
  },
  'tools.crafts': {
    vi: 'Làng Nghề Cổ',
    en: 'Craft Villages',
    fr: 'Villages d\'Artisans',
    ja: '伝統工芸村',
    ko: '전통 공예 마을',
    zh: '古老手艺村'
  },
  'tools.craftsDesc': {
    vi: 'Làng gốm, tranh đông hồ, nón lá',
    en: 'Pottery, folk prints, conical hats',
    fr: 'Poterie, estampes, chapeaux coniques',
    ja: '陶芸、版画、ノンラー帽子',
    ko: '도자기, 판화, 논라 모자',
    zh: '陶瓷、年画、斗笠工坊'
  },
  'tools.learning': {
    vi: 'Quiz & Thử Thách',
    en: 'Quiz Challenge',
    fr: 'Quiz & Défis',
    ja: 'クイズ＆挑戦',
    ko: '퀴즈 & 챌린지',
    zh: '问答挑战'
  },
  'tools.learningDesc': {
    vi: 'Trắc nghiệm văn hóa tích điểm',
    en: 'Earn XP with cultural trivia',
    fr: 'Gagnez des XP avec des quiz',
    ja: '文化クイズでXPを獲得',
    ko: '문화 퀴즈 풀고 XP 적립',
    zh: '参与文化问答赚取积分'
  },
  'tools.community': {
    vi: 'Cộng Đồng',
    en: 'Community',
    fr: 'Communauté',
    ja: 'コミュニティ',
    ko: '커뮤니티',
    zh: '互动社区'
  },
  'tools.communityDesc': {
    vi: 'Chia sẻ câu chuyện & đóng góp ảnh',
    en: 'Share memories & photos',
    fr: 'Partager récits et photos',
    ja: '物語や写真を共有・投稿',
    ko: '이야기와 사진 함께 공유',
    zh: '分享旅游故事与投递照片'
  },
  'tools.favorites': {
    vi: 'Yêu Thích',
    en: 'Favorites',
    fr: 'Favoris',
    ja: 'お気に入り',
    ko: '즐겨찾기',
    zh: '收藏夹'
  },
  'tools.favoritesDesc': {
    vi: 'Các địa danh & ẩm thực đã lưu',
    en: 'Saved places & delicacies',
    fr: 'Lieux et plats sauvegardés',
    ja: '保存した名勝とグルメ一覧',
    ko: '저장한 명소 및 맛집',
    zh: '已收藏的胜地与美食'
  },
  'tools.profile': {
    vi: 'Hồ Sơ & Danh Hiệu',
    en: 'Profile & Badges',
    fr: 'Profil & Titres',
    ja: 'プロフィール＆称号',
    ko: '프로필 & 칭호',
    zh: '个人档案与成就'
  },
  'tools.profileDesc': {
    vi: 'Thứ hạng & bộ sưu tập danh hiệu',
    en: 'Ranks & badge achievements',
    fr: 'Classements & collection de badges',
    ja: 'ランキングと称号コレクション',
    ko: '순위 및 획득한 배지 모음',
    zh: '文化等级与成就勋章'
  },
  'tools.heritage': {
    vi: 'Danh Sách Di Sản',
    en: 'Heritage Catalog',
    fr: 'Catalogue du Patrimoine',
    ja: '遺産アーカイブ',
    ko: '문화유산 목록',
    zh: '文化遗产目录'
  },
  'tools.heritageDesc': {
    vi: 'Tìm kiếm bộ lọc chuyên sâu',
    en: 'Deep search & filters',
    fr: 'Filtres et recherche avancée',
    ja: '高度な検索と絞り込みフィルター',
    ko: '상세 검색 및 카테고리 필터',
    zh: '高级搜索与分类筛选'
  },

  // Floating controls
  'floating.exploreLandmark': {
    vi: 'Khám phá di sản',
    en: 'Explore Heritage',
    fr: 'Explorer le site',
    ja: '名所を探索',
    ko: '명소 탐험',
    zh: '探索名胜'
  },
  'floating.peekBackground': {
    vi: 'Ngắm ảnh nền',
    en: 'View Wallpaper',
    fr: 'Voir le fond',
    ja: '壁紙を鑑賞',
    ko: '배경 감상',
    zh: '欣赏壁纸'
  },
  'floating.changeLandmark': {
    vi: 'Đổi cảnh sắc',
    en: 'Change View',
    fr: 'Changer la vue',
    ja: '景色を変更',
    ko: '배경 변경',
    zh: '更换名胜'
  },

  // Footer
  'footer.platformDesc': {
    vi: 'Nền tảng trí tuệ nhân tạo đồng hành khám phá, bảo tồn và lan tỏa giá trị di sản văn hóa, lịch sử và trải nghiệm du lịch Việt Nam.',
    en: 'AI-powered platform to discover, preserve, and promote Vietnamese cultural heritage, history, and authentic travel experiences.',
    fr: 'Plateforme propulsée par l\'IA pour découvrir, préserver et valoriser le patrimoine culturel et historique du Vietnam.',
    ja: 'ベトナムの文化遺産、歴史、そして本物の旅行体験を発見・保存・発信するAIプラットフォーム。',
    ko: '베트남의 문화유산과 역사, 생생한 여행 경험을 발견하고 보존하며 널리 알리는 AI 플랫폼입니다.',
    zh: '致力于探索、保护与传承越南璀璨历史遗产与真实旅游体验的人工智能综合平台。'
  },
  'footer.pride': {
    vi: 'Phát triển với sự trân trọng đối với 4.000 năm lịch sử hào hùng và nguồn tư liệu lịch sử dân tộc.',
    en: 'Crafted with reverence for 4,000 years of heroic history and national cultural treasures.',
    fr: 'Conçu avec respect pour 4 000 ans d\'histoire héroïque et de trésors culturels nationaux.',
    ja: '4000年の輝かしい歴史と民族の文化財への敬意を込めて開発。',
    ko: '4,000년의 자랑스러운 역사와 민족 문화유산에 대한 깊은 경의를 담아 개발되었습니다.',
    zh: '致敬四千年波澜壮阔的历史文明与璀璨的民族文献宝库。'
  },
  'footer.coreFeatures': {
    vi: 'Chức năng cốt lõi',
    en: 'Core Features',
    fr: 'Fonctionnalités Clés',
    ja: '主要機能',
    ko: '핵심 기능',
    zh: '核心功能'
  },
  'footer.fRecognizer': {
    vi: 'Nhận diện di sản bằng AI Vision',
    en: 'Heritage AI Vision Recognition',
    fr: 'Reconnaissance de patrimoine par IA',
    ja: 'AI視覚による遺産認識',
    ko: 'AI 비전 기반 문화유산 인식',
    zh: 'AI 视觉识别历史遗迹'
  },
  'footer.fStory': {
    vi: 'Nghe AI kể chuyện văn hóa',
    en: 'Listen to AI Cultural Stories',
    fr: 'Écouter les récits culturels de l\'IA',
    ja: 'AIによる文化ストーリーテリング',
    ko: 'AI 문화 역사 이야기 청취',
    zh: '倾听AI讲述文化典故'
  },
  'footer.fFood': {
    vi: 'Ăn uống & vui chơi gần di sản',
    en: 'Food & leisure near heritage',
    fr: 'Gastronomie & sorties à proximité',
    ja: '名所周辺のグルメ＆レジャー',
    ko: '문화유산 주변 먹거리 & 즐길거리',
    zh: '胜地周边地道风味与娱乐'
  },
  'footer.fItinerary': {
    vi: 'Lập lịch trình du lịch thông minh',
    en: 'Smart travel itinerary planner',
    fr: 'Planificateur de voyage intelligent',
    ja: 'スマート旅行計画の作成',
    ko: '스마트 맞춤 여행 일정 설계',
    zh: '智能定制深度游览线路'
  },
  'footer.accountDevice': {
    vi: 'Tài khoản & Thiết bị',
    en: 'Account & Device',
    fr: 'Compte & Appareil',
    ja: 'アカウント＆端末',
    ko: '계정 & 기기',
    zh: '账户与设备'
  },
  'footer.loginRegister': {
    vi: 'Đăng nhập / Đăng ký tài khoản',
    en: 'Sign In / Register Account',
    fr: 'Connexion / Inscription',
    ja: 'ログイン / 新規登録',
    ko: '로그인 / 회원가입',
    zh: '登录 / 注册新账户'
  },
  'footer.viewBadges': {
    vi: 'Xem điểm văn hóa & danh hiệu',
    en: 'View Cultural XP & Badges',
    fr: 'Voir les points XP & titres',
    ja: '文化XPと獲得称号の確認',
    ko: '문화 XP 및 획득 칭호 확인',
    zh: '查看文化积分与专属勋章'
  },
  'footer.activityHistory': {
    vi: 'Lịch sử thao tác thiết bị',
    en: 'Device Activity History',
    fr: 'Historique d\'activité',
    ja: '端末の操作履歴',
    ko: '기기 활동 기록',
    zh: '设备历史浏览与活动记录'
  },
  'footer.savedFavorites': {
    vi: 'Bộ sưu tập di sản đã lưu',
    en: 'Saved Heritage Collection',
    fr: 'Collection de patrimoine enregistrée',
    ja: 'お気に入り保存コレクション',
    ko: '저장한 문화유산 컬렉션',
    zh: '已收藏的文化遗产名录'
  },
  'footer.copyright': {
    vi: '© 2026 HỒN ĐẤT VIỆT. Tự hào Di sản Việt Nam.',
    en: '© 2026 HERITAGEAI. Pride of Vietnamese Heritage.',
    fr: '© 2026 HERITAGEAI. Fierté du Patrimoine Vietnamien.',
    ja: '© 2026 HERITAGEAI. ベトナムの遺産を誇りに。',
    ko: '© 2026 HERITAGEAI. 베트남 문화유산의 자부심.',
    zh: '© 2026 越南之魂 HERITAGEAI. 传承华夏与越裳文化之美。'
  },
  'footer.dataCredit': {
    vi: 'Dữ liệu đối chiếu: Đại Việt Sử Ký Toàn Thư, UNESCO & Google Places',
    en: 'Sources verified with Dai Viet Su Ky Toan Thu, UNESCO & Google Places',
    fr: 'Sources vérifiées avec Dai Viet Su Ky Toan Thu, UNESCO & Google Places',
    ja: '参照文献：大越史記全書、UNESCO世界遺産、Google Places',
    ko: '자료 검증: 대월사기전서, UNESCO 세계유산, Google Places',
    zh: '考据典籍：《大越史记全书》、联合国教科文组织(UNESCO)及 Google Places'
  },

  // Aliases for navigation
  'nav.recognize': {
    vi: 'Nhận diện AI',
    en: 'AI Vision',
    fr: 'Vision IA',
    ja: 'AI画像認識',
    ko: 'AI 비전 인식',
    zh: 'AI 视觉识别'
  },
  'nav.story': {
    vi: 'Kể chuyện AI',
    en: 'AI Stories',
    fr: 'Récits IA',
    ja: 'AIストーリー',
    ko: 'AI 이야기',
    zh: 'AI 故事讲述'
  },
  'nav.quiz': {
    vi: 'Quiz & Lịch sử',
    en: 'Quiz & History',
    fr: 'Quiz & Histoire',
    ja: 'クイズ・歴史',
    ko: '퀴즈 & 역사',
    zh: '历史问答'
  },

  // Home Page S-Shaped Map Section
  'home.mapSectionBadge': {
    vi: 'Bản Đồ Địa Lý & Du Lịch Tương Tác Trực Tiếp',
    en: 'Interactive Geographical & Travel Map',
    fr: 'Carte Géographique & Touristique Interactive',
    ja: 'インタラクティブ地理・観光マップ',
    ko: '인터랙티브 지리 및 관광 지도',
    zh: '全景交互式地理与文旅地图'
  },
  'home.mapSectionTitle': {
    vi: 'Khám Phá Dải Đất Hình Chữ S Việt Nam',
    en: 'Explore the S-Shaped Land of Vietnam',
    fr: 'Explorez la Terre en Forme de S du Vietnam',
    ja: 'ベトナムのS字型の国土を探訪',
    ko: '베트남 S자형 국토 탐험',
    zh: '探索越南S形壮丽山河'
  },
  'home.mapSectionDesc': {
    vi: 'Chạm hoặc nhấn vào bất kỳ tỉnh thành nào trên bản đồ để phóng to và xem các di sản thực tế.',
    en: 'Touch or click any province on the map to zoom in and discover real heritages.',
    fr: 'Touchez ou cliquez sur une province pour zoomer et découvrir ses patrimoines réels.',
    ja: '地図上の各省をタップしてズームし、実在の世界遺産や史跡を発見。',
    ko: '지도의 각 성/시를 터치하여 확대하고 실제 문화유산을 확인하세요.',
    zh: '点击地图上的任意省市即可放大浏览当地真实的文化名胜。'
  },
  'home.mapSectionFullscreen': {
    vi: 'Mở Bản Đồ Toàn Màn Hình',
    en: 'Open Fullscreen Map',
    fr: 'Ouvrir la Carte Plein Écran',
    ja: '全画面マップを開く',
    ko: '전체 화면 지도 열기',
    zh: '开启全屏地图'
  },

  // Heritage Detail Modal
  'detail.title': {
    vi: 'Chi Tiết Di Sản Văn Hóa',
    en: 'Cultural Heritage Details',
    fr: 'Détails du Patrimoine Culturel',
    ja: '文化遺産の詳細',
    ko: '문화유산 상세 정보',
    zh: '文化遗产详细介绍'
  },
  'detail.significance': {
    vi: 'Ý nghĩa & Giá trị di sản',
    en: 'Significance & Cultural Value',
    fr: 'Signification & Valeur Culturelle',
    ja: '文化的意義と価値',
    ko: '문화적 의의 및 가치',
    zh: '历史文化价值与意义'
  },
  'detail.history': {
    vi: 'Niên đại & Lịch sử hình thành',
    en: 'Chronology & Historical Origins',
    fr: 'Chronologie & Origines Historiques',
    ja: '年代と歴史的起源',
    ko: '연대 및 역사적 기원',
    zh: '历史年代与形成渊源'
  },
  'detail.practical': {
    vi: 'Thông tin tham quan & Lời khuyên',
    en: 'Visitor Information & Travel Tips',
    fr: 'Informations Pratiques & Conseils',
    ja: '拝観・見学案内とアドバイス',
    ko: '관람 정보 및 여행 팁',
    zh: '参观指南与游玩建议'
  },
  'detail.openHours': {
    vi: 'Giờ mở cửa',
    en: 'Opening Hours',
    fr: 'Horaires d\'ouverture',
    ja: '開館時間',
    ko: '운영 시간',
    zh: '开放时间'
  },
  'detail.ticketPrice': {
    vi: 'Giá vé tham quan',
    en: 'Admission Fee',
    fr: 'Tarif d\'entrée',
    ja: '拝観料・入場料',
    ko: '입장료',
    zh: '门票价格'
  },
  'detail.free': {
    vi: 'Miễn phí vé vào cổng',
    en: 'Free Admission',
    fr: 'Entrée Gratuite',
    ja: '無料拝観',
    ko: '무료 입장',
    zh: '免费参观'
  },
  'detail.nearbyFood': {
    vi: 'Ẩm thực xung quanh',
    en: 'Nearby Delicacies',
    fr: 'Gastronomie aux alentours',
    ja: '周辺グルメ',
    ko: '주변 먹거리',
    zh: '周边特色美食'
  },
  'detail.listenStory': {
    vi: 'Nghe kể chuyện',
    en: 'Listen to Story',
    fr: 'Écouter le récit',
    ja: '物語を聴く',
    ko: '이야기 듣기',
    zh: '聆听历史故事'
  },
  'detail.askAI': {
    vi: 'Hỏi Hướng Dẫn Viên AI',
    en: 'Ask AI Tour Guide',
    fr: 'Demander au Guide IA',
    ja: 'AIガイドに質問',
    ko: 'AI 가이드에게 질문',
    zh: '咨询AI虚拟导游'
  },
  'detail.audioNarration': {
    vi: 'Thuyết minh tự động (AI)',
    en: 'AI Audio Narration',
    fr: 'Narration Audio IA',
    ja: 'AI自動音声解説',
    ko: 'AI 자동 오디오 해설',
    zh: 'AI 语音讲解'
  },
  'detail.save': {
    vi: 'Lưu vào yêu thích',
    en: 'Save to Favorites',
    fr: 'Enregistrer aux favoris',
    ja: 'お気に入りに保存',
    ko: '즐겨찾기에 저장',
    zh: '收藏此地标'
  },
  'detail.saved': {
    vi: 'Đã lưu yêu thích',
    en: 'Saved in Favorites',
    fr: 'Enregistré dans les favoris',
    ja: 'お気に入り登録済み',
    ko: '저장 완료',
    zh: '已收藏'
  },
  'detail.map': {
    vi: 'Xem vị trí bản đồ',
    en: 'View on Map',
    fr: 'Voir sur la carte',
    ja: '地図で位置を確認',
    ko: '지도에서 위치 보기',
    zh: '在地图中查看'
  },
  'detail.distance': {
    vi: 'Khoảng cách từ bạn',
    en: 'Distance from you',
    fr: 'Distance depuis vous',
    ja: '現在地からの距離',
    ko: '현재 위치에서의 거리',
    zh: '距离您的当前位置'
  },
  'detail.historicalPhoto': {
    vi: 'Ảnh tư liệu lịch sử',
    en: 'Historical Archive Photo',
    fr: 'Photo d\'Archives Historiques',
    ja: '歴史資料写真',
    ko: '역사 사료 사진',
    zh: '历史档案老照片'
  },
  'detail.currentPhoto': {
    vi: 'Ảnh hiện tại',
    en: 'Current Photo',
    fr: 'Photo actuelle',
    ja: '現在の写真',
    ko: '현재 사진',
    zh: '当代实景照片'
  },
  'detail.share': {
    vi: 'Chia sẻ di sản',
    en: 'Share Heritage',
    fr: 'Partager le patrimoine',
    ja: '遺産を共有',
    ko: '문화유산 공유',
    zh: '分享此文化遗产'
  },
  'detail.copied': {
    vi: 'Đã sao chép liên kết!',
    en: 'Link copied to clipboard!',
    fr: 'Lien copié dans le presse-papiers !',
    ja: 'リンクをクリップボードにコピーしました！',
    ko: '링크가 클립보드에 복사되었습니다!',
    zh: '链接已复制到剪贴板！'
  },

  // Mobile Bottom Nav
  'mobile.home': {
    vi: 'Trang chủ',
    en: 'Home',
    fr: 'Accueil',
    ja: 'ホーム',
    ko: '홈',
    zh: '首页'
  },
  'mobile.recognizer': {
    vi: 'Nhận diện',
    en: 'Vision',
    fr: 'Vision',
    ja: '認識',
    ko: '인식',
    zh: '识别'
  },
  'mobile.storyteller': {
    vi: 'Kể chuyện',
    en: 'Stories',
    fr: 'Récits',
    ja: '物語',
    ko: '이야기',
    zh: '讲述'
  },
  'mobile.chat': {
    vi: 'HDV AI',
    en: 'AI Guide',
    fr: 'Guide IA',
    ja: 'AI案内',
    ko: 'AI가이드',
    zh: 'AI导游'
  },
  'mobile.map': {
    vi: 'Bản đồ',
    en: 'Map',
    fr: 'Carte',
    ja: '地図',
    ko: '지도',
    zh: '地图'
  },
  'mobile.more': {
    vi: 'Thêm',
    en: 'More',
    fr: 'Plus',
    ja: 'その他',
    ko: '더보기',
    zh: '更多'
  },
  'mobile.close': {
    vi: 'Đóng menu',
    en: 'Close Menu',
    fr: 'Fermer',
    ja: '閉じる',
    ko: '닫기',
    zh: '关闭'
  },

  // Floating Controls
  'floating.showUI': {
    vi: 'Hiện giao diện',
    en: 'Show Interface',
    fr: 'Afficher',
    ja: 'UIを表示',
    ko: '화면 표시',
    zh: '显示界面'
  },

  // Common buttons
  'btn.details': {
    vi: 'Chi tiết',
    en: 'Details',
    fr: 'Détails',
    ja: '詳細',
    ko: '상세보기',
    zh: '详情'
  },
  'btn.story': {
    vi: 'Kể chuyện',
    en: 'Story',
    fr: 'Histoire',
    ja: 'ストーリー',
    ko: '이야기',
    zh: '故事'
  },
  'btn.food': {
    vi: 'Ăn uống',
    en: 'Food',
    fr: 'Cuisine',
    ja: 'グルメ',
    ko: '음식',
    zh: '餐饮'
  },
  'btn.save': {
    vi: 'Lưu',
    en: 'Save',
    fr: 'Enregistrer',
    ja: '保存',
    ko: '저장',
    zh: '保存'
  },
  'btn.cancel': {
    vi: 'Hủy',
    en: 'Cancel',
    fr: 'Annuler',
    ja: 'キャンセル',
    ko: '취소',
    zh: '取消'
  }
};

/**
 * Direct phrase translations dictionary for auto-translating Vietnamese text in any component
 */
export const PHRASE_TRANSLATIONS: Record<string, Record<string, string>> = {
  // Navigation & General
  'Trang chủ': { en: 'Home', fr: 'Accueil', ja: 'ホーム', ko: '홈', zh: '首页' },
  'Di sản': { en: 'Heritage', fr: 'Patrimoine', ja: '世界遺産', ko: '문화유산', zh: '文化遗产' },
  'Nhận diện AI': { en: 'AI Vision', fr: 'Vision IA', ja: 'AI画像認識', ko: 'AI 비전', zh: 'AI 识别' },
  'Nhận diện': { en: 'Vision', fr: 'Vision', ja: '認識', ko: '인식', zh: '识别' },
  'Kể chuyện AI': { en: 'AI Stories', fr: 'Récits IA', ja: 'AI物語音声', ko: 'AI 스토리', zh: 'AI 讲述' },
  'Kể chuyện': { en: 'Story', fr: 'Histoire', ja: 'ストーリー', ko: '이야기', zh: '讲故事' },
  'Hướng Dẫn Viên AI': { en: 'AI Tour Guide', fr: 'Guide IA', ja: 'AIツアーガイド', ko: 'AI 가이드', zh: 'AI 虚拟导游' },
  'HDV AI': { en: 'AI Guide', fr: 'Guide IA', ja: 'AI案内', ko: 'AI가이드', zh: 'AI导游' },
  'Bản đồ': { en: 'Map', fr: 'Carte', ja: '地図', ko: '지도', zh: '全景地图' },
  'Bản đồ Việt Nam': { en: 'Vietnam Map', fr: 'Carte du Vietnam', ja: 'ベトナム地図', ko: '베트남 지도', zh: '越南地图' },
  'Ăn uống & Vui chơi': { en: 'Food & Leisure', fr: 'Gastronomie & Loisirs', ja: 'グルメ＆レジャー', ko: '음식 & 즐길거리', zh: '美食与休闲' },
  'Ăn uống': { en: 'Food', fr: 'Cuisine', ja: 'グルメ', ko: '음식', zh: '餐饮' },
  'Lịch trình': { en: 'Itinerary', fr: 'Itinéraire', ja: '旅行日程', ko: '여행 일정', zh: '行程规划' },
  'Lập lịch trình': { en: 'Tour Planner', fr: 'Planificateur', ja: '日程プランナー', ko: '일정 플래너', zh: '规划行程' },
  'Lập Lịch Trình': { en: 'Tour Planner', fr: 'Planificateur', ja: '日程プランナー', ko: '일정 플래너', zh: '规划行程' },
  'Làng nghề & Nghệ thuật': { en: 'Crafts & Arts', fr: 'Artisanat & Arts', ja: '伝統工芸・芸能', ko: '전통공예 & 예술', zh: '传统手工艺与艺术' },
  'Quiz & Lịch sử': { en: 'Quiz & History', fr: 'Quiz & Histoire', ja: 'クイズ・歴史', ko: '퀴즈 & 역사', zh: '历史问答' },
  'Hồ sơ & Danh hiệu': { en: 'Profile & Badges', fr: 'Profil & Titres', ja: 'プロフィール＆称号', ko: '프로필 및 칭호', zh: '个人档案与成就' },
  'Cộng đồng': { en: 'Community', fr: 'Communauté', ja: 'コミュニティ', ko: '커뮤니티', zh: '互动社区' },
  'Quản trị viên': { en: 'Admin', fr: 'Administration', ja: '管理者', ko: '관리자', zh: '管理后台' },
  'Yêu thích': { en: 'Favorites', fr: 'Favoris', ja: 'お気に入り', ko: '즐겨찾기', zh: '收藏夹' },
  'Đề Xuất Mới': { en: 'Submit New', fr: 'Proposer', ja: '遺産提案', ko: '신규 제안', zh: '推荐遗址' },
  'Đề Xuất Di Sản / Địa Điểm Mới': { en: 'Submit Heritage / New Place', fr: 'Proposer un site', ja: '新名勝・遺産提案', ko: '새 명소 제안', zh: '推荐新遗址/地点' },
  'Ngoại tuyến': { en: 'Offline', fr: 'Hors ligne', ja: 'オフライン', ko: '오프라인', zh: '离线模式' },
  'Đăng nhập': { en: 'Sign In', fr: 'Connexion', ja: 'ログイン', ko: '로그인', zh: '登录' },
  'Đăng Nhập': { en: 'Sign In', fr: 'Connexion', ja: 'ログイン', ko: '로그인', zh: '登录' },
  'Đăng ký': { en: 'Sign Up', fr: 'Inscription', ja: '新規登録', ko: '회원가입', zh: '注册' },
  'Đăng Ký': { en: 'Sign Up', fr: 'Inscription', ja: '新規登録', ko: '회원가입', zh: '注册' },
  'Đăng xuất': { en: 'Sign Out', fr: 'Déconnexion', ja: 'ログアウト', ko: '로그아웃', zh: '退出登录' },
  'Chi tiết': { en: 'Details', fr: 'Détails', ja: '詳細', ko: '상세보기', zh: '详情' },
  'Lưu': { en: 'Save', fr: 'Enregistrer', ja: '保存', ko: '저장', zh: '保存' },
  'Hủy': { en: 'Cancel', fr: 'Annuler', ja: 'キャンセル', ko: '취소', zh: '取消' },
  'Đóng': { en: 'Close', fr: 'Fermer', ja: '閉じる', ko: '닫기', zh: '关闭' },
  'Thêm': { en: 'More', fr: 'Plus', ja: 'その他', ko: '더보기', zh: '更多' },
  'Xóa': { en: 'Clear', fr: 'Effacer', ja: 'クリア', ko: '삭제', zh: '清除' },
  'Khám phá di sản này': { en: 'Explore this heritage', fr: 'Explorer ce site', ja: 'この遺産を探索', ko: '이 유산 탐험', zh: '探索此遗址' },
  'Khám phá di sản': { en: 'Explore Heritage', fr: 'Explorer le site', ja: '遺産を探索', ko: '문화유산 탐험', zh: '探索名胜' },
  'Ngắm ảnh nền': { en: 'View Wallpaper', fr: 'Voir le fond', ja: '壁紙を鑑賞', ko: '배경 감상', zh: '欣赏壁纸' },
  'Đổi cảnh sắc': { en: 'Change View', fr: 'Changer la vue', ja: '景色を変更', ko: '배경 변경', zh: '更换名胜' },
  'Đổi danh thắng khác': { en: 'Change Landmark', fr: 'Changer de site', ja: '名勝を変更', ko: '명소 변경', zh: '更换名胜' },
  'Lấy GPS của tôi': { en: 'Get My GPS', fr: 'Localiser mon GPS', ja: '現在地を取得', ko: '내 GPS 위치', zh: '获取当前位置' },
  'Đang dò GPS...': { en: 'Locating GPS...', fr: 'Localisation GPS...', ja: 'GPS測位中...', ko: 'GPS 탐색 중...', zh: '正在定位...' },
  'Gần Bạn Nhất (GPS)': { en: 'Nearest You (GPS)', fr: 'Le Plus Proche (GPS)', ja: '最寄りの名所 (GPS)', ko: '가장 가까운 곳 (GPS)', zh: '离你最近 (GPS)' },
  'Hiện giao diện': { en: 'Show Interface', fr: 'Afficher', ja: 'UIを表示', ko: '화면 표시', zh: '显示界面' },
  'Quay về Trang chủ': { en: 'Back to Home', fr: 'Retour Accueil', ja: 'ホームに戻る', ko: '홈으로 돌아가기', zh: '返回首页' },
  'Quay lại Trang chủ': { en: 'Back to Home', fr: 'Retour Accueil', ja: 'ホームに戻る', ko: '홈으로 돌아가기', zh: '返回首页' },
  'Ngắm trọn vẹn bức ảnh nền danh thắng': { en: 'View Full Wallpaper', fr: 'Voir le fond d\'écran complet', ja: '壁紙をフル鑑賞', ko: '배경화면 전체 감상', zh: '全屏欣赏背景壁纸' },
  'Hiểu di sản. Khám phá Việt Nam.': { en: 'Understand Heritage. Discover Vietnam.', fr: 'Comprendre le Patrimoine. Explorer le Vietnam.', ja: '遺産を知り、ベトナムを巡る。', ko: '역사를 이해하고, 베트남을 탐험하세요.', zh: '感悟文化遗产，探索大美越南。' },

  // Home Page Sections
  'Di Sản Tiêu Biểu': { en: 'Featured Heritages', fr: 'Patrimoines Remarquables', ja: '代表的な世界遺産', ko: '대표 문화유산', zh: '代表性文化遗产' },
  'Báu Vật Ngàn Năm Của Dân Tộc': { en: 'Millennial Treasures of the Nation', fr: 'Trésors Millénaires de la Nation', ja: '千年の歴史を誇る国の宝', ko: '민족의 찬란한 천년 보물', zh: '千百年来流传的民族瑰宝' },
  'Xem tất cả trên bản đồ': { en: 'View all on map', fr: 'Voir tout sur la carte', ja: '地図ですべて見る', ko: '지도에서 전체 보기', zh: '在全景地图中查看' },
  'Bản Đồ Địa Lý & Du Lịch Tương Tác Trực Tiếp': { en: 'Interactive Geographical & Travel Map', fr: 'Carte Géographique & Touristique Interactive', ja: 'インタラクティブ地理・観光マップ', ko: '인터랙티브 지리 및 관광 지도', zh: '全景交互式地理与文旅地图' },
  'Khám Phá Dải Đất Hình Chữ S Việt Nam': { en: 'Explore the S-Shaped Land of Vietnam', fr: 'Explorez la Terre en Forme de S du Vietnam', ja: 'ベトナムのS字型の国土を探訪', ko: '베트남 S자형 국토 탐험', zh: '探索越南S形壮丽山河' },
  'Chạm hoặc nhấn vào bất kỳ tỉnh thành nào trên bản đồ để phóng to và xem các di sản thực tế.': {
    en: 'Touch or click any province on the map to zoom in and discover real heritages.',
    fr: 'Touchez ou cliquez sur une province pour zoomer et découvrir ses patrimoines réels.',
    ja: '地図上の各省をタップしてズームし、実在の世界遺産や史跡を発見。',
    ko: '지도의 각 성/시를 터치하여 확대하고 실제 문화유산을 확인하세요.',
    zh: '点击地图上的任意省市即可放大浏览当地真实的文化名胜。'
  },
  'Mở Bản Đồ Toàn Màn Hình': { en: 'Open Fullscreen Map', fr: 'Ouvrir la Carte Plein Écran', ja: '全画面マップを開く', ko: '전체 화면 지도 열기', zh: '开启全屏地图' },
  'Hệ Thống Lưu Trữ Cá Nhân & Điểm Văn Hóa': { en: 'Personal Archive & Cultural XP System', fr: 'Système d\'Archives Personnelles & Points XP', ja: '個人アーカイブ＆文化ポイントシステム', ko: '개인 보관함 & 문화 포인트 시스템', zh: '个人档案与文化积分系统' },
  'Đồng Hành & Lưu Trữ Mọi Hành Trình Di Sản Của Bạn': { en: 'Accompanying & Preserving All Your Heritage Journeys', fr: 'Accompagner & Préserver Tous Vos Voyages Culturels', ja: 'あなたの歴史遺産の旅を記録・共有', ko: '당신의 모든 문화유산 여정을 함께 기록합니다', zh: '陪伴并记录您的每一段文化遗产之旅' },
  'Mỗi thao tác nhận diện ảnh chụp bằng AI, nghe kể chuyện lịch sử, hoàn thành câu đố văn hóa hay lập kế hoạch du lịch đều được tự động ghi lại trong hồ sơ cá nhân với hệ thống điểm thưởng XP và danh hiệu di sản.': {
    en: 'Every AI image recognition, historical story listened to, cultural quiz completed, and trip plan made is automatically recorded with XP rewards and heritage badges.',
    fr: 'Chaque reconnaissance d\'image IA, histoire écoutée, quiz réussi ou itinéraire planifié est enregistré avec des points XP et des titres patrimoniaux.',
    ja: 'AI画像認識、歴史ストーリーの再生、クイズの挑戦、旅行日程の作成のすべてが個人プロファイルに記録され、XPやバッジが付与されます。',
    ko: 'AI 사진 인식, 역사 이야기 청취, 문화 퀴즈 풀이 및 여행 계획 등 모든 활동이 XP 포인트와 문화유산 칭호로 기록됩니다.',
    zh: '每一次AI视觉识别、倾听历史故事、完成文化问答或规划行程，都将自动记录在个人档案中，并累积XP积分与专属成就。'
  },
  'Xem Bảng Danh Hiệu & Hồ Sơ': { en: 'View Badges & Profile', fr: 'Voir les Titres & Profil', ja: '称号＆プロフィールを見る', ko: '칭호 및 프로필 보기', zh: '查看成就与档案' },
  'Tài Khoản Cá Nhân': { en: 'Personal Account', fr: 'Compte Personnel', ja: 'マイアカウント', ko: '개인 계정', zh: '个人账户' },
  'Đăng Nhập / Đăng Ký': { en: 'Sign In / Register', fr: 'Connexion / Inscription', ja: 'ログイン／新規登録', ko: '로그인 / 회원가입', zh: '登录 / 注册' },
  'AI Nhận Diện Thị Giác': { en: 'AI Visual Recognition', fr: 'Vision IA Patrimoniale', ja: 'AI視覚・画像認識', ko: 'AI 시각 인식', zh: 'AI 视觉识别' },
  'Chụp ảnh di tích, đồ cổ, trang phục cổ hay món ăn để biết ngay tên gọi, niên đại và ý nghĩa lịch sử.': {
    en: 'Take photos of monuments, antiques, historic costumes or food to discover names, periods and cultural origins.',
    fr: 'Prenez en photo monuments, antiquités, costumes ou plats pour connaître leur histoire et signification.',
    ja: '写真から寺院、古美術品、伝統衣装、郷土料理を瞬時に特定し、時代背景を解説。',
    ko: '유적지, 골동품, 전통 의상 또는 음식을 촬영하여 이름, 연대 및 역사적 의미를 즉시 확인하세요.',
    zh: '拍摄古迹、文物古董、传统服饰或特色菜肴，即时获知其名称、历史年代与文化底蕴。'
  },
  'AI Kể Chuyện Đa Đối Tượng': { en: 'Multi-Audience AI Storyteller', fr: 'Récits IA Personnalisés', ja: 'AI歴史ストーリーテリング', ko: '맞춤형 AI 이야기꾼', zh: 'AI 多群体故事讲述' },
  'Lắng nghe giọng kể truyền cảm phù hợp với trẻ em, học sinh, nhà nghiên cứu hay du khách quốc tế.': {
    en: 'Listen to expressive storytelling crafted for children, students, scholars, or international tourists.',
    fr: 'Écoutez une narration captivante adaptée aux enfants, étudiants, chercheurs ou voyageurs du monde.',
    ja: '子供向け、学生向け、研究者向け、外国人観光客向けに最適化された感情豊かな音声解説。',
    ko: '어린이, 학생, 연구자 및 해외 관광객에 맞춘 감동적인 내레이션을 들어보세요.',
    zh: '倾听针对儿童、青少年、历史学者或国际游客量身定制的生动语音导览。'
  },
  'Lập Lịch Trình Tự Động': { en: 'Automated Itinerary Planner', fr: 'Planificateur d\'Itinéraire', ja: 'スマート旅行計画', ko: '스마트 일정 플래너', zh: '智能行程规划' },
  'Lên kế hoạch du lịch văn hóa theo thời gian, ngân sách, tích hợp Google Places lân cận.': {
    en: 'Generate customized cultural tour plans by time and budget with nearby Google Places.',
    fr: 'Organisez des circuits culturels selon votre temps et budget avec les lieux Google Places à proximité.',
    ja: '時間や予算に合わせて最適な文化ツアーを自動編成し、周辺の人気スポットも提案。',
    ko: '시간과 예산에 맞추어 맞춤형 문화 여행을 계획하고 주변 장소를 추천받으세요.',
    zh: '根据游玩时间与预算，自动生成深度文化游览路线，并推荐周边精选地标。'
  },

  // Footer & Miscellaneous
  'Chức năng cốt lõi': { en: 'Core Features', fr: 'Fonctionnalités Clés', ja: '主要機能', ko: '핵심 기능', zh: '核心功能' },
  'Nhận diện di sản bằng AI Vision': { en: 'Heritage AI Vision Recognition', fr: 'Reconnaissance de patrimoine par IA', ja: 'AI視覚による遺産認識', ko: 'AI 비전 기반 문화유산 인식', zh: 'AI 视觉识别历史遗迹' },
  'Nghe AI kể chuyện văn hóa': { en: 'Listen to AI Cultural Stories', fr: 'Écouter les récits culturels de l\'IA', ja: 'AIによる文化ストーリーテリング', ko: 'AI 문화 역사 이야기 청취', zh: '倾听AI讲述文化典故' },
  'Ăn uống & vui chơi gần di sản': { en: 'Food & leisure near heritage', fr: 'Gastronomie & sorties à proximité', ja: '名所周辺のグルメ＆レジャー', ko: '문화유산 주변 먹거리 & 즐길거리', zh: '胜地周边地道风味与娱乐' },
  'Lập lịch trình du lịch thông minh': { en: 'Smart travel itinerary planner', fr: 'Planificateur de voyage intelligent', ja: 'スマート旅行計画の作成', ko: '스마트 맞춤 여행 일정 설계', zh: '智能定制深度游览线路' },
  'Tài khoản & Thiết bị': { en: 'Account & Device', fr: 'Compte & Appareil', ja: 'アカウント＆端末', ko: '계정 & 기기', zh: '账户与设备' },
  'Đăng nhập / Đăng ký tài khoản': { en: 'Sign In / Register Account', fr: 'Connexion / Inscription', ja: 'ログイン / 新規登録', ko: '로그인 / 회원가입', zh: '登录 / 注册新账户' },
  'Xem điểm văn hóa & danh hiệu': { en: 'View Cultural XP & Badges', fr: 'Voir les points XP & titres', ja: '文化XPと獲得称号の確認', ko: '문화 XP 및 획득 칭호 확인', zh: '查看文化积分与专属勋章' },
  'Lịch sử thao tác thiết bị': { en: 'Device Activity History', fr: 'Historique d\'activité', ja: '端末の操作履歴', ko: '기기 활동 기록', zh: '设备历史浏览与活动记录' },
  'Bộ sưu tập di sản đã lưu': { en: 'Saved Heritage Collection', fr: 'Collection de patrimoine enregistrée', ja: 'お気に入り保存コレクション', ko: '저장한 문화유산 컬렉션', zh: '已收藏的文化遗产名录' },
  '© 2026 HỒN ĐẤT VIỆT. Tự hào Di sản Việt Nam.': {
    en: '© 2026 HERITAGEAI. Pride of Vietnamese Heritage.',
    fr: '© 2026 HERITAGEAI. Fierté du Patrimoine Vietnamien.',
    ja: '© 2026 HERITAGEAI. ベトナムの遺産を誇りに。',
    ko: '© 2026 HERITAGEAI. 베트남 문화유산의 자부심.',
    zh: '© 2026 越南之魂 HERITAGEAI. 传承华夏与越裳文化之美。'
  },
  'profile.badgesTab': {
    vi: 'Bảng Danh Hiệu',
    en: 'Badges',
    fr: 'Titres & Badges',
    ja: 'バッジ＆称号',
    ko: '칭호 & 배지',
    zh: '成就与勋章'
  },
  'profile.infoTab': {
    vi: 'Hồ Sơ & Thống Kê',
    en: 'Profile & Stats',
    fr: 'Profil & Stats',
    ja: 'プロフィール＆統計',
    ko: '프로필 & 통계',
    zh: '个人档案与统计'
  },
  'profile.historyTab': {
    vi: 'Lịch Sử',
    en: 'History',
    fr: 'Historique',
    ja: '履歴',
    ko: '기록',
    zh: '历史足迹'
  },
  'profile.securityTab': {
    vi: 'Bảo Mật',
    en: 'Security',
    fr: 'Sécurité',
    ja: 'セキュリティ',
    ko: '보안',
    zh: '账号安全'
  },
  'profile.visitor': {
    vi: 'Khách tham quan',
    en: 'Visitor',
    fr: 'Visiteur',
    ja: '訪問者',
    ko: '방문객',
    zh: '游客'
  },
  'profile.badgeCollection': {
    vi: 'Bộ Sưu Tập Huy Hiệu & Danh Hiệu Di Sản',
    en: 'Heritage Badge & Title Collection',
    fr: 'Collection de Badges & Titres de Patrimoine',
    ja: '文化遺産バッジ＆称号コレクション',
    ko: '문화유산 배지 & 칭호 컬렉션',
    zh: '文化遗产勋章与成就陈列馆'
  },
  'profile.badgeSub': {
    vi: 'Hoàn thành các hoạt động khám phá, nhận diện và học tập để mở khóa huy hiệu vinh danh.',
    en: 'Complete exploration, recognition, and learning activities to unlock honorary badges.',
    fr: 'Complétez les activités d\'exploration, de reconnaissance et d\'apprentissage pour débloquer des badges honorifiques.',
    ja: '探索、画像認識、学習アクティビティを完了して、名誉あるバッジをアンロック。',
    ko: '탐험, 인식, 학습 활동을 완료하고 명예로운 배지를 잠금 해제하세요.',
    zh: '完成探索、图文识别与文化问答学习活动，即可解锁专属荣誉勋章。'
  },
  'profile.completion': {
    vi: 'Độ hoàn thiện:',
    en: 'Completion:',
    fr: 'Complétion :',
    ja: '達成率：',
    ko: '달성률:',
    zh: '完成度：'
  },
  'profile.achieved': {
    vi: 'Đã đạt được',
    en: 'Achieved',
    fr: 'Obtenu',
    ja: '獲得済み',
    ko: '획득 완료',
    zh: '已达成'
  },
  'profile.locked': {
    vi: 'Chưa mở khóa',
    en: 'Locked',
    fr: 'Verrouillé',
    ja: '未ロック',
    ko: '잠김',
    zh: '未解锁'
  },
  'profile.heritageRank': {
    vi: 'Cấp bậc Di sản:',
    en: 'Heritage Rank:',
    fr: 'Rang de Patrimoine :',
    ja: 'ヘリテージランク：',
    ko: '문화유산 등급:',
    zh: '遗产等级：'
  },
  'profile.culturalXP': {
    vi: 'Điểm Văn Hóa (XP)',
    en: 'Cultural XP',
    fr: 'Points XP Culturels',
    ja: '文化XPポイント',
    ko: '문화 XP 포인트',
    zh: '文化积分 (XP)'
  },
  'profile.favHeritages': {
    vi: 'Di sản yêu thích',
    en: 'Favorite Heritages',
    fr: 'Patrimoines favoris',
    ja: 'お気に入り遺産',
    ko: '즐겨찾는 문화유산',
    zh: '收藏的遗迹'
  },
  'profile.aiRecognitions': {
    vi: 'Lần nhận diện AI',
    en: 'AI Recognitions',
    fr: 'Reconnaissances IA',
    ja: 'AI認識回数',
    ko: 'AI 인식 횟수',
    zh: 'AI识别次数'
  },
  'profile.culturalQuiz': {
    vi: 'Quiz văn hóa',
    en: 'Cultural Quizzes',
    fr: 'Quiz culturels',
    ja: '文化クイズ',
    ko: '문화 퀴즈',
    zh: '文化问答'
  },
  'profile.familyMemories': {
    vi: 'Ký ức gia đình',
    en: 'Family Memories',
    fr: 'Souvenirs familiaux',
    ja: 'ファミリーメモリー',
    ko: '가족 기억',
    zh: '家族记忆'
  },
  'profile.personalDetails': {
    vi: 'Chi Tiết Hồ Sơ Cá Nhân',
    en: 'Personal Profile Details',
    fr: 'Détails du Profil Personnel',
    ja: '個人プロファイル詳細',
    ko: '개인 프로필 상세 정보',
    zh: '个人档案详情'
  },
  'profile.editProfile': {
    vi: 'Chỉnh sửa hồ sơ',
    en: 'Edit Profile',
    fr: 'Modifier le profil',
    ja: 'プロフィール編集',
    ko: '프로필 수정',
    zh: '编辑个人档案'
  },
  'profile.cancelEdit': {
    vi: 'Hủy chỉnh sửa',
    en: 'Cancel',
    fr: 'Annuler',
    ja: 'キャンセル',
    ko: '취소',
    zh: '取消编辑'
  },
  'profile.displayNameLabel': {
    vi: 'Họ và Tên Hiển Thị:',
    en: 'Display Name:',
    fr: 'Nom d\'affichage :',
    ja: '表示名：',
    ko: '표시 이름:',
    zh: '显示昵称：'
  },
  'profile.cityLabel': {
    vi: 'Tỉnh / Thành Phố Quê Hương:',
    en: 'Hometown / Province:',
    fr: 'Ville / Province d\'origine :',
    ja: '出身地・省：',
    ko: '고향 / 시·도:',
    zh: '家乡省市：'
  },
  'profile.userRoleLabel': {
    vi: 'Vai Trò Người Dùng:',
    en: 'User Role:',
    fr: 'Rôle d\'utilisateur :',
    ja: 'ユーザーロール：',
    ko: '사용자 역할:',
    zh: '用户身份：'
  },
  'profile.saveChanges': {
    vi: 'Lưu thay đổi',
    en: 'Save Changes',
    fr: 'Enregistrer les modifications',
    ja: '変更を保存',
    ko: '변경사항 저장',
    zh: '保存修改'
  },
  'profile.changePasswordTitle': {
    vi: 'Đổi mật khẩu bảo mật tài khoản',
    en: 'Change Account Password',
    fr: 'Changer le mot de passe du compte',
    ja: 'アカウントパスワードの変更',
    ko: '계정 비밀번호 변경',
    zh: '修改账户登录密码'
  },
  'profile.currentPassword': {
    vi: 'Mật khẩu hiện tại:',
    en: 'Current Password:',
    fr: 'Mot de passe actuel :',
    ja: '現在のパスワード：',
    ko: '현재 비밀번호:',
    zh: '当前密码：'
  },
  'profile.newPassword': {
    vi: 'Mật khẩu mới (ít nhất 6 ký tự):',
    en: 'New Password (at least 6 chars):',
    fr: 'Nouveau mot de passe (6 car. min) :',
    ja: '新しいパスワード（6文字以上）：',
    ko: '새 비밀번호 (6자 이상):',
    zh: '新密码（至少6个字符）：'
  },
  'profile.confirmPassword': {
    vi: 'Xác nhận mật khẩu mới:',
    en: 'Confirm New Password:',
    fr: 'Confirmer le nouveau mot de passe :',
    ja: '新しいパスワードの確認：',
    ko: '새 비밀번호 확인:',
    zh: '确认新密码：'
  },
  'profile.updatePasswordBtn': {
    vi: 'Cập nhật mật khẩu',
    en: 'Update Password',
    fr: 'Mettre à jour le mot de passe',
    ja: 'パスワードを更新',
    ko: '비밀번호 업데이트',
    zh: '更新密码'
  },
  'profile.activityLog': {
    vi: 'Nhật ký hoạt động & Thao tác',
    en: 'Activity & Action Log',
    fr: 'Journal d\'activité',
    ja: 'アクティビティ＆操作履歴',
    ko: '활동 및 작업 로그',
    zh: '活动轨迹与操作日志'
  },
  'profile.clearHistory': {
    vi: 'Xóa lịch sử',
    en: 'Clear History',
    fr: 'Effacer l\'historique',
    ja: '履歴をクリア',
    ko: '기록 지우기',
    zh: '清空历史'
  },
  'profile.filterAll': {
    vi: 'Tất cả',
    en: 'All',
    fr: 'Tout',
    ja: 'すべて',
    ko: '전체',
    zh: '全部'
  },
  'community.badge': {
    vi: 'Kho Dữ Liệu Văn Hóa Mở Cho Cộng Đồng',
    en: 'Open Community Cultural Data Repository',
    fr: 'Répertoire de Données Culturelles Ouvert',
    ja: 'オープン・コミュニティ文化データリポジトリ',
    ko: '오픈 커뮤니티 문화 데이터 저장소',
    zh: '开放式社区文化数据宝库'
  },
  'community.heading': {
    vi: 'Chung Tay Đóng Góp Tri Thức Di Sản',
    en: 'Together Contributing Heritage Knowledge',
    fr: 'Contribuer ensemble au savoir du patrimoine',
    ja: 'みんなで育む文化遺産の知見',
    ko: '함께 기여하는 문화유산 지식',
    zh: '携手共建遗产文化知识库'
  },
  'community.desc': {
    vi: 'Mỗi câu chuyện truyền khẩu, một công thức nấu ăn cổ hay một bức ảnh di tích xưa từ bạn đều là mảnh ghép vô giá cho kho tàng văn hóa Việt Nam.',
    en: 'Every oral story, ancient recipe, or historic photo from you is an invaluable piece for Vietnam\'s cultural treasure trove.',
    fr: 'Chaque histoire orale, recette ancienne ou photo historique est une pièce inestimable pour le trésor culturel du Vietnam.',
    ja: '語り継がれる物語、古いレシピ、歴史ある写真のすべてが、ベトナムの文化遺産を彩るかけがえのないピースです。',
    ko: '구전 이야기, 고대의 조리법, 혹은 오래된 유적 사진 등 여러분의 모든 기여는 베트남 문화 유산의 소중한 조각이 됩니다.',
    zh: '每一则口耳相传的故事、每一道古老食谱或一张历史古迹照片，都是构筑越南灿烂文化宝库不可或缺的珍贵拼图。'
  },
  'community.submitNew': {
    vi: 'Gửi Đóng Góp Tư Liệu Mới',
    en: 'Submit New Contribution',
    fr: 'Soumettre une contribution',
    ja: '新しい資料を投稿する',
    ko: '새 자료 기여하기',
    zh: '提交新资料投稿'
  },
  'community.closeForm': {
    vi: 'Đóng form đóng góp',
    en: 'Close Contribution Form',
    fr: 'Fermer le formulaire',
    ja: '投稿フォームを閉じる',
    ko: '기여 폼 닫기',
    zh: '关闭投稿表单'
  },
  'community.formTitle': {
    vi: 'Phiếu Đóng Góp Tư Liệu Văn Hóa',
    en: 'Cultural Material Contribution Form',
    fr: 'Formulaire de Contribution Culturelle',
    ja: '文化資料投稿フォーム',
    ko: '문화 자료 기여 양식',
    zh: '文化资料贡献申请表'
  },
  'community.formSub': {
    vi: 'Thông tin sẽ được đối chiếu và kiểm duyệt trước khi đưa vào kho dữ liệu chính thức.',
    en: 'Information will be verified and moderated before entering the official database.',
    fr: 'Les informations seront vérifiées et modérées avant d\'entrer dans la base officielle.',
    ja: '情報は公式データベースに登録される前に検証・モデレーションされます。',
    ko: '제출된 정보는 공식 데이터베이스에 등록되기 전에 검증 및 검토를 거칩니다.',
    zh: '提交的信息将在审核验证后收录至官方数据库。'
  },
  'community.contributorName': {
    vi: 'Tên người đóng góp:',
    en: 'Contributor Name:',
    fr: 'Nom du contributeur :',
    ja: '貢献者名：',
    ko: '기여자 이름:',
    zh: '贡献者姓名：'
  },
  'community.location': {
    vi: 'Địa phương / Tỉnh thành:',
    en: 'Location / Province:',
    fr: 'Lieu / Province :',
    ja: '地域・省：',
    ko: '지역 / 시·도:',
    zh: '所属地区/省市：'
  },
  'community.category': {
    vi: 'Chủ đề đóng góp:',
    en: 'Contribution Category:',
    fr: 'Catégorie de contribution :',
    ja: '投稿カテゴリ：',
    ko: '기여 분야:',
    zh: '投稿主题分类：'
  },
  'community.cat1': {
    vi: 'Huyền tích & Phong tục dân gian',
    en: 'Folklore & Folk Customs',
    fr: 'Légendes & Coutumes Populaires',
    ja: '伝承・民俗風習',
    ko: '설화 및 민속 풍습',
    zh: '民间传说与民俗风情'
  },
  'community.cat2': {
    vi: 'Di tích / Công trình chưa được ghi danh',
    en: 'Unlisted Monuments / Sites',
    fr: 'Monuments / Sites non répertoriés',
    ja: '未登録の史跡・建築物',
    ko: '미등록 유적 및 건축물',
    zh: '未登记的历史古迹/建筑'
  },
  'community.cat3': {
    vi: 'Món ăn truyền thống / Công thức cổ',
    en: 'Traditional Cuisine / Ancient Recipes',
    fr: 'Cuisine traditionnelle / Recettes anciennes',
    ja: '伝統料理・古来のレシピ',
    ko: '전통 음식 / 고대 조리법',
    zh: '传统风味/古法菜谱'
  },
  'community.cat4': {
    vi: 'Làng nghề thủ công gia truyền',
    en: 'Traditional Craft Villages',
    fr: 'Villages artisanaux traditionnels',
    ja: '伝統工芸の村',
    ko: '전통 공예 마을',
    zh: '传统手工艺村'
  },
  'community.cat5': {
    vi: 'Ảnh tư liệu lịch sử',
    en: 'Historical Archive Photos',
    fr: 'Photos d\'archives historiques',
    ja: '歴史的アーカイブ写真',
    ko: '역사 아카이브 사진',
    zh: '历史档案照片'
  },
  'community.sourceRef': {
    vi: 'Nguồn tư liệu / Nhân chứng:',
    en: 'Source Reference / Witness:',
    fr: 'Référence source / Témoin :',
    ja: '資料出典・証言者：',
    ko: '출처 참고 / 증언자:',
    zh: '资料来源/知情人：'
  },
  'community.titleLabel': {
    vi: 'Tiêu đề tư liệu / Câu chuyện:',
    en: 'Material / Story Title:',
    fr: 'Titre de l\'histoire :',
    ja: '資料・ストーリータイトル：',
    ko: '자료 / 이야기 제목:',
    zh: '资料/故事标题：'
  },
  'community.contentLabel': {
    vi: 'Nội dung chi tiết tư liệu:',
    en: 'Detailed Content:',
    fr: 'Contenu détaillé :',
    ja: '詳細内容：',
    ko: '상세 내용:',
    zh: '详细内容描述：'
  },
  'community.imageUrlLabel': {
    vi: 'Đường dẫn hình ảnh (Ảnh thực tế/Tư liệu):',
    en: 'Image URL (Real photo / Archive):',
    fr: 'URL de l\'image (Photo réelle / Archive) :',
    ja: '画像URL（実写・資料写真）：',
    ko: '이미지 URL (실제 사진 / 아카이브):',
    zh: '图片链接（实景/历史资料）：'
  },
  'community.terms': {
    vi: 'Tôi cam kết thông tin cung cấp chính xác, không vi phạm bản quyền hay thuần phong mỹ tục và đồng ý đóng góp cho kho tri thức mở Hồn Đất Việt.',
    en: 'I commit that the provided information is accurate, respects copyrights and cultural standards, and agree to contribute to the HeritageAI open knowledge base.',
    fr: 'Je m\'engage à ce que les informations fournies soient exactes et respectueuses, et j\'accepte de contribuer à la base de connaissances ouverte.',
    ja: '提供する情報が正確であり、著作権や公序良俗に違反しないことを誓約し、オープン知識ベースへの貢献に同意します。',
    ko: '제공된 정보가 정확하며 저작권 및 미풍양속을 위반하지 않음을 서약하고 오픈 지식 베이스 기여에 동의합니다.',
    zh: '我承诺所提供的信息真实准确、不侵犯版权及公序良俗，并同意将其贡献给越南文化遗产开放知识库。'
  },
  'community.submitBtn': {
    vi: 'Gửi Tư Liệu Để Kiểm Định',
    en: 'Submit Material for Verification',
    fr: 'Soumettre pour vérification',
    ja: '検証用に資料を送信',
    ko: '검증을 위해 자료 제출',
    zh: '提交资料等待审核验证'
  },
  'community.submitSuccess': {
    vi: 'Đã gửi thành công! Cảm ơn đóng góp của bạn.',
    en: 'Submitted successfully! Thank you for your contribution.',
    fr: 'Soumis avec succès ! Merci pour votre contribution.',
    ja: '送信成功！ご貢献ありがとうございます。',
    ko: '성공적으로 제출되었습니다! 기여해주셔서 감사합니다.',
    zh: '提交成功！感谢您的热忱贡献。'
  },
  'community.feedHeader': {
    vi: 'Các Đóng Góp Mới Từ Cộng Đồng',
    en: 'Latest Community Contributions',
    fr: 'Dernières contributions de la communauté',
    ja: 'コミュニティからの最新の投稿',
    ko: '최신 커뮤니티 기여작',
    zh: '最新社区贡献投稿'
  },
  'community.verified': {
    vi: 'Đã kiểm duyệt & Xác thực nguồn gốc',
    en: 'Moderated & Verified Source',
    fr: 'Modéré & Source vérifiée',
    ja: 'モデレーション済み・出典確認済み',
    ko: '검토 및 출처 인증됨',
    zh: '已通过审核与来源验证'
  },
  'community.authorPrefix': {
    vi: 'Người đóng góp:',
    en: 'Contributor:',
    fr: 'Contributeur :',
    ja: '貢献者：',
    ko: '기여자:',
    zh: '贡献者：'
  },
  'community.verifiedBadge': {
    vi: 'Đã kiểm định',
    en: 'Verified',
    fr: 'Vérifié',
    ja: '検証済み',
    ko: '인증됨',
    zh: '已验证'
  },
  'community.pendingBadge': {
    vi: 'Đang chờ duyệt',
    en: 'Pending Review',
    fr: 'En attente',
    ja: '審査待ち',
    ko: '승인 대기 중',
    zh: '待审核'
  },
  'profile.noActivity': {
    vi: 'Không tìm thấy nhật ký hoạt động nào.',
    en: 'No activity logs found.',
    fr: 'Aucun journal d\'activité trouvé.',
    ja: 'アクティビティ履歴が見つかりません。',
    ko: '활동 기록이 없습니다.',
    zh: '未找到活动日志。'
  },
  'Nhà Thám Hiểm Sơ Cấp': {
    en: 'Junior Explorer',
    fr: 'Explorateur Junior',
    ja: '初級探検家',
    ko: '초급 탐험가',
    zh: '初级探险家'
  },
  'Bắt đầu bước chân vào hành trình khám phá di sản 3 miền non sông.': {
    en: 'Begin your journey exploring heritage across the three regions of Vietnam.',
    fr: 'Commencez votre voyage d\'exploration du patrimoine dans les trois régions du Vietnam.',
    ja: 'ベトナム3地域の文化遺産を巡る旅の第一歩を踏み出そう。',
    ko: '베트남 3대 지역의 문화유산 탐험 여정을 시작하세요.',
    zh: '开启探索越南三地自然与人文遗产的精彩旅程。'
  },
  'Tạo tài khoản hoặc đăng nhập thành viên': {
    en: 'Create an account or sign in as a member',
    fr: 'Créez un compte ou connectez-vous',
    ja: 'アカウント作成またはログイン',
    ko: '계정 생성 또는 회원 로그인',
    zh: '注册账号或登录会员'
  },
  'Sứ Giả Cố Đô': {
    en: 'Ancient Capital Envoy',
    fr: 'Émissaire de l\'Ancienne Capitale',
    ja: '古都の使者',
    ko: '고도(古都)의 사신',
    zh: '古都使者'
  },
  'Tìm hiểu sâu về Đại Nội Huế, nhã nhạc cung đình và quần thể di tích triều Nguyễn.': {
    en: 'Deep dive into Hue Imperial Citadel, Royal Court Music and Nguyen Dynasty monuments.',
    fr: 'Explorez en profondeur la citadelle de Hué, la musique de la cour et les monuments des Nguyen.',
    ja: 'フエ王宮、宮廷雅楽、グエン朝の歴史的建造物を深く探求。',
    ko: '후에 왕궁, 궁중음악 및 응우옌 왕조 유적군을 깊이 있게 탐구하세요.',
    zh: '深入了解顺化皇城、宫廷雅乐及阮朝历史古迹群。'
  },
  'Nghe kể chuyện hoặc tìm hiểu di sản Huế': {
    en: 'Listen to stories or learn about Hue heritage',
    fr: 'Écoutez des histoires ou découvrez le patrimoine de Hué',
    ja: 'フエの物語を聴く、または遺産を学ぶ',
    ko: '후에 이야기 청취 또는 유산 학습',
    zh: '收听顺化典故或了解顺化遗产'
  },
  'Nghe kể chuyện Huế': {
    en: 'Listen to Hue Stories',
    fr: 'Écouter les récits de Hué',
    ja: 'フエの物語を聞く',
    ko: '후에 이야기 듣기',
    zh: '收听顺化故事'
  },
  'Nhiếp Ảnh Gia Di Sản AI': {
    en: 'AI Heritage Photographer',
    fr: 'Photographe de Patrimoine IA',
    ja: 'AIヘリテージフォトグラファー',
    ko: 'AI 문화유산 사진작가',
    zh: 'AI 遗产摄影师'
  },
  'Sử dụng AI nhận diện thị giác để tra cứu di tích, cổ vật, trang phục truyền thống.': {
    en: 'Use AI visual recognition to identify monuments, antiques, and traditional costumes.',
    fr: 'Utilisez la vision IA pour identifier monuments, antiquités et costumes traditionnels.',
    ja: 'AI視覚認識を使用して、史跡、古美術品、伝統衣装を識別。',
    ko: 'AI 시각 인식을 사용하여 유적, 골동품, 전통 의상을 식별하세요.',
    zh: '利用 AI 视觉识别技术鉴别古迹、文物古董与传统服饰。'
  },
  'Thực hiện ít nhất 3 lần nhận diện ảnh bằng AI': {
    en: 'Perform at least 3 AI image recognitions',
    fr: 'Effectuez au moins 3 reconnaissances d\'images par IA',
    ja: 'AI画像認識を3回以上実行',
    ko: '최소 3회 이상 AI 이미지 인식 실행',
    zh: '完成至少3次 AI 图像识别'
  },
  'Nhận diện ảnh ngay': {
    en: 'Recognize Photo Now',
    fr: 'Reconnaître une photo',
    ja: '今すぐ画像認識',
    ko: '지금 사진 인식하기',
    zh: '立即拍照识别'
  },
  'Người Kể Chuyện Di Sản': {
    en: 'Heritage Storyteller',
    fr: 'Conteur de Patrimoine',
    ja: 'ヘリテージ・ストーリーテラー',
    ko: '문화유산 이야기꾼',
    zh: '文化遗产说书人'
  },
  'Nghe AI tái hiện những câu chuyện di sản, huyền tích và chính sử Việt Nam.': {
    en: 'Listen to AI recreate Vietnamese heritage stories, legends, and official histories.',
    fr: 'Écoutez l\'IA recréer des histoires du patrimoine, des légendes et l\'histoire du Vietnam.',
    ja: 'AIが再現するベトナムの遺産ストーリー、伝説、歴史を聴く。',
    ko: 'AI가 재현하는 베트남의 유산 이야기, 전설, 정사(正史)를 들어보세요.',
    zh: '聆听 AI 演绎的越南历史传说与官方正史典故。'
  },
  'Nghe ít nhất 1 câu chuyện di sản bằng AI': {
    en: 'Listen to at least 1 AI heritage story',
    fr: 'Écoutez au moins 1 récit de patrimoine par IA',
    ja: 'AI遺産ストーリーを1つ以上聴く',
    ko: '최소 1개의 AI 유산 이야기 청취',
    zh: '收听至少 1 个 AI 历史故事'
  },
  'Nghe kể chuyện': {
    en: 'Listen to Stories',
    fr: 'Écouter les récits',
    ja: 'ストーリーを聴く',
    ko: '이야기 듣기',
    zh: '收听故事'
  },
  'Sử Học Gia Đất Việt': {
    en: 'Vietnamese Historian',
    fr: 'Historien du Vietnam',
    ja: 'ベトナム歴史家',
    ko: '베트남 역사학자',
    zh: '越南历史学者'
  },
  'Chinh phục các câu đố lịch sử văn hóa và dòng thời gian các triều đại.': {
    en: 'Conquer cultural-historical quizzes and dynastic timelines.',
    fr: 'Conquérez les quiz historico-culturels et la chronologie des dynasties.',
    ja: '文化歴史クイズや王朝のタイムラインを制覇しよう。',
    ko: '문화 역사 퀴즈와 왕조 연대기를 정복하세요.',
    zh: '挑战文化历史问答与历代王朝时间线。'
  },
  'Hoàn thành ít nhất 3 bộ câu hỏi trắc nghiệm văn hóa': {
    en: 'Complete at least 3 cultural quiz sets',
    fr: 'Complétez au moins 3 séries de quiz culturels',
    ja: '文化クイズセットを3つ以上完了',
    ko: '최소 3개의 문화 퀴즈 세트 완료',
    zh: '完成至少 3 套文化问答测试'
  },
  'Làm Quiz văn hóa': {
    en: 'Take Cultural Quiz',
    fr: 'Faire le Quiz culturel',
    ja: '文化クイズに挑戦',
    ko: '문화 퀴즈 풀기',
    zh: '参与文化问答'
  },
  'Kiến Trúc Sư Hành Trình': {
    en: 'Journey Architect',
    fr: 'Architecte de Voyage',
    ja: 'ジャーニー・アーキテクト',
    ko: '여행 건축가',
    zh: '行程架构师'
  },
  'Tạo lập lịch trình khám phá di sản thông minh và tối ưu thời gian di chuyển.': {
    en: 'Create smart heritage exploration itineraries with optimized travel times.',
    fr: 'Créez des itinéraires d\'exploration intelligents avec des temps de trajet optimisés.',
    ja: '移動時間を最適化したスマートな文化遺産ツアー計画を作成。',
    ko: '이동 시간이 최적화된 스마트 문화유산 탐험 일정을 만드세요.',
    zh: '智能规划文化探索行程，优化出行时间。'
  },
  'Lập 1 lịch trình tham quan thông minh': {
    en: 'Create 1 smart sightseeing itinerary',
    fr: 'Créer 1 itinéraire touristique intelligent',
    ja: 'スマート観光日程を1つ作成',
    ko: '스마트 관광 일정 1개 생성',
    zh: '创建 1 个智能观光行程'
  },

  'Thực Thần Bản Địa': {
    en: 'Local Foodie',
    fr: 'Gourmet Local',
    ja: 'ローカルグルメエキスパート',
    ko: '로컬 미식가',
    zh: '地道美食家'
  },
  'Khám phá quán ăn dân dã, món ngon gia truyền xung quanh các quần thể di sản.': {
    en: 'Discover rustic eateries and traditional family delicacies around heritage complexes.',
    fr: 'Découvrez des restaurants rustiques et des délices traditionnels autour des sites patrimoniaux.',
    ja: '世界遺産周辺の郷土料理や伝統的な名店を発見しよう。',
    ko: '문화유산 단지 주변의 향토 음식점과 전통 가전(家傳) 맛집을 발견하세요.',
    zh: '探索世界遗产周边的地道小吃与祖传特色美食。'
  },
  'Tìm kiếm ẩm thực hoặc lưu di sản yêu thích': {
    en: 'Search food or save favorite heritage',
    fr: 'Recherchez de la gastronomie ou enregistrez des favoris',
    ja: 'グルメ検索またはお気に入り遺産の保存',
    ko: '음식 검색 또는 즐겨찾는 유산 저장',
    zh: '搜索地道美食或收藏心仪遗迹'
  },
  'Xem quán ngon quanh di sản': {
    en: 'Explore Nearby Food',
    fr: 'Explorer la gastronomie',
    ja: '周辺のグルメを見る',
    ko: '주변 맛집 보기',
    zh: '查看周边美食'
  },
  'Đại Sứ Di Sản Quốc Gia': {
    en: 'National Heritage Ambassador',
    fr: 'Ambassadeur du Patrimoine National',
    ja: '国家文化遺産アンバサダー',
    ko: '국가 문화유산 대사',
    zh: '国家文化遗产大使'
  },
  'Danh hiệu tối cao vinh danh người thấu hiểu sâu sắc và tích cực lan tỏa di sản văn hóa Việt Nam.': {
    en: 'Supreme title honoring those with deep understanding and active dissemination of Vietnamese culture.',
    fr: 'Titre suprême honorant ceux qui comprennent profondément et diffusent la culture vietnamienne.',
    ja: 'ベトナム文化遺産への深い理解と積極的な普及活動を讃える最高称号。',
    ko: '베트남 문화유산에 대한 깊은 이해와 적극적인 전파를 기리는 최고 칭호.',
    zh: '至高荣耀勋章，表彰对越南文化遗产有深刻理解并积极传播的杰出使者。'
  },
  'Đạt từ 500 điểm XP văn hóa trở lên': {
    en: 'Reach 500+ cultural XP points',
    fr: 'Atteindre 500+ points XP culturels',
    ja: '文化XPポイント500以上達成',
    ko: '문화 XP 포인트 500 이상 달성',
    zh: '累积文化积分达到 500 XP 以上'
  },
  'Tích lũy XP': {
    en: 'Earn XP',
    fr: 'Gagner des XP',
    ja: 'XPを貯める',
    ko: 'XP 적립하기',
    zh: '积累积分'
  },
  'Khám phá': {
    en: 'Exploration',
    fr: 'Exploration',
    ja: '探索',
    ko: '탐험',
    zh: '探索'
  },
  'Di tích': {
    en: 'Monuments',
    fr: 'Monuments',
    ja: '史跡',
    ko: '유적',
    zh: '古迹'
  },
  'Thị giác AI': {
    en: 'AI Vision',
    fr: 'Vision IA',
    ja: 'AI視覚',
    ko: 'AI 비전',
    zh: 'AI视觉'
  },
  'Văn hóa': {
    en: 'Culture',
    fr: 'Culture',
    ja: '文化',
    ko: '문화',
    zh: '文化'
  },
  'Học tập': {
    en: 'Learning',
    fr: 'Apprentissage',
    ja: '学習',
    ko: '학습',
    zh: '学习'
  },
  'Du lịch': {
    en: 'Travel',
    fr: 'Voyage',
    ja: '旅行',
    ko: '여행',
    zh: '旅游'
  },
  'Ẩm thực': {
    en: 'Cuisine',
    fr: 'Gastronomie',
    ja: 'グルメ',
    ko: '미식',
    zh: '美食'
  },
  'Đặc biệt': {
    en: 'Special',
    fr: 'Spécial',
    ja: 'スペシャル',
    ko: '스페셜',
    zh: '特级'
  },
  'Đã đạt được': {
    en: 'Achieved',
    fr: 'Obtenu',
    ja: '獲得済み',
    ko: '획득 완료',
    zh: '已获得'
  },

  'Thành viên Di sản': {
    en: 'Heritage Member',
    fr: 'Membre du Patrimoine',
    ja: 'ヘリテージメンバー',
    ko: '문화유산 회원',
    zh: '遗产会员'
  },
  'Nhà Khám Phá Trẻ': {
    en: 'Young Explorer',
    fr: 'Jeune Explorateur',
    ja: 'ヤングエクスプローラー',
    ko: '청소년 탐험가',
    zh: '青年探险家'
  },
  'Dữ liệu đối chiếu: Đại Việt Sử Ký Toàn Thư, UNESCO & Google Places': {
    en: 'Sources verified with Dai Viet Su Ky Toan Thu, UNESCO & Google Places',
    fr: 'Sources vérifiées avec Dai Viet Su Ky Toan Thu, UNESCO & Google Places',
    ja: '参照文献：大越史記全書、UNESCO世界遺産、Google Places',
    ko: '자료 검증: 대월사기전서, UNESCO 세계유산, Google Places',
    zh: '考据典籍：《大越史记全书》、联合国教科文组织(UNESCO)及 Google Places'
  },
  'Phát triển với sự trân trọng đối với 4.000 năm lịch sử hào hùng và nguồn tư liệu lịch sử dân tộc.': {
    en: 'Crafted with reverence for 4,000 years of heroic history and national cultural treasures.',
    fr: 'Conçu avec respect pour 4 000 ans d\'histoire héroïque et de trésors culturels nationaux.',
    ja: '4000年の輝かしい歴史と民族の文化財への敬意を込めて開発。',
    ko: '4,000년의 자랑스러운 역사와 민족 문화유산에 대한 깊은 경의를 담아 개발되었습니다.',
    zh: '致敬四千年波澜壮阔的历史文明与璀璨的民族文献宝库。'
  },
  'Nền tảng trí tuệ nhân tạo đồng hành khám phá, bảo tồn và lan tỏa giá trị di sản văn hóa, lịch sử và trải nghiệm du lịch Việt Nam.': {
    en: 'AI-powered platform to discover, preserve, and promote Vietnamese cultural heritage, history, and authentic travel experiences.',
    fr: 'Plateforme propulsée par l\'IA pour découvrir, préserver et valoriser le patrimoine culturel et historique du Vietnam.',
    ja: 'ベトナムの文化遺産、歴史、そして本物の旅行体験を発見・保存・発信するAIプラットフォーム。',
    ko: '베트남의 문화유산과 역사, 생생한 여행 경험을 발견하고 보존하며 널리 알리는 AI 플랫폼입니다.',
    zh: '致力于探索、保护与传承越南璀璨历史遗产与真实旅游体验的人工智能综合平台。'
  },

  // Categories and Regions
  'Di tích lịch sử': { en: 'Historical Monument', fr: 'Monument historique', ja: '歴史史跡', ko: '역사 유적', zh: '历史遗迹' },
  'Di sản văn hóa thế giới': { en: 'World Cultural Heritage', fr: 'Patrimoine mondial', ja: '世界文化遺産', ko: '세계문화유산', zh: '世界文化遗产' },
  'Di tích quốc gia đặc biệt': { en: 'Special National Monument', fr: 'Monument national spécial', ja: '特別国家史跡', ko: '특별국가유적', zh: '特别国家级古迹' },
  'Di sản thiên nhiên thế giới': { en: 'World Natural Heritage', fr: 'Patrimoine naturel mondial', ja: '世界自然遺産', ko: '세계자연유산', zh: '世界自然遗产' },
  'Văn hóa phi vật thể': { en: 'Intangible Cultural Heritage', fr: 'Patrimoine immatériel', ja: '無形文化遺産', ko: '무형문화유산', zh: '非物质文化遗产' },
  'Danh lam thắng cảnh': { en: 'Scenic Landscape', fr: 'Paysage pittoresque', ja: '名勝景勝地', ko: '명승지', zh: '名胜古迹' },
  'Làng nghề truyền thống': { en: 'Traditional Craft Village', fr: 'Village artisanal', ja: '伝統工芸村', ko: '전통 공예 마을', zh: '传统手工艺村' },
  'Ẩm thực truyền thống': { en: 'Traditional Cuisine', fr: 'Cuisine traditionnelle', ja: '郷土料理', ko: '전통 요리', zh: '传统美食' },
  'Miền Bắc': { en: 'Northern Vietnam', fr: 'Nord du Vietnam', ja: 'ベトナム北部', ko: '베트남 북부', zh: '越南北部' },
  'Miền Trung': { en: 'Central Vietnam', fr: 'Centre du Vietnam', ja: 'ベトナム中部', ko: '베트남 중부', zh: '越南中部' },
  'Miền Nam': { en: 'Southern Vietnam', fr: 'Sud du Vietnam', ja: 'ベトナム南部', ko: '베트남 남부', zh: '越南南部' },
  'Tất cả': { en: 'All', fr: 'Tous', ja: 'すべて', ko: '전체', zh: '全部' },

  // Provinces & Cities of Vietnam
  'Hà Nội': { en: 'Hanoi', fr: 'Hanoï', ja: 'ハノイ', ko: '하노이', zh: '河内' },
  'TP. Hồ Chí Minh': { en: 'Ho Chi Minh City', fr: 'Hô Chi Minh-Ville', ja: 'ホーチミン市', ko: '호치민시', zh: '胡志明市' },
  'Hồ Chí Minh': { en: 'Ho Chi Minh City', fr: 'Hô Chi Minh-Ville', ja: 'ホーチミン市', ko: '호치민시', zh: '胡志明市' },
  'Thừa Thiên Huế': { en: 'Thua Thien Hue', fr: 'Thua Thien Hue', ja: 'トゥアティエン・フエ', ko: '트어티엔후에', zh: '承天顺化' },
  'Huế': { en: 'Hue', fr: 'Hué', ja: 'フエ', ko: '후에', zh: '顺化' },
  'Đà Nẵng': { en: 'Da Nang', fr: 'Da Nang', ja: 'ダナン', ko: '다낭', zh: '岘港' },
  'Quảng Nam': { en: 'Quang Nam', fr: 'Quang Nam', ja: 'クアンナム', ko: '꽝남', zh: '广南' },
  'Quảng Ninh': { en: 'Quang Ninh', fr: 'Quang Ninh', ja: 'クアンニン', ko: '꽝닌', zh: '广宁' },
  'Ninh Bình': { en: 'Ninh Binh', fr: 'Ninh Binh', ja: 'ニンビン', ko: '닌빈', zh: '宁平' },
  'Khánh Hòa': { en: 'Khanh Hoa', fr: 'Khanh Hoa', ja: 'カインホア', ko: '카인호아', zh: '庆和' },
  'Lâm Đồng': { en: 'Lam Dong', fr: 'Lam Dong', ja: 'ラムドン', ko: '람동', zh: '林同' },
  'Bắc Ninh': { en: 'Bac Ninh', fr: 'Bac Ninh', ja: 'バクニン', ko: '박닌', zh: '北宁' },
  'Bắc Giang': { en: 'Bac Giang', fr: 'Bac Giang', ja: 'バクザン', ko: '박장', zh: '北江' },
  'Cần Thơ': { en: 'Can Tho', fr: 'Can Tho', ja: 'カントー', ko: '깐토', zh: '芹苴' },
  'Hải Phòng': { en: 'Hai Phong', fr: 'Haiphong', ja: 'ハイフォン', ko: '하이퐁', zh: '海防' },
  'Cao Bằng': { en: 'Cao Bang', fr: 'Cao Bang', ja: 'カオバン', ko: '까오방', zh: '高平' },
  'Hà Giang': { en: 'Ha Giang', fr: 'Ha Giang', ja: 'ハザン', ko: '하장', zh: '河江' },
  'Lào Cai': { en: 'Lao Cai', fr: 'Lao Cai', ja: 'ラオカイ', ko: '라오까이', zh: '老街' },
  'Điện Biên': { en: 'Dien Bien', fr: 'Dien Bien', ja: 'ディエンビエン', ko: '디엔비엔', zh: '奠边' },
  'Kiên Giang': { en: 'Kien Giang', fr: 'Kien Giang', ja: 'キエンザン', ko: '끼엔장', zh: '坚江' },
  'Tây Ninh': { en: 'Tay Ninh', fr: 'Tay Ninh', ja: 'タイニン', ko: '떠이닌', zh: '西宁' },
  'Bình Thuận': { en: 'Binh Thuan', fr: 'Binh Thuan', ja: 'ビントゥアン', ko: '빈투언', zh: '平顺' },
  'Bà Rịa - Vũng Tàu': { en: 'Ba Ria - Vung Tau', fr: 'Ba Ria - Vung Tau', ja: 'バリア＝ブンタウ', ko: '바리어붕따우', zh: '巴地头顿' },
  'Đồng Nai': { en: 'Dong Nai', fr: 'Dong Nai', ja: 'ドンナイ', ko: '동나이', zh: '同奈' },
  'Bình Dương': { en: 'Binh Duong', fr: 'Binh Duong', ja: 'ビンズオン', ko: '빈즈엉', zh: '平阳' },
  'Nghệ An': { en: 'Nghe An', fr: 'Nghe An', ja: 'ゲアン', ko: '응에안', zh: '乂安' },
  'Thanh Hóa': { en: 'Thanh Hoa', fr: 'Thanh Hoa', ja: 'タインホア', ko: '타인호아', zh: '清化' },
  'Hà Tĩnh': { en: 'Ha Tinh', fr: 'Ha Tinh', ja: 'ハティン', ko: '하띤', zh: '河静' },
  'Quảng Bình': { en: 'Quang Binh', fr: 'Quang Binh', ja: 'クアンビン', ko: '꽝빈', zh: '广平' },
  'Quảng Trị': { en: 'Quang Tri', fr: 'Quang Tri', ja: 'クアンチ', ko: '꽝찌', zh: '广治' },
  'Bình Định': { en: 'Binh Dinh', fr: 'Binh Dinh', ja: 'ビンディン', ko: '빈딘', zh: '平定' },
  'Phú Yên': { en: 'Phu Yen', fr: 'Phu Yen', ja: 'フーイエン', ko: '푸옌', zh: '富安' },
  'Gia Lai': { en: 'Gia Lai', fr: 'Gia Lai', ja: 'ザライ', ko: '잘라이', zh: '嘉莱' },
  'Đắk Lắk': { en: 'Dak Lak', fr: 'Dak Lak', ja: 'ダクラク', ko: '닥락', zh: '多乐' },
  'An Giang': { en: 'An Giang', fr: 'An Giang', ja: 'アンザン', ko: '안장', zh: '安江' },
  'Cà Mau': { en: 'Ca Mau', fr: 'Ca Mau', ja: 'カマウ', ko: '까마우', zh: '金瓯' },
  'Bến Tre': { en: 'Ben Tre', fr: 'Ben Tre', ja: 'ベンチェ', ko: '벤째', zh: '槟椥' },

  // Iconic Landmarks & Cultural Relics
  'Văn Miếu - Quốc Tử Giám & Hồ Gươm': { en: 'Temple of Literature & Sword Lake', fr: 'Temple de la Littérature & Lac de l\'Épée', ja: '文廟・ホアンキエム湖', ko: '문묘 & 호안끼엠 호수', zh: '文庙·国子监与还剑湖' },
  'Văn Miếu - Quốc Tử Giám': { vi: 'Văn Miếu - Quốc Tử Giám', en: 'Temple of Literature - Imperial Academy', fr: 'Temple de la Littérature - Académie Impériale', ja: '文廟・国子監', ko: '문묘 - 국자감', zh: '文庙·国子监' },
  'Hồ Gươm': { en: 'Sword Lake (Hoan Kiem Lake)', fr: 'Lac de l\'Épée Restituée', ja: 'ホアンキエム湖', ko: '호안끼엠 호수', zh: '还剑湖' },
  'Đền Ngọc Sơn & Cầu Thê Húc': { en: 'Ngoc Son Temple & The Huc Bridge', fr: 'Temple Ngoc Son & Pont The Huc', ja: '玉山祠・棲旭橋', ko: '응옥선 사당 & 테훅 다리', zh: '玉山祠与栖旭桥' },
  'Đền Ngọc Sơn': { en: 'Ngoc Son Temple', fr: 'Temple Ngoc Son', ja: '玉山祠', ko: '응옥선 사당', zh: '玉山祠' },
  'Cầu Thê Húc': { en: 'The Huc Bridge', fr: 'Pont The Huc', ja: '棲旭橋', ko: '테훅 다리', zh: '栖旭桥' },
  'Hoàng thành Thăng Long': { en: 'Imperial Citadel of Thang Long', fr: 'Cité impériale de Thang Long', ja: 'タンロン遺跡', ko: '탕롱 황성', zh: '升龙皇城' },
  'Chùa Một Cột': { en: 'One Pillar Pagoda', fr: 'Pagode au Pilier Unique', ja: '一柱寺', ko: '일주사', zh: '一柱寺' },
  'Quần thể di tích Cố đô Huế': { en: 'Complex of Hue Monuments', fr: 'Ensemble de monuments de Hué', ja: 'フエの建造物群', ko: '후에 기념물 복합 지구', zh: '顺化古迹建筑群' },
  'Đại Nội Cung Đình Huế & Sông Hương': { en: 'Hue Imperial Citadel & Perfume River', fr: 'Cité Impériale de Hué & Rivière des Parfums', ja: 'フエ王宮・香江', ko: '후에 황궁 & 흐엉강', zh: '顺化皇城与香江' },
  'Đại Nội Huế': { en: 'Hue Imperial Citadel', fr: 'Cité Impériale de Hué', ja: 'フエ王宮', ko: '후에 황궁', zh: '顺化皇城' },
  'Vịnh Hạ Long': { en: 'Ha Long Bay', fr: 'Baie d\'Ha Long', ja: 'ハ隆湾', ko: '하롱베이', zh: '下龙湾' },
  'Phố cổ Hội An': { en: 'Hoi An Ancient Town', fr: 'Vieille ville de Hoi An', ja: '古都ホイアン', ko: '호이안 고대 도시', zh: '会安古镇' },
  'Quần thể danh thắng Tràng An': { en: 'Trang An Scenic Landscape Complex', fr: 'Complexe paysager de Trang An', ja: 'チャンアンの景観複合体', ko: '짱안 경관 단지', zh: '长安名胜群' },
  'Thánh địa Mỹ Sơn': { en: 'My Son Sanctuary', fr: 'Sanctuaire de My Son', ja: 'ミーソン聖域', ko: '미선 성지', zh: '美山圣地' },
  'Chùa Hương': { en: 'Perfume Pagoda', fr: 'Pagode des Parfums', ja: '香寺', ko: '흐엉 사원', zh: '香寺' },
  'Địa đạo Củ Chi': { en: 'Cu Chi Tunnels', fr: 'Tunnels de Cu Chi', ja: 'クチの地下道', ko: '구찌 터널', zh: '古芝地道' },
  'Dinh Độc Lập & Bến Bạch Đằng': { en: 'Independence Palace & Bach Dang Wharf', fr: 'Palais de la Réunification & Quai Bach Dang', ja: '統一会堂・バクダン埠頭', ko: '독립궁 & 바익당 부두', zh: '独立宫与白藤码头' },
  'Dinh Độc Lập': { en: 'Independence Palace', fr: 'Palais de la Réunification', ja: '統一会堂', ko: '독립궁', zh: '独立宫' },
  'Chợ Bến Thành': { en: 'Ben Thanh Market', fr: 'Marché Ben Thanh', ja: 'ベンタイン市場', ko: '벤탄 시장', zh: '滨城市场' },
  'Núi Bà Đen': { en: 'Ba Den Mountain', fr: 'Montagne Ba Den', ja: 'バーデン山', ko: '바덴 산', zh: '黑婆山' },
  'Thác Bản Giốc': { en: 'Ban Gioc Waterfall', fr: 'Chutes de Ban Gioc', ja: 'バンゾック滝', ko: '반족 폭포', zh: '板约瀑布' },
  'Hồ Ba Bể': { en: 'Ba Be Lake', fr: 'Lac Ba Be', ja: 'バーベー湖', ko: '바베 호수', zh: '巴卑湖' },
  'Động Phong Nha': { en: 'Phong Nha Cave', fr: 'Grotte de Phong Nha', ja: 'フォンニャ洞窟', ko: '퐁냐 동굴', zh: '风牙洞' },
  'Gốm Bát Tràng': { vi: 'Gốm Bát Tràng', en: 'Bat Trang Ceramic Village', fr: 'Village de Potiers de Bat Trang', ja: 'バッチャン陶芸村', ko: '밧짱 도자기 마을', zh: '钵场陶瓷古村' },
  'Tranh Đông Hồ': { vi: 'Tranh Đông Hồ', en: 'Dong Ho Folk Woodblock Painting', fr: 'Estampes Populaires de Dong Ho', ja: 'ドンホー版画（伝統木版画）', ko: '동호 민속 판화', zh: '东湖民间木版年画' },
  'Lụa Vạn Phúc': { en: 'Van Phuc Silk', fr: 'Soie de Van Phuc', ja: 'ヴァンフックシルク', ko: '반푹 비단', zh: '万福丝绸' },
  'Nón lá Tây Hồ': { en: 'Tay Ho Conical Hat', fr: 'Chapeau conique de Tay Ho', ja: 'ノンラー（西湖）', ko: '논라 (떠이호)', zh: '西湖斗笠' },
  'Nhã nhạc Cung đình Huế': { en: 'Hue Court Music (Nha Nhac)', fr: 'Nha Nhac, musique de cour', ja: 'フエの雅楽', ko: '후에 궁중음악', zh: '顺化宫廷雅乐' },
  'Dân ca Quan họ Bắc Ninh': { en: 'Bac Ninh Quan Ho Folk Songs', fr: 'Chants Quan Ho de Bac Ninh', ja: 'バクニン民謡クアンホ', ko: '박닌 꽌호 민요', zh: '北宁官贺民歌' },
  'Đờn ca tài tử Nam Bộ': { en: 'Don Ca Tai Tu Southern Folk Music', fr: 'Musique Don Ca Tai Tu', ja: 'ドンカータイトゥー', ko: '돈까따이뜨', zh: '南部才子弹唱' },
  'Tháp Bà Ponagar': { en: 'Po Nagar Cham Towers', fr: 'Tours de Po Nagar', ja: 'ポーナガル塔', ko: '포나가르 탑', zh: '婆那加占婆塔' },
  'Mũi Né - Tháp Poshanư': { en: 'Mui Ne - Poshanu Cham Towers', fr: 'Mui Ne - Tours Poshanu', ja: 'ムイネー・ポシャヌ塔', ko: '무이네 - 포샤누 탑', zh: '美奈 - 波沙努占婆塔' },
  'Dinh Cậu - Phú Quốc': { en: 'Dinh Cau - Phu Quoc', fr: 'Dinh Cau - Phu Quoc', ja: 'ディンカウ（フーコック）', ko: '딘꺼우 - 푸꾸옥', zh: '舅府 (富国岛)' },

  // Landmark Taglines
  'Thủ đô ngàn năm văn hiến, lắng đọng hào khí Thăng Long': {
    en: 'Thousand-year-old capital of culture, embodying the spirit of Thang Long',
    fr: 'Capitale millénaire de culture, berceau de l\'esprit de Thang Long',
    ja: '千年の歴史と文化が息づく首都・タンロンの誇り',
    ko: '천년의 역사를 품은 수도, 탕롱의 유구한 기개',
    zh: '千年文献古都，沉淀升龙豪气'
  },
  'Đô thị phương Nam phồn hoa, giao thoa truyền thống và hiện đại': {
    en: 'Vibrant southern metropolis, blending tradition and modernity',
    fr: 'Métropole dynamique du Sud, carrefour de tradition et modernité',
    ja: '伝統と現代が交差する活気あふれる南部のメガシティ',
    ko: '전통과 현대가 공존하는 남부의 번화한 대도시',
    zh: '繁华南方都会，交融传统与现代'
  },
  'Cố đô vàng son triều Nguyễn - Di sản Văn hóa Thế giới': {
    en: 'Golden capital of the Nguyen Dynasty - UNESCO World Cultural Heritage',
    fr: 'Capitale impériale de la dynastie Nguyen - Patrimoine mondial',
    ja: 'グエン朝の黄金期を伝える古都・ユネスコ世界文化遺産',
    ko: '응우옌 왕조의 황금빛 고도 - 유네스코 세계문화유산',
    zh: '阮朝黄金古都 - 联合国教科文组织世界文化遗产'
  },
  'Thành phố đáng sống bên sông Hàn và biển Mỹ Khê': {
    en: 'Livable coastal city by Han River and My Khe Beach',
    fr: 'Ville côtière agréable au bord du fleuve Han et plage My Khe',
    ja: 'ハン川とミーケビーチに抱かれた美しい沿岸都市',
    ko: '한강과 미케 해변이 어우러진 살기 좋은 도시',
    zh: '倚傍瀚江与美溪沙滩的宜居之城'
  },
  'Di sản văn hóa thế giới bên dòng sông Hoài thơ mộng': {
    en: 'World cultural heritage along the poetic Hoai River',
    fr: 'Patrimoine mondial bordant la rivière poétique Hoai',
    ja: 'ホアイ川のほとりに佇むノスタルジックな世界文化遺産',
    ko: '서정적인 호아이 강변의 유네스코 세계문화유산',
    zh: '悠悠怀江畔的诗意世界文化遗产'
  },
  'Kỳ quan thiên nhiên thế giới nghìn năm với hàng ngàn đảo đá vôi': {
    en: 'World natural wonder with thousands of limestone karst islands',
    fr: 'Merveille naturelle mondiale aux milliers d\'îles calcaires',
    ja: '幾千もの奇岩が織りなすユネスコ世界自然遺産',
    ko: '수천 개의 석회암 섬이 빚어낸 세계 자연 불가사의',
    zh: '千百座奇峰突兀的世界级自然奇观'
  },
  'Tuyệt sắc non nước Tràng An & Cố đô Hoa Lư ngàn năm': {
    en: 'Magnificent landscape of Trang An & thousand-year-old Hoa Lu ancient capital',
    fr: 'Splendeur des paysages de Trang An & ancienne capitale Hoa Lu',
    ja: '壮麗なチャンアンの山水と千年の古都ホアルー',
    ko: '찬란한 짱안 산수와 천년 고도 호아루',
    zh: '长安绝色山水与千年华闾古都'
  },
  'Thành phố ngàn hoa và cao nguyên sương mờ thơ mộng': {
    en: 'City of a thousand flowers and romantic misty highlands',
    fr: 'Cité des mille fleurs et hauts plateaux brumeux romantiques',
    ja: '千の花が咲き誇る霧深きロマンチックな高原都市',
    ko: '천 개의 꽃이 피어나는 낭만적인 안개 고원 도시',
    zh: '千花盛开的浪漫迷雾高原之城'
  },
  'Viên ngọc xanh của Biển Đông với bờ vịnh tuyệt mỹ': {
    en: 'Green gem of the East Sea with a stunning bay',
    fr: 'Joyau vert de la mer de l\'Est avec une baie magnifique',
    ja: '美しい湾が広がる東海の緑の宝石',
    ko: '동해의 푸른 보석과 눈부신 해변 만',
    zh: '东海绿宝石与绝美海湾'
  },
  'Đảo Ngọc thiên đường nhiệt đới và di tích lịch sử Phú Quốc': {
    en: 'Pearl Island tropical paradise and historic sites of Phu Quoc',
    fr: 'Île d\'émeraude, paradis tropical et sites historiques de Phu Quoc',
    ja: '熱帯の楽園・真珠の島フーコックの歴史遺産',
    ko: '열대 낙원 진주 섬과 푸꾸옥 역사 유적지',
    zh: '热带天堂珍珠岛与富国岛历史名胜'
  },

  // CulturalMap and Interactive UI Phrases
  'Bản Đồ Chuyên Biệt Việt Nam (Hình Chữ S Toàn Vẹn)': {
    en: 'Dedicated Vietnam Map (Complete S-Shape Territory)',
    fr: 'Carte Exclusive du Vietnam (Territoire Intégral en S)',
    ja: 'ベトナム専用地図（完全なS字型の国土）',
    ko: '베트남 전용 지도 (완전한 S자 국토)',
    zh: '越南专属全景地图 (完整的S形锦绣河山)'
  },
  'Dải Đất Hình Chữ S Việt Nam': {
    en: 'The S-Shaped Land of Vietnam',
    fr: 'La Terre en Forme de S du Vietnam',
    ja: 'ベトナムのS字型の国土',
    ko: '베트남 S자형 국토',
    zh: '越南S形壮丽山河'
  },
  'Bản Đồ Di Sản:': { en: 'Heritage Map:', fr: 'Carte du Patrimoine:', ja: '遺産マップ：', ko: '문화유산 지도:', zh: '文化遗产地图：' },
  'Di Sản:': { en: 'Heritage:', fr: 'Patrimoine:', ja: '遺産：', ko: '문화유산:', zh: '文化遗产：' },
  'Toàn cảnh Việt Nam': { en: 'Full Vietnam View', fr: 'Vue d\'ensemble du Vietnam', ja: 'ベトナム全図', ko: '베트남 전체보기', zh: '全景越南' },
  'Toàn cảnh chữ S': { en: 'S-Shape View', fr: 'Vue en S', ja: 'S字全景', ko: 'S자형 전체보기', zh: 'S形全景' },
  'Toàn quốc': { en: 'Nationwide', fr: 'National', ja: '全国', ko: '전국', zh: '全国' },
  'Chỉ Bản Đồ VN': { en: 'Vietnam Only', fr: 'Vietnam Seul', ja: 'ベトナムのみ', ko: '베트남 전용', zh: '仅越南地图' },
  'Vệ Tinh': { en: 'Satellite', fr: 'Satellite', ja: '衛星写真', ko: '위성', zh: '卫星图' },
  'Đường Phố': { en: 'Streets', fr: 'Rues', ja: '市街図', ko: '도로', zh: '街道图' },
  'Địa Hình': { en: 'Terrain', fr: 'Relief', ja: '地形図', ko: '지형', zh: '地形图' },
  'Ranh giới': { en: 'Borders', fr: 'Frontières', ja: '境界線', ko: '경계선', zh: '省界' },
  'Tên tỉnh': { en: 'Labels', fr: 'Noms', ja: '省名ラベル', ko: '지명 표시', zh: '省名标注' },
  'Tìm di tích, tỉnh thành...': { en: 'Search monuments, provinces...', fr: 'Rechercher monuments, provinces...', ja: '史跡・省名を検索...', ko: '유적지, 성/시 검색...', zh: '搜索名胜古迹、省市...' },
  'Phóng to': { en: 'Zoom In', fr: 'Zoom avant', ja: '拡大', ko: '확대', zh: '放大' },
  'Thu nhỏ': { en: 'Zoom Out', fr: 'Zoom arrière', ja: '縮小', ko: '축소', zh: '缩小' },
  'Về lại toàn cảnh chữ S': { en: 'Reset to S-Shape View', fr: 'Réinitialiser la vue', ja: '全体表示に戻す', ko: '전체화면 초기화', zh: '重置全景' },
  'Định vị tọa độ GPS của bạn': { en: 'Locate your GPS position', fr: 'Localiser votre GPS', ja: '現在地を測位', ko: '내 GPS 위치 찾기', zh: '定位您的当前位置' },
  'Xem chi tiết đầy đủ': { en: 'View Full Details', fr: 'Voir tous les détails', ja: '詳細をすべて見る', ko: '전체 상세정보 보기', zh: '查看完整详情' },
  'Điểm Đến Di Sản Việt Nam': { en: 'Vietnam Heritage Destinations', fr: 'Destinations du Patrimoine', ja: 'ベトナムの世界遺産目的地', ko: '베트남 문화유산 목적지', zh: '越南文化遗产胜地' },
  'Xem toàn quốc': { en: 'View Nationwide', fr: 'Voir tout le pays', ja: '全国を見る', ko: '전국 보기', zh: '浏览全国' },
  'Chưa có di sản nào khớp với bộ lọc này.': { en: 'No heritage matches this filter.', fr: 'Aucun patrimoine ne correspond à ce filtre.', ja: '条件に一致する遺産はありません。', ko: '이 필터에 맞는 문화유산이 없습니다.', zh: '暂无符合此筛选条件的文化遗迹。' },
  'Dữ liệu văn hóa đang được liên tục bổ sung và cập nhật.': { en: 'Cultural data is continually being enriched and updated.', fr: 'Les données culturelles sont continuellement mises à jour.', ja: '文化データは継続的に追加・更新されています。', ko: '문화 데이터는 지속적으로 보완 및 업데이트됩니다.', zh: '文化数据库正在持续补充与完善更新。' },
  'Tất cả di sản': { en: 'All Heritages', fr: 'Tous les patrimoines', ja: 'すべての遺産', ko: '모든 문화유산', zh: '全部文化名胜' },
  '📜 Di tích lịch sử': { en: '📜 Historic Monuments', fr: '📜 Monuments Historiques', ja: '📜 歴史的史跡', ko: '📜 역사 유적지', zh: '📜 历史古迹' },
  '🏛 Hoàng thành & Cung điện': { en: '🏛 Citadels & Palaces', fr: '🏛 Citadelles & Palais', ja: '🏛 皇城・宮殿', ko: '🏛 황성 및 궁궐', zh: '🏛 皇城与宫殿' },
  '⛩ Đền chùa & Tháp cổ': { en: '⛩ Temples & Pagodas', fr: '⛩ 寺院 & 古塔', ja: '⛩ 寺院・古塔', ko: '⛩ 사찰 및 고탑', zh: '⛩ 寺庙与古塔' },
  '🏘 Đô thị cổ': { en: '🏘 Ancient Towns', fr: '🏘 Villes Anciennes', ja: '🏘 古代都市・旧市街', ko: '🏘 고대 도시', zh: '🏘 古城与古镇' },
  '🏺 Làng nghề truyền thống': { en: '🏺 Craft Villages', fr: '🏺 Villages Artisanaux', ja: '🏺 伝統工芸村', ko: '🏺 전통 공예 마을', zh: '🏺 传统手工艺村' },
  'Ảnh nền GPS:': { en: 'GPS Landmark:', fr: 'Fond GPS:', ja: 'GPS壁紙：', ko: 'GPS 배경 명소:', zh: 'GPS 地标壁纸：' },
  'Ảnh nền GPS': { en: 'GPS Landmark', fr: 'Fond GPS', ja: 'GPS壁紙', ko: 'GPS 배경 명소', zh: 'GPS 地标壁纸' },
  'Chạm để quay lại giao diện': { en: 'Tap to return to interface', fr: 'Appuyez pour revenir', ja: 'タップしてUIに戻る', ko: '탭하여 화면으로 복귀', zh: '点击返回主界面' },
  'Tìm thấy': { en: 'Found', fr: 'Trouvé', ja: '発見', ko: '발견', zh: '找到' },
  'Tổng cộng': { en: 'Total', fr: 'Total', ja: '合計', ko: '총', zh: '共计' },
  'địa điểm': { en: 'places', fr: 'lieux', ja: '箇所', ko: '곳', zh: '处地点' },
  'Tỉnh thành:': { en: 'Province:', fr: 'Province:', ja: '省・市：', ko: '성/시:', zh: '省市：' },

  'Đổi cảnh': { en: 'Change View', fr: 'Changer la vue', ja: '景色変更', ko: '배경 변경', zh: '更换背景' },
  'Ngắm ảnh': { en: 'View Image', fr: 'Voir l\'image', ja: '壁紙鑑賞', ko: '사진 감상', zh: '欣赏图片' },
  'Ảnh Nền Danh Thắng Việt Nam': {
    en: 'Vietnam Scenic Landmarks Background',
    fr: 'Arrière-plan des Sites Pittoresques du Vietnam',
    ja: 'ベトナム名勝の背景画像',
    ko: '베트남 명승지 배경 이미지',
    zh: '越南名胜风景壁纸'
  },
  'Ảnh nền toàn bộ trang web tự động khớp với thành phố theo định vị GPS của bạn': {
    en: 'The website background automatically matches your city based on GPS positioning',
    fr: 'L\'arrière-plan s\'adapte automatiquement à votre ville selon la position GPS',
    ja: 'ウェブサイトの背景画像がGPS位置情報に基づいて滞在都市に自動同期されます',
    ko: '웹사이트 배경이 GPS 위치에 따라 방문 중인 도시의 명소로 자동 동기화됩니다',
    zh: '全站背景将根据您的GPS定位自动匹配当前所在城市的代表性名胜'
  },
  'Dùng cảm biến GPS thực tế trên thiết bị của bạn:': {
    en: 'Use real-time GPS sensor from your device:',
    fr: 'Utiliser le capteur GPS réel de votre appareil:',
    ja: '端末の実機GPSセンサーを使用：',
    ko: '기기의 실시간 GPS 센서 사용:',
    zh: '使用您设备的实时GPS传感器：'
  },
  'Bật GPS của tôi': {
    en: 'Enable My GPS',
    fr: 'Activer mon GPS',
    ja: 'マイGPSを有効化',
    ko: '내 GPS 켜기',
    zh: '启用我的GPS'
  },
  'Đang định vị...': {
    en: 'Locating...',
    fr: 'Localisation...',
    ja: '測位中...',
    ko: '위치 확인 중...',
    zh: '正在定位...'
  },
  'AI Tìm ảnh': {
    en: 'AI Photo Search',
    fr: 'Recherche Photo IA',
    ja: 'AI画像検索',
    ko: 'AI 사진 검색',
    zh: 'AI 寻找图片'
  },
  'Mặc định': {
    en: 'Defaults',
    fr: 'Par défaut',
    ja: '初期値',
    ko: '기본값',
    zh: '恢复默认'
  },
  'Đang dùng': {
    en: 'Active',
    fr: 'Actif',
    ja: '適用中',
    ko: '사용 중',
    zh: '当前应用'
  },
  'Quay về toàn cảnh bản đồ Việt Nam': {
    en: 'Return to full Vietnam view',
    fr: 'Revenir à la vue d\'ensemble du Vietnam',
    ja: 'ベトナム全図表示に戻る',
    ko: '베트남 전체 지도로 복귀',
    zh: '返回越南全景地图'
  },
  'Thu gọn ô thông tin': {
    en: 'Collapse info panel',
    fr: 'Réduire le panneau d\'info',
    ja: '情報パネルを折りたたむ',
    ko: '정보 패널 접기',
    zh: '折叠信息面板'
  },
  'Mở rộng ô thông tin': {
    en: 'Expand info panel',
    fr: 'Agrandir le panneau d\'info',
    ja: '情報パネルを展開',
    ko: '정보 패널 펼치기',
    zh: '展开信息面板'
  },
  'Chỉ hiển thị độc quyền bản đồ Việt Nam, không có quốc gia bên ngoài': {
    en: 'Exclusively displays Vietnam territory without foreign borders',
    fr: 'Affiche exclusivement le territoire du Vietnam sans frontières extérieures',
    ja: '国外領域を含まないベトナム領土のみを限定表示',
    ko: '외국 영토 없이 베트남 영토만 독점 표시',
    zh: '专属完整展示越南本土疆域'
  },
  'Bản đồ ảnh vệ tinh Esri World Imagery': {
    en: 'Esri World Imagery satellite view',
    fr: 'Vue satellite Esri World Imagery',
    ja: 'Esri World Imagery 衛星写真マップ',
    ko: 'Esri World Imagery 위성 사진 지도',
    zh: 'Esri 全球卫星影像图'
  },
  'Bản đồ giao thông du lịch Esri World Street Map': {
    en: 'Esri World Street Map travel navigation',
    fr: 'Carte routière et touristique Esri',
    ja: 'Esri 観光交通ストリートマップ',
    ko: 'Esri 관광 교통 도로 지도',
    zh: 'Esri 旅游交通街道图'
  },
  'Đổi màu sắc bản đồ Việt Nam': {
    en: 'Change Vietnam map color theme',
    fr: 'Changer le thème de couleur de la carte',
    ja: 'ベトナム地図の配色テーマを変更',
    ko: '베트남 지도 색상 테마 변경',
    zh: '切换越南地图配色主题'
  },
  'Chọn tông màu bản đồ:': {
    en: 'Select map color theme:',
    fr: 'Choisir le thème de couleur:',
    ja: '地図の配色テーマを選択：',
    ko: '지도 색상 테마 선택:',
    zh: '选择地图色彩风格：'
  },
  'Khám phá trọn vẹn lãnh thổ 34 đơn vị hành chính cấp tỉnh mới của Việt Nam, Biển Đông cùng hai quần đảo Hoàng Sa & Trường Sa thiêng liêng.': {
    en: 'Explore the complete territory of Vietnam\'s provincial units, the East Sea, and the sacred Hoang Sa & Truong Sa archipelagos.',
    fr: 'Explorez l\'intégralité du territoire du Vietnam, la mer de l\'Est et les archipels sacrés de Hoang Sa et Truong Sa.',
    ja: 'ベトナム全土の行政区画、東海、そして神聖なホアンサ・チュオンサ両諸島を包括的に探訪。',
    ko: '베트남의 지방 행정 단위, 동해, 그리고 신성한 호앙사·쯔엉사 군도를 아우르는 완전한 영토 탐험.',
    zh: '全面探索越南各省市行政区、东海以及神圣的黄沙与长沙群岛。'
  },
  'Đang tập trung vào khu vực': {
    en: 'Focusing on the region of',
    fr: 'Zoom sur la région de',
    ja: '選択中のエリア：',
    ko: '집중 탐색 중인 지역:',
    zh: '正在浏览地区：'
  },
  'Nhấn vào các điểm sáng để mở thông tin di sản.': {
    en: 'Click on highlighted markers to open heritage details.',
    fr: 'Cliquez sur les points lumineux pour afficher les détails du patrimoine.',
    ja: '輝くマーカーをクリックして遺産詳細を開きます。',
    ko: '빛나는 마커를 클릭하여 문화유산 상세 정보를 확인하세요.',
    zh: '点击地图上的亮点标志即可开启该文化遗产详细导览。'
  },
  'Địa phương': {
    en: 'Location',
    fr: 'Localité',
    ja: '所在地',
    ko: '지역',
    zh: '所属地区'
  },
  'Thời kỳ / Triều đại': {
    en: 'Period / Dynasty',
    fr: 'Période / Dynastie',
    ja: '時代・王朝',
    ko: '시대 / 왕조',
    zh: '历史时期 / 朝代'
  },
  'Lịch sử Hình thành': {
    en: 'Historical Origins',
    fr: 'Histoire & Origines',
    ja: '歴史的背景と成り立ち',
    ko: '역사적 배경 및 기원',
    zh: '历史渊源与形成'
  },
  'Ý nghĩa Lịch sử & Văn hóa': {
    en: 'Cultural & Historical Significance',
    fr: 'Signification Culturelle & Historique',
    ja: '歴史的・文化的意義',
    ko: '역사 및 문화적 가치',
    zh: '历史与文化内涵'
  },
  'Giờ mở cửa': {
    en: 'Opening Hours',
    fr: 'Horaires d\'ouverture',
    ja: '開館時間',
    ko: '개장 시간',
    zh: '开放时间'
  },
  'Giá vé tham khảo': {
    en: 'Admission Fee',
    fr: 'Tarif d\'entrée',
    ja: '入場料',
    ko: '입장료 안내',
    zh: '门票参考'
  },
  'Giá vé': {
    en: 'Ticket Price',
    fr: 'Prix du billet',
    ja: 'チケット料金',
    ko: '티켓 가격',
    zh: '门票'
  },
  'Chưa có dữ liệu xác nhận': {
    en: 'No verified hours available',
    fr: 'Non confirmé',
    ja: '未確認',
    ko: '확인된 정보 없음',
    zh: '暂未确认'
  },
  'Đang cập nhật': {
    en: 'Updating',
    fr: 'Mise à jour',
    ja: '更新中',
    ko: '업데이트 중',
    zh: '正在更新'
  },
  'Đang cập nhật thêm tư liệu lịch sử từ chuyên gia.': {
    en: 'Historical documentation is currently being compiled from experts.',
    fr: 'Les archives historiques sont en cours d\'enrichissement par des experts.',
    ja: '専門家による歴史資料の拡充を行っています。',
    ko: '전문가 자문을 거친 역사 사료를 지속적으로 보완하고 있습니다.',
    zh: '历史档案资料正由专家学者持续完善补充。'
  },
  'Bật/Tắt đường ranh giới 63 tỉnh thành': {
    en: 'Toggle provincial borderlines',
    fr: 'Afficher/Masquer les frontières provinciales',
    ja: '省界線の表示/非表示',
    ko: '성/시 경계선 켜기/끄기',
    zh: '切换省界显示'
  },
  'Bật/Tắt nhãn tên 63 tỉnh thành': {
    en: 'Toggle province labels',
    fr: 'Afficher/Masquer les noms de provinces',
    ja: '省名ラベルの表示/非表示',
    ko: '성/시 명칭 라벨 켜기/끄기',
    zh: '切换省名标注'
  },
  'Dùng AI tìm kiếm ảnh danh lam thắng cảnh Việt Nam': {
    en: 'Use AI to search Vietnamese scenic landmark photos',
    fr: 'Utiliser l\'IA pour chercher des photos de sites vietnamiens',
    ja: 'AIでベトナムの名勝写真を検索',
    ko: 'AI로 베트남 명승지 사진 검색',
    zh: '使用AI智能检索越南风景名胜图片'
  },
  'Thêm ảnh nền danh thắng mới': {
    en: 'Add new scenic landmark background',
    fr: 'Ajouter un nouvel arrière-plan de site',
    ja: '新しい名勝壁紙を追加',
    ko: '새 명승지 배경 추가',
    zh: '添加新名胜壁纸'
  },
  'Thêm thủ công': {
    en: 'Add Manual',
    fr: 'Ajout Manuel',
    ja: '手動追加',
    ko: '직접 추가',
    zh: '手动添加'
  },
  'Khôi phục mặc định': {
    en: 'Restore Defaults',
    fr: 'Restaurer défauts',
    ja: '初期値に戻す',
    ko: '기본값 복원',
    zh: '恢复默认'
  },
  'Admin Quyền Quản Lý': {
    en: 'Admin Manager',
    fr: 'Gestion Admin',
    ja: '管理者権限',
    ko: '관리자 권한',
    zh: '管理员权限'
  },
  // AI Image Recognizer / Vision Lens Section
  '✨ Thị giác Máy tính & AI Văn hóa Việt Nam': {
    vi: '✨ Thị giác Máy tính & AI Văn hóa Việt Nam',
    en: '✨ Computer Vision & Vietnam Cultural AI',
    fr: '✨ Vision par Ordinateur & IA Culturelle du Vietnam',
    ja: '✨ コンピュータビジョン＆ベトナム文化AI',
    ko: '✨ 컴퓨터 비전 & 베트남 문화 AI',
    zh: '✨ 计算机视觉与越南文化AI'
  },
  'Thị giác Máy tính & AI Văn hóa Việt Nam': {
    vi: 'Thị giác Máy tính & AI Văn hóa Việt Nam',
    en: 'Computer Vision & Vietnam Cultural AI',
    fr: 'Vision par Ordinateur & IA Culturelle du Vietnam',
    ja: 'コンピュータビジョン＆ベトナム文化AI',
    ko: '컴퓨터 비전 & 베트남 문화 AI',
    zh: '计算机视觉与越南文化AI'
  },
  'Nhận diện Di sản, Hiện vật & Cổ phục': {
    vi: 'Nhận diện Di sản, Hiện vật & Cổ phục',
    en: 'Recognize Heritage, Artifacts & Costumes',
    fr: 'Reconnaissance du Patrimoine, Objets & Costumes',
    ja: '世界遺産・古美術品・伝統衣装のAI認識',
    ko: '문화유산, 유물 & 전통의상 AI 인식',
    zh: '文化遗产、历史文物与传统服饰识别'
  },
  'Nhận diện Di sản': {
    vi: 'Nhận diện Di sản',
    en: 'Heritage Recognition',
    fr: 'Reconnaissance du Patrimoine',
    ja: '遺産認識',
    ko: '문화유산 인식',
    zh: '文化遗产识别'
  },
  'Chụp ảnh trực tiếp hoặc tải hình ảnh di tích, đình chùa, làng nghề, nhạc cụ, cổ phục để AI phân tích tức thì.': {
    vi: 'Chụp ảnh trực tiếp hoặc tải hình ảnh di tích, đình chùa, làng nghề, nhạc cụ, cổ phục để AI phân tích tức thì.',
    en: 'Capture live photos or upload images of monuments, pagodas, craft villages, instruments, and costumes for instant AI analysis.',
    fr: 'Prenez une photo en direct ou téléchargez une image de monuments, pagodes, villages artisanaux, instruments et costumes pour une analyse IA instantanée.',
    ja: '写真の撮影または画像アップロードにより、寺院、工芸村、楽器、伝統衣装をAIが瞬時に分析・解説します。',
    ko: '유적지, 사찰, 공예마을, 악기, 전통의상을 직접 촬영하거나 사진을 업로드하여 AI의 즉각적인 분석을 받아보세요.',
    zh: '现场拍照或上传古迹、寺庙、手艺村、乐器与古装图片，获取AI即时深度解析。'
  },
  ': ẢNH MẪU THỬ NGHIỆM NHANH MỘT CHẠM:': {
    vi: ': ẢNH MẪU THỬ NGHIỆM NHANH MỘT CHẠM:',
    en: ': QUICK ONE-TOUCH SAMPLE PRESETS:',
    fr: ': ÉCHANTILLONS D\'ESSAI RAPIDE EN UN CLIC :',
    ja: ': ワンタップで試せるサンプル画像：',
    ko: ': 원터치 빠른 체험용 샘플 이미지:',
    zh: ': 一键快速体验测试样本：'
  },
  'ẢNH MẪU THỬ NGHIỆM NHANH MỘT CHẠM:': {
    vi: 'ẢNH MẪU THỬ NGHIỆM NHANH MỘT CHẠM:',
    en: 'QUICK ONE-TOUCH SAMPLE PRESETS:',
    fr: 'ÉCHANTILLONS D\'ESSAI RAPIDE EN UN CLIC :',
    ja: 'ワンタップで試せるサンプル画像：',
    ko: '원터치 빠른 체험용 샘플 이미지:',
    zh: '一键快速体验测试样本：'
  },
  'ẢNH MẪU THỬ NGHIỆM NHANH MỘT CHẠM': {
    vi: 'ẢNH MẪU THỬ NGHIỆM NHANH MỘT CHẠM',
    en: 'QUICK ONE-TOUCH SAMPLE PRESETS',
    fr: 'ÉCHANTILLONS D\'ESSAI RAPIDE',
    ja: 'ワンタップで試せるサンプル画像',
    ko: '원터치 빠른 체험용 샘플 이미지',
    zh: '一键快速体验测试样本'
  },
  'Ảnh mẫu thử nghiệm nhanh một chạm:': {
    vi: 'Ảnh mẫu thử nghiệm nhanh một chạm:',
    en: 'Quick one-touch sample presets:',
    fr: 'Échantillons d\'essai rapide en un clic :',
    ja: 'ワンタップで試せるサンプル画像：',
    ko: '원터치 빠른 체험용 샘플 이미지:',
    zh: '一键快速体验测试样本：'
  },
  'Ảnh mẫu thử nghiệm nhanh một chạm': {
    vi: 'Ảnh mẫu thử nghiệm nhanh một chạm',
    en: 'Quick one-touch sample presets',
    fr: 'Échantillons d\'essai rapide',
    ja: 'ワンタップで試せるサンプル画像',
    ko: '원터치 빠른 체험용 샘플 이미지',
    zh: '一键快速体验测试样本'
  },
  'Đại Nội Huế (Ngọ Môn)': {
    vi: 'Đại Nội Huế (Ngọ Môn)',
    en: 'Imperial City of Hue (Ngo Mon Gate)',
    fr: 'Cité Impériale de Hué (Porte du Midi)',
    ja: 'フエ王宮（午門）',
    ko: '후에 황궁 (오문)',
    zh: '顺化皇城（午门）'
  },
  'Hoàng thành & Cung điện': {
    vi: 'Hoàng thành & Cung điện',
    en: 'Imperial Citadels & Palaces',
    fr: 'Cités Impériales & Palais',
    ja: '皇城・宮殿',
    ko: '황성 & 궁궐',
    zh: '皇城与宫殿'
  },
  'Temple of Literature': {
    vi: 'Văn Miếu - Quốc Tử Giám',
    en: 'Temple of Literature',
    fr: 'Temple de la Littérature',
    ja: '文廟・国子監',
    ko: '문묘 - 국자감',
    zh: '文庙·国子监'
  },
  'Di tích Lịch sử & Giáo dục': {
    vi: 'Di tích Lịch sử & Giáo dục',
    en: 'Historical & Educational Site',
    fr: 'Site Historique & Éducatif',
    ja: '歴史・教育史跡',
    ko: '역사 & 교육 유적',
    zh: '历史与教育古迹'
  },
  'Áo Nhật Bình triều Nguyễn': {
    vi: 'Áo Nhật Bình triều Nguyễn',
    en: 'Nguyen Dynasty Nhat Binh Costume',
    fr: 'Costume Nhat Binh de la Dynastie Nguyen',
    ja: '阮朝の日平衣（伝統宮廷衣装）',
    ko: '응우옌 왕조 녓빈 전통의상',
    zh: '阮朝日平衣（传统宫廷服饰）'
  },
  'Cổ phục & Trang phục truyền thống': {
    vi: 'Cổ phục & Trang phục truyền thống',
    en: 'Historic & Traditional Costumes',
    fr: 'Costumes Historiques & Traditionnels',
    ja: '伝統宮廷衣装・古式服飾',
    ko: '고전 복식 & 전통 의상',
    zh: '历史古装与传统服饰'
  },
  'Đàn Bầu Việt Nam': {
    vi: 'Đàn Bầu Việt Nam',
    en: 'Vietnamese Monochord (Dan Bau)',
    fr: 'Dan Bau (Monocorde vietnamien)',
    ja: 'ベトナム単弦琴（ダン・バウ）',
    ko: '베트남 단바우 (단현금)',
    zh: '越南独弦琴（单弦琴）'
  },
  'Nhạc cụ cổ truyền': {
    vi: 'Nhạc cụ cổ truyền',
    en: 'Traditional Musical Instrument',
    fr: 'Instrument de Musique Traditionnel',
    ja: '伝統民族楽器',
    ko: '전통 악기',
    zh: '传统民族乐器'
  },
  'Làng nghề dân gian': {
    vi: 'Làng nghề dân gian',
    en: 'Folk Craft Village',
    fr: 'Village d\'Artisanat Populaire',
    ja: '伝統民芸・工芸村',
    ko: '민속 공예 마을',
    zh: '民间传统手艺古村'
  },
  'Làng nghề gốm sứ': {
    vi: 'Làng nghề gốm sứ',
    en: 'Ceramic & Pottery Village',
    fr: 'Village de Céramique & Poterie',
    ja: '陶磁器工芸村',
    ko: '도자기 공예 마을',
    zh: '陶瓷手艺名村'
  },
  'Trống Đồng Đông Sơn': {
    vi: 'Trống Đồng Đông Sơn',
    en: 'Dong Son Bronze Drum',
    fr: 'Tambour de Bronze de Dong Son',
    ja: 'ドンソン青銅太鼓',
    ko: '동선 청동북',
    zh: '东山青铜鼓'
  },
  'Bảo vật hoàng cung': {
    vi: 'Bảo vật hoàng cung',
    en: 'Imperial & National Treasure',
    fr: 'Trésor Impérial & National',
    ja: '皇室・国家の至宝',
    ko: '황실 및 국가 보물',
    zh: '皇室与国家至宝'
  },
  'Bảo vật hoàng cung / Cổ vật': {
    vi: 'Bảo vật hoàng cung / Cổ vật',
    en: 'Imperial Treasure / Ancient Relic',
    fr: 'Trésor Impérial / Relique Ancienne',
    ja: '皇室至宝・古美術品',
    ko: '황실 보물 / 고대 유물',
    zh: '皇室国宝 / 历史古物'
  },
  'Chùa Cầu Hội An': {
    vi: 'Chùa Cầu Hội An',
    en: 'Hoi An Japanese Covered Bridge',
    fr: 'Pont Couvert Japonais de Hoi An',
    ja: 'ホイアン来遠橋（日本橋）',
    ko: '호이안 내원교 (일본다리)',
    zh: '会安来远桥（日本桥）'
  },
  'Đô thị Cổ & Kiến trúc gỗ': {
    vi: 'Đô thị Cổ & Kiến trúc gỗ',
    en: 'Ancient Town & Wooden Architecture',
    fr: 'Vieille Ville & Architecture en Bois',
    ja: '古都・木造建築',
    ko: '고대 도시 & 목조 건축',
    zh: '古老街市与木造建筑'
  },
  'Làng Gốm Bát Tràng': {
    vi: 'Làng Gốm Bát Tràng',
    en: 'Bat Trang Ceramic Village',
    fr: 'Village de Potiers de Bat Trang',
    ja: 'バッチャン陶芸村',
    ko: '밧짱 도자기 마을',
    zh: '钵场陶瓷古村'
  },
  'Làng nghề Thủ công Truyền thống': {
    vi: 'Làng nghề Thủ công Truyền thống',
    en: 'Traditional Craft Village',
    fr: 'Village Artisanal Traditionnel',
    ja: '伝統手工芸村',
    ko: '전통 수공예 마을',
    zh: '传统手工艺村落'
  },
  'Làng nghề Thủ công Truyền...': {
    vi: 'Làng nghề Thủ công Truyền...',
    en: 'Traditional Craft Village...',
    fr: 'Village Artisanal...',
    ja: '伝統工芸村...',
    ko: '전통 공예 마을...',
    zh: '传统手艺古村...'
  },
  'Áo Dài & Cổ Phục Việt Nam': {
    vi: 'Áo Dài & Cổ Phục Việt Nam',
    en: 'Ao Dai & Traditional Costumes',
    fr: 'Ao Dai & Costumes Traditionnels',
    ja: 'アオザイとベトナムの伝統衣装',
    ko: '아오자이 & 베트남 전통의상',
    zh: '奥黛与越南传统服饰'
  },
  'Áo Dài & Cổ Phục Việt...': {
    vi: 'Áo Dài & Cổ Phục Việt...',
    en: 'Ao Dai & Costumes...',
    fr: 'Ao Dai & Costumes...',
    ja: 'アオザイ＆伝統衣装...',
    ko: '아오자이 & 전통의상...',
    zh: '奥黛与古装服饰...'
  },
  'Trang phục Truyền thống': {
    vi: 'Trang phục Truyền thống',
    en: 'Traditional Costumes',
    fr: 'Costumes Traditionnels',
    ja: '伝統衣装',
    ko: '전통 의상',
    zh: '传统服饰'
  },
  'Chùa Thiên Mụ & Tháp Phước Duyên': {
    vi: 'Chùa Thiên Mụ & Tháp Phước Duyên',
    en: 'Thien Mu Pagoda & Phuoc Duyen Tower',
    fr: 'Pagode Thien Mu & Tour Phuoc Duyen',
    ja: 'ティエンムー寺・福縁塔',
    ko: '티엔무 사찰 & 프억지엔 탑',
    zh: '天姥寺与福缘塔'
  },
  'Chùa Thiên Mụ & Tháp...': {
    vi: 'Chùa Thiên Mụ & Tháp...',
    en: 'Thien Mu Pagoda & Tower...',
    fr: 'Pagode Thien Mu...',
    ja: 'ティエンムー寺＆塔...',
    ko: '티엔무 사찰 & 탑...',
    zh: '天姥寺与古塔...'
  },
  'Chùa cổ & Phật giáo': {
    vi: 'Chùa cổ & Phật giáo',
    en: 'Ancient Pagodas & Buddhism',
    fr: 'Pagodes Anciennes & Bouddhisme',
    ja: '古刹・仏教寺院',
    ko: '고대 사찰 & 불교',
    zh: '古刹与佛教文化'
  },
  'Ống Kính AI Di Sản': {
    vi: 'Ống Kính AI Di Sản',
    en: 'Heritage AI Vision Lens',
    fr: 'Objectif IA du Patrimoine',
    ja: '遺産AIビジョンレンズ',
    ko: '문화유산 AI 비전 렌즈',
    zh: '文化遗产AI视觉透镜'
  },
  'Heritage AI Vision Lens': {
    vi: 'Ống Kính AI Di Sản',
    en: 'Heritage AI Vision Lens',
    fr: 'Objectif IA du Patrimoine',
    ja: '遺産AIビジョンレンズ',
    ko: '문화유산 AI 비전 렌즈',
    zh: '文化遗产AI视觉透镜'
  },
  'Chụp ảnh trực tiếp từ thiết bị': {
    vi: 'Chụp ảnh trực tiếp từ thiết bị',
    en: 'Capture photo directly from device',
    fr: 'Prendre une photo directement depuis l\'appareil',
    ja: 'デバイスから直接写真を撮影',
    ko: '기기에서 직접 사진 촬영',
    zh: '从设备直接拍摄照片'
  },
  'Capture photo directly from device': {
    vi: 'Chụp ảnh trực tiếp từ thiết bị',
    en: 'Capture photo directly from device',
    fr: 'Prendre une photo directement depuis l\'appareil',
    ja: 'デバイスから直接写真を撮影',
    ko: '기기에서 직접 사진 촬영',
    zh: '从设备直接拍摄照片'
  },
  'Tải ảnh từ thư viện': {
    vi: 'Tải ảnh từ thư viện',
    en: 'Upload photo from library',
    fr: 'Télécharger depuis la galerie',
    ja: 'ライブラリから写真をアップロード',
    ko: '갤러리에서 사진 업로드',
    zh: '从相册上传照片'
  },
  'Chụp trực tiếp': {
    vi: 'Chụp trực tiếp',
    en: 'Live Capture',
    fr: 'Capture Directe',
    ja: 'リアルタイム撮影',
    ko: '실시간 촬영',
    zh: '实时拍摄'
  },
  'Live Capture': {
    vi: 'Chụp trực tiếp',
    en: 'Live Capture',
    fr: 'Capture Directe',
    ja: 'リアルタイム撮影',
    ko: '실시간 촬영',
    zh: '实时拍摄'
  },
  'Tải tệp': {
    vi: 'Tải tệp',
    en: 'Upload File',
    fr: 'Fichier',
    ja: 'ファイル選択',
    ko: '파일 업로드',
    zh: '上传文件'
  },
  'Upload File': {
    vi: 'Tải tệp',
    en: 'Upload File',
    fr: 'Fichier',
    ja: 'ファイル選択',
    ko: '파일 업로드',
    zh: '上传文件'
  },
  'Căn góc di sản': {
    vi: 'Căn góc di sản',
    en: 'Frame the heritage',
    fr: 'Cadrez le patrimoine',
    ja: '遺産を枠内に収める',
    ko: '초점 맞추기',
    zh: '对准取景框'
  },
  '• Căn góc di sản': {
    vi: '• Căn góc di sản',
    en: '• Frame the heritage',
    fr: '• Cadrez le patrimoine',
    ja: '• 遺産を枠内に収める',
    ko: '• 초점 맞추기',
    zh: '• 对准取景框'
  },
  'LIVE • Căn góc di sản': {
    vi: 'LIVE • Căn góc di sản',
    en: 'LIVE • Frame the heritage',
    fr: 'EN DIRECT • Cadrez le patrimoine',
    ja: 'LIVE • 遺産を枠内に収める',
    ko: 'LIVE • 초점 맞추기',
    zh: 'LIVE • 对准取景框'
  },
  'Đổi camera trước / sau': {
    vi: 'Đổi camera trước / sau',
    en: 'Switch front / rear camera',
    fr: 'Basculer caméra avant / arrière',
    ja: 'フロント/リアカメラ切替',
    ko: '전면 / 후면 카메라 전환',
    zh: '切换前置 / 后置摄像头'
  },
  'Hướng camera vào di tích, hoa văn, hiện vật hoặc cổ phục': {
    vi: 'Hướng camera vào di tích, hoa văn, hiện vật hoặc cổ phục',
    en: 'Point camera at monuments, patterns, artifacts or costumes',
    fr: 'Pointez la caméra vers des monuments, motifs, objets ou costumes',
    ja: '寺院、文様、古美術品、伝統衣装にカメラを向けてください',
    ko: '유적지, 전통 문양, 유물 또는 전통의상에 카메라를 향하세요',
    zh: '请将镜头对准古迹、传统纹样、文物或古装'
  },
  'Kích hoạt Máy Ảnh Chụp Trực Tiếp': {
    vi: 'Kích hoạt Máy Ảnh Chụp Trực Tiếp',
    en: 'Activate Live Camera',
    fr: 'Activer la Caméra en Direct',
    ja: 'ライブカメラを起動',
    ko: '실시간 카메라 활성화',
    zh: '开启实时拍摄镜头'
  },
  'Cho phép quyền truy cập Camera trên trình duyệt để chụp và nhận diện di sản ngay tại chỗ.': {
    vi: 'Cho phép quyền truy cập Camera trên trình duyệt để chụp và nhận diện di sản ngay tại chỗ.',
    en: 'Allow browser camera access to capture and identify heritage on-site.',
    fr: 'Autorisez l\'accès à la caméra pour capturer et identifier le patrimoine sur place.',
    ja: 'ブラウザのカメラアクセスを許可して、その場で遺産を撮影・認識します。',
    ko: '브라우저 카메라 접근 권한을 허용하여 현장에서 즉시 문화유산을 촬영하고 인식하세요.',
    zh: '请允许浏览器摄像头访问权限，以便在现场拍照并即时识别文化遗产。'
  },
  'Thử lại Camera': {
    vi: 'Thử lại Camera',
    en: 'Retry Camera',
    fr: 'Réessayer la Caméra',
    ja: 'カメラを再試行',
    ko: '카메라 다시 시도',
    zh: '重试摄像头'
  },
  'Mở Camera máy': {
    vi: 'Mở Camera máy',
    en: 'Open Device Camera',
    fr: 'Ouvrir l\'Appareil Photo',
    ja: '端末のカメラを開く',
    ko: '기기 카메라 열기',
    zh: '打开原生相机'
  },
  'Bấm để chọn tệp hoặc kéo thả ảnh vào đây': {
    vi: 'Bấm để chọn tệp hoặc kéo thả ảnh vào đây',
    en: 'Click to select file or drag & drop image here',
    fr: 'Cliquez pour sélectionner un fichier ou glissez-déposez ici',
    ja: 'クリックしてファイルを選択、または画像をドラッグ＆ドロップ',
    ko: '파일을 선택하거나 이미지를 여기로 드래그 앤 드롭하세요',
    zh: '点击选择文件或将图片拖拽至此处'
  },
  'Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 10MB)': {
    vi: 'Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 10MB)',
    en: 'Supports JPG, PNG, WEBP (Up to 10MB)',
    fr: 'Formats pris en charge : JPG, PNG, WEBP (Max 10 Mo)',
    ja: '対応形式：JPG、PNG、WEBP（最大10MB）',
    ko: '지원 형식: JPG, PNG, WEBP (최대 10MB)',
    zh: '支持 JPG、PNG、WEBP 格式（最大 10MB）'
  },
  'Duyệt ảnh từ thiết bị': {
    vi: 'Duyệt ảnh từ thiết bị',
    en: 'Browse from device',
    fr: 'Parcourir l\'appareil',
    ja: '端末から画像を選択',
    ko: '기기에서 사진 찾아보기',
    zh: '从设备浏览选取图片'
  },
  'Ảnh vừa chụp từ Camera': {
    vi: 'Ảnh vừa chụp từ Camera',
    en: 'Photo captured from Camera',
    fr: 'Photo capturée depuis la Caméra',
    ja: 'カメラで撮影した写真',
    ko: '카메라로 방금 촬영한 사진',
    zh: '刚刚从相机拍摄的照片'
  },
  'Ảnh mẫu thử nghiệm': {
    vi: 'Ảnh mẫu thử nghiệm',
    en: 'Sample test photo',
    fr: 'Photo d\'échantillon d\'essai',
    ja: 'テスト用サンプル写真',
    ko: '체험용 샘플 사진',
    zh: '测试示例照片'
  },
  'Ảnh từ thiết bị': {
    vi: 'Ảnh từ thiết bị',
    en: 'Photo from device',
    fr: 'Photo de l\'appareil',
    ja: '端末からの写真',
    ko: '기기에서 불러온 사진',
    zh: '来自设备的本地图片'
  },
  'Chụp lại': {
    vi: 'Chụp lại',
    en: 'Retake',
    fr: 'Reprendre',
    ja: '撮り直す',
    ko: '다시 촬영',
    zh: '重新拍摄'
  },
  'Chụp lại ảnh khác': {
    vi: 'Chụp lại ảnh khác',
    en: 'Retake another photo',
    fr: 'Reprendre une autre photo',
    ja: '別の写真を撮り直す',
    ko: '다른 사진 다시 촬영',
    zh: '重新拍摄其他照片'
  },
  'Camera máy': {
    vi: 'Camera máy',
    en: 'Device Cam',
    fr: 'Caméra de l\'Appareil',
    ja: '端末カメラ',
    ko: '기기 카메라',
    zh: '设备相机'
  },
  'Chụp & Nhận Diện Ngay': {
    vi: 'Chụp & Nhận Diện Ngay',
    en: 'Capture & Identify Now',
    fr: 'Capturer & Identifier',
    ja: '撮影して即座に認識',
    ko: '촬영 후 즉시 인식',
    zh: '立即拍照并识别'
  },
  'Đổi chiều': {
    vi: 'Đổi chiều',
    en: 'Flip',
    fr: 'Inverser',
    ja: 'カメラ切替',
    ko: '방향 전환',
    zh: '翻转'
  },
  'Tự động nhận diện AI ngay khi bấm chụp (Tối ưu 1 chạm)': {
    vi: 'Tự động nhận diện AI ngay khi bấm chụp (Tối ưu 1 chạm)',
    en: 'Auto-identify with AI right after snapping (1-tap optimized)',
    fr: 'Reconnaissance IA automatique dès la prise de vue (Optimisé 1 clic)',
    ja: '撮影後すぐにAIが自動認識（ワンタップ最適化）',
    ko: '촬영 즉시 AI가 자동으로 인식 (원터치 최적화)',
    zh: '拍摄后立即自动执行AI分析（一键极速体验）'
  },
  'Ghi chú bối cảnh (tùy chọn)': {
    vi: 'Ghi chú bối cảnh (tùy chọn)',
    en: 'Context notes (optional)',
    fr: 'Notes de contexte (optionnel)',
    ja: '文脈メモ（任意）',
    ko: '상황 메모 (선택사항)',
    zh: '背景线索备注（选填）'
  },
  'Ghi chú bổ sung cho AI (tùy chọn):': {
    vi: 'Ghi chú bổ sung cho AI (tùy chọn):',
    en: 'Additional note for AI (optional):',
    fr: 'Note complémentaire pour l\'IA (optionnel) :',
    ja: 'AIへの追加メモ（任意）：',
    ko: 'AI를 위한 추가 메모 (선택사항):',
    zh: '向AI补充背景线索（选填）：'
  },
  'Ví dụ: Hiện vật tìm thấy ở Ninh Bình, chụp tại bảo tàng...': {
    vi: 'Ví dụ: Hiện vật tìm thấy ở Ninh Bình, chụp tại bảo tàng...',
    en: 'E.g., Artifact found in Ninh Binh, photographed in a museum...',
    fr: 'Ex. : Objet trouvé à Ninh Binh, photographié au musée...',
    ja: '例：ニンビンで発見された遺物、博物館にて撮影...',
    ko: '예: 닌빈에서 발견된 유물, 박물관에서 촬영...',
    zh: '例如：在宁平发现的古物，拍摄于博物馆...'
  },
  'Ví dụ: Hiện vật này tôi thấy tại chùa ở Bắc Ninh...': {
    vi: 'Ví dụ: Hiện vật này tôi thấy tại chùa ở Bắc Ninh...',
    en: 'E.g., I saw this artifact at a pagoda in Bac Ninh...',
    fr: 'Ex. : J\'ai vu cet objet dans une pagode à Bac Ninh...',
    ja: '例：バクニンの寺院で見かけた仏像・古美術品です...',
    ko: '예: 박닌의 사찰에서 발견한 유물입니다...',
    zh: '例如：此文物是我在北宁某古寺见到的...'
  },
  'Bắt đầu Nhận diện Di sản AI': {
    vi: 'Bắt đầu Nhận diện Di sản AI',
    en: 'Start AI Heritage Recognition',
    fr: 'Démarrer la Reconnaissance IA',
    ja: 'AI遺産認識を開始',
    ko: 'AI 문화유산 인식 시작',
    zh: '开启AI文化遗产识别'
  },
  'Phân tích lại hình ảnh này': {
    vi: 'Phân tích lại hình ảnh này',
    en: 'Re-analyze this image',
    fr: 'Réanalyser cette image',
    ja: 'この画像を再分析',
    ko: '이 사진 다시 분석',
    zh: '重新分析此图片'
  },
  'AI đang phân tích thị giác di sản...': {
    vi: 'AI đang phân tích thị giác di sản...',
    en: 'AI is analyzing heritage visuals...',
    fr: 'L\'IA analyse les éléments visuels...',
    ja: 'AIが遺産の視覚的特徴を分析中...',
    ko: 'AI가 문화유산 시각 요소를 분석 중입니다...',
    zh: 'AI 正在对文化遗产图像进行深度分析...'
  },
  'Đang đối chiếu dữ liệu di sản Việt Nam': {
    vi: 'Đang đối chiếu dữ liệu di sản Việt Nam',
    en: 'Cross-referencing Vietnamese heritage archives',
    fr: 'Correspondance avec les archives du patrimoine vietnamien',
    ja: 'ベトナム遺産データベースと照合中',
    ko: '베트남 문화유산 데이터베이스 대조 중',
    zh: '正在比对越南国家文化遗产权威档案'
  },
  'Mô hình Gemini 3.8 Flash Vision đang phân tích đặc trưng kiến trúc, hoa văn, niên đại và độ tin cậy lịch sử...': {
    vi: 'Mô hình Gemini 3.8 Flash Vision đang phân tích đặc trưng kiến trúc, hoa văn, niên đại và độ tin cậy lịch sử...',
    en: 'Gemini 3.8 Flash Vision model is analyzing architectural details, motifs, dynasty, and historical authenticity...',
    fr: 'Le modèle Gemini 3.8 Flash Vision analyse les détails architecturaux, motifs, époques et l\'authenticité historique...',
    ja: 'Gemini 3.8 Flash Vision モデルが建築様式、文様、年代、歴史的信憑性を分析中...',
    ko: 'Gemini 3.8 Flash Vision 모델이 건축 특징, 문양, 연대 및 역사적 신뢰도를 분석 중입니다...',
    zh: 'Gemini 3.8 Flash Vision 模型正在深度解析建筑风格、传统纹饰、历史朝代与考据可信度...'
  },
  'Chưa có kết quả nhận diện': {
    vi: 'Chưa có kết quả nhận diện',
    en: 'No recognition result yet',
    fr: 'Aucun résultat pour le moment',
    ja: '認識結果はまだありません',
    ko: '아직 인식 결과가 없습니다',
    zh: '暂无识别结果'
  },
  'No recognition result yet': {
    vi: 'Chưa có kết quả nhận diện',
    en: 'No recognition result yet',
    fr: 'Aucun résultat pour le moment',
    ja: '認識結果はまだありません',
    ko: '아직 인식 결과가 없습니다',
    zh: '暂无识别结果'
  },
  'Hãy hướng camera về phía di tích / hiện vật hoặc tải ảnh chụp lên, AI sẽ phân tích và cung cấp hồ sơ văn hóa chi tiết.': {
    vi: 'Hãy hướng camera về phía di tích / hiện vật hoặc tải ảnh chụp lên, AI sẽ phân tích và cung cấp hồ sơ văn hóa chi tiết.',
    en: 'Point the camera at a monument or artifact, or upload a photo. AI will analyze and provide a comprehensive cultural profile.',
    fr: 'Pointez la caméra vers un monument ou un objet, ou téléchargez une photo pour une analyse culturelle détaillée par l\'IA.',
    ja: '寺院や古美術品にカメラを向けるか写真をアップロードすると、AIが詳細な文化・歴史プロファイルを即座に提供します。',
    ko: '유적지나 유물에 카메라를 비추거나 사진을 업로드하면 AI가 심층 문화유산 프로필을 상세히 제공합니다.',
    zh: '请将摄像头对准名胜古迹或珍贵文物，或上传清晰照片，AI将即时呈现详尽的文化档案。'
  },
  'Chỉ cần hướng camera vào di sản và bấm "Chụp & Nhận Diện Ngay" hoặc chọn ảnh mẫu phía trên để trải nghiệm.': {
    vi: 'Chỉ cần hướng camera vào di sản và bấm "Chụp & Nhận Diện Ngay" hoặc chọn ảnh mẫu phía trên để trải nghiệm.',
    en: 'Simply point the camera at a heritage site and tap "Capture & Identify Now", or select a sample photo above.',
    fr: 'Pointez simplement la caméra vers un site et cliquez sur "Capturer & Identifier", ou choisissez un échantillon ci-dessus.',
    ja: 'カメラを遺産に向けて「撮影して即座に認識」を押すか、上のサンプル写真を選択してください。',
    ko: '카메라를 문화유산에 비추고 "촬영 후 즉시 인식"을 누르거나 상단 샘플 사진을 선택해보세요.',
    zh: '只需将镜头对准文化遗产并点击“立即拍照识别”，或选择上方的示例图片进行体验。'
  },
  '[THÔNG TIN ĐÃ XÁC MINH]': {
    vi: '[THÔNG TIN ĐÃ XÁC MINH]',
    en: '[VERIFIED INFORMATION]',
    fr: '[INFORMATION VÉRIFIÉE]',
    ja: '[確認済み公式情報]',
    ko: '[검증된 공식 정보]',
    zh: '[已证实权威信息]'
  },
  '[TRUYỀN THUYẾT / DÂN GIAN]': {
    vi: '[TRUYỀN THUYẾT / DÂN GIAN]',
    en: '[FOLKLORE / LEGEND]',
    fr: '[LÉGENDE / FOLKLORE]',
    ja: '[民間伝承・伝説]',
    ko: '[전설 / 민화]',
    zh: '[民间传说 / 典故]'
  },
  '[THÔNG TIN CHƯA XÁC MINH]': {
    vi: '[THÔNG TIN CHƯA XÁC MINH]',
    en: '[UNVERIFIED CLAIM]',
    fr: '[INFORMATION NON VÉRIFIÉE]',
    ja: '[未確認情報]',
    ko: '[미확인 정보]',
    zh: '[未证实信息]'
  },
  'Lịch sử & Nguồn gốc:': {
    vi: 'Lịch sử & Nguồn gốc:',
    en: 'History & Provenance:',
    fr: 'Histoire & Origine :',
    ja: '歴史と起源：',
    ko: '역사 및 기원:',
    zh: '历史溯源：'
  },
  'Ý nghĩa Văn hóa & Kiến trúc:': {
    vi: 'Ý nghĩa Văn hóa & Kiến trúc:',
    en: 'Cultural & Architectural Significance:',
    fr: 'Signification Culturelle & Architecturale :',
    ja: '文化的・建築的意義：',
    ko: '문화 및 건축적 의의:',
    zh: '文化与建筑价值：'
  },
  'Thông tin thú vị ít người biết:': {
    vi: 'Thông tin thú vị ít người biết:',
    en: 'Fascinating Facts You May Not Know:',
    fr: 'Faits insolites peu connus :',
    ja: 'あまり知られていない興味深い事実：',
    ko: '흥미로운 비하인드 스토리:',
    zh: '鲜为人知的趣味知识：'
  },
  'Câu hỏi gợi ý để tìm hiểu sâu hơn:': {
    vi: 'Câu hỏi gợi ý để tìm hiểu sâu hơn:',
    en: 'Suggested questions to explore deeper:',
    fr: 'Questions suggérées pour aller plus loin :',
    ja: 'さらに深く知るためのおすすめの質問：',
    ko: '더 깊이 알아보기 위한 추천 질문:',
    zh: '深入探索推荐提问：'
  },
  'Nghe AI kể chuyện': {
    vi: 'Nghe AI kể chuyện',
    en: 'Listen to AI Story',
    fr: 'Écouter le récit IA',
    ja: 'AI物語を聴く',
    ko: 'AI 이야기 듣기',
    zh: '聆听AI讲故事'
  },
  'Ăn uống & Vui chơi gần đây': {
    vi: 'Ăn uống & Vui chơi gần đây',
    en: 'Food & Leisure Nearby',
    fr: 'Restaurants & Loisirs proches',
    ja: '周辺のグルメ＆レジャー',
    ko: '주변 먹거리 & 즐길거리',
    zh: '周边美食与娱乐'
  },
  'Xem vị trí trên bản đồ': {
    vi: 'Xem vị trí trên bản đồ',
    en: 'View on map',
    fr: 'Voir sur la carte',
    ja: '地図で位置を確認',
    ko: '지도에서 위치 확인',
    zh: '在地图上查看位置'
  },
  'Admin: Tùy chỉnh nội dung & ảnh mẫu nhận diện': {
    vi: 'Admin: Tùy chỉnh nội dung & ảnh mẫu nhận diện',
    en: 'Admin: Customize recognition content & samples',
    fr: 'Admin : Personnaliser le contenu et les échantillons',
    ja: '管理者：認識コンテンツとサンプル画像のカスタマイズ',
    ko: '관리자: 인식 콘텐츠 및 샘플 이미지 설정',
    zh: '管理员：自定义识别内容与样本图像'
  },
  '⚡ Đang ở Chế độ Nhận Diện AI Ngoại Tuyến (Offline Visual Engine)': {
    vi: '⚡ Đang ở Chế độ Nhận Diện AI Ngoại Tuyến (Offline Visual Engine)',
    en: '⚡ Offline AI Visual Recognition Mode Active',
    fr: '⚡ Mode de Reconnaissance IA Hors-ligne Actif',
    ja: '⚡ オフラインAI視覚認識モード稼働中',
    ko: '⚡ 오프라인 AI 시각 인식 모드 활성화',
    zh: '⚡ 离线AI视觉识别模式运行中'
  },
  'Phân tích đặc trưng & đối chiếu kho tư liệu di sản lưu trong thiết bị': {
    vi: 'Phân tích đặc trưng & đối chiếu kho tư liệu di sản lưu trong thiết bị',
    en: 'Analyzing features & cross-referencing local heritage archive on device',
    fr: 'Analyse des caractéristiques et correspondance avec les archives locales',
    ja: '特徴を分析し、端末内の遺産アーカイブと照合',
    ko: '특징을 분석하고 기기 내 저장된 문화유산 아카이브와 대조',
    zh: '分析图像特征并对照存储在本地设备中的文化遗产典籍'
  },
  // Admin Recognition Modal & Multilingual Editor
  'Biên Tập Nội Dung & Ảnh Mẫu Nhận Diện AI': {
    vi: 'Biên Tập Nội Dung & Ảnh Mẫu Nhận Diện AI',
    en: 'Edit AI Recognition Content & Sample Photos',
    fr: 'Modifier le Contenu & Échantillons de Reconnaissance IA',
    ja: 'AI認識コンテンツとサンプル写真の編集',
    ko: 'AI 인식 콘텐츠 및 샘플 사진 편집',
    zh: '编辑AI识别内容和示例照片'
  },
  'Quyền Quản Trị': {
    vi: 'Quyền Quản Trị',
    en: 'Admin Access',
    fr: 'Accès Administrateur',
    ja: '管理者権限',
    ko: '관리자 권한',
    zh: '管理员权限'
  },
  'Tùy chỉnh tiêu đề, câu lệnh gợi ý và danh sách ảnh mẫu thử nghiệm nhanh một chạm': {
    vi: 'Tùy chỉnh tiêu đề, câu lệnh gợi ý và danh sách ảnh mẫu thử nghiệm nhanh một chạm',
    en: 'Customize title, prompt suggestions, and one-touch test sample photos',
    fr: 'Personnaliser le titre, les suggestions d\'invites et les photos échantillons',
    ja: 'タイトル、プロンプトの提案、ワンタッチテスト用サンプル写真をカスタマイズ',
    ko: '제목, 프롬프트 제안 및 원터치 테스트 샘플 사진 맞춤 설정',
    zh: '自定义标题、提示词建议和一键测试示例照片'
  },
  'Danh Sách Ảnh Mẫu': {
    vi: 'Danh Sách Ảnh Mẫu',
    en: 'Sample Photo List',
    fr: 'Liste des Photos Échantillons',
    ja: 'サンプル写真リスト',
    ko: '샘플 사진 목록',
    zh: '示例照片列表'
  },
  'Tiêu Đề & Lời Dẫn Banner': {
    vi: 'Tiêu Đề & Lời Dẫn Banner',
    en: 'Banner Title & Introduction',
    fr: 'Titre & Introduction de la Bannière',
    ja: 'バナータイトルと紹介文',
    ko: '배너 제목 및 소개글',
    zh: '横幅标题与导语'
  },
  'Xem Trước Giao Diện': {
    vi: 'Xem Trước Giao Diện',
    en: 'Live UI Preview',
    fr: 'Aperçu en Direct',
    ja: 'UIライブプレビュー',
    ko: 'UI 실시간 미리보기',
    zh: '界面实时预览'
  },
  'Ảnh mẫu thử nghiệm nhận diện một chạm': {
    vi: 'Ảnh mẫu thử nghiệm nhận diện một chạm',
    en: 'One-touch test sample photos',
    fr: 'Photos d\'exemple pour test en un clic',
    ja: 'ワンタッチ認識テスト用サンプル写真',
    ko: '원터치 인식 테스트 샘플 사진',
    zh: '一键识别测试示例照片'
  },
  'Người dùng nhấp vào từng thẻ để AI lập tức phân tích và đưa ra thuyết minh lịch sử.': {
    vi: 'Người dùng nhấp vào từng thẻ để AI lập tức phân tích và đưa ra thuyết minh lịch sử.',
    en: 'Users click each card for AI to instantly analyze and present historical explanation.',
    fr: 'Les utilisateurs cliquent sur chaque carte pour que l\'IA analyse et présente l\'histoire.',
    ja: 'カードをクリックするとAIが即座に分析し、歴史的な解説を提供します。',
    ko: '사용자가 각 카드를 클릭하면 AI가 즉시 분석하고 역사적 해설을 제공합니다.',
    zh: '用户点击每张卡片即可让AI立即分析并提供历史讲解。'
  },
  'Thêm Ảnh Mẫu Mới': {
    vi: 'Thêm Ảnh Mẫu Mới',
    en: 'Add New Sample Photo',
    fr: 'Ajouter une Nouvelle Photo',
    ja: '新しいサンプル写真を追加',
    ko: '새 샘플 사진 추가',
    zh: '添加新示例照片'
  },
  'Khôi Phục Chuẩn': {
    vi: 'Khôi Phục Chuẩn',
    en: 'Reset to Default',
    fr: 'Réinitialiser aux Défauts',
    ja: 'デフォルトに復元',
    ko: '기본값으로 복원',
    zh: '恢复默认标准'
  },
  'Thêm Thẻ Ảnh Mẫu Mới': {
    vi: 'Thêm Thẻ Ảnh Mẫu Mới',
    en: 'Add New Sample Photo Card',
    fr: 'Ajouter une Nouvelle Carte Échantillon',
    ja: '新しいサンプル写真カードを追加',
    ko: '새 샘플 사진 카드 추가',
    zh: '添加新示例照片卡片'
  },
  'Chỉnh Sửa Mẫu:': {
    vi: 'Chỉnh Sửa Mẫu:',
    en: 'Edit Sample:',
    fr: 'Modifier l\'échantillon :',
    ja: 'サンプルの編集：',
    ko: '샘플 수정:',
    zh: '编辑示例：'
  },
  'Tên Di sản / Hiện vật / Cổ phục': {
    vi: 'Tên Di sản / Hiện vật / Cổ phục',
    en: 'Heritage / Artifact / Costume Name',
    fr: 'Nom du Patrimoine / Objet / Costume',
    ja: '遺産・工芸品・伝統衣装の名称',
    ko: '문화유산 / 유물 / 전통의상 이름',
    zh: '文化遗产/文物/传统服饰名称'
  },
  'Thể loại / Nhãn phụ': {
    vi: 'Thể loại / Nhãn phụ',
    en: 'Category / Sub-tag',
    fr: 'Catégorie / Sous-étiquette',
    ja: 'カテゴリー・サブタグ',
    ko: '카테고리 / 보조 태그',
    zh: '分类/副标签'
  },
  'Câu Lệnh Kiểm Thử Cho AI (Prompt)': {
    vi: 'Câu Lệnh Kiểm Thử Cho AI (Prompt)',
    en: 'AI Test Prompt (Prompt)',
    fr: 'Invite de test pour l\'IA (Prompt)',
    ja: 'AIテストプロンプト (Prompt)',
    ko: 'AI 테스트 프롬프트 (Prompt)',
    zh: 'AI测试提示词 (Prompt)'
  },
  'Lời gợi ý giúp AI nhận dạng đúng góc máy hoặc triều đại lịch sử.': {
    vi: 'Lời gợi ý giúp AI nhận dạng đúng góc máy hoặc triều đại lịch sử.',
    en: 'Prompt hint to help AI correctly recognize angle or historical dynasty.',
    fr: 'Indication pour aider l\'IA à identifier l\'angle ou la dynastie.',
    ja: 'AIが画角や歴史的王朝を正確に認識するのを助けるヒント。',
    ko: 'AI가 촬영 각도나 역사적 왕조를 정확하게 인식하도록 돕는 힌트.',
    zh: '提示词可帮助AI准确识别拍摄视角或历史朝代。'
  },
  'Mô tả / Bối cảnh văn hóa': {
    vi: 'Mô tả / Bối cảnh văn hóa',
    en: 'Description / Cultural Context',
    fr: 'Description / Contexte Culturel',
    ja: '説明・文化的背景',
    ko: '설명 / 문화적 맥락',
    zh: '描述/文化背景'
  },
  'Đường dẫn ảnh (URL)': {
    vi: 'Đường dẫn ảnh (URL)',
    en: 'Image URL',
    fr: 'URL de l\'image',
    ja: '画像URL',
    ko: '이미지 URL',
    zh: '图片链接 (URL)'
  },
  'Chọn từ Kho Ảnh Di Sản': {
    vi: 'Chọn từ Kho Ảnh Di Sản',
    en: 'Choose from Heritage Photo Archive',
    fr: 'Choisir dans la Banque d\'Images du Patrimoine',
    ja: '遺産フォトアーカイブから選択',
    ko: '문화유산 사진 아카이브에서 선택',
    zh: '从遗产图库中选择'
  },
  'Tải ảnh tệp': {
    vi: 'Tải ảnh tệp',
    en: 'Upload Photo',
    fr: 'Télécharger un Fichier',
    ja: '写真をアップロード',
    ko: '사진 파일 업로드',
    zh: '上传图片文件'
  },
  'Chưa có ảnh xem trước': {
    vi: 'Chưa có ảnh xem trước',
    en: 'No preview image yet',
    fr: 'Aucun aperçu disponible',
    ja: 'プレビュー画像がありません',
    ko: '미리보기 이미지가 없습니다',
    zh: '暂无预览图片'
  },
  'Lưu Thẻ Này': {
    vi: 'Lưu Thẻ Này',
    en: 'Save This Card',
    fr: 'Enregistrer cette Carte',
    ja: 'このカードを保存',
    ko: '이 카드 저장',
    zh: '保存此卡片'
  },
  'Cấu hình Tiêu đề & Lời dẫn Banner': {
    vi: 'Cấu hình Tiêu đề & Lời dẫn Banner',
    en: 'Banner Title & Introduction Configuration',
    fr: 'Configuration du Titre & de la Bannière',
    ja: 'バナータイトルと紹介文の設定',
    ko: '배너 제목 및 소개글 설정',
    zh: '横幅标题与导语配置'
  },
  'Nội dung hiển thị ở phần giới thiệu của Mô-đun Nhận Diện Di Sản': {
    vi: 'Nội dung hiển thị ở phần giới thiệu của Mô-đun Nhận Diện Di Sản',
    en: 'Content displayed in the introduction of the Heritage Recognition Module',
    fr: 'Contenu affiché dans l\'introduction du module de reconnaissance du patrimoine',
    ja: '遺産認識モジュールの導入部に表示されるコンテンツ',
    ko: '문화유산 인식 모듈의 소개 섹션에 표시되는 콘텐츠',
    zh: '在文化遗产识别模块导语部分显示的内容'
  },
  'Huy hiệu / Badge nổi bật': {
    vi: 'Huy hiệu / Badge nổi bật',
    en: 'Featured Badge',
    fr: 'Badge en Vedette',
    ja: '注目バッジ',
    ko: '주요 배지',
    zh: '特色徽章'
  },
  'Tiêu đề chính (H2 Heading)': {
    vi: 'Tiêu đề chính (H2 Heading)',
    en: 'Main Title (H2 Heading)',
    fr: 'Titre Principal (En-tête H2)',
    ja: 'メインタイトル (H2見出し)',
    ko: '기본 제목 (H2 헤딩)',
    zh: '主标题 (H2 标题)'
  },
  'Mô tả / Hướng dẫn thao tác': {
    vi: 'Mô tả / Hướng dẫn thao tác',
    en: 'Description / Instructions',
    fr: 'Description / Instructions',
    ja: '説明・操作ガイド',
    ko: '설명 / 조작 안내',
    zh: '描述/操作说明'
  },
  'Tiêu đề danh sách mẫu thử nghiệm': {
    vi: 'Tiêu đề danh sách mẫu thử nghiệm',
    en: 'Test Sample List Title',
    fr: 'Titre de la Liste d\'Échantillons',
    ja: 'テストサンプルリストのタイトル',
    ko: '테스트 샘플 목록 제목',
    zh: '测试示例列表标题'
  },
  'Mô phỏng trực tiếp cách người dùng nhìn thấy phần này trên website:': {
    vi: 'Mô phỏng trực tiếp cách người dùng nhìn thấy phần này trên website:',
    en: 'Direct preview of how users will see this section on the website:',
    fr: 'Aperçu direct de ce que verront les utilisateurs sur le site :',
    ja: 'ウェブサイト上でユーザーにどのように表示されるかの直接プレビュー：',
    ko: '웹사이트에서 사용자가 이 섹션을 보게 되는 방식 실시간 미리보기:',
    zh: '直接预览用户在网站上看到的此部分效果：'
  },
  'thẻ mẫu hiển thị': {
    vi: 'thẻ mẫu hiển thị',
    en: 'sample cards displayed',
    fr: 'cartes échantillons affichées',
    ja: '表示サンプルカード',
    ko: '표시된 샘플 카드',
    zh: '张展示示例卡片'
  },
  'Cập nhật lần cuối:': {
    vi: 'Cập nhật lần cuối:',
    en: 'Last updated:',
    fr: 'Dernière mise à jour :',
    ja: '最終更新：',
    ko: '최종 업데이트:',
    zh: '最后更新：'
  },
  'Lưu Thay Đổi (Cập Nhật Toàn Web)': {
    vi: 'Lưu Thay Đổi (Cập Nhật Toàn Web)',
    en: 'Save Changes (Apply Site-wide)',
    fr: 'Enregistrer les Modifications (Tout le site)',
    ja: '変更を保存 (全サイト適用)',
    ko: '변경사항 저장 (전체 웹 적용)',
    zh: '保存更改 (应用于整个网站)'
  },
  'Đang lưu...': {
    vi: 'Đang lưu...',
    en: 'Saving...',
    fr: 'Enregistrement...',
    ja: '保存中...',
    ko: '저장 중...',
    zh: '正在保存...'
  },
  'Đã lưu thành công nội dung và danh sách ảnh mẫu!': {
    vi: 'Đã lưu thành công nội dung và danh sách ảnh mẫu!',
    en: 'Successfully saved content and sample photo presets!',
    fr: 'Contenu et préréglages enregistrés avec succès !',
    ja: 'コンテンツとサンプル写真を正常に保存しました！',
    ko: '콘텐츠 및 샘플 사진이 성공적으로 저장되었습니다!',
    zh: '已成功保存内容与示例图片列表！'
  },
  'Đã khôi phục về mẫu di sản chuẩn nguyên bản!': {
    vi: 'Đã khôi phục về mẫu di sản chuẩn nguyên bản!',
    en: 'Restored to original Vietnamese heritage presets!',
    fr: 'Rétabli aux préréglages originaux du patrimoine !',
    ja: '標準の文化遺産プリセットに復元しました！',
    ko: '기본 표준 문화유산 프리셋으로 복원되었습니다!',
    zh: '已恢复为越南标准文化遗产初始预设！'
  },
  'Ngôn ngữ biên tập:': {
    vi: 'Ngôn ngữ biên tập:',
    en: 'Editing Language:',
    fr: 'Langue d\'édition :',
    ja: '編集言語：',
    ko: '편집 언어:',
    zh: '编辑语言：'
  },
  'Xem trước bằng ngôn ngữ:': {
    vi: 'Xem trước bằng ngôn ngữ:',
    en: 'Preview in language:',
    fr: 'Aperçu dans la langue :',
    ja: '言語別プレビュー：',
    ko: '언어별 미리보기:',
    zh: '以指定语言预览：'
  },
  'Tự động điền bản dịch': {
    vi: 'Tự động điền bản dịch',
    en: 'Auto-fill Translation',
    fr: 'Remplir automatiquement la traduction',
    ja: '翻訳を自動入力',
    ko: '번역 자동 입력',
    zh: '自动填充翻译'
  }
};

class LanguageService {
  private currentLanguage: string = 'vi';
  private domObserver: MutationObserver | null = null;
  private isTranslating: boolean = false;

  constructor() {
    this.currentLanguage = this.loadLanguage();
    // Re-apply translation on startup if not Vietnamese
    if (typeof window !== 'undefined' && this.currentLanguage !== 'vi') {
      setTimeout(() => {
        this.applyFullPageTranslation(this.currentLanguage);
      }, 500);
    }
  }

  /**
   * Loads saved language from localStorage with fallback to Vietnamese
   */
  public loadLanguage(): string {
    if (typeof localStorage === 'undefined') return 'vi';
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // ignore storage access error
    }
    return 'vi';
  }

  /**
   * Get current language code (e.g., 'vi', 'en', 'fr', 'ja', 'ko', 'zh')
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get language info object for current or specific language code
   */
  public getLanguageInfo(code?: string): LanguageInfo {
    const targetCode = code || this.currentLanguage;
    const found = SUPPORTED_LANGUAGES.find(l => l.code === targetCode);
    return found || SUPPORTED_LANGUAGES[0];
  }

  /**
   * Set, persist application language, and trigger full-page DOM translation
   */
public setLanguage(code: string): void {
  const supported = SUPPORTED_LANGUAGES.some(
    (language) => language.code === code
  );

  if (!supported) {
    console.warn(`Unsupported language code: ${code}`);
    return;
  }

  this.currentLanguage = code;

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch (error) {
    console.warn("Could not save language:", error);
  }

  const langInfo = this.getLanguageInfo(code);

  document.documentElement.lang = langInfo.bcp47;

  // Đồng bộ lựa chọn với Google Translate.
  const targetCode = langInfo.googleTranslateCode || code;

  try {
    const combo = document.querySelector(
      "select.goog-te-combo"
    ) as HTMLSelectElement | null;

    if (combo && combo.value !== targetCode) {
      combo.value = targetCode;
      combo.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    } else if (!combo) {
      // Widget chưa sẵn sàng: thử lại khi nó được tải.
      window.setTimeout(() => {
        const retry = document.querySelector(
          "select.goog-te-combo"
        ) as HTMLSelectElement | null;

        if (retry && retry.value !== targetCode) {
          retry.value = targetCode;
          retry.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }
      }, 1000);
    }
  } catch (error) {
    console.warn("Google Translate error:", error);
  }

  // Giữ đồng bộ trạng thái ngôn ngữ giữa các component React.
  window.dispatchEvent(
    new CustomEvent("hdv_language_changed", {
      detail: {
        language: code,
        info: langInfo,
      },
    })
  );

  // Translate the full page, including dynamic content outside the manual dictionary.
  this.applyFullPageTranslation(code);
}

  /**
   * Translates the entire webpage content (including database entries, paragraphs, and external text)
   * using Google Translate engine and cookie synchronization.
   */
  public applyFullPageTranslation(code: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const langInfo = this.getLanguageInfo(code);
    const targetGoogleCode = langInfo.googleTranslateCode || code;

    // 1. Sync cookie for Google Translate
    try {
      const hostname = window.location.hostname;
      if (code === 'vi') {
        // Clear translation cookies to restore original Vietnamese
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
        document.cookie = 'googtrans=/vi/vi; path=/;';
      } else {
        document.cookie = `googtrans=/vi/${targetGoogleCode}; path=/;`;
        document.cookie = `googtrans=/vi/${targetGoogleCode}; path=/; domain=${hostname};`;
      }
    } catch (e) {
      console.warn('Translate cookie setting:', e);
    }

    // 2. Trigger Google Translate dropdown element if rendered in DOM
    const triggerCombo = () => {
      const combo = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        if (combo.value !== targetGoogleCode) {
          combo.value = targetGoogleCode;
          combo.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return true;
      }
      return false;
    };

    if (!triggerCombo()) {
      // Google Translate loads asynchronously; keep retrying long enough for slow networks.
      let retries = 0;
      const timer = setInterval(() => {
        retries++;
        if (triggerCombo() || retries >= 60) {
          clearInterval(timer);
        }
      }, 500);
    }

    // 3. Fast-path In-Memory DOM Text Translation for Instant Feedback
    this.translateDOM(code);
  }

  /**
   * Fast In-Memory DOM Text Translation engine
   * Translates key elements and phrases across the DOM immediately without waiting for network scripts
   */
  public translateDOM(code: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (this.domObserver) {
      this.domObserver.disconnect();
      this.domObserver = null;
    }

    const langInfo = this.getLanguageInfo(code);
    document.documentElement.lang = langInfo.bcp47;

    if (code === 'vi') {
      document.title = 'HERITAGEAI - Khám phá Di sản & Trải nghiệm Việt Nam';
      // Restore any text previously replaced
      const trackedElements = document.querySelectorAll('[data-orig-text]');
      trackedElements.forEach((el) => {
        const orig = el.getAttribute('data-orig-text');
        if (orig) {
          el.textContent = orig;
          el.removeAttribute('data-orig-text');
        }
      });
      // Restore original form and accessibility attributes as well.
      document.querySelectorAll('*').forEach((el) => {
        ['placeholder', 'title', 'aria-label', 'alt'].forEach((attr) => {
          const key = 'data-orig-attr-' + attr;
          const original = el.getAttribute(key);
          if (original !== null) {
            el.setAttribute(attr, original);
            el.removeAttribute(key);
          }
        });
      });
      return;
    }

    // Update document title for the selected language
    const titleMap: Record<string, string> = {
      en: 'HERITAGEAI - Explore Vietnam Cultural Heritage & AI Guide',
      fr: 'HERITAGEAI - Découvrez le Patrimoine du Vietnam & Guide IA',
      ja: 'HERITAGEAI - ベトナムの世界遺産探索とAIツアーガイド',
      ko: 'HERITAGEAI - 베트남 문화유산 탐험 및 AI 가이드',
      zh: 'HERITAGEAI - 越南文化遗产探索与AI虚拟导游'
    };
    if (titleMap[code]) {
      document.title = titleMap[code];
    }

    // Known common UI phrases to translate across all text nodes
    const phraseMap: Record<string, Record<string, string>> = {
      ...PHRASE_TRANSLATIONS,
      'Khám phá Di sản': { en: 'Explore Heritage', fr: 'Explorer le Patrimoine', ja: '遺産を探索', ko: '문화유산 탐험', zh: '探索文化遗产' },
      'Khám phá di sản': { en: 'Explore heritage', fr: 'Explorer le site', ja: '遺産を探索', ko: '문화유산 탐험', zh: '探索名胜' },
      'Nhận diện bằng AI': { en: 'AI Vision Recognition', fr: 'Reconnaissance IA', ja: 'AI画像認識', ko: 'AI 사진 인식', zh: 'AI 视觉识别' },
      'Nhận diện AI': { en: 'AI Vision', fr: 'Vision IA', ja: 'AI画像認識', ko: 'AI 비전', zh: 'AI 识别' },
      'Hỏi Trợ lý AI': { en: 'Ask AI Guide', fr: 'Demander au Guide IA', ja: 'AIガイドに質問', ko: 'AI 가이드에게 질문', zh: '向AI导游提问' },
      'Ăn uống & Vui chơi': { en: 'Food & Leisure', fr: 'Gastronomie & Loisirs', ja: 'グルメ＆レジャー', ko: '음식 & 즐길거리', zh: '美食与休闲' },
      'Bản đồ Văn hóa': { en: 'Cultural Map', fr: 'Carte Culturelle', ja: '文化マップ', ko: '문화 지도', zh: '全景文化地图' },
      'Bản đồ': { en: 'Map', fr: 'Carte', ja: '地図', ko: '지도', zh: '全景地图' },
      'Hồ sơ & Danh hiệu': { en: 'Profile & Badges', fr: 'Profil & Titres', ja: 'プロフィール＆称号', ko: '프로필 및 칭호', zh: '个人档案与成就' },
      'Kể chuyện': { en: 'Story', fr: 'Histoire', ja: 'ストーリー', ko: '이야기', zh: '讲故事' },
      'Kể chuyện AI': { en: 'AI Stories', fr: 'Récits IA', ja: 'AI物語音声', ko: 'AI 스토리', zh: 'AI 讲述' },
      'Lập lịch trình': { en: 'Tour Planner', fr: 'Planificateur', ja: '日程プランナー', ko: '일정 플래너', zh: '规划行程' },
      'Làng nghề & Nghệ thuật': { en: 'Crafts & Arts', fr: 'Artisanat & Arts', ja: '伝統工芸・芸能', ko: '전통공예 & 예술', zh: '传统手工艺与艺术' },
      'Quiz & Lịch sử': { en: 'Quiz & History', fr: 'Quiz & Histoire', ja: 'クイズ・歴史', ko: '퀴즈 & 역사', zh: '历史问答' },
      'Cộng đồng': { en: 'Community', fr: 'Communauté', ja: 'コミュニティ', ko: '커뮤니티', zh: '互动社区' },
      'Yêu thích': { en: 'Favorites', fr: 'Favoris', ja: 'お気に入り', ko: '즐겨찾기', zh: '收藏夹' },
      'Quản trị viên': { en: 'Admin', fr: 'Administration', ja: '管理者', ko: '관리자', zh: '管理后台' },
      'Ngắm ảnh nền': { en: 'View Wallpaper', fr: 'Voir le fond', ja: '壁紙を鑑賞', ko: '배경 감상', zh: '欣赏壁纸' },
      'Đổi cảnh sắc': { en: 'Change View', fr: 'Changer la vue', ja: '景色を変更', ko: '배경 변경', zh: '更换名胜' },
      'Di Sản Tiêu Biểu': { en: 'Featured Heritage', fr: 'Patrimoines Remarquables', ja: '代表的な世界遺産', ko: '대표 문화유산', zh: '代表性文化遗产' },
      'Báu Vật Ngàn Năm Của Dân Tộc': { en: 'Millennial Treasures of the Nation', fr: 'Trésors Millénaires de la Nation', ja: '千年の歴史を誇る国の宝', ko: '민족의 찬란한 천년 보물', zh: '千百年来流传的民族瑰宝' },
      'Xem tất cả trên bản đồ': { en: 'View all on map', fr: 'Voir tout sur la carte', ja: '地図ですべて見る', ko: '지도에서 전체 보기', zh: '在全景地图中查看' },
      'Định Hướng Khám Phá': { en: 'Discovery Compass', fr: 'Boussole de Découverte', ja: '探訪ナビゲーション', ko: '탐험 길잡이', zh: '探索向导' },
      'Bản Đồ Điều Hướng Tiện Ích Di Sản': { en: 'Heritage Utilities Navigation', fr: 'Tableau de Bord des Services', ja: '遺産ナビゲーションダッシュボード', ko: '문화유산 편의 도구 대시보드', zh: '文化遗产智能工具导航' },
      'Chi tiết': { en: 'Details', fr: 'Détails', ja: '詳細', ko: '상세보기', zh: '详情' },
      'Ăn uống': { en: 'Food', fr: 'Cuisine', ja: 'グルメ', ko: '음식', zh: '餐饮' },
      'Đăng nhập': { en: 'Sign In', fr: 'Connexion', ja: 'ログイン', ko: '로그인', zh: '登录' },
      'Đăng ký': { en: 'Sign Up', fr: 'Inscription', ja: '新規登録', ko: '회원가입', zh: '注册' },
      'Đăng xuất': { en: 'Sign Out', fr: 'Déconnexion', ja: 'ログアウト', ko: '로그아웃', zh: '退出登录' },
      'Đóng': { en: 'Close', fr: 'Fermer', ja: '閉じる', ko: '닫기', zh: '关闭' },
      'Thêm': { en: 'More', fr: 'Plus', ja: 'その他', ko: '더보기', zh: '更多' },
      'Áp dụng': { en: 'Apply', fr: 'Appliquer', ja: '適用', ko: '적용', zh: '应用' },
      'Hủy': { en: 'Cancel', fr: 'Annuler', ja: 'キャンセル', ko: '취소', zh: '取消' },
      'Tất cả': { en: 'All', fr: 'Tous', ja: 'すべて', ko: '전체', zh: '全部' },
      'Tìm kiếm': { en: 'Search', fr: 'Rechercher', ja: '検索', ko: '검색', zh: '搜索' },
      'Lưu': { en: 'Save', fr: 'Enregistrer', ja: '保存', ko: '저장', zh: '保存' },
      'Xác nhận': { en: 'Confirm', fr: 'Confirmer', ja: '確認', ko: '확인', zh: '确认' },
      'Nghe thử': { en: 'Sample audio', fr: 'Écouter', ja: 'サンプル試聴', ko: '미리듣기', zh: '试听' },
      'Dừng': { en: 'Stop', fr: 'Arrêter', ja: '停止', ko: '정지', zh: '停止' },
      'Gần Bạn Nhất (GPS)': { en: 'Nearest (GPS)', fr: 'Plus proche (GPS)', ja: '最寄り (GPS)', ko: '가장 가까운 곳 (GPS)', zh: '最近地点 (GPS)' },
      'Đổi Danh Thắng': { en: 'Change Landmark', fr: 'Changer de Site', ja: '名勝変更', ko: '명소 변경', zh: '更换名胜' },
      'Khám phá danh lam': { en: 'Explore Landmark', fr: 'Explorer le Site', ja: '名勝を探訪', ko: '명소 탐방', zh: '探索名胜' },
      'Tài Khoản Cá Nhân': { en: 'Personal Account', fr: 'Compte Personnel', ja: '個人アカウント', ko: '개인 계정', zh: '个人中心' },
      'Đăng Nhập / Đăng Ký': { en: 'Sign In / Register', fr: 'Connexion / Inscription', ja: 'ログイン／新規登録', ko: '로그인 / 회원가입', zh: '登录 / 注册' },
      'Quay lại Trang chủ': { en: 'Back to Home', fr: 'Retour Accueil', ja: 'ホームに戻る', ko: '홈으로 돌아가기', zh: '返回首页' },
      'Lịch sử hoạt động': { en: 'Activity History', fr: 'Historique', ja: '活動履歴', ko: '활동 내역', zh: '活动历史' },
      'Chế độ ngoại tuyến': { en: 'Offline Mode', fr: 'Mode Hors-ligne', ja: 'オフライン', ko: '오프라인', zh: '离线模式' },
      'Trang chủ': { en: 'Home', fr: 'Accueil', ja: 'ホーム', ko: '홈', zh: '首页' },
      'Di sản': { en: 'Heritage', fr: 'Patrimoine', ja: '世界遺産', ko: '문화유산', zh: '文化遗产' },
      'Di tích lịch sử': { en: 'Historical Monument', fr: 'Monument historique', ja: '歴史史跡', ko: '역사 유적', zh: '历史遗迹' },
      'Di sản văn hóa thế giới': { en: 'World Cultural Heritage', fr: 'Patrimoine mondial', ja: '世界文化遺産', ko: '세계문화유산', zh: '世界文化遗产' },
      'Di tích quốc gia đặc biệt': { en: 'Special National Monument', fr: 'Monument national spécial', ja: '特別国家史跡', ko: '특별국가유적', zh: '特别国家级古迹' },
      'Di sản thiên nhiên thế giới': { en: 'World Natural Heritage', fr: 'Patrimoine naturel mondial', ja: '世界自然遺産', ko: '세계자연유산', zh: '世界自然遗产' },
      'Văn hóa phi vật thể': { en: 'Intangible Cultural Heritage', fr: 'Patrimoine immatériel', ja: '無形文化遺産', ko: '무형문화유산', zh: '非物质文化遗产' },
      'Danh lam thắng cảnh': { en: 'Scenic Landscape', fr: 'Paysage pittoresque', ja: '名勝景勝地', ko: '명승지', zh: '名胜古迹' },
      'Làng nghề truyền thống': { en: 'Traditional Craft Village', fr: 'Village artisanal', ja: '伝統工芸村', ko: '전통 공예 마을', zh: '传统手工艺村' },
      'Ẩm thực truyền thống': { en: 'Traditional Cuisine', fr: 'Cuisine traditionnelle', ja: '郷土料理', ko: '전통 요리', zh: '传统美食' },
      'Miền Bắc': { en: 'Northern Vietnam', fr: 'Nord du Vietnam', ja: 'ベトナム北部', ko: '베트남 북부', zh: '越南北部' },
      'Miền Trung': { en: 'Central Vietnam', fr: 'Centre du Vietnam', ja: 'ベトナム中部', ko: '베트남 중부', zh: '越南中部' },
      'Miền Nam': { en: 'Southern Vietnam', fr: 'Sud du Vietnam', ja: 'ベトナム南部', ko: '베트남 남부', zh: '越南南部' }
    };

    const runPass = () => {
      if (this.isTranslating) return;
      this.isTranslating = true;
      try {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName.toLowerCase();
              if (['script', 'style', 'textarea', 'input', 'code', 'pre'].includes(tag)) {
                return NodeFilter.FILTER_REJECT;
              }
              if (parent.closest('#google_translate_element')) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        let currentNode = walker.nextNode();
        while (currentNode) {
          const text = currentNode.nodeValue?.trim();
          if (text && phraseMap[text] && phraseMap[text][code]) {
            const parent = currentNode.parentElement;
            if (parent && !parent.hasAttribute('data-orig-text')) {
              parent.setAttribute('data-orig-text', text);
            }
            currentNode.nodeValue = currentNode.nodeValue!.replace(text, phraseMap[text][code]);
          }
          currentNode = walker.nextNode();
        }

        // Translate common text-bearing attributes too (placeholders, tooltips,
        // image alt text and accessibility labels), using the original value
        // so switching between languages does not get stuck on a previous translation.
        document.querySelectorAll('*').forEach((el) => {
          ['placeholder', 'title', 'aria-label', 'alt'].forEach((attr) => {
            const key = 'data-orig-attr-' + attr;
            const currentValue = el.getAttribute(attr);
            if (currentValue === null) return;
            const originalValue = el.getAttribute(key) ?? currentValue;
            const translatedValue = phraseMap[originalValue]?.[code];
            if (translatedValue) {
              if (!el.hasAttribute(key)) el.setAttribute(key, originalValue);
              el.setAttribute(attr, translatedValue);
            }
          });
        });
      } catch (e) {
        console.warn('DOM translation pass:', e);
      } finally {
        this.isTranslating = false;
      }
    };

    // Immediate translation pass
    runPass();

    // Re-check shortly for asynchronous components and tab loads
    setTimeout(runPass, 150);
    setTimeout(runPass, 450);

    // Continuous translation observer for dynamic tabs & dialogs
    try {
      this.domObserver = new MutationObserver(() => {
        runPass();
      });
      this.domObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch {
      // Ignore if observer not supported
    }
  }

  /**
   * Translate a given key or phrase
   */
  public t(key: string, lang?: string, fallback?: string): string {
    if (!key) return fallback || '';
    const activeLang = lang || this.currentLanguage;
    const trimmedKey = key.trim();

    if (activeLang === 'vi') {
      if (DICTIONARY[trimmedKey]?.['vi']) return DICTIONARY[trimmedKey]['vi'];
      if (PHRASE_TRANSLATIONS[trimmedKey]?.['vi']) return PHRASE_TRANSLATIONS[trimmedKey]['vi'];
      return fallback !== undefined ? fallback : key;
    }

    // 1. Check DICTIONARY by key
    const entry = DICTIONARY[trimmedKey] || DICTIONARY[key];
    if (entry) {
      if (entry[activeLang]) return entry[activeLang];
      if (entry['en']) return entry['en'];
      if (entry['vi']) return entry['vi'];
    }

    // 2. Check PHRASE_TRANSLATIONS by key/phrase
    const phraseEntry = PHRASE_TRANSLATIONS[trimmedKey] || PHRASE_TRANSLATIONS[key];
    if (phraseEntry) {
      if (phraseEntry[activeLang]) return phraseEntry[activeLang];
      if (phraseEntry['en']) return phraseEntry['en'];
    }

    // 3. Strip leading emojis, symbols or punctuation if match not yet found
    const cleanKey = trimmedKey.replace(/^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}✨⚡•:\s]+/u, '').trim();
    if (cleanKey && cleanKey !== trimmedKey) {
      if (DICTIONARY[cleanKey]?.[activeLang]) return DICTIONARY[cleanKey][activeLang];
      if (PHRASE_TRANSLATIONS[cleanKey]?.[activeLang]) return PHRASE_TRANSLATIONS[cleanKey][activeLang];
      if (PHRASE_TRANSLATIONS[cleanKey]?.['en']) return PHRASE_TRANSLATIONS[cleanKey]['en'];
    }

    // 4. Check fallback in PHRASE_TRANSLATIONS
    if (fallback) {
      const fbTrimmed = fallback.trim();
      const fbEntry = PHRASE_TRANSLATIONS[fbTrimmed] || PHRASE_TRANSLATIONS[fallback];
      if (fbEntry) {
        if (fbEntry[activeLang]) return fbEntry[activeLang];
        if (fbEntry['en']) return fbEntry['en'];
      }
      const fbClean = fbTrimmed.replace(/^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}✨⚡•:\s]+/u, '').trim();
      if (fbClean && fbClean !== fbTrimmed) {
        if (PHRASE_TRANSLATIONS[fbClean]?.[activeLang]) return PHRASE_TRANSLATIONS[fbClean][activeLang];
        if (PHRASE_TRANSLATIONS[fbClean]?.['en']) return PHRASE_TRANSLATIONS[fbClean]['en'];
      }
    }

    // 5. Return fallback or key
    return fallback !== undefined ? fallback : key;
  }

  /**
   * Translate or return English/foreign version of heritage item if lang === 'en'
   */
  public translateHeritageItem(item: any, lang?: string): any {
    const activeLang = lang || this.currentLanguage;
    if (!item) return item;

    // Check if there are explicit edited translations for this language
    const customTranslation = item.translations?.[activeLang];
    if (customTranslation) {
      return {
        ...item,
        name: customTranslation.name || (activeLang === 'en' ? item.englishName : undefined) || item.name,
        categoryLabel: customTranslation.categoryLabel || this.t(item.categoryLabel, activeLang, item.categoryLabel),
        period: customTranslation.period || item.period,
        dynasty: customTranslation.dynasty || item.dynasty,
        history: customTranslation.history || item.history,
        culturalSignificance: customTranslation.culturalSignificance || item.culturalSignificance,
        overview: customTranslation.overview || item.overview,
        address: customTranslation.address || item.address,
        visitingHours: customTranslation.visitingHours || item.visitingHours,
        ticketPrice: customTranslation.ticketPrice || item.ticketPrice,
        interestingFacts: (customTranslation.interestingFacts && customTranslation.interestingFacts.length > 0)
          ? customTranslation.interestingFacts
          : item.interestingFacts
      };
    }

    if (activeLang === 'vi') return item;

    const translated = { ...item };
    if (translated.name) {
      translated.name = this.t(translated.name, activeLang, translated.englishName || translated.name);
    } else if (translated.englishName && activeLang === 'en') {
      translated.name = translated.englishName;
    }
    if (translated.categoryLabel) {
      translated.categoryLabel = this.t(translated.categoryLabel, activeLang, translated.categoryLabel);
    }
    if (translated.period) {
      translated.period = this.t(translated.period, activeLang, translated.period);
    }
    if (translated.culturalSignificance) {
      translated.culturalSignificance = this.t(translated.culturalSignificance, activeLang, translated.culturalSignificance);
    }
    if (activeLang === 'en') {
      const n = (translated.name || '').toLowerCase();
      const id = (translated.id || '').toLowerCase();
      if (id === 'dai-noi-hue' || n.includes('ngọ môn') || n.includes('đại nội') || n.includes('imperial city')) {
        translated.name = "Imperial City of Hue (Ngo Mon Gate)";
        translated.categoryLabel = "Imperial Citadels & Palaces";
        translated.history = "Construction began in 1804 under Emperor Gia Long and was completed in 1833 under Emperor Minh Mang. The Imperial Citadel served as the administrative center and royal residence for 13 Nguyen Dynasty emperors over 143 years.";
        translated.culturalSignificance = "Recognized as a UNESCO World Cultural Heritage site in 1993. It is a pinnacle of Vietnamese imperial architecture, harmoniously combining Eastern feng shui philosophy with Western Vauban military architecture.";
        translated.period = "Nguyen Dynasty (1802 - 1945)";
        translated.dynasty = "Nguyen Dynasty";
        translated.interestingFacts = [
          "Ngo Mon has 5 entrances, of which the central portal was exclusively reserved for the reigning Emperor.",
          "Ngu Phung pavilion on top is built with ironwood and roofed with yellow and green glazed tiles.",
          "The site witnessed the historic abdication of Emperor Bao Dai in August 1945."
        ];
        translated.suggestedQuestions = [
          "What is the feng shui layout of Hue Imperial Citadel?",
          "How was the Ngo Mon Gate constructed and preserved?"
        ];
      } else if (id === 'van-mieu-quoc-tu-giam' || id === 'van-mieu-hanoi' || n.includes('văn miếu') || n.includes('temple of literature')) {
        translated.name = "Temple of Literature - Imperial Academy";
        translated.categoryLabel = "Historical & Educational Site";
        translated.history = "Built in 1070 during the reign of Emperor Ly Thanh Tong to worship Confucius and sages. In 1076, Emperor Ly Nhan Tong established Quoc Tu Giam next to it, becoming Vietnam's first national university.";
        translated.culturalSignificance = "Home to 82 Doctor's stelae inscribed by UNESCO as a Memory of the World documentary heritage, symbolizing the studious tradition and academic devotion of the Vietnamese nation.";
        translated.period = "Ly - Le Dynasties (1070 - 1779)";
        translated.dynasty = "Ly - Tran - Le Dynasties";
        translated.interestingFacts = [
          "82 Stone Doctor's Stelae rest on the backs of stone turtles, honoring 1,304 doctoral laureates.",
          "Khue Van Cac pavilion was built in 1805 and is the official emblem of Hanoi capital.",
          "Students still visit before key exams to pray for academic fortune and wisdom."
        ];
        translated.suggestedQuestions = [
          "Why are doctoral stelae placed upon stone turtles?",
          "How did students graduate from Quoc Tu Giam in ancient Vietnam?"
        ];
      } else if (id === 'pho-co-hoi-an' || id === 'chua-cau-hoi-an' || n.includes('chùa cầu') || n.includes('covered bridge')) {
        translated.name = "Hoi An Japanese Covered Bridge (Lai Vien Kieu)";
        translated.categoryLabel = "Ancient Town & Wooden Architecture";
        translated.history = "Constructed by Japanese merchant guilds in the early 17th century spanning a canal connecting Japanese and Chinese quarters. Emperor Nguyen Phuc Chu granted the plaque 'Lai Vien Kieu' in 1719.";
        translated.culturalSignificance = "UNESCO World Cultural Heritage icon recognized in 1999, embodying maritime silk road trade diplomacy, spiritual harmony, and intricate wooden tile-roofed craftsmanship.";
        translated.period = "17th Century (1590s - 1719)";
        translated.dynasty = "Nguyen Lords Era";
        translated.interestingFacts = [
          "The bridge is guarded by pairs of carved wooden dogs and monkeys at either end.",
          "Despite being called a pagoda (Chùa Cầu), it worships Bac De Tran Vu, deity of weather and sailors, rather than Buddha.",
          "The bridge appears prominently on Vietnam's 20,000 VND banknote."
        ];
        translated.suggestedQuestions = [
          "Why are statues of dogs and monkeys placed at both ends of Chua Cau?",
          "What is the folklore legend of the Cu sea monster beneath Chua Cau?"
        ];
      } else if (id === 'gom-bat-trang' || n.includes('bát tràng') || n.includes('bat trang')) {
        translated.name = "Bat Trang Ceramic Craft Village";
        translated.categoryLabel = "Traditional Craft Village";
        translated.history = "Established over 700 years ago along the Red River during the Ly - Tran transition era. Bat Trang potters supplied royal tableware, temple incense burners, and exported wares worldwide.";
        translated.culturalSignificance = "One of Vietnam's oldest and most renowned pottery villages, celebrated for its unique crackle glaze, cobalt blue patterns, and wood-fired kiln traditions.";
        translated.period = "14th Century - Present";
        translated.dynasty = "Ly - Tran - Le - Nguyen";
        translated.interestingFacts = [
          "Crackle glaze is achieved through precise thermal expansion differences between body and glaze.",
          "Ancient Bat Trang bricks were celebrated for exceptional hardness and acoustic resonance.",
          "Visitors can hand-throw clay on traditional potter wheels with master artisans."
        ];
        translated.suggestedQuestions = [
          "How is ancient Bat Trang crackle glaze created?",
          "What distinguishes Bat Trang pottery from other ceramic traditions in Asia?"
        ];
      } else if (id === 'ao-dai-co-phuc' || n.includes('áo dài') || n.includes('cổ phục') || n.includes('costume')) {
        translated.name = "Ao Dai & Vietnamese Traditional Costumes";
        translated.categoryLabel = "Traditional Costumes";
        translated.history = "Evolving from the 18th-century Ngu Than (five-panel) tunics decreed by Lord Nguyen Phuc Khoat, the Ao Dai transformed through the 20th century into Vietnam's cherished national garment.";
        translated.culturalSignificance = "An enduring national emblem celebrating grace, humility, and philosophical harmony (symbolizing the Five Cardinal Virtues: Benevolence, Righteousness, Propriety, Wisdom, Fidelity).";
        translated.period = "18th - 21st Century";
        translated.dynasty = "Nguyen Lords & Nguyen Dynasty";
        translated.interestingFacts = [
          "Five panels represent parents, in-laws, and the wearer, bound by moral duty.",
          "Nhat Binh collars display exquisite imperial embroideries of phoenixes and water waves.",
          "Modern youth revival movements are restoring historic garments with meticulous research."
        ];
        translated.suggestedQuestions = [
          "What is the difference between Ao Nhat Binh and Ao Ngu Than?",
          "How did Lord Nguyen Phuc Khoat establish the regulations of the Ao Dai?"
        ];
      } else if (id === 'chua-thien-mu' || n.includes('thiên mụ') || n.includes('phước duyên')) {
        translated.name = "Thien Mu Pagoda & Phuoc Duyen Tower";
        translated.categoryLabel = "Ancient Pagodas & Buddhism";
        translated.history = "Founded in 1601 by the first Nguyen Lord, Nguyen Hoang, following a local prophecy of a celestial lady (Thien Mu). Emperor Thieu Tri erected the iconic octagonal Phuoc Duyen tower in 1844.";
        translated.culturalSignificance = "The unofficial symbol of Hue ancient capital, standing serenely on Ha Khe hill overlooking the gentle Perfume River, housing national bronze treasures.";
        translated.period = "17th - 19th Century (1601 - 1844)";
        translated.dynasty = "Nguyen Lords & Nguyen Dynasty";
        translated.interestingFacts = [
          "Phuoc Duyen tower rises 21 meters with 7 octagonal tiers, each dedicated to a Buddha.",
          "The giant Great Bell (Dai Hong Chung) cast in 1710 weighs over two tons and resonates for miles.",
          "The pagoda houses the historic car driven by Venerable Thich Quang Duc in 1963."
        ];
        translated.suggestedQuestions = [
          "What is the legendary prophecy of the celestial lady at Thien Mu Pagoda?",
          "What cultural artifacts are preserved in the garden pavilions of Thien Mu?"
        ];
      } else if (id === 'ao-nhat-binh' || n.includes('nhật bình') || n.includes('nhat binh')) {
        translated.name = "Nguyen Dynasty Nhat Binh Costume";
        translated.categoryLabel = "Historic & Traditional Costumes";
        translated.history = "Nhat Binh was the daily ceremonial attire of royal empresses, princesses, and noblewomen of the Nguyen Dynasty, stipulated in Kham Dinh Dai Nam Hoi Dien Su Le.";
        translated.culturalSignificance = "Characterized by its rectangular neckband featuring embroidered phoenixes, five-color clouds, and floral motifs, representing the pinnacle of ancient Vietnamese court embroidery.";
        translated.period = "Nguyen Dynasty (1802 - 1945)";
        translated.dynasty = "Nguyen Dynasty";
        translated.interestingFacts = [
          "The rectangular collar matches the character 'Nhat' (一) in Chinese characters, giving it the name Nhat Binh.",
          "Different colors were strictly reserved for ranks: bright red for Empress, orange/purple for Princesses.",
          "It is now passionately revived by Vietnamese youth and brides as a cultural wedding attire."
        ];
        translated.suggestedQuestions = [
          "How did rank determine colors and motifs on royal Ao Nhat Binh?",
          "What is the cultural history behind the revival of Ao Nhat Binh today?"
        ];
      } else if (id === 'dan-bau' || n.includes('đàn bầu') || n.includes('dan bau') || n.includes('độc huyền')) {
        translated.name = "Vietnamese Monochord (Dan Bau)";
        translated.categoryLabel = "Traditional Musical Instrument";
        translated.history = "Dan Bau (Doc Huyen Cam) is a uniquely indigenous Vietnamese musical instrument, dating back centuries, originally made with a bamboo tube and a dried gourd resonator.";
        translated.culturalSignificance = "Renowned for producing hauntingly expressive flageolet tones (harmonics) using only a single string and a flexible bamboo whammy rod, closely echoing the subtle inflections of Vietnamese speech.";
        translated.period = "Traditional Folk Instrument (Centuries-old)";
        translated.dynasty = "Vietnamese Folk & Court Traditions";
        translated.interestingFacts = [
          "It uses only one string, producing pure flageolet harmonic nodes with the fleshy palm of the right hand.",
          "The flexible bamboo handle (can dan) allows continuous pitch bending and vibrato.",
          "A famous folk proverb cautions: 'Dan bau ai no trot nghe - Nuoc non ngam ngot de me long nguoi'."
        ];
        translated.suggestedQuestions = [
          "How can a single-string instrument produce full musical scales?",
          "What is the legend connecting Dan Bau with motherly love in Vietnamese folklore?"
        ];
      } else if (id === 'tranh-dong-ho' || n.includes('đông hồ') || n.includes('dong ho')) {
        translated.name = "Dong Ho Folk Woodblock Painting";
        translated.categoryLabel = "Folk Craft Village";
        translated.history = "Born in Song Ho commune, Thuan Thanh district, Bac Ninh province along the Duong River over 400 years ago, celebrating traditional Lunar New Year blessings.";
        translated.culturalSignificance = "Printed on natural Diep paper coated with glittering scallop shell powder, using natural plant and mineral pigments: charcoal black, pagoda flower yellow, gardenia green, and red ochre.";
        translated.period = "17th Century - Present";
        translated.dynasty = "Post-Le to Modern Era";
        translated.interestingFacts = [
          "Diep paper sparkles subtly due to crushed mother-of-pearl scallop shell powder mixed with glutinous rice paste.",
          "Each color requires a distinct carved woodblock, requiring up to 5 successive prints for a single painting.",
          "Famous themes include 'Catching Coconuts', 'Mice Wedding', 'Honoring Ancestral Pride', and 'Glory and Wealth'."
        ];
        translated.suggestedQuestions = [
          "How are natural colors extracted for Dong Ho woodblock prints?",
          "What is the satirical social message behind the 'Mice Wedding' painting?"
        ];
      } else if (id === 'trong-dong' || n.includes('đông sơn') || n.includes('trống đồng') || n.includes('dong son')) {
        translated.name = "Dong Son Bronze Drum";
        translated.categoryLabel = "Imperial Treasure / Ancient Relic";
        translated.history = "Created during the Bronze Age by the ancient Viet people of the Van Lang - Au Lac kingdom (Dong Son Culture), dating from around 700 BC to 100 AD.";
        translated.culturalSignificance = "The quintessential national icon of Vietnamese civilization, demonstrating sophisticated bronze metallurgy and depicting ancient agricultural rituals, bird motifs, and boat warriors.";
        translated.period = "700 BC - 100 AD";
        translated.dynasty = "Hung Kings / Van Lang - Au Lac";
        translated.interestingFacts = [
          "The center of the tympanum features a radiant 12 to 16-ray sun surrounded by flying Lac birds.",
          "Used in spiritual ceremonies, rain prayers, war mobilization, and chieftain burials.",
          "Ngoc Lu and Hoang Ha drums are preserved as Vietnam's National Treasures."
        ];
        translated.suggestedQuestions = [
          "What casting technique was used to forge giant bronze drums 2,500 years ago?",
          "What do the concentric geometric and human scenes on the tympanum signify?"
        ];
      }
    } else {
      // General translation for French, Japanese, Korean, Chinese
      if (translated.categoryLabel) {
        translated.categoryLabel = this.t(translated.categoryLabel, activeLang, translated.categoryLabel);
      }
      if (translated.name) {
        translated.name = this.t(translated.name, activeLang, translated.name);
      }
    }
    return translated;
  }

  /**
   * Plays a quick sample greeting in the target language using browser Web Speech API
   */
  public playSampleGreeting(code: string, onEnd?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const langInfo = this.getLanguageInfo(code);
      const utterance = new SpeechSynthesisUtterance(langInfo.sampleGreeting);
      utterance.lang = langInfo.bcp47;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Try selecting an optimal voice for the language
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(langInfo.bcp47) || v.lang.startsWith(code));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('Speech synthesis sample error:', err);
      onEnd?.();
      return false;
    }
  }

  /**
   * Stops any currently playing sample greeting
   */
  public stopSampleGreeting(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const languageService = new LanguageService();

export function t(key: string, fallback?: string): string {
  return languageService.t(key, undefined, fallback);
}
