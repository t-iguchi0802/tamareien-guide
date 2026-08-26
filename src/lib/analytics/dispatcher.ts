/**
 * data-*属性から6イベントを拾う汎用クリック/変更ディスパッチャ。
 *
 * ui-components / pages 担当は、要素に以下のようなdata-*属性を付けるだけで
 * このモジュールの実装詳細を知らずに計測を組み込める（疎結合にするための
 * 唯一の統合ポイント）。
 *
 * 共通:
 *   data-event="<AnalyticsEventName>"   … 必須。送信するイベント名。
 *   data-page-path="/sekizaiten/"        … 省略時は `window.location.pathname`。
 *
 * イベント別の追加属性:
 *   business_outbound_click : data-business-id, data-link-type
 *                             (official_site | contact | directory)
 *   business_phone_click    : data-business-id
 *   business_map_click      : data-business-id
 *   comparison_filter_use   : data-filter-type, data-filter-value
 *   official_procedure_click: data-authority, data-topic
 *   correction_request_click: （追加属性なし）
 *
 * 使用例（pages/ui-components側の実装イメージ。このファイルは変更しない）:
 *
 * ```astro
 * <a
 *   href={business.contact.websiteUrl}
 *   data-event="business_outbound_click"
 *   data-business-id={business.id}
 *   data-link-type="official_site"
 * >
 *   公式サイト
 * </a>
 * <script>
 *   import { initAnalyticsDispatcher } from '../lib/analytics/dispatcher';
 *   initAnalyticsDispatcher();
 * </script>
 * ```
 *
 * 絞り込みUIのようにクリック以外（selectのchange等）で発火する場合も、
 * 同じ要素に `data-event="comparison_filter_use"` 等を付けておけば
 * click/changeどちらのイベントでも拾う。
 *
 * 所有者: feature/seo-analytics（src/lib/analytics/**）
 */

import {
  trackBusinessOutboundClick,
  trackBusinessPhoneClick,
  trackBusinessMapClick,
  trackComparisonFilterUse,
  trackOfficialProcedureClick,
  trackCorrectionRequestClick,
} from './events';
import type { AnalyticsEventName, OutboundLinkType } from '../../types/analytics';

const EVENT_ATTR = 'data-event';

const OUTBOUND_LINK_TYPES: readonly OutboundLinkType[] = ['official_site', 'contact', 'directory'];

function isOutboundLinkType(value: string | null): value is OutboundLinkType {
  return value !== null && (OUTBOUND_LINK_TYPES as readonly string[]).includes(value);
}

function resolvePagePath(el: Element): string {
  const override = el.getAttribute('data-page-path');
  if (override) {
    return override;
  }
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '';
}

function dispatchFromElement(el: Element): void {
  const eventName = el.getAttribute(EVENT_ATTR) as AnalyticsEventName | null;
  if (!eventName) {
    return;
  }
  const pagePath = resolvePagePath(el);

  switch (eventName) {
    case 'business_outbound_click': {
      const businessId = el.getAttribute('data-business-id');
      const linkTypeRaw = el.getAttribute('data-link-type');
      if (!businessId || !isOutboundLinkType(linkTypeRaw)) {
        return;
      }
      trackBusinessOutboundClick({
        business_id: businessId,
        link_type: linkTypeRaw,
        page_path: pagePath,
      });
      return;
    }
    case 'business_phone_click': {
      const businessId = el.getAttribute('data-business-id');
      if (!businessId) {
        return;
      }
      trackBusinessPhoneClick({ business_id: businessId, page_path: pagePath });
      return;
    }
    case 'business_map_click': {
      const businessId = el.getAttribute('data-business-id');
      if (!businessId) {
        return;
      }
      trackBusinessMapClick({ business_id: businessId, page_path: pagePath });
      return;
    }
    case 'comparison_filter_use': {
      const filterType = el.getAttribute('data-filter-type');
      const filterValue = el.getAttribute('data-filter-value');
      if (!filterType || !filterValue) {
        return;
      }
      trackComparisonFilterUse({
        filter_type: filterType,
        filter_value: filterValue,
        page_path: pagePath,
      });
      return;
    }
    case 'official_procedure_click': {
      const authority = el.getAttribute('data-authority');
      const topic = el.getAttribute('data-topic');
      if (!authority || !topic) {
        return;
      }
      trackOfficialProcedureClick({ authority, topic, page_path: pagePath });
      return;
    }
    case 'correction_request_click': {
      trackCorrectionRequestClick({ page_path: pagePath });
      return;
    }
    default:
      return;
  }
}

function findTrackableElement(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) {
    return null;
  }
  return target.closest(`[${EVENT_ATTR}]`);
}

let initialized = false;

/**
 * `document`（または指定した親要素）にクリック/変更イベントの委譲リスナーを
 * 1つだけ登録する。`data-event`属性を持つ要素（またはその子孫要素）が
 * クリック・変更されたときに対応するGA4イベントを送信する。
 *
 * ブラウザ環境以外（SSR/ビルド時）では何もしない。二重登録防止のため、
 * 同一モジュールインスタンス内では最初の呼び出しだけが有効になる。
 */
export function initAnalyticsDispatcher(root?: Document | Element): void {
  if (typeof document === 'undefined') {
    return;
  }
  if (initialized) {
    return;
  }
  initialized = true;

  const target: Document | Element = root ?? document;

  target.addEventListener('click', (evt) => {
    const el = findTrackableElement(evt.target);
    if (el) {
      dispatchFromElement(el);
    }
  });

  target.addEventListener('change', (evt) => {
    const el = findTrackableElement(evt.target);
    if (el) {
      dispatchFromElement(el);
    }
  });
}
