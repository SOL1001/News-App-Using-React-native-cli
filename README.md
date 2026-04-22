# AwesomeNews — React Native Pre-Interview Technical Assessment

This repository implements the **React Native Pre-Interview Technical Assessment** brief (React Native CLI news feed, Hacker News API, two core screens + optional bonuses). The README follows the submission format: **setup**, **architecture and trade-offs**, **honest limitations**, **requirement traceability**, and **Section 02 (Q1–Q5)**. The goal is code and prose you can defend in a follow-up interview.

**Ground rules (from the brief):** AI-assisted development is encouraged; the interview focuses on **why** you made decisions, not syntax recall. Be ready to walk through any file and discuss trade-offs.

---

## Technical requirements (brief → this repo)

| Requirement | How it is satisfied |
| ------------- | ------------------- |
| **React Native CLI (not Expo)** | Bare RN project (`react-native` CLI). No Expo SDK or `expo-*` dependencies. |
| **TypeScript throughout; avoid `any` unless justified** | All app and test code is `.ts` / `.tsx`. No `any` / `as any` in source or tests; ESLint uses the React Native TypeScript preset. |
| **Target Android API 30+ & iOS 14+** | **Android:** `compileSdkVersion` / `targetSdkVersion` **36** (satisfies “target API 30+” in the Play / platform sense). **`minSdkVersion` 24** matches the current RN template so the APK installs on common emulators; set `minSdkVersion = 30` in `android/build.gradle` if you need API 30 as the *minimum device* floor. **iOS:** Deployment target from the RN template (**15.1**), which is **≥ 14**. |
| **React Navigation v6+** | `@react-navigation/native` **v7** with native stack and bottom tabs (v6+ line). |
| **Redux Toolkit or Zustand (justify in README)** | **Zustand** for feed + bookmarks; **Zustand `persist` + AsyncStorage** for bookmark durability. Rationale is under [Architecture & state](#architecture--state) and **Section 02 Q4**. |

---

## Setup & run

```bash
npm install
# iOS (first clone or after native dependency changes)
cd ios && bundle exec pod install && cd ..
npm start
# separate terminals:
npm run android
npm run ios
```

**Android note (first clone):** `@react-native-async-storage/async-storage` v3 ships the native artifact `storage-android` in an npm-bundled Maven repo. This repo already adds that repo in `android/build.gradle` so **you should not need manual Gradle edits** after `npm install`.

```bash
npm test        # Jest: unit + RNTL
npm run lint    # ESLint
```

---

## 01 Task — requirement traceability (Hacker News API)

**API (base `https://hacker-news.firebaseio.com/v0/`):**

| Brief | Implementation |
| ----- | -------------- |
| `GET topstories.json`, first **20** IDs | `fetchTopStoryIds()` in `src/features/news/api/hnApi.ts` → `data.slice(0, 20)` |
| `GET item/{id}.json` in **parallel** | `Promise.all(ids.map(...))` in `loadTopStoriesForFeed()` |
| Filter `type === 'story'` and **url** exists | `parseStoryPayload` + `filterValidStories` in `hnApi.ts` / `model/storyUtils.ts` |

**Screen 1 — Article list (`FeedScreen.tsx`, components under `src/features/news/components/`):**

| Brief | Implementation |
| ----- | -------------- |
| `FlatList`: title, **source domain** (from URL), **score**, **relative time** | `ArticleRow.tsx`: `sourceDomainFromUrl` / `faviconUrlForDomain` in `model/domainFromUrl.ts`, Google `s2/favicons` with **“HN”** placeholder on failure, `formatRelativeTime` for list time |
| Pull-to-refresh | `RefreshControl` on the feed `FlatList` |
| Skeleton **or** `ActivityIndicator` on first load | **`FeedSkeleton` only** on first load (`stories.length === 0` + loading); pull-to-refresh still uses the native refresh indicator |
| Empty + error UI | Empty copy when `success` + no rows; full-screen error + **Try again** when `status === 'error'` |
| Tap → Screen 2 | `navigation.navigate('ArticleDetail', { story })` |
| Sort by score (default) or time; survives back | `useFeedStore.sortBy` (Zustand); `FeedHeaderSort` → `SortToggle` |
| Favicon or placeholder | Per brief: `https://www.google.com/s2/favicons?domain={domain}&sz=64`; **“HN”** tile if load fails or domain is empty |

**Screen 2 — Detail (`ArticleDetailScreen.tsx`, `ArticleDetailHeaderActions.tsx`):**

| Brief | Implementation |
| ----- | -------------- |
| Title, author, score, time, URL tappable | **Open in browser** uses `Linking.canOpenURL` / `openURL`; metadata block shows fields |
| Share in header | `Share` API in header actions |
| Bookmark toggle; **cold restart** persistence | `useBookmarkStore` + Zustand `persist` + **AsyncStorage** (see rationale below) |
| Back restores **list scroll** | `useFeedStore.listScrollOffset` + `useFocusEffect` on feed (`FeedScreen.tsx`) |

**Bonus (optional):**

| Brief | Implementation |
| ----- | -------------- |
| Third **Bookmarks** tab | Bottom tabs + `BookmarksScreen` |
| Swipe to remove | `Swipeable` + `BookmarkSwipeActions` |
| Debounced search, no extra API | `useDebouncedValue` + filter in-memory titles |
| Offline banner | `useNetworkBanner` + `OfflineBanner` |

**Performance (rubric):** `FlatList` uses **`keyExtractor`**, **`getItemLayout`** (fixed row height from `LIST_ROW_HEIGHT`), list windowing props, and **`React.memo`** on `ArticleRow`.

---

## Official submission checklist (from the brief)

| Item | Status |
| ---- | ------ |
| Runs on **Android** and **iOS** with standard setup (`npm install`, `pod install`) | Yes — see AsyncStorage Maven note under [Setup & run](#setup--run) |
| **TypeScript** throughout; no unexplained **`any`** | Yes |
| Hacker News **API** (20 IDs, `Promise.all`, `story` + `url` filter) | Yes — `hnApi.ts` + `storyUtils.filterValidStories` |
| Pull-to-refresh + **loading / error / empty** | Yes |
| **Bookmark** persistence after **cold restart** | Yes — Zustand `persist` + AsyncStorage |
| **Scroll position** restored after back from detail | Yes — `listScrollOffset` in feed store + `useFocusEffect` |
| README: setup, architecture, **trade-offs** | Yes |
| README: **Section 02** Q1–Q5 | Yes |
| **Unit test** (business logic) + **RNTL** interaction test | Yes — see [Tests](#tests-assessment-minimum) |
| **Bonus:** Bookmarks tab + swipe remove | Yes |
| **Bonus:** Debounced search (no extra API) | Yes |
| **Bonus:** Offline banner | Yes |
| **Bonus:** E2E (Detox / Maestro) | Not implemented (called out under trade-offs) |

---

## Architecture & state

- **Feature-based layout:** `src/features/news/` (api, model, components, screens), `src/navigation/`, `src/store/`, `src/shared/`.
- **Icons:** Header actions, tabs, and search use **`react-native-vector-icons` (Ionicons)** with `fonts.gradle` on Android; ensure **`Ionicons.ttf`** is bundled per RNVI setup so icons do not fall back to wrong glyphs.
- **No prop-drilling:** Screens use Zustand + navigation params; rows get `story` + `onPress` only.
- **Zustand (vs Redux Toolkit):** Chosen for small surface area (feed + bookmarks), minimal boilerplate, and selector-friendly updates. **Redux Toolkit + RTK Query** would be the pivot if the app grew many endpoints, normalized caches, and shared patterns with a Redux web app. This is spelled out for **Section 02 Q4** as well.
- **AsyncStorage (vs MMKV) for bookmarks:** Good enough for small JSON, trivial Jest mock, no extra native surface. **MMKV** if we needed sync reads at high frequency or much larger payloads.

### Trade-offs (honest)

- **Scroll restore** is offset-on-blur only (not full list state restoration after process death).
- **Favicons** depend on Google’s helper URL (third party).
- **NetInfo** `isInternetReachable === null` is treated as online to avoid flaky “offline” banners.
- **Hermes** may lack `Intl.RelativeTimeFormat`; `formatRelativeTime.ts` falls back to a small English string formatter.

### What I would do differently with more time

- E2E (Maestro / Detox) for bookmark + cold start.
- RTK Query if the feed gains pagination, search-on-server, or multiple HN lists.
- Stricter **minSdk 30** if the business requires zero support below API 30 devices.

---

## Section 02 — Short technical questions

### Q1 — Bridge vs JSI & The New Architecture

The legacy **Bridge** batched asynchronous, JSON-shaped messages between JS and native code. That design paid serialization and queueing costs and made tight synchronous coordination between runtimes awkward. **JSI** lets native code hold references into the JS runtime and call into JS (and the reverse) with a much thinner boundary, which reduces crossing overhead for hot paths. **Fabric** moves more of the layout and commit pipeline toward a model closer to native UI toolkits. **TurboModules** replace “always linked” native modules with lazily loaded, JSI-facing bindings. Together, the new architecture reduces “bridge ping-pong” and makes performance work more about your JS/React choices than about marshaling taxes alone.

### Q2 — Diagnosing a janky FlatList (500 items, mid-range Android)

**(1) Diagnose:** Use **Android Studio Profiler / Systrace / RN perf overlay** to see whether JS, UI, or GPU is the bottleneck and whether jank correlates with scroll or with updates. **(2) Re-render audit:** Log or use tooling to see if parents recreate `renderItem` or row props every frame. **(3) List tuning:** Confirm **`keyExtractor`**, **`getItemLayout`** (fixed row height), **`windowSize` / `maxToRenderPerBatch`**, and **`removeClippedSubviews`** (Android, where safe). **(4) Row cost:** **`React.memo`** rows, move expensive derived props out of render, avoid heavy shadows, and shrink images. If still bound, **paginate** or adopt **FlashList** after measurement.

### Q3 — `useCallback` / `useMemo`: benefit vs harm

**Benefit:** A **`useCallback`**-wrapped `renderItem` passed into a memoized row prevents every parent re-render from looking like “new props” to `FlatList` children. **`useMemo`** for a sorted list helps when sorting is non-trivial and multiple children consume the same derived array. **Harm:** `useMemo` on a cheap computation with volatile dependencies recomputes every time anyway, adding hook bookkeeping. Worse: returning **fresh object identities** from `useMemo` without stabilizing consumers defeats memoization downstream.

### Q4 — Context vs Redux Toolkit vs Zustand (12 screens, APIs, global state)

**Context** fits low-churn values (theme, locale) but scales poorly when many consumers re-render on any change unless split carefully. **Redux Toolkit** shines with **RTK Query**, normalized entities, DevTools, and team conventions shared with web Redux. **Zustand** fits medium apps with explicit stores and fewer files. For **12 screens + several APIs + auth/theme/cart**, I would pick **RTK + RTK Query** if web already standardizes on Redux or if cache invalidation across entities is central. I would pick **Zustand** if the mobile scope is smaller and iteration speed matters. I would switch to **RTK** when debugging/cache complexity clearly exceeds Zustand’s sweet spot.

### Q5 — Offline-first UX strategy

Treat **local state as the source of truth** for first paint: render from cache, then reconcile. **Connectivity:** combine **NetInfo** with optional active probes when “connected but captive portal” matters. **Cache:** versioned JSON per endpoint or **SQLite** if you need querying; **stale-while-revalidate** reads avoid blank screens. **Invalidation:** user pull, TTL expiry, and successful mutations—not global nukes by default. **Libraries:** NetInfo, AsyncStorage/MMKV/SQLite, optionally TanStack Query patterns if sharing with web. **Trade-offs:** staleness, conflict resolution, and storage growth; mitigate with “last updated” labels and scoped TTLs.

---

## Tests (assessment minimum)

| Brief | File |
| ----- | ---- |
| **Business-logic** Jest tests | `__tests__/storyUtils.test.ts` (`sortStories`, `filterValidStories`); `__tests__/domainFromUrl.test.ts` (`sourceDomainFromUrl`, `faviconUrlForDomain`) |
| **Component interaction** RNTL test | `__tests__/SortToggle.test.tsx` (press Score / Time → `onChange`) |

```bash
npm test
```
