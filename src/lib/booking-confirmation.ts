const STORAGE_PREFIX = "motherhood-vlp-booking-ref:";

type BookingConfirmation = { requestId: string; name: string };

const consumedConfirmations = new Map<string, BookingConfirmation>();

export function bookingConfirmationKey(slug: string) {
  return `${STORAGE_PREFIX}${slug}`;
}

export function saveBookingConfirmation(slug: string, data: BookingConfirmation) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(bookingConfirmationKey(slug), JSON.stringify(data));
}

function parseStored(value: string): BookingConfirmation | null {
  try {
    const parsed = JSON.parse(value);
    if (parsed.requestId?.trim() && parsed.name?.trim()) {
      return { requestId: parsed.requestId.trim(), name: parsed.name.trim() };
    }
  } catch {
    // Legacy plain request id string.
  }

  const legacy = value.trim();
  if (!legacy) return null;
  return { requestId: legacy, name: "there" };
}

function readBookingConfirmation(slug: string) {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(bookingConfirmationKey(slug));
  if (!value) return null;
  return parseStored(value);
}

export function consumeBookingConfirmation(slug: string) {
  if (typeof window === "undefined") return null;

  const cached = consumedConfirmations.get(slug);
  if (cached) return cached;

  const value = readBookingConfirmation(slug);
  if (!value) return null;

  consumedConfirmations.set(slug, value);
  return value;
}

export function personalizeBookingText(text: string, name: string) {
  const displayName = name.trim() || "there";
  return text.replace(/\{name\}/gi, displayName);
}