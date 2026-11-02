/**
 * Lightweight analytics layer.
 *
 * Events are pushed to `window.dataLayer` (GTM-compatible) and forwarded to
 * `window.gtag` when present. In development every event is logged so the
 * instrumentation can be verified from the browser console.
 */

import { getServiceContext, setServiceContext } from "./service-context";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "division_selector_click"
  | "proof_block_cta_click"
  | "case_study_view"
  | "inquiry_form_submit"
  | "hero_phone_division_click"
  | "hero_phone_work_click"
  | "hero_phone_cta_click"
  | "advisor_generate"
  | "advisor_result"
  | "advisor_send_request"
  | "advisor_work_click"
  | "sticky_cta_click";

export const trackEvent = (event: AnalyticsEvent, payload: AnalyticsPayload = {}) => {
  if (typeof window === "undefined") return;

  // Any interaction tied to a division updates the persistent contact context.
  const division = payload.division;
  if (typeof division === "string" && division !== getServiceContext().divisionId) {
    setServiceContext({ divisionId: division });
  }

  const data: AnalyticsPayload = {
    event,
    source_page: window.location.pathname,
    ...payload,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
  window.gtag?.("event", event, data);

  if (import.meta.env.DEV) {
    console.info("[analytics]", event, data);
  }
};
