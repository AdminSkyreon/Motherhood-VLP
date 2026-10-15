import { analyticsConfig } from "@/lib/analytics-config";

declare global {
  interface Window {
    google_tag_manager?: Record<string, unknown>;
  }
}

export const GTM_LOADER_ID = "gtm-default-loader";

const GTM_IDLE_TIMEOUT_MS = 3000;

function gtmInjectSnippet(gtmId: string): string {
  return `var id=${JSON.stringify(gtmId)};
    var loaderId=${JSON.stringify(GTM_LOADER_ID)};
    if(!id)return;
    window.dataLayer=window.dataLayer||[];
    if(window.google_tag_manager&&window.google_tag_manager[id])return;
    if(document.getElementById(loaderId))return;
    window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var s=document.createElement('script');
    s.id=loaderId;
    s.async=true;
    s.src='https://www.googletagmanager.com/gtm.js?id='+id;
    document.head.appendChild(s);`;
}

/**
 * Inline head snippet: load GTM on idle (3s cap), first interaction, or scroll.
 * Uses the same script id as `ensureGtmLoaded` so thank-you cannot double-inject.
 */
export function gtmDelayedLoaderSnippet(gtmId: string): string {
  return `(function(){
    var done=false;
    function load(){
      if(done)return;
      done=true;
      ${gtmInjectSnippet(gtmId)}
    }
    var evts=['pointerdown','keydown','scroll','touchstart'];
    for(var i=0;i<evts.length;i++){
      addEventListener(evts[i],load,{once:true,passive:true});
    }
    if('requestIdleCallback' in window){
      requestIdleCallback(load,{timeout:${GTM_IDLE_TIMEOUT_MS}});
    }else{
      setTimeout(load,${GTM_IDLE_TIMEOUT_MS});
    }
  })();`;
}

/**
 * Ensure the default GTM container is loaded.
 * Safe on landing and thank-you (after soft nav from the booking form).
 */
export function ensureGtmLoaded(gtmId: string = analyticsConfig.gtmId): void {
  if (typeof window === "undefined" || !gtmId) return;

  window.dataLayer = window.dataLayer || [];

  if (window.google_tag_manager?.[gtmId]) return;
  if (document.getElementById(GTM_LOADER_ID)) return;

  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.id = GTM_LOADER_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(script);
}

/** Resolves when the GTM container is ready, or after timeout (dataLayer still queues). */
export function waitForGtm(gtmId: string = analyticsConfig.gtmId, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.google_tag_manager?.[gtmId]) {
      resolve(true);
      return;
    }

    const started = Date.now();
    const timer = window.setInterval(() => {
      if (window.google_tag_manager?.[gtmId]) {
        window.clearInterval(timer);
        resolve(true);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, 50);
  });
}