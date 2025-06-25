# Racket

A mobile app for tennis tournaments, built with React Native and Expo.

## Features

- NativeWind v4
- [React Native Reusables](https://www.reactnativereusables.com)
- Dark and light mode
  - Android Navigation Bar matches mode
  - Persistent mode
- Expo Router
- iBeacons to detect nearby courts
- Cloudflare Workers + D1 based backend

## Installation
This project uses pnpm as the package manager. You can use `yarn` or `pnpm` if you prefer, but you will need to change the scripts in `package.json`.

```bash
pnpm install
```
## Running the project
This project uses `expo` as the development environment. 
Due to the use of `react-native-beacon-radar`, you will need to run the project on a physical device.
> [!NOTE]  
> `expo-dev-client` is already installed when you run `pnpm install`.

Follow the instructions in the Expo documentation to set up your environment.
- [Android](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=physical&mode=development-build&buildEnv=local)
- [iOS](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=physical&mode=development-build&buildEnv=local)

## Running the app
```bash
# iOS
npx expo run:ios --device
# Android
npx expo run:android --device
```

## Structure
The project is structured as follows:

```
/app - Main pages
    - /index.tsx - Main page
    - /[event]/index.tsx - Event page
/components - Reusable UI components
/lib - Utility functions and API integrations
```
