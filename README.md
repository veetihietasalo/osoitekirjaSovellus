# osoitekirjaSovellus

An address book app (the name is Finnish for "address book app"). Save addresses to a local SQLite database and tap one to see it on a map.

What it does:
- Saves typed addresses to SQLite (`expo-sqlite`, `addresses.db`)
- Two screens with React Navigation: the address list (`Places.js`) and a map (`MapQuest.js`)
- Tapping an address geocodes it with the MapQuest Geocoding API and shows it on the map with a marker
- Long-pressing the red-bordered box in a row deletes that address

Not finished:
- The code never creates the `addresses` table, so on a fresh install Save fails (the error only goes to the console)
- The list isn't loaded when the app opens, saved addresses show up after the next save or delete

Stack: JavaScript, React Native 0.72, Expo SDK 49, React Navigation 6 (native stack), `expo-sqlite`, `react-native-maps`, `react-native-elements`.

Run it:

```
npm install
npm start
```

`npm start` runs `expo start`. `npm run android` and `npm run ios` are in `package.json` too. The project is on Expo SDK 49, so Expo Go has to be a version that supports SDK 49. Geocoding needs a MapQuest API key, set as `API_KEY` in `MapQuest.js`.

Status: course assignment, mobile programming at a university of applied sciences, October 2023. No tests.
