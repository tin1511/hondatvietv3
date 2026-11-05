import { HeritageItem } from '../types';

/**
 * ============================================================================
 * DỮ LIỆU THUYẾT MINH TĨNH CHO HƯỚNG DẪN VIÊN 3D (<GuideCharacter />)
 * ============================================================================
 * - Hoàn toàn sử dụng dữ liệu tĩnh có sẵn trong ứng dụng (KHÔNG gọi AI lúc chạy).
 * - Mỗi lời giới thiệu có độ dài 3–5 câu (~30–45 giây đọc thuyết minh tự nhiên).
 * - Bạn có thể thêm hoặc sửa trực tiếp nội dung thuyết minh tại:
 *   1. Bảng `PROVINCE_INTROS` bên dưới cho 34 tỉnh/thành phố và 2 quần đảo.
 *   2. Bảng `HERITAGE_INTROS` bên dưới hoặc trường `intro?: string` trực tiếp
 *      trên từng đối tượng `HeritageItem` trong `src/data/vietnamHeritageData.ts`.
 */

export const PROVINCE_INTROS: Record<string, string> = {
  'Hà Nội':
    'Chào mừng bạn đến với Thủ đô Hà Nội ngàn năm văn hiến, trái tim lịch sử và văn hóa của dân tộc Việt Nam. Nơi đây lưu giữ quần thể Hoàng thành Thăng Long uy nghiêm, Văn Miếu Quốc Tử Giám cổ kính cùng 36 phố phường nhộn nhịp. Dạo bước bên Hồ Gươm xanh biếc và thưởng thức hương vị ẩm thực tinh tế, bạn sẽ cảm nhận trọn vẹn cốt cách thanh lịch của người Tràng An qua bao thế kỷ.',
  'TP. Hồ Chí Minh':
    'Xin chào bạn đến với Thành phố Hồ Chí Minh, đô thị năng động bậc nhất phương Nam với hơn ba trăm năm lịch sử giao thương. Thành phố sở hữu những công trình biểu tượng như Dinh Độc Lập, Bến Nhà Rồng lịch sử, Chợ Bến Thành và hệ thống Địa đạo Củ Chi kiên cường. Sự giao thoa hài hòa giữa di sản kiến trúc cổ điển và nhịp sống hiện đại tạo nên sức hút khó quên cho mảnh đất Sài Gòn phóng khoáng.',
  'Hải Phòng':
    'Chào mừng bạn ghé thăm Hải Phòng, thành phố Hoa Phượng Đỏ hiên ngang nơi cửa biển miền Bắc. Vùng đất này gắn liền với ba lần chiến thắng vẻ vang trên dòng sông Bạch Đằng lịch sử và di tích Đền Nghè linh thiêng. Không chỉ có bề dày truyền thống, Hải Phòng còn mê hoặc du khách bởi quần đảo Cát Bà kỳ vĩ thuộc khu dự trữ sinh quyển thế giới.',
  'Huế':
    'Xin kính chào quý khách đến với Cố đô Huế, miền đất di sản thơ mộng bên dòng sông Hương và núi Ngự. Huế tự hào là nơi hội tụ Quần thể Di tích Cố đô với Đại Nội uy nghiêm, các lăng tẩm hoàng gia triều Nguyễn và Nhã nhạc cung đình được UNESCO vinh danh. Từng mái ngói rêu phong và giai điệu ca Huế sâu lắng đều kể lại câu chuyện vàng son của một triều đại lịch sử.',
  'Đà Nẵng':
    'Chào mừng bạn đến với Đà Nẵng, thành phố đáng sống nằm ở tâm điểm con đường di sản miền Trung. Nơi đây nổi tiếng với danh thắng Ngũ Hành Sơn huyền ảo, bảo tàng Điêu khắc Chăm độc đáo và bán đảo Sơn Trà xanh mát vươn mình ra biển lớn. Từ những cây cầu biểu tượng rực rỡ ánh đèn, bạn có thể dễ dàng kết nối hành trình khám phá cả một vùng văn hóa đặc sắc.',
  'Cần Thơ':
    'Xin chào bạn về với Cần Thơ, thủ phủ miền Tây sông nước hiền hòa với câu ca gạo trắng nước trong. Điểm nhấn văn hóa đặc sắc nhất nơi đây là Chợ nổi Cái Răng tấp nập từ lúc bình minh, di sản văn hóa phi vật thể quốc gia phản ánh đời sống thương hồ mộc mạc. Đừng quên ghé thăm Nhà cổ Bình Thủy trăm năm tuổi và thưởng thức tiếng đàn Đờn ca tài tử ngọt ngào bên vườn cây trái trĩu quả.',
  'Lào Cai':
    'Chào mừng bạn đến với Lào Cai, vùng đất biên cương hùng vĩ nơi giao thoa bản sắc của nhiều dân tộc vùng cao Tây Bắc. Nơi đây sở hữu đỉnh Fansipan nóc nhà Đông Dương ẩn hiện trong mây trắng, thung lũng Mường Hoa với ruộng bậc thang kỳ vĩ và dinh thự cổ Hoàng A Tưởng. Phiên chợ vùng cao Bắc Hà rực rỡ sắc thổ cẩm sẽ mang đến cho bạn những trải nghiệm văn hóa bản địa sống động.',
  'Tuyên Quang':
    'Xin chào bạn đến với Tuyên Quang, mảnh đất giàu truyền thống cách mạng gắn với Khu di tích Quốc gia đặc biệt Tân Trào lịch sử. Không chỉ là Thủ đô Khu giải phóng xưa, vùng đất này còn sở hữu Cao nguyên đá Đồng Văn hùng vĩ, cột cờ Lũng Cú thiêng liêng và hồ Sinh thái Na Hang tuyệt đẹp. Mỗi cung đường nơi đây đều hòa quyện giữa kỳ quan địa chất toàn cầu và bản sắc văn hóa miền sơn cước.',
  'Thái Nguyên':
    'Chào mừng bạn ghé thăm Thái Nguyên, vùng đất đệ nhất danh trà và là trung tâm căn cứ địa Việt Bắc anh hùng. Tại đây, du khách có thể khám phá Khu di tích lịch sử ATK Định Hóa cùng danh thắng Hồ Ba Bể trong xanh giữa rừng nguyên sinh bạt ngàn. Hương chè Tân Cương thơm ngát và điệu hát Then đàn Tính êm dịu sẽ để lại ấn tượng sâu đậm trong lòng lữ khách.',
  'Lạng Sơn':
    'Xin chào bạn đến với xứ Lạng, vùng đất địa đầu Tổ quốc nổi tiếng với câu ca Đồng Đăng có phố Kỳ Lừa, có nàng Tô Thị, có chùa Tam Thanh. Lạng Sơn lưu giữ hệ thống ди tích Ải Chi Lăng lịch sử hào hùng cùng Công viên địa chất toàn cầu với những hang động kỳ thú. Sắc hoa đào phai mùa xuân và ẩm thực vùng cao đặc sắc luôn sẵn sàng chào đón bước chân khám phá của bạn.',
  'Phú Thọ':
    'Chào mừng bạn về với Phú Thọ, vùng đất Tổ cội nguồn của dân tộc Việt Nam nơi các Vua Hùng dựng nước Văn Lang. Quần thể Di tích Đền Hùng trên núi Nghĩa Lĩnh cùng Tín ngưỡng thờ cúng Hùng Vương và Hát Xoan cổ truyền đã trở thành biểu tượng tâm linh bất diệt của người Việt. Hành trình về đất Tổ còn đưa bạn khám phá vùng văn hóa Mường Hòa Bình và thung lũng Mai Châu thơ mộng.',
  'Bắc Ninh':
    'Xin chào bạn đến với Bắc Ninh - Kinh Bắc, vùng đất địa linh nhân kiệt với truyền thống khoa bảng vẻ vang và những làn điệu Dân ca Quan họ mượt mà. Nơi đây quy tụ hàng trăm ngôi chùa cổ kính như Chùa Dâu, Chùa Bút Tháp, Đền Đô thờ tám vị vua nhà Lý và làng tranh dân gian Đông Hồ nổi tiếng. Mỗi câu hát giao duyên của liền anh liền chị đều thấm đẫm nghĩa tình văn hóa ngàn năm.',
  'Quảng Ninh':
    'Chào mừng bạn đến với Quảng Ninh, vùng đất hội tụ kỳ quan thiên nhiên và chiều sâu tâm linh Phật giáo Việt Nam. Vịnh Hạ Long với hàng ngàn đảo đá vôi kỳ vĩ trên mặt biển ngọc bích đã nhiều lần được UNESCO vinh danh là Di sản Thiên nhiên Thế giới. Bên cạnh đó, non thiêng Yên Tử là cái nôi của Thiền phái Trúc Lâm do Phật hoàng Trần Nhân Tông sáng lập từ thế kỷ thứ mười ba.',
  'Hưng Yên':
    'Xin chào bạn ghé thăm Hưng Yên, vùng đất văn hiến xưa từng vang danh thứ nhất Kinh Kỳ, thứ nhì Phố Hiến. Nơi đây lưu giữ quần thể di tích Phố Hiến cổ kính, Chùa Keo kiến trúc gỗ độc đáo và Đền Trần linh thiêng của vùng đồng bằng châu thổ sông Hồng. Mảnh đất phù sa màu mỡ này còn nổi tiếng với nhãn lồng tiến vua và những làng nghề thủ công truyền thống lâu đời.',
  'Ninh Bình':
    'Chào mừng bạn đến với Ninh Bình, vùng đất Cố đô Hoa Lư lịch sử gắn với ba triều đại Đinh, Tiền Lê và khởi đầu nhà Lý. Quần thể danh thắng Tràng An nơi đây là Di sản Thế giới hỗn hợp văn hóa và thiên nhiên đầu tiên của Đông Nam Á với hệ thống núi đá vôi và hang động xuyên thủy kỳ ảo. Kết hợp cùng hệ thống đền đài Tam Chúc và Phủ Dầy, vùng đất này tạo nên bức tranh sơn thủy hữu tình bậc nhất Việt Nam.',
  'Điện Biên':
    'Xin chào bạn đến với Điện Biên, mảnh đất lịch sử lừng lẫy năm châu, chấn động địa cầu ở cực Tây Tổ quốc. Quần thể di tích Chiến trường Điện Biên Phủ với Đồi A1, hầm Đờ Cát và Tượng đài Chiến thắng luôn nhắc nhớ về trang sử hào hùng của dân tộc. Vào mùa xuân, sắc hoa ban trắng nở rộ khắp núi rừng Tây Bắc hòa cùng điệu xòe Thái nồng hậu đón chào du khách.',
  'Sơn La':
    'Chào mừng bạn ghé thăm Sơn La, viên ngọc xanh giữa lòng cao nguyên Tây Bắc với khí hậu trong lành và cảnh sắc hùng vĩ. Nơi đây ghi dấu lịch sử tại Di tích Quốc gia đặc biệt Nhà tù Sơn La với cây đào Tô Hiệu kiên cường sức sống. Cao nguyên Mộc Châu bát ngát đồi chè xanh và những bản làng văn hóa Thái, Mông sẽ mang đến cho bạn hành trình khám phá đầy thi vị.',
  'Lai Châu':
    'Xin chào bạn đến với Lai Châu, vùng đất của những đỉnh núi kỳ vĩ nhất Việt Nam và những biển mây bồng bềnh nơi biên giới. Lai Châu sở hữu đèo Ô Quy Hồ hùng vĩ, bia Lê Lợi cổ kính bên bờ sông Đà cùng bản làng du lịch cộng đồng Sin Suối Hồ bình yên. Nét văn hóa truyền thống nguyên sơ của hơn hai mươi dân tộc anh em tạo nên bức tranh đa sắc màu quyến rũ.',
  'Thanh Hóa':
    'Chào mừng bạn về với xứ Thanh, vùng đất địa linh nhân kiệt gắn liền với nhiều bậc đế vương và anh hùng dân tộc. Thanh Hóa tự hào sở hữu Di sản Văn hóa Thế giới Thành nhà Hồ bằng đá khối độc đáo duy nhất tại Việt Nam và Khu di tích Lam Kinh uy nghiêm của vương triều Hậu Lê. Từ cầu Hàm Rồng lịch sử bên dòng sông Mã đến bãi biển Sầm Sơn sôi động, mỗi điểm đến đều mang đậm dấu ấn thời gian.',
  'Nghệ An':
    'Xin chào bạn đến với Nghệ An, quê hương giàu truyền thống yêu nước, hiếu học và thấm đượm câu dân ca Ví, Giặm. Điểm dừng chân thiêng liêng nhất nơi đây là Khu di tích Kim Liên tại Nam Đàn, nơi lưu giữ những kỷ vật mộc mạc thời niên thiếu của Chủ tịch Hồ Chí Minh. Vùng đất xứ Nghệ còn mê hoặc du khách bởi rừng nguyên sinh Pù Mát và vẻ đẹp hùng vĩ của miền Tây Nghệ An.',
  'Hà Tĩnh':
    'Chào mừng bạn ghé thăm Hà Tĩnh, miền đất núi Hồng sông La nổi tiếng với truyền thống văn chương và tinh thần kiên cường. Nơi đây có Khu di tích Ngã ba Đồng Lộc bất tử, Khu lưu niệm Đại thi hào Nguyễn Du tại Tiên Điền và chùa Hương Tích cổ kính được mệnh danh là Hoan Châu đệ nhất danh lam. Những làn điệu Ví, Giặm Nghệ Tĩnh mộc mạc luôn ngân vang tình đất, tình người sâu nặng.',
  'Quảng Trị':
    'Xin chào bạn đến với Quảng Trị, vùng đất hội tụ những ký ức lịch sử thiêng liêng và kỳ quan thiên nhiên bậc nhất miền Trung. Nơi đây lưu giữ Thành cổ Quảng Trị, Đôi bờ Hiền Lương - Bến Hải kiên trung cùng Vườn Quốc gia Phong Nha - Kẻ Bàng với hang Sơn Đoòng lớn nhất thế giới. Sự hòa quyện giữa lòng tri ân lịch sử và vẻ đẹp kỳ vĩ của tạo hóa khiến hành trình qua vùng đất này thật sự đáng nhớ.',
  'Quảng Ngãi':
    'Chào mừng bạn đến với Quảng Ngãi, vùng đất núi Ấn sông Trà kiên cường bên bờ Biển Đông và đại ngàn Tây Nguyên. Nơi đây nổi tiếng với đảo tiền tiêu Lý Sơn được tạo nên từ những miệng núi lửa cổ cùng lễ Khao lề thế lính Hoàng Sa đầy xúc động. Không gian văn hóa cồng chiêng và những mái nhà Rông cao vút vùng cao Kon Tum càng làm giàu thêm bản sắc của mảnh đất này.',
  'Gia Lai':
    'Xin chào bạn đến với Gia Lai, vùng đất giao hòa giữa đại ngàn Tây Nguyên hùng vĩ và hào khí thượng võ Tây Sơn. Bạn sẽ được chiêm ngưỡng Biển Hồ Pleiku trong xanh được mệnh danh là đôi mắt Pleiku, lắng nghe tiếng cồng chiêng trầm hùng và ghé thăm Bảo tàng Quang Trung lịch sử. Những cụm tháp Chăm cổ kính như Tháp Đôi, Tháp Bánh Ít cũng là những báu vật kiến trúc không thể bỏ lỡ.',
  'Đắk Lắk':
    'Chào mừng bạn về với Đắk Lắk, thủ phủ cà phê của Việt Nam và là trung tâm Không gian văn hóa Cồng chiêng Tây Nguyên được UNESCO công nhận. Nơi đây cuốn hút du khách bởi vẻ đẹp hùng vĩ của cụm thác Dray Nur, hồ Lắk thơ mộng cùng kỳ quan thiên nhiên Gành Đá Đĩa độc đáo bên bờ biển Phú Yên. Hương vị cà phê Buôn Ma Thuột đậm đà và sử thi Đam San hào hùng sẽ đưa bạn vào thế giới đại ngàn đầy mê hoặc.',
  'Khánh Hòa':
    'Xin chào bạn đến với Khánh Hòa, vùng đất sở hữu những vịnh biển đẹp nhất hành tinh cùng di sản văn hóa Chăm Pa đặc sắc. Nơi đây nổi bật với Tháp Bà Ponagar nghìn năm tuổi tại Nha Trang, cụm tháp Hòa Lai, Po Klong Garai cổ kính và Vịnh Vĩnh Hy xanh ngắt. Sự giao thoa giữa văn hóa biển đảo, làng gốm Bàu Trúc lâu đời và nắng gió miền Trung tạo nên sức quyến rũ riêng biệt.',
  'Lâm Đồng':
    'Chào mừng bạn đến với Lâm Đồng, vùng đất của thành phố ngàn hoa Đà Lạt mộng mơ, cao nguyên đá Đắk Nông và biển xanh Mũi Né. Nơi đây lưu giữ Mộc bản triều Nguyễn là Di sản Tư liệu Thế giới, những dinh thự kiến trúc cổ kính ẩn mình dưới rừng thông cùng Công viên địa chất toàn cầu Đắk Nông. Khí hậu cao nguyên mát lành kết hợp với văn hóa cồng chiêng bản địa mang lại trải nghiệm nghỉ dưỡng và khám phá trọn vẹn.',
  'Đồng Nai':
    'Xin chào bạn ghé thăm Đồng Nai, vùng đất mở cõi phương Nam với hơn ba trăm năm lịch sử hình thành và phát triển. Nơi đây sở hữu Văn miếu Trấn Biên tôn vinh truyền thống hiếu học đầu tiên tại miền Nam, Cù lao Phố cổ kính và Vườn quốc gia Cát Tiên giàu đa dạng sinh học. Những làng nghề gốm Biên Hòa trăm năm tuổi cùng rừng cao su bạt ngàn ở Bình Phước tạo nên dấu ấn văn hóa sâu sắc.',
  'Tây Ninh':
    'Chào mừng bạn đến với Tây Ninh, vùng đất tâm linh và lịch sử đặc sắc nơi cửa ngõ kết nối miền Đông Nam Bộ. Nổi bật giữa đồng bằng là đỉnh núi Bà Đen cao nhất Nam Bộ được mệnh danh là Đệ nhất thiên sơn, cùng Tòa Thánh Tây Ninh có kiến trúc tôn giáo độc đáo. Nơi đây còn lưu giữ Khu di tích Trung ương Cục miền Nam giữa rừng già lịch sử hào hùng.',
  'Đồng Tháp':
    'Xin chào bạn về với Đồng Tháp, xứ sở sen hồng thanh khiết và những di tích lịch sử văn hóa đặc trưng của vùng Đồng Tháp Mười. Nơi đây có Khu di tích cụ Phó bảng Nguyễn Sinh Sắc trang nghiêm, di chỉ khảo cổ Gò Tháp thuộc nền văn hóa Óc Eo và làng hoa Sa Đéc rực rỡ bốn mùa. Hành trình xuôi dòng sông Tiền còn đưa bạn ghé thăm cù lao Thới Sơn và những ngôi nhà cổ duyên dáng.',
  'An Giang':
    'Chào mừng bạn đến với An Giang, vùng đất Thất Sơn huyền bí nối liền với biển đảo Kiên Giang trù phú nơi cực Tây Nam Tổ quốc. Nơi đây hội tụ Miếu Bà Chúa Xứ Núi Sam linh thiêng, rừng tràm Trà Sư xanh ngát cùng di chỉ văn hóa Óc Eo - Ba Thê cổ đại. Vươn ra khơi xa là Đảo ngọc Phú Quốc và quần đảo Hà Tiên thơ mộng với mười cảnh đẹp từng đi vào thi ca.',
  'Vĩnh Long':
    'Xin chào bạn ghé thăm Vĩnh Long, vùng đất địa linh nhân kiệt nằm giữa hai dòng sông Tiền và sông Hậu hiền hòa. Nơi đây nổi tiếng với Văn Thánh Miếu Vĩnh Long cổ kính, làng nghề gạch gốm đỏ Mang Thít độc đáo bên dòng kênh Thầy Cai, cùng di tích Chùa Âng và văn hóa Khmer đặc sắc. Ghé thăm xứ dừa Bến Tre và quê hương Đồng Khởi anh hùng cũng là điểm nhấn tuyệt vời trong hành trình này.',
  'Cà Mau':
    'Chào mừng bạn đến với Cà Mau, mảnh đất cực Nam thiêng liêng nơi con tàu Tổ quốc vươn mình ra biển lớn. Đứng tại Mũi Cà Mau giữa rừng ngập mặn bạt ngàn, bạn có thể ngắm mặt trời mọc trên biển Đông và lặn ở biển Tây trong cùng một ngày. Hành trình nơi đây còn đưa bạn lắng nghe giai thoại Công tử Bạc Liêu và bản Dạ cổ hoài lang bất hủ của cố nhạc sĩ Cao Văn Lầu.',
  'Hoàng Sa':
    'Quần đảo Hoàng Sa là máu thịt thiêng liêng không thể tách rời của Tổ quốc Việt Nam giữa Biển Đông mênh mông, trực thuộc thành phố Đà Nẵng. Từ nhiều thế kỷ trước, các đội Hoàng Sa kiêm quản Bắc Hải đã vâng mệnh triều đình vượt sóng gió ra cắm mốc, dựng bia chủ quyền và khai thác sản vật biển đảo. Những tư liệu lịch sử, châu bản triều Nguyễn và lễ Khao lề thế lính Hoàng Sa là minh chứng bất diệt cho chủ quyền biển đảo Việt Nam.',
  'Trường Sa':
    'Quần đảo Trường Sa là pháo đài tiền tiêu thiêng liêng của Tổ quốc Việt Nam nơi đầu sóng ngọn gió, trực thuộc tỉnh Khánh Hòa. Nơi đây có cột mốc chủ quyền uy nghiêm, những ngôi chùa Việt cổ kính ngân vang tiếng chuông giữa đại dương và những hàng cây bàng vuông kiên cường trước bão tố. Trường Sa mãi mãi là biểu tượng của ý chí bất khuất và tình yêu biển đảo quê hương trong trái tim mỗi người dân đất Việt.',
};

export const HERITAGE_INTROS: Record<string, string> = {
  'hoang-thanh-thang-long':
    'Chào mừng bạn đến với Hoàng thành Thăng Long, quần thể di tích gắn liền với lịch sử kinh thành Thăng Long Hà Nội suốt hơn một thiên niên kỷ. Được xây dựng từ thế kỷ thứ mười một dưới triều Lý và mở rộng qua các thời Trần, Lê, Nguyễn, nơi đây là trung tâm quyền lực chính trị liên tục lâu đời nhất Việt Nam. Năm hai nghìn không trăm mười, Khu trung tâm Hoàng thành Thăng Long đã được UNESCO vinh danh là Di sản Văn hóa Thế giới.',
  'van-mieu-quoc-tu-giam':
    'Xin giới thiệu với bạn Văn Miếu Quốc Tử Giám, trường đại học quốc gia đầu tiên của Việt Nam được xây dựng từ năm một nghìn không trăm bảy mươi dưới triều vua Lý Thánh Tông. Nơi đây lưu giữ tám mươi hai tấm Bia Tiến sĩ khắc tên những bậc hiền tài khoa bảng, đã được UNESCO công nhận là Di sản Tư liệu Thế giới. Khuê Văn Các cổ kính giữa hồ Văn phẳng lặng chính là biểu tượng cao đẹp cho truyền thống hiếu học và tôn sư trọng đạo của dân tộc.',
  'vinh-ha-long':
    'Chào mừng bạn chiêm ngưỡng Vịnh Hạ Long, kỳ quan thiên nhiên thế giới tại tỉnh Quảng Ninh với gần hai nghìn hòn đảo đá vôi muôn hình vạn trạng. Trải qua hàng trăm triệu năm kiến tạo địa chất, nơi đây sở hữu những hang động thạch nhũ tráng lệ như hang Sửng Sốt, động Thiên Cung cùng hệ sinh thái biển đảo phong phú. Vịnh Hạ Long cũng là cái nôi của nền văn hóa Cái Bèo, Hạ Long cổ xưa và gắn liền với truyền thuyết Rồng mẹ hạ giới giữ nước.',
  'trang-an-ninh-binh':
    'Xin chào bạn đến với Quần thể Danh thắng Tràng An tại Ninh Bình, Di sản Văn hóa và Thiên nhiên Thế giới kép đầu tiên của khu vực Đông Nam Á. Ngồi trên thuyền nan lướt nhẹ qua dòng nước trong vắt, bạn sẽ đi xuyên qua các hang động đá vôi kỳ ảo và ghé thăm những đền đài cổ kính từ thời Đinh, Tiền Lê. Cảnh sắc non nước hữu tình nơi đây hòa quyện tuyệt mỹ với di tích Cố đô Hoa Lư ngàn năm tuổi.',
  'dai-noi-hue':
    'Chào mừng bạn bước vào Đại Nội Huế, trái tim của Quần thể Di tích Cố đô Huế được xây dựng từ đầu thế kỷ mười chín dưới triều vua Gia Long và Minh Mạng. Công trình nổi bật với cổng Ngọ Môn uy nghi, điện Thái Hòa lộng lẫy và Tử Cấm Thành được quy hoạch chuẩn mực theo triết lý phương Đông và nghệ thuật kiến trúc cung đình Việt Nam. Đây là di sản văn hóa đầu tiên của Việt Nam được UNESCO ghi danh vào danh sách Di sản Thế giới năm một nghìn chín trăm chín mươi ba.',
  'pho-co-hoi-an':
    'Xin chào bạn đến với Phố cổ Hội An, thương cảng quốc tế sầm uất bậc nhất Đông Nam Á từ thế kỷ mười sáu đến thế kỷ mười bảy. Nơi đây vẫn bảo tồn nguyên vẹn hàng trăm ngôi nhà cổ mái ngói âm dương phủ rêu phong, các hội quán華 kiến trúc tinh xảo và biểu tượng Chùa Cầu hơn bốn trăm năm tuổi. Khi màn đêm buông xuống, hàng ngàn chiếc đèn lồng rực rỡ cùng hoa đăng trên dòng sông Hoài tạo nên khung cảnh cổ tích đầy mê hoặc.',
  'thanh-dia-my-son':
    'Chào mừng bạn khám phá Khu đền tháp Mỹ Sơn, thánh địa Ấn Độ giáo quan trọng bậc nhất của vương quốc Chăm Pa cổ đại suốt từ thế kỷ thứ tư đến thế kỷ mười ba. Nằm ẩn mình trong thung lũng xanh kín đáo được bao bọc bởi núi non hùng vĩ, Mỹ Sơn quy tụ hơn bảy mươi công trình đền tháp gạch nung với kỹ thuật xây dựng và chạm khắc phù điêu đầy bí ẩn. Quần thể kiến trúc độc đáo này đã được UNESCO công nhận là Di sản Văn hóa Thế giới năm một nghìn chín trăm chín mươi chín.',
  'dinh-doc-lap':
    'Xin giới thiệu với bạn Dinh Độc Lập, Di tích Quốc gia đặc biệt nằm ngay trung tâm Thành phố Hồ Chí Minh, gắn liền với thời khắc lịch sử thống nhất đất nước ngày ba mươi tháng tư năm một nghìn chín trăm bảy mươi lăm. Công trình do kiến trúc sư Ngô Viết Thụ thiết kế, kết hợp hài hòa giữa kiến trúc hiện đại phương Tây và triết lý phong thủy phương Đông qua bức rèm hoa đá hình đốt trúc thanh thoát. Tham quan các phòng khánh tiết và hầm chỉ huy kiên cố bên dưới, bạn sẽ hiểu thêm về một giai đoạn lịch sử trọng đại của dân tộc.',
  'dia-dao-cu-chi':
    'Chào mừng bạn đến với Địa đạo Củ Chi, kỳ quan quân sự dưới lòng đất dài hơn hai trăm năm mươi ki-lô-mét tại vùng đất thép Thành phố Hồ Chí Minh. Hệ thống đường hầm nhiều tầng đan xen như mạng nhện được đào hoàn toàn bằng dụng cụ thô sơ, có đầy đủ phòng họp, bếp Hoàng Cầm giấu khói và trạm quân y. Công trình là biểu tượng sống động cho trí thông minh, sức sáng tạo và ý chí kiên cường bất khuất của quân dân Việt Nam.',
  'cho-noi-cai-rang':
    'Xin chào bạn đến với Chợ nổi Cái Răng tại Cần Thơ, nét văn hóa giao thương trên sông đặc sắc nhất vùng Đồng bằng sông Cửu Long đã được công nhận là Di sản Văn hóa Phi vật thể Quốc gia. Từ tờ mờ sáng, hàng trăm ghe thuyền chở đầy trái cây miệt vườn tụ họp, treo nông sản lên cây bẹo trước mũi ghe để chào mời khách thương hồ. Thưởng thức một tô bún riêu hay ly cà phê sữa đá ngay trên sóng nước bồng bềnh là trải nghiệm miền Tây không thể nào quên.',
};

/**
 * Lấy nội dung thuyết minh 3–5 câu (~30–45 giây) cho Tỉnh/Thành phố hoặc Quần đảo.
 */
export function getProvinceIntroText(
  provinceName: string,
  descriptionFallback?: string,
  heritageCount?: number
): string {
  const cleanName = (provinceName || '').trim();
  if (PROVINCE_INTROS[cleanName]) {
    return PROVINCE_INTROS[cleanName];
  }

  for (const [key, text] of Object.entries(PROVINCE_INTROS)) {
    if (cleanName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanName.toLowerCase())) {
      return text;
    }
  }

  const countSentence =
    typeof heritageCount === 'number' && heritageCount > 0
      ? `Hiện vùng đất này đang lưu giữ ${heritageCount} điểm di sản văn hóa, lịch sử và danh thắng tiêu biểu trên bản đồ Hồn Đất Việt.`
      : 'Vùng đất này lưu giữ nhiều di tích lịch sử, lễ hội truyền thống và danh thắng thiên nhiên đặc sắc.';

  return `Chào mừng bạn đến với ${cleanName}, một vùng đất giàu truyền thống lịch sử và bản sắc văn hóa của dải đất hình chữ S Việt Nam. ${
    descriptionFallback || ''
  } ${countSentence} Hãy chạm vào từng điểm di sản bên dưới để khám phá câu chuyện ngàn năm của vùng đất này nhé!`.replace(
    /\s+/g,
    ' '
  ).trim();
}

/**
 * Lấy nội dung thuyết minh 3–5 câu (~30–45 giây) cho một Di sản cụ thể.
 * Ưu tiên: `heritage.intro` -> `HERITAGE_INTROS[heritage.id]` -> tổng hợp từ dữ liệu tĩnh có sẵn.
 */
export function getHeritageIntroText(heritage: HeritageItem): string {
  if (heritage.intro && heritage.intro.trim().length > 20) {
    return heritage.intro.trim();
  }

  if (HERITAGE_INTROS[heritage.id]) {
    return HERITAGE_INTROS[heritage.id];
  }

  // Tạo đoạn giới thiệu 3–5 câu từ dữ liệu tĩnh của di sản (không gọi AI)
  const name = heritage.name;
  const province = heritage.province || heritage.address || 'Việt Nam';
  const period = heritage.period ? `có niên đại từ thời kỳ ${heritage.period}` : 'mang bề dày lịch sử lâu đời';
  const sig = (heritage.culturalSignificance || '').trim();
  const hist = (heritage.history || '').trim();

  // Lấy tối đa 2 câu đầu của history để giữ thời lượng 30–45 giây
  const histSentences = hist
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(' ');

  return `Xin giới thiệu với bạn ${name}, một ${heritage.categoryLabel?.toLowerCase() || 'di sản tiêu biểu'} tọa lạc tại ${province}, ${period}. ${sig} ${histSentences}`.replace(
    /\s+/g,
    ' '
  ).trim();
}
