import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function toCodeFormat(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
}

export function toUpperCaseOnly(value: string): string {
  return value.toUpperCase();
}

export function toAlphaNumericUpper(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function toDigitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export function toTitleCase(value: string): string {
  return value.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

export function toSentenceCase(value: string): string {
  return value.replace(
    /(^\s*\p{L}|[.!?]\s+\p{L})/gu,
    (match) => match.toUpperCase(),
  );
}
