import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "es" | "fr" | "de";

export const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

const STORAGE_KEY = "ride.lang";

type Dict = Record<string, string>;

const en: Dict = {
  // nav
  "nav.home": "Home",
  "nav.feed": "Feed",
  "nav.profile": "Profile",
  // home
  "home.welcome": "Welcome back",
  "home.ready": "Ready for your",
  "home.next_ride": "next ride?",
  "home.start_ride": "Start Ride",
  "home.tap_to_begin": "Tap to begin tracking",
  "home.last_ride": "Last ride",
  "home.view_all": "View all",
  "stat.distance": "Distance",
  "stat.duration": "Duration",
  "stat.top": "Top",
  // profile
  "profile.garage": "Garage",
  "profile.vehicles": "vehicles",
  "profile.add": "Add",
  "profile.add_vehicle": "Add Vehicle",
  // settings
  "settings.title": "Settings",
  "settings.account": "Account",
  "settings.app": "App",
  "settings.subscription": "Subscription",
  "settings.legal": "Legal",
  "settings.danger": "Danger Zone",
  "settings.edit_profile": "Edit profile",
  "settings.change_picture": "Change profile picture",
  "settings.connected_socials": "Connected socials",
  "settings.language": "Language",
  "settings.units": "Units",
  "settings.manage_subscription": "Manage subscription",
  "settings.privacy": "Privacy policy",
  "settings.terms": "Terms of service",
  "settings.reset_data": "Reset data",
  "settings.reset_data_desc": "Clears rides, settings, and cached preferences",
  "settings.delete_account": "Delete account",
  "settings.delete_account_desc": "Permanently remove your account and data",
  "settings.linked_count": "{n} linked",
  "settings.none": "None",
  // common
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.back": "Back",
  "common.edit": "Edit",
  "common.delete": "Delete",
};

const es: Dict = {
  "nav.home": "Inicio",
  "nav.feed": "Feed",
  "nav.profile": "Perfil",
  "home.welcome": "Bienvenido",
  "home.ready": "¿Listo para tu",
  "home.next_ride": "próxima ruta?",
  "home.start_ride": "Iniciar ruta",
  "home.tap_to_begin": "Toca para empezar a registrar",
  "home.last_ride": "Última ruta",
  "home.view_all": "Ver todo",
  "stat.distance": "Distancia",
  "stat.duration": "Duración",
  "stat.top": "Máx.",
  "profile.garage": "Garaje",
  "profile.vehicles": "vehículos",
  "profile.add": "Añadir",
  "profile.add_vehicle": "Añadir vehículo",
  "settings.title": "Ajustes",
  "settings.account": "Cuenta",
  "settings.app": "Aplicación",
  "settings.subscription": "Suscripción",
  "settings.legal": "Legal",
  "settings.danger": "Zona de peligro",
  "settings.edit_profile": "Editar perfil",
  "settings.change_picture": "Cambiar foto de perfil",
  "settings.connected_socials": "Redes vinculadas",
  "settings.language": "Idioma",
  "settings.units": "Unidades",
  "settings.manage_subscription": "Gestionar suscripción",
  "settings.privacy": "Política de privacidad",
  "settings.terms": "Términos del servicio",
  "settings.reset_data": "Restablecer datos",
  "settings.reset_data_desc": "Borra rutas, ajustes y preferencias en caché",
  "settings.delete_account": "Eliminar cuenta",
  "settings.delete_account_desc": "Eliminar tu cuenta y datos permanentemente",
  "settings.linked_count": "{n} vinculadas",
  "settings.none": "Ninguna",
  "common.save": "Guardar",
  "common.cancel": "Cancelar",
  "common.back": "Atrás",
  "common.edit": "Editar",
  "common.delete": "Eliminar",
};

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.feed": "Fil",
  "nav.profile": "Profil",
  "home.welcome": "Bon retour",
  "home.ready": "Prêt pour votre",
  "home.next_ride": "prochaine sortie ?",
  "home.start_ride": "Démarrer",
  "home.tap_to_begin": "Touchez pour commencer",
  "home.last_ride": "Dernière sortie",
  "home.view_all": "Voir tout",
  "stat.distance": "Distance",
  "stat.duration": "Durée",
  "stat.top": "Max",
  "profile.garage": "Garage",
  "profile.vehicles": "véhicules",
  "profile.add": "Ajouter",
  "profile.add_vehicle": "Ajouter un véhicule",
  "settings.title": "Paramètres",
  "settings.account": "Compte",
  "settings.app": "Application",
  "settings.subscription": "Abonnement",
  "settings.legal": "Légal",
  "settings.danger": "Zone sensible",
  "settings.edit_profile": "Modifier le profil",
  "settings.change_picture": "Changer la photo de profil",
  "settings.connected_socials": "Réseaux liés",
  "settings.language": "Langue",
  "settings.units": "Unités",
  "settings.manage_subscription": "Gérer l'abonnement",
  "settings.privacy": "Politique de confidentialité",
  "settings.terms": "Conditions d'utilisation",
  "settings.reset_data": "Réinitialiser les données",
  "settings.reset_data_desc": "Efface les sorties, réglages et préférences",
  "settings.delete_account": "Supprimer le compte",
  "settings.delete_account_desc": "Supprime définitivement votre compte et vos données",
  "settings.linked_count": "{n} liés",
  "settings.none": "Aucun",
  "common.save": "Enregistrer",
  "common.cancel": "Annuler",
  "common.back": "Retour",
  "common.edit": "Modifier",
  "common.delete": "Supprimer",
};

const de: Dict = {
  "nav.home": "Start",
  "nav.feed": "Feed",
  "nav.profile": "Profil",
  "home.welcome": "Willkommen zurück",
  "home.ready": "Bereit für deine",
  "home.next_ride": "nächste Fahrt?",
  "home.start_ride": "Fahrt starten",
  "home.tap_to_begin": "Tippen, um die Aufzeichnung zu starten",
  "home.last_ride": "Letzte Fahrt",
  "home.view_all": "Alle anzeigen",
  "stat.distance": "Distanz",
  "stat.duration": "Dauer",
  "stat.top": "Spitze",
  "profile.garage": "Garage",
  "profile.vehicles": "Fahrzeuge",
  "profile.add": "Hinzufügen",
  "profile.add_vehicle": "Fahrzeug hinzufügen",
  "settings.title": "Einstellungen",
  "settings.account": "Konto",
  "settings.app": "App",
  "settings.subscription": "Abonnement",
  "settings.legal": "Rechtliches",
  "settings.danger": "Gefahrenzone",
  "settings.edit_profile": "Profil bearbeiten",
  "settings.change_picture": "Profilbild ändern",
  "settings.connected_socials": "Verknüpfte Konten",
  "settings.language": "Sprache",
  "settings.units": "Einheiten",
  "settings.manage_subscription": "Abonnement verwalten",
  "settings.privacy": "Datenschutzerklärung",
  "settings.terms": "Nutzungsbedingungen",
  "settings.reset_data": "Daten zurücksetzen",
  "settings.reset_data_desc": "Löscht Fahrten, Einstellungen und gespeicherte Präferenzen",
  "settings.delete_account": "Konto löschen",
  "settings.delete_account_desc": "Konto und Daten endgültig entfernen",
  "settings.linked_count": "{n} verknüpft",
  "settings.none": "Keine",
  "common.save": "Speichern",
  "common.cancel": "Abbrechen",
  "common.back": "Zurück",
  "common.edit": "Bearbeiten",
  "common.delete": "Löschen",
};

const DICTS: Record<Lang, Dict> = { en, es, fr, de };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "es" || saved === "fr" || saved === "de") {
        setLangState(saved);
      } else if (saved) {
        // legacy label migration
        const found = LANG_OPTIONS.find((o) => o.label === saved);
        if (found) setLangState(found.code);
      }
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => {
    const dict = DICTS[lang] ?? en;
    let str = dict[key] ?? en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  }, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
