export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export function seasonForMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}
export function seasonInTokyo(date = new Date()): Season {
  return seasonForMonth(
    Number(
      new Intl.DateTimeFormat('en', { timeZone: 'Asia/Tokyo', month: 'numeric' }).format(date),
    ),
  );
}
export const seasonNames: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};
