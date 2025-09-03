# @stratton.cologne/vue-smart-toast

[![npm version](https://img.shields.io/npm/v/@stratton-cologne/vue-smart-toast.svg)](https://www.npmjs.com/package/@stratton-cologne/vue-smart-toast)
[![npm downloads (total)](https://img.shields.io/npm/dt/%40stratton-cologne%2Fvue-smart-toast)](https://www.npmjs.com/package/@stratton-cologne/vue-smart-toast)
[![npm downloads (week)](https://img.shields.io/npm/dw/%40stratton-cologne%2Fvue-smart-toast)](https://www.npmjs.com/package/@stratton-cologne/vue-smart-toast)
![node >= 18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![typescript](https://img.shields.io/badge/TypeScript-ready-blue)
![license: MIT](https://img.shields.io/badge/license-MIT-lightgrey)


Leichtgewichtiges, typisiertes Toast/Notifications-Paket für **Vue 3** (Vite Library Mode).
Unterstützt **stabile Keys** (Upsert statt Stapeln), **Positionen**, **Typen/Themes** und **Transitions** – zero-dependency (außer Vue).

---

## Features

-   🧩 **Composable API**: `useToast()` für `showToast()` & `removeToast()`
-   🔁 **Stable Keys**: per `key` Toastrs aktualisieren statt duplizieren
-   📍 **Positionen**: u. a. top/bottom/center, inkl. `center-left/right`
-   🎨 **Themes**: success, info, warning, danger/error, u. v. m. (CSS linear-gradients)
-   ⚡ **Kein Global State-Tool nötig** – reine Vue-Reactivity
-   🧪 **TypeScript**-Typen & Declaration Files out-of-the-box

---

## Installation

```bash
# npm
npm i @stratton.cologne/vue-smart-toast
# pnpm
pnpm add @stratton.cologne/vue-smart-toast
# yarn
yarn add @stratton.cologne/vue-smart-toast
```

---

## Quick Start

### 1) Plugin & Styles registrieren

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";

import ToastPlugin from "@stratton.cologne/vue-smart-toast";
import "@stratton.cologne/vue-smart-toast/style.css";

createApp(App).use(ToastPlugin).mount("#app");
```

### 2) Host-Komponente einfügen

```vue
<!-- z.B. im Root-Layout -->
<template>
    <RouterView />
    <ToastNotifications />
</template>
```

### 3) Toasts anzeigen

```ts
import { useToast } from "@stratton.cologne/vue-smart-toast";

const { showToast } = useToast();

showToast({
    key: "save", // optional: upsert statt stapeln
    message: "Gespeichert!",
    type: "success", // 'info' | 'warning' | 'danger' | 'error' | ...
    duration: 4000, // in ms (Default: 3000)
    position: "bottom-right", // siehe Positionen unten
});
```

---

## API

### `useToast()`

```ts
const { toasts, showToast, removeToast } = useToast();
```

-   `toasts: Toast[]` – reaktives Array der aktuellen Toasts
-   `showToast(opts: ToastOptions): void` – Toast erstellen/aktualisieren
-   `removeToast(id: number): void` – Toast per ID schließen

### Typen

```ts
export type ToastType =
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "error" // Alias zu 'danger'
    | "fuchsia"
    | "slate"
    | "lime"
    | "red"
    | "orange"
    | "cyan"
    | "gray"
    | "dark";

export type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "center"
    | "center-left"
    | "center-right";

export interface ToastOptions {
    key?: string; // stabiler Schlüssel (Upsert)
    message: string; // HTML erlaubt (wird via v-html eingesetzt)
    type?: ToastType; // Default: 'info'
    duration?: number; // Default: 3000 (ms)
    position?: ToastPosition; // Default: 'top-right'
}
```

> **Hinweis zu `type`:** `error` wird intern als `danger` normalisiert, damit CSS-Klassen konsistent bleiben.

---

## CSS & Styling

Das Paket bringt globale Styles mit (`@stratton.cologne/vue-smart-toast/style.css`):

-   Container & Wrapper: `.notifications-container`, `.toasts-wrapper`
-   Toast-Box: `.toast`
-   Positionen als Klassen: `.top-left`, `.bottom-right`, `center`, `center-left`, `center-right`, …
-   Farben als Klassen: `.success`, `.info`, `.warning`, `.danger`/`.error`, `.fuchsia`, `.slate`, `.lime`, `.red`, `.orange`, `.cyan`, `.gray`, `.dark`
-   Transitions: `slide-down`, `slide-right`, `slide-left`, `slide-up`, `slide-up-right`, `slide-up-left`, `fade`

**Anpassen:**
Du kannst in deinem Projekt eigene Styles nach der Paket-CSS importieren und Klassen überschreiben – z. B.:

```css
/* override.css */
.toast.success {
    background: #22c55e; /* Tailwind green-500 */
}
```

```ts
// main.ts
import "@stratton.cologne/vue-smart-toast/style.css";
import "./override.css";
```

---

## Positionen & Transitions

| Position      | Klassen/Transition                |
| ------------- | --------------------------------- |
| top-left      | `.top-left` + `slide-right`       |
| top-center    | `.top-center` + `slide-down`      |
| top-right     | `.top-right` + `slide-left`       |
| bottom-left   | `.bottom-left` + `slide-up-right` |
| bottom-center | `.bottom-center` + `slide-up`     |
| bottom-right  | `.bottom-right` + `slide-up-left` |
| center        | `.center` + `fade`                |
| center-left   | `.center-left` + `fade`           |
| center-right  | `.center-right` + `fade`          |

---

## Beispiele

### 1) Upsert per `key`

```ts
const { showToast } = useToast();

showToast({ key: "upload", message: "Upload gestartet…", type: "info" });
// später:
showToast({ key: "upload", message: "Upload fertig!", type: "success" });
// Ergebnis: nur ein Toast – Nachricht/Type werden aktualisiert
```

### 2) Manuell schließen

```ts
const { showToast, removeToast } = useToast();

const id = (() => {
    // kleine Hilfsfunktion, um die ID zu erhalten (optional in eigener App)
    let capture = -1;
    const orig = showToast as any;
    (showToast as any) = (opts: any) => {
        orig(opts);
        // In der Regel reicht Auto-Close; wenn du IDs brauchst,
        // erweitere dein eigenes Wrapper-API, das die ID zurückgibt.
    };
    return capture;
})();

// removeToast(id);
```

> **Tipp:** Das Paket verwaltet intern IDs & Timer. Falls du IDs zurückgeben möchtest, kannst du `useToast()` bei dir wrapen und `showToast()` entsprechend erweitern.

---

## SSR

-   Rendering erfolgt clientseitig, Styles sind global. Für reine SSR-Umgebungen einfach als Client-Only-Komponente einbinden (z. B. in Nuxt `<client-only>` oder mit Dynamic Import nur im Browser laden).

---

## Local Development

```bash
pnpm i
pnpm build
pnpm dev           # Playground, falls eingerichtet
```

**Im Zielprojekt lokal verlinken:**

```bash
# im Paketordner
pnpm build
# im Zielprojekt
pnpm add ../pfad/zu/vue-smart-toast
```

---

## Publish

```bash
# ggf. als öffentliches Scoped-Package:
npm publish --access public
# sonst
npm publish
```

---

## Lizenz

MIT © stratton.cologne

---

## Roadmap

-   Optionale Queue-Strategie (Max-Anzahl pro Position)
-   ARIA-Verbesserungen & Fokus-Management
-   Programmatic Container-Mount (auto-inject)
-   CSS-Variablen für Themes

---

## Changelog

### 0.1.0

-   Erste Veröffentlichung: Composable `useToast`, Komponente `<ToastNotifications />`, globale CSS, Positions- & Typen-Support, Transitions, stable `key`-Upserts.
