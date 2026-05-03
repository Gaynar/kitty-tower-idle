# Capacitor Build Notes

The web app is configured for Capacitor with:

- App name: `Kitty Tower Idle`
- App id: `com.example.kittytoweridle`
- Web directory: `dist`

## Sync Web Build

```bash
npm run build
npx cap sync
```

## Add Native Platforms

Run these once on a machine with the relevant native toolchain installed:

```bash
npx cap add ios
npx cap add android
```

## Open Native Projects

```bash
npx cap open ios
npx cap open android
```

After web changes, run `npm run build && npx cap sync` again before opening Xcode or Android Studio.
