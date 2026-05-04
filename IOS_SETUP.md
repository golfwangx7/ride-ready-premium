# Rydr — iOS (Capacitor) Setup

This project is wrapped as a Capacitor shell that loads the published Lovable
app inside an iOS WebView. You need a **Mac with Xcode 15+** and Node 18+.

## 1. Clone the repo locally and install deps

```bash
git clone <your-repo-url> rydr
cd rydr
npm install
npm install @capacitor/core @capacitor/cli @capacitor/ios
```

## 2. Add the iOS platform

```bash
npx cap add ios
npx cap sync ios
```

This generates an `ios/` folder containing the Xcode project.

## 3. Open in Xcode

```bash
npx cap open ios
```

In Xcode:

1. Select the **App** target → **Signing & Capabilities** → choose your Apple Developer team.
2. Pick a simulator or a connected device.
3. Press ▶ Run.

## 4. Updating the app

Because `capacitor.config.ts` points `server.url` at
`https://ride-luxe-canvas.lovable.app`, **any change you publish on Lovable is
instantly live in the iOS app** — no rebuild needed.

If you ever want to ship a fully offline version, replace the `server.url`
config with a real static build (`webDir: "dist"`) and re-run `npx cap sync ios`.

## 5. Custom domain (optional)

After connecting a custom domain in Lovable, update `server.url` in
`capacitor.config.ts` and run `npx cap sync ios`.

## 6. App Store submission notes

- Set the bundle id, app name, version, and icons in Xcode (`App/App/Assets.xcassets`).
- Add `NSLocationWhenInUseUsageDescription` to `ios/App/App/Info.plist` if you use ride tracking with GPS.
- Apple may reject pure WebView wrappers — make sure the app has clear native value (offline cache, push, location, etc.) before submitting.
