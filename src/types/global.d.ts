export {};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    google_tag_manager?: Record<string, unknown>;
  }
}
