/**
 * `initAnalyticsDispatcher()` をimportの副作用として即時実行する薄いエントリ。
 *
 * ページ側で個別に呼び出し順を意識したくない場合、クライアント側スクリプトから
 * このモジュールをimportするだけでdata-*属性ディスパッチャが有効になる。
 *
 * 使用例（pages/ui-components側。このファイルは変更しない）:
 *
 * ```astro
 * <script>
 *   import '../lib/analytics/autoInit';
 * </script>
 * ```
 *
 * 呼び出し方を明示的に制御したい場合は、代わりに `./dispatcher` の
 * `initAnalyticsDispatcher` を直接importして呼び出してよい。
 *
 * 所有者: feature/seo-analytics（src/lib/analytics/**）
 */

import { initAnalyticsDispatcher } from './dispatcher';

initAnalyticsDispatcher();
