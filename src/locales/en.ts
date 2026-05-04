// English (base) locale. Add new keys here first; other locales fall back to en.
const en = {
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
  "profile.empty_title": "No vehicles yet",
  "profile.empty_subtitle": "Add your first vehicle to start tracking rides",
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
} as const;

export default en;
export type TranslationKey = keyof typeof en;
