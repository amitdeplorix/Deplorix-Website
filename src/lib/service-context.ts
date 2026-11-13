/**
 * Tracks the service / division the visitor is currently looking at so the
 * persistent contact CTA can carry that context into the enquiry form.
 */
import { useEffect, useState } from "react";

export type ServiceContext = {
  divisionId: string;
  service?: string;
};

const EVENT = "deplorix:service-context";

let current: ServiceContext = { divisionId: "" };

export const setServiceContext = (ctx: ServiceContext) => {
  if (current.divisionId === ctx.divisionId && current.service === ctx.service) return;
  current = ctx;
  window.dispatchEvent(new CustomEvent<ServiceContext>(EVENT, { detail: ctx }));
};

export const getServiceContext = () => current;

export const useServiceContext = () => {
  const [ctx, setCtx] = useState<ServiceContext>(current);

  useEffect(() => {
    const handler = (e: Event) => setCtx((e as CustomEvent<ServiceContext>).detail);
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return ctx;
};
