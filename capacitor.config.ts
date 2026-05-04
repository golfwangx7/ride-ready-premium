import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.rydr",
  appName: "Rydr",
  webDir: "www",
  server: {
    // Loads the published Lovable app inside the iOS WebView.
    // Change this to your custom domain once it's connected.
    url: "https://ride-luxe-canvas.lovable.app",
    cleartext: false,
  },
  ios: {
    contentInset: "always",
  },
};

export default config;
