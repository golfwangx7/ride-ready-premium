// Central locale registry. To add a new language:
//   1. Create src/locales/<code>.ts exporting Partial<Record<TranslationKey, string>>
//   2. Register it below with its display label
// Missing keys automatically fall back to English.
import en, { type TranslationKey } from "./en";
import de from "./de";
import es from "./es";
import fr from "./fr";

export type Dict = Partial<Record<TranslationKey, string>>;

export type LocaleEntry = {
  code: string;
  label: string;
  dict: Dict;
};

export const LOCALES = [
  { code: "en", label: "English", dict: en },
  { code: "de", label: "Deutsch", dict: de },
  { code: "es", label: "Español", dict: es },
  { code: "fr", label: "Français", dict: fr },
] as const satisfies readonly LocaleEntry[];

export type Lang = (typeof LOCALES)[number]["code"];

export const BASE_DICT = en;
export type { TranslationKey };
