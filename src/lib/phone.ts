export function normalizeIndianMobile(phone: string | number | null | undefined) {
  if (phone == null) return "";

  let digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  return digits;
}

export function isValidIndianMobile(phone: string | number | null | undefined) {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(phone));
}
