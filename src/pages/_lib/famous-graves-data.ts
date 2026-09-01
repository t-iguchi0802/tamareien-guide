/**
 * 多磨霊園 著名人墓所一覧（公式一次資料からの構造化データ）。
 *
 * 出典: 公益財団法人東京都公園協会「東京都多磨霊園案内図」2ページ目の
 * 「■著名人墓所」表（氏名・主要経歴・区・種・側・番）。URLは
 * src/pages/_lib/guide-sources.ts の tamaMapPdf と同じ
 * （https://www.tokyo-park.or.jp/reien/tama/index.html に現在掲載されている
 * 「園内マップ（日本語）」PDFで、2026-09-01時点の最新版は発行R8.6）。
 *
 * 確認方法（2026-09-01）: この実行環境ではPDFビューアが使えないため、
 * 公式サイトから取得したPDFをPythonのPyMuPDFライブラリでテキスト・
 * 単語座標を抽出するプログラムを組んで機械的に読み取った（本文の目視転記は
 * 行っていない）。また、同じ表を含む1世代前の版（発行R7.4、2026-09-01時点で
 * 既にキャッシュされていたもの）でも同じ手順で抽出し、両者を機械的に突き合わせた。
 * 差分は以下の2件のみで、他141名は区・種・側・番を含めて完全に一致した。
 * - 馬場鍈一: 両版ともPDF内の埋め込みフォントの不具合で氏名の「鍈」の字が
 *   テキスト抽出時に欠落する（画像としては正しく表示されるが、コピー可能な
 *   文字データとしては失われている）。現職（大蔵大臣・内務大臣、1936〜37年）と
 *   区10という一致から本人と特定し、複数の独立した公開情報（Wikipedia
 *   「馬場鍈一」、墓所・銅像を記録した第三者サイト）で区10という記載を
 *   確認したうえで「馬場(姓)鍈一(名)」の氏名で補って掲載している
 *   （下記データのnameフィールドでは公式PDFの表記どおり全角スペース区切り）。
 * - 中島知久平: 番が1世代前の版では「3」、現行版（R8.6）では「3-2」。
 *   現在公式サイトに掲載されている最新版の表記を採用し「3-2」とした。
 *
 * 掲載対象の選定方針（ミチの全体校正・指摘1対応）: このページに載せる人物は
 * Claude独自の「有名度」判断では選ばず、公式PDFの当該表に掲載されている
 * 全員（143名、2026-09-01時点の現行版で確認）をそのまま収録している
 * （一部を抜粋・取捨選択していない）。
 *
 * 表記について:
 * - name・career（主要経歴）は公式PDFの表記をそのまま用いている（当サイトによる
 *   経歴の要約・創作はしていない）。全角スペースは氏名内の姓名区切りの表記を再現。
 * - block（区）・section（種）・side（側）・number（番）も公式PDFの表記のまま。
 *   区が「特」（特別区画）の場合は文字列のまま保持する。番に枝番（例:「8-2」）が
 *   ある場合もPDFの表記どおり文字列で保持する。
 * - kana は、公式PDF表内の五十音インデックス（ア・カ・サ・タ・ナ・ハ・マ・ヤ・ワ）を
 *   そのまま保持したもの。当サイト独自の分類ではない。
 */
export interface FamousGraveEntry {
  /** 五十音インデックス（公式PDF表記のまま） */
  kana: string;
  /** 氏名（公式PDF表記のまま） */
  name: string;
  /** 主要経歴（公式PDF表記のまま、当サイトによる要約・創作なし） */
  career: string;
  /** 区 */
  block: string;
  /** 種 */
  section: string;
  /** 側 */
  side: string;
  /** 番（枝番を含む場合がある） */
  number: string;
}

export const FAMOUS_GRAVES: FamousGraveEntry[] = [
  { kana: 'ア', name: '赤塚　自得', career: '蒔絵師', block: '11', section: '1', side: '25', number: '28' },
  { kana: 'ア', name: '浅沼稲次郎', career: '政治家', block: '18', section: '1', side: '3', number: '12' },
  { kana: 'ア', name: '東　龍太郎', career: '都知事', block: '16', section: '1', side: '13', number: '17' },
  { kana: 'ア', name: '阿南　惟幾', career: '陸相', block: '13', section: '1', side: '25', number: '5' },
  { kana: 'ア', name: '阿部真之助', career: '評論家', block: '20', section: '1', side: '52', number: '14' },
  { kana: 'ア', name: '天野　為之', career: '経済学者', block: '9', section: '1', side: '9', number: '1' },
  { kana: 'ア', name: '鮎川　義介', career: '実業家', block: '10', section: '1', side: '7', number: '1' },
  { kana: 'ア', name: '有島　武郎', career: '作家', block: '10', section: '1', side: '3', number: '10' },
  { kana: 'ア', name: '有田　八郎', career: '外相', block: '9', section: '1', side: '1', number: '2' },
  { kana: 'ア', name: '石坂　泰三', career: '実業家', block: '13', section: '1', side: '1', number: '9' },
  { kana: 'ア', name: '石坂洋次郎', career: '作家', block: '21', section: '1', side: '1', number: '1' },
  { kana: 'ア', name: '石渡荘太郎', career: '蔵相', block: '11', section: '1', side: '10', number: '2' },
  { kana: 'ア', name: '井上　成美', career: '海軍大将', block: '21', section: '1', side: '3', number: '18' },
  { kana: 'ア', name: '井下　　清', career: '行政ランドスケーププランナー', block: '8', section: '1', side: '18', number: '18' },
  { kana: 'ア', name: '巌谷　小波', career: '俳人、童話作家', block: '12', section: '1', side: '2', number: '18' },
  { kana: 'ア', name: '岩谷　莫哀', career: '歌人', block: '2', section: '1', side: '2', number: '19' },
  { kana: 'ア', name: '上田貞次郎', career: '東京商大学長', block: '19', section: '1', side: '10', number: '3' },
  { kana: 'ア', name: '上原　　謙', career: '俳優', block: '2', section: '2', side: '11', number: '2' },
  { kana: 'ア', name: '植村　　環', career: '宗教家', block: '1', section: '1', side: '1', number: '8' },
  { kana: 'ア', name: '宇垣　一成', career: '陸・外相', block: '6', section: '1', side: '12', number: '1' },
  { kana: 'ア', name: '内田　康哉', career: '外相', block: '11', section: '1', side: '1', number: '6' },
  { kana: 'ア', name: '内田　魯庵', career: '評論家', block: '12', section: '2', side: '1', number: '1' },
  { kana: 'ア', name: '内村　鑑三', career: '宗教家', block: '8', section: '1', side: '16', number: '29' },
  { kana: 'ア', name: '梅原龍三郎', career: '洋画家', block: '5', section: '1', side: '7', number: '43' },
  { kana: 'ア', name: '海野　十三', career: 'SF作家', block: '4', section: '1', side: '25', number: '11' },
  { kana: 'ア', name: '江戸川乱歩', career: '探偵小説作家', block: '26', section: '1', side: '17', number: '6' },
  { kana: 'ア', name: '海老名弾正', career: '同志社大総長', block: '12', section: '1', side: '7', number: '18' },
  { kana: 'ア', name: '大内　兵衛', career: '経済学者', block: '6', section: '1', side: '11', number: '11' },
  { kana: 'ア', name: '大岡　昇平', career: '作家', block: '7', section: '2', side: '13', number: '22' },
  { kana: 'ア', name: '大川　　博', career: '実業家', block: '15', section: '1', side: '2', number: '14' },
  { kana: 'ア', name: '大賀　一郎', career: '植物学者', block: '20', section: '1', side: '33', number: '15' },
  { kana: 'ア', name: '大久保一翁', career: '東京府知事', block: '11', section: '1', side: '2', number: '3' },
  { kana: 'ア', name: '太田　耕造', career: '亜細亜大学長', block: '22', section: '1', side: '44', number: '17' },
  { kana: 'ア', name: '大辻　司郎', career: '活動弁士', block: '20', section: '1', side: '20', number: '1' },
  { kana: 'ア', name: '大平　正芳', career: '首相', block: '9', section: '1', side: '1', number: '15' },
  { kana: 'ア', name: '尾崎　秀実', career: '評論家', block: '10', section: '1', side: '13', number: '5' },
  { kana: 'ア', name: '岡田　啓介', career: '首相', block: '9', section: '1', side: '9', number: '3' },
  { kana: 'ア', name: '岡田　嘉子', career: '女優、演出家', block: '6', section: '1', side: '7', number: '53' },
  { kana: 'ア', name: '岡本　一平', career: '漫画・洋画家', block: '16', section: '1', side: '17', number: '3' },
  { kana: 'ア', name: '岡本かの子', career: '歌人、小説家', block: '16', section: '1', side: '17', number: '3' },
  { kana: 'ア', name: '岡本　太郎', career: '画家・彫刻家', block: '16', section: '1', side: '17', number: '3' },
  { kana: 'ア', name: '小熊　秀雄', career: '詩人', block: '24', section: '1', side: '68', number: '32' },
  { kana: 'ア', name: '尾上　柴舟', career: '歌人、書家', block: '6', section: '1', side: '16', number: '23' },
  { kana: 'カ', name: '貝谷八百子', career: 'バレリーナ', block: '21', section: '1', side: '10', number: '8-2' },
  { kana: 'カ', name: '賀川　豊彦', career: '宗教家', block: '3', section: '1', side: '24', number: '15' },
  { kana: 'カ', name: '加藤　建夫', career: '隼戦闘機隊長', block: '20', section: '1', side: '12', number: '19' },
  { kana: 'カ', name: '上司　小剣', career: '作家', block: '4', section: '1', side: '57', number: '35' },
  { kana: 'カ', name: '賀屋　興宣', career: '政治家', block: '9', section: '1', side: '1', number: '8-2' },
  { kana: 'カ', name: '川合　玉堂', career: '日本画家', block: '2', section: '1', side: '13', number: '8' },
  { kana: 'カ', name: '川田　晴久', career: '俳優・歌手', block: '10', section: '1', side: '13', number: '8-1' },
  { kana: 'カ', name: '川路　柳虹', career: '詩人', block: '10', section: '1', side: '14', number: '12' },
  { kana: 'カ', name: '木々高太郎', career: '作家', block: '10', section: '1', side: '6', number: '3' },
  { kana: 'カ', name: '菊池　　寛', career: '作家、劇作家', block: '14', section: '1', side: '6', number: '1' },
  { kana: 'カ', name: '岸田　国士', career: '劇作家', block: '18', section: '1', side: '10', number: '1' },
  { kana: 'カ', name: '岸田　劉生', career: '洋画家', block: '12', section: '1', side: '11', number: '11' },
  { kana: 'カ', name: '北原　白秋', career: '詩人、歌人', block: '10', section: '1', side: '2', number: '6' },
  { kana: 'カ', name: '木下杢太郎', career: '詩人', block: '16', section: '1', side: '12', number: '3' },
  { kana: 'カ', name: '木村　　栄', career: '天文学者', block: '23', section: '1', side: '22', number: '7' },
  { kana: 'カ', name: '楠山　正雄', career: '児童文学者', block: '3', section: '1', side: '32', number: '17' },
  { kana: 'カ', name: '久保　天随', career: '漢詩人', block: '11', section: '1', side: '3', number: '3' },
  { kana: 'カ', name: '倉田　百三', career: '劇作家、評論家', block: '23', section: '1', side: '26', number: '2' },
  { kana: 'カ', name: '小泉　信三', career: '慶応義塾塾長', block: '3', section: '1', side: '17', number: '3' },
  { kana: 'カ', name: '古賀　峯一', career: '海軍元帥', block: '7', section: '特', side: '1', number: '3' },
  { kana: 'カ', name: '児玉源太郎', career: '陸・内相', block: '8', section: '1', side: '17', number: '1' },
  { kana: 'カ', name: '小堀　鞆音', career: '日本画家', block: '7', section: '2', side: '7', number: '1' },
  { kana: 'サ', name: '西園寺公望', career: '首相', block: '8', section: '1', side: '1', number: '16' },
  { kana: 'サ', name: '西郷　従道', career: '陸・海相', block: '10', section: '1', side: '1', number: '1' },
  { kana: 'サ', name: '斉藤　　実', career: '海軍軍人、首相', block: '7', section: '1', side: '2', number: '16' },
  { kana: 'サ', name: '下村　観山', career: '日本画家', block: '3', section: '1', side: '9', number: '5' },
  { kana: 'サ', name: '正田建次郎', career: '数学者', block: '15', section: '1', side: '1', number: '23' },
  { kana: 'サ', name: '新海竹太郎', career: '彫刻家', block: '3', section: '1', side: '34', number: '9' },
  { kana: 'サ', name: 'ゾ　ル　ゲ', career: '新聞記者', block: '17', section: '1', side: '21', number: '16' },
  { kana: 'タ', name: '高木　貞治', career: '数学者', block: '24', section: '1', side: '61', number: '18' },
  { kana: 'タ', name: '高橋　是清', career: '首相・蔵相', block: '8', section: '1', side: '2', number: '16' },
  { kana: 'タ', name: '田中　義一', career: '陸軍軍人、首相', block: '6', section: '1', side: '16', number: '14' },
  { kana: 'タ', name: '田宮　虎彦', career: '作家', block: '26', section: '1', side: '32', number: '13' },
  { kana: 'タ', name: '田山　花袋', career: '作家', block: '12', section: '2', side: '31', number: '24' },
  { kana: 'タ', name: '塚本　　靖', career: '建築・工芸学者', block: '12', section: '1', side: '10', number: '1' },
  { kana: 'タ', name: 'ディックミネ', career: '歌手', block: '11', section: '1', side: '14', number: '17' },
  { kana: 'タ', name: '東郷平八郎', career: '海軍元帥', block: '7', section: '特', side: '1', number: '1' },
  { kana: 'タ', name: '戸川　秋骨', career: '評論家', block: '21', section: '1', side: '24', number: '16' },
  { kana: 'タ', name: '徳川　夢声', career: '芸能家', block: '2', section: '1', side: '7', number: '48' },
  { kana: 'タ', name: '徳田　球一', career: '社会運動家', block: '19', section: '1', side: '31', number: '2' },
  { kana: 'タ', name: '徳富　蘇峰', career: '評論家', block: '6', section: '1', side: '8', number: '13' },
  { kana: 'タ', name: '徳永　　直', career: '作家', block: '19', section: '1', side: '24', number: '17' },
  { kana: 'タ', name: '床次竹次郎', career: '官僚、内相', block: '12', section: '1', side: '17', number: '18' },
  { kana: 'タ', name: '朝永振一郎', career: '理論物理学者', block: '22', section: '1', side: '38', number: '5' },
  { kana: 'ナ', name: '中島　　敦', career: '作家', block: '16', section: '2', side: '33', number: '11' },
  { kana: 'ナ', name: '中島知久平', career: '実業家、政治家', block: '9', section: '1', side: '2', number: '3-2' },
  { kana: 'ナ', name: '中野　正剛', career: '政治家', block: '12', section: '1', side: '1', number: '2' },
  { kana: 'ナ', name: '中村歌右衛門', career: '歌舞伎（5代目）', block: '2', section: '1', side: '13', number: '5' },
  { kana: 'ナ', name: '中村　不折', career: '洋画家', block: '3', section: '1', side: '15', number: '10' },
  { kana: 'ナ', name: '中山　晋平', career: '作曲家', block: '21', section: '1', side: '6', number: '3' },
  { kana: 'ナ', name: '南原　　繁', career: '東大総長', block: '3', section: '2', side: '11', number: '2' },
  { kana: 'ナ', name: '仁科　芳雄', career: '物理学者', block: '22', section: '1', side: '38', number: '5' },
  { kana: 'ナ', name: '新渡戸稲造', career: '東京女子大学長', block: '7', section: '1', side: '5', number: '11' },
  { kana: 'ナ', name: '野村　胡堂', career: '作家', block: '13', section: '1', side: '1', number: '3' },
  { kana: 'ハ', name: '林　銑十郎', career: '首相', block: '16', section: '1', side: '3', number: '5' },
  { kana: 'ハ', name: '馬場　鍈一', career: '蔵相・内相', block: '10', section: '1', side: '7', number: '12' },
  { kana: 'ハ', name: '平賀　　譲', career: '東大総長', block: '23', section: '1', side: '2', number: '15' },
  { kana: 'ハ', name: '平沼騏一郎', career: '首相', block: '10', section: '1', side: '1', number: '15' },
  { kana: 'ハ', name: '平福　百穂', career: '日本画家', block: '5', section: '1', side: '10', number: '15' },
  { kana: 'ハ', name: '藤田　豊八', career: '東洋史家', block: '3', section: '1', side: '34', number: '2' },
  { kana: 'ハ', name: '藤山　雷太', career: '実業家', block: '11', section: '1', side: '2', number: '2' },
  { kana: 'ハ', name: '藤原　咲平', career: '気象学者', block: '18', section: '2', side: '85', number: '17' },
  { kana: 'ハ', name: '舟橋　聖一', career: '作家、劇作家', block: '3', section: '2', side: '6', number: '3' },
  { kana: 'ハ', name: '堀　　辰雄', career: '作家', block: '12', section: '1', side: '3', number: '29' },
  { kana: 'マ', name: '正宗　白鳥', career: '作家', block: '24', section: '1', side: '8', number: '20' },
  { kana: 'マ', name: '前田　多門', career: '政治家', block: '16', section: '1', side: '3', number: '7' },
  { kana: 'マ', name: '前田　夕暮', career: '歌人', block: '12', section: '1', side: '10', number: '21' },
  { kana: 'マ', name: '牧野　虎雄', career: '洋画家', block: '7', section: '2', side: '5', number: '1' },
  { kana: 'マ', name: '松岡　映丘', career: '日本画家', block: '10', section: '1', side: '13', number: '19' },
  { kana: 'マ', name: '満谷国四郎', career: '洋画家', block: '21', section: '2', side: '19', number: '12' },
  { kana: 'マ', name: '水上滝太郎', career: '作家、評論家', block: '5', section: '1', side: '16', number: '6' },
  { kana: 'マ', name: '箕作　麟祥', career: '法律学者', block: '14', section: '1', side: '2', number: '2' },
  { kana: 'マ', name: '美濃部達吉', career: '憲法学者', block: '25', section: '1', side: '24', number: '1' },
  { kana: 'マ', name: '美濃部亮吉', career: '都知事', block: '25', section: '1', side: '24', number: '1' },
  { kana: 'マ', name: '三宅やす子', career: '作家、評論家', block: '8', section: '1', side: '16', number: '34' },
  { kana: 'マ', name: '三好　十郎', career: '詩人、劇作家', block: '18', section: '1', side: '36', number: '22' },
  { kana: 'マ', name: '三好　　学', career: '植物学者', block: '8', section: '1', side: '10', number: '26-2' },
  { kana: 'マ', name: '向田　邦子', career: '作家', block: '12', section: '1', side: '29', number: '52' },
  { kana: 'マ', name: '望月　圭介', career: '逓信・内相', block: '6', section: '1', side: '16', number: '12' },
  { kana: 'マ', name: '望月　優子', career: '女優', block: '23', section: '1', side: '43', number: '4' },
  { kana: 'マ', name: '森　　槐南', career: '漢詩人', block: '14', section: '1', side: '3', number: '3' },
  { kana: 'マ', name: '守田　勘弥', career: '歌舞伎俳優', block: '1', section: '1', side: '6', number: '8' },
  { kana: 'ヤ', name: '矢島　楫子', career: '女子教育者', block: '3', section: '1', side: '1', number: '20' },
  { kana: 'ヤ', name: '安井誠一郎', career: '都知事', block: '2', section: '1', side: '2', number: '37' },
  { kana: 'ヤ', name: '安井　てつ', career: '東京女子大学長', block: '15', section: '1', side: '10', number: '7' },
  { kana: 'ヤ', name: '矢内原忠雄', career: '東大総長', block: '2', section: '2', side: '1', number: '19' },
  { kana: 'ヤ', name: '山崎　直方', career: '地理学者', block: '6', section: '1', side: '2', number: '10' },
  { kana: 'ヤ', name: '山下　奉文', career: '陸軍大将', block: '16', section: '1', side: '8', number: '6' },
  { kana: 'ヤ', name: '山室　軍平', career: '救世軍司令官', block: '15', section: '1', side: '11', number: '1' },
  { kana: 'ヤ', name: '山本五十六', career: '海軍元帥', block: '7', section: '特', side: '1', number: '2' },
  { kana: 'ヤ', name: '横井　時敬', career: '東京農大学長', block: '6', section: '1', side: '12', number: '12' },
  { kana: 'ヤ', name: '横光　利一', career: '作家', block: '4', section: '1', side: '39', number: '16' },
  { kana: 'ヤ', name: '与謝野鉄幹', career: '歌人、詩人', block: '11', section: '1', side: '10', number: '14' },
  { kana: 'ヤ', name: '与謝野晶子', career: '歌人、詩人', block: '11', section: '1', side: '10', number: '14' },
  { kana: 'ヤ', name: '吉岡　弥生', career: '東京女子医大創設', block: '8', section: '1', side: '7', number: '9' },
  { kana: 'ヤ', name: '吉川　英治', career: '作家', block: '20', section: '1', side: '51', number: '5' },
  { kana: 'ヤ', name: '吉田絃二郎', career: '作家', block: '14', section: '1', side: '1', number: '6' },
  { kana: 'ヤ', name: '吉野　作造', career: '政治学者', block: '8', section: '1', side: '13', number: '17' },
  { kana: 'ワ', name: '米窪　満亮', career: '初代労働大臣', block: '15', section: '1', side: '13', number: '7' },
  { kana: 'ワ', name: '渡辺錠太郎', career: '陸軍大将', block: '12', section: '1', side: '10', number: '15' },
];
