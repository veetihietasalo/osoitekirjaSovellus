# osoitekirjaSovellus

An address book app (the name is Finnish for "address book app"). Save addresses and tap one to see it on a map. Runs on a phone and as a web page.

What it does:
- Saves typed addresses, on a phone to SQLite (`expo-sqlite`, `addresses.db`), on the web to the browser's localStorage. The table is created on first start and the saved list loads when the app opens
- Two screens with React Navigation: the address list (`Places.js`) and a map (`MapQuest.js`)
- Tapping an address geocodes it and shows it on the map with a marker. Geocoding uses MapQuest if `EXPO_PUBLIC_MAPQUEST_KEY` is set, otherwise OpenStreetMap Nominatim, which needs no key
- Long-pressing the red-bordered box in a row deletes that address

Phone and web differ in two files each: `db.js` / `db.web.js` (expo-sqlite has no web support in SDK 49) and `maps.js` / `maps.web.js` (react-native-maps has no web support, the web map is Leaflet with OpenStreetMap tiles).

Stack: JavaScript, React Native 0.72, Expo SDK 49, React Navigation 6 (native stack), `expo-sqlite`, `react-native-maps`, `react-native-elements`, Leaflet 1.9 and react-native-web for the web build.

Run it on a phone:

```
npm install
npm start
```

`npm run android` and `npm run ios` are in `package.json` too. Expo Go from the app stores only runs the latest SDK, so running it on a phone now needs an SDK upgrade first.

MapQuest is optional: copy `.env.example` to `.env` and set `EXPO_PUBLIC_MAPQUEST_KEY` (a key from developer.mapquest.com), then restart with `npx expo start --clear`. `.env` is git-ignored. Expo writes `EXPO_PUBLIC_` values into the JS bundle, so anyone with a build can read the key. Leave it out for a public web build.

Nominatim has a usage policy (https://operations.osmfoundation.org/policies/nominatim/): at most one request per second, the app identified, attribution shown, no search-as-you-type. The app sends one request per opened address, waits if the last one was under a second ago, names itself in the User-Agent on phones, and shows "Search by OpenStreetMap Nominatim, data © OpenStreetMap contributors" under the map.

Web build:

```
npm run build:web     # static site in dist/
npm run deploy:web    # build:web, then push dist/ to the gh-pages branch
```

`build:web` runs `expo export --platform web` and then `scripts/web-relative-paths.js`, which makes the paths relative (SDK 49 has no base URL setting) and writes `.nojekyll`, so the site works from `https://veetihietasalo.github.io/osoitekirjaSovellus/`. `deploy:web` runs `scripts/deploy-web.sh`, which builds the gh-pages branch from `dist/` only and pushes it without force. GitHub Pages has to be set to the gh-pages branch once in the repo settings. To try the build locally, copy `dist/` to `site/osoitekirjaSovellus/`, run `python3 -m http.server -d site` and open `http://localhost:8000/osoitekirjaSovellus/`.

Review, Oct 2026:
- The MapQuest key was hard-coded in `MapQuest.js`. It's revoked and now optional, from `EXPO_PUBLIC_MAPQUEST_KEY`. The old value is still in git history, it's dead.
- Nothing created the `addresses` table, so Save failed on a fresh install. `Places.js` now runs `create table if not exists` on start.
- The list never loaded on open (`shouldUpdate` started false and nothing set it true). It loads once the table is ready.
- Empty addresses are skipped and the input clears after Save.
- The address is URL-encoded in the geocoding URL. "Address not found" and search errors show on the map screen.
- Debug logs that printed the route and every saved row are gone.
- Seven packages the code never imported are removed: axios, react-native-geocoding, react-native-sqlite-storage, @react-native-community/geolocation, @react-navigation/stack, react-navigation 4, react-navigation-stack.

Still open:
- Delete is a long press on an empty red-bordered ListItem nested inside the row. Hard to find, left as it was.
- react-native-screens and react-native-safe-area-context come in only as peers of the native stack, at 3.27.0 and 4.7.4. SDK 49 expects ~3.22.0 and 4.6.3. `npx expo install react-native-screens react-native-safe-area-context` would pin them, not done since we can't test on a device.
- No tests. Not run on a phone or emulator in this review, only bundled with `npx expo export` for Android, iOS and the web. The web build was checked in headless Chromium.
- The dependencies are the 2023 SDK 49 set. `npx expo install --check` wants react-native 0.72.10 (we have 0.72.6) and npm audit lists advisories in that tree. The fix is an SDK upgrade.

Status: course assignment, mobile programming at a university of applied sciences, October 2023. Key moved out, review fixes and web build in October 2026.
