// Short introductions are editorial summaries. Grave locations remain in famous-graves-data.ts.
// Sources checked 2026-11-13 (JST); do not present this as a new grave-location verification.
export const FAMOUS_PROFILES: Record<string, { description: string; source: string }> = {
  江戸川乱歩: {
    description: '明智小五郎や少年探偵団シリーズで知られる推理作家。',
    source: 'https://www.ndl.go.jp/portrait/datas/4128/',
  },
  岡本太郎: {
    description: '「太陽の塔」を制作した芸術家。',
    source: 'https://taiyounotou-expo70.jp/about/',
  },
  北原白秋: {
    description: '「この道」「待ちぼうけ」などの作詞で知られる詩人。',
    source: 'https://www.hakushu.or.jp/douyou.html',
  },
  菊池寛: {
    description: '「父帰る」の作者。文藝春秋を創刊し、芥川賞・直木賞を創設。',
    source: 'https://www.ndl.go.jp/portrait/datas/4281/index.html',
  },
  西園寺公望: {
    description: '明治・大正期に首相を務め、最後の元老として知られる政治家。',
    source: 'https://www.ndl.go.jp/portrait/datas/84/',
  },
  高橋是清: {
    description: '首相や大蔵大臣を歴任。「高橋財政」と呼ばれる積極的な財政政策で知られる。',
    source: 'https://www.ndl.go.jp/portrait/datas/122/index.html',
  },
  朝永振一郎: {
    description: '量子電磁力学の研究でノーベル物理学賞を受賞した物理学者。',
    source: 'https://www.nobelprize.org/prizes/physics/1965/summary/',
  },
  中島敦: {
    description: '教科書でも親しまれる「山月記」の作者。',
    source: 'https://www.kanabun.or.jp/exhibition/project/2446/',
  },
  新渡戸稲造: {
    description: '「武士道」の著者。東京女子大学の初代学長を務めた教育者。',
    source: 'https://www.ndl.go.jp/portrait/datas/311/',
  },
  堀辰雄: {
    description: '「風立ちぬ」「美しい村」などを著した小説家。',
    source: 'https://www.town.karuizawa.lg.jp/uploaded/attachment/3137.pdf',
  },
  向田邦子: {
    description: '「父の詫び状」などで知られる作家・脚本家。',
    source: 'https://www.k-kb.or.jp/kinmeru/about-literature/',
  },
  美濃部達吉: {
    description: '天皇機関説で知られる憲法学者。',
    source: 'https://www.ndl.go.jp/modern/cha4/description04.html',
  },
  山本五十六: {
    description: '太平洋戦争時の連合艦隊司令長官。',
    source:
      'https://n-story.jp/localculture/%E5%B1%B1%E6%9C%AC%E4%BA%94%E5%8D%81%E5%85%AD%E8%A8%98%E5%BF%B5%E9%A4%A8/',
  },
  与謝野晶子: {
    description: '歌集「みだれ髪」や「君死にたまふことなかれ」で知られる歌人。',
    source: 'https://www.ndl.go.jp/portrait/datas/347',
  },
  吉川英治: {
    description: '「宮本武蔵」「新・平家物語」などを著した小説家。',
    source: 'https://www.city.ome.tokyo.jp/site/provincial-history-museum/77648.html',
  },
  米窪満亮: {
    description: '労働組合運動に携わり、片山内閣で初代労働大臣を務めた政治家。',
    source: 'https://www.jacar.go.jp/exhibition/glossary/term1/0110-0010-0090-0020-0010.html',
  },
  渡辺錠太郎: {
    description: '陸軍大将。教育総監を務め、二・二六事件で命を落とした。',
    source: 'https://apec.aichi-c.ed.jp/kyouka/shakai/kyouzai/2018/syakai/owari/owa124.htm',
  },
};
export const FAMOUS_PICKS: Record<string, string[]> = {
  ア: ['江戸川乱歩', '岡本太郎'],
  カ: ['北原白秋', '菊池寛'],
  サ: ['西園寺公望'],
  タ: ['高橋是清', '朝永振一郎'],
  ナ: ['中島敦', '新渡戸稲造'],
  ハ: ['堀辰雄'],
  マ: ['向田邦子', '美濃部達吉'],
  ヤ: ['与謝野晶子', '吉川英治', '山本五十六'],
  ワ: ['米窪満亮', '渡辺錠太郎'],
};
export const compactName = (name: string): string => name.replace(/\s/g, '');
