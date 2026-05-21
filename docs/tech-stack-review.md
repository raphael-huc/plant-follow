# Tech Stack Review — plant-follow

État des lieux de la stack actuelle, des problèmes concrets, et de ce qui serait à faire — par ordre d'impact.

## Ce qu'on utilise et pourquoi

| Couche  | Techno                                                                                                                                  | Pourquoi (raisonnable)                               | Statut réel                                                             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| Build   | **Vite 7**                                                                                                                              | Standard pour React moderne, HMR rapide              | OK — bien configuré                                                     |
| UI      | **React 19 + react-router-dom 7**                                                                                                       | Stack actuelle                                       | OK                                                                      |
| Backend | **Directus** (self-hosted, `localhost:8055`)                                                                                            | Headless CMS, gère schéma + auth + REST gratuitement | Bon choix pour une app data-centric comme du suivi de plantes           |
| Auth    | Directus SDK avec `authentication('cookie')`                                                                                            | Cookie httpOnly = plus sûr que localStorage          | Bonne décision                                                          |
| Data    | **Trois clients en parallèle** : Directus SDK (`src/api/directus.ts`), Apollo dans `App.jsx`, autre Apollo dans `src/graphql/client.ts` | Convention annoncée : "Directus SDK partout"         | Conflit — voir plus bas                                                 |
| Styling | Classes **Tailwind** (`bg-blue-600`, `min-h-screen`...)                                                                                 | Utility-first                                        | Tailwind n'est pas installé — les classes ne font rien                  |
| Typing  | **TypeScript partiel** (`.tsx` pour les pages, `.jsx` pour App)                                                                         | Migration en cours                                   | ESLint ne lint que `.{js,jsx}` (`eslint.config.js:10`) → TS pas vérifié |
| Tests   | —                                                                                                                                       | —                                                    | Aucun                                                                   |

## Problèmes concrets trouvés en lisant le code

### 1. Apollo Client n'est pas cohérent

- `App.jsx:9` instancie un ApolloClient sans auth (`http://localhost:8055/graphql` en dur).
- `src/graphql/client.ts` instancie un _autre_ ApolloClient — mais c'est du code **React Native** copié-collé : `__DEV__` (n'existe pas en Vite, sera `undefined`), `@react-native-async-storage/async-storage` (inutile en web), bearer token alors que Directus est en mode cookie.
- `src/pages/home.tsx:5` importe `gql` d'Apollo mais ne l'utilise même pas.

**Décision** : supprimer Apollo entièrement et passer uniquement par les helpers REST du Directus SDK (`readItems`, `readMe`, …). C'est aligné avec la convention "Directus SDK partout" et c'est plus simple.

### 2. Tailwind est utilisé partout dans le JSX mais pas installé

- Aucun `tailwindcss` dans `package.json`, aucun `tailwind.config.*`, aucun `@tailwind base` dans `index.css`.
- Soit installer Tailwind (`pnpm add -D tailwindcss @tailwindcss/vite` — plugin Vite officiel), soit retirer les classes.
- Aujourd'hui l'UI est cassée visuellement.

### 3. TypeScript à moitié branché

- `eslint.config.js:10` ignore `.ts` / `.tsx`. Il faut ajouter `typescript-eslint` et étendre :
  ```js
  files: ["**/*.{js,jsx,ts,tsx}"];
  ```
- `Plant` et `Schema` sont utilisés dans `directus.ts` mais pas définis ni importés → ne compile pas avec `strict: true`. À déclarer à la main dans `src/types/schema.ts` (une interface par collection Directus).

### 4. Secrets et URLs en dur

- `login.tsx:22` : `admin@example.com / d1r3ctu5` hardcodés → à mettre dans une variable d'env, ou supprimer le bouton "Login as Admin" en prod.
- `localhost:8055` apparaît 3 fois → centraliser dans `import.meta.env.VITE_DIRECTUS_URL`.

### 5. Dépendances mortes

- `@react-native-async-storage/async-storage`, `axios` (jamais importé) → à retirer.
- `react-router-dom` est en **devDependencies** alors qu'il est importé en runtime dans `App.jsx` → à passer en `dependencies`.

### 6. Directives `"use client"`

- `login.tsx:1` et `home.tsx:1` → directive **Next.js**, sans effet en Vite. À supprimer.

## Ce qui serait le mieux — par ordre d'impact

1. **Installer Tailwind** (1h max) — sinon l'UI ne reflète pas le code.
2. **Tuer Apollo** : supprimer `src/graphql/client.ts`, retirer l'`ApolloProvider` d'`App.jsx`, retirer `@apollo/client`, `@react-native-async-storage/async-storage` et `axios` du `package.json`. Tout passer par `DirectusClient`.
3. **Aller au bout de TypeScript** : migrer `App.jsx` et `main.jsx` en `.tsx`, étendre la conf ESLint aux fichiers TS, ajouter `tsc --noEmit` dans le script `lint` (ou créer un script `typecheck`). Déclarer à la main les types Directus dans `src/types/schema.ts` (`Plant`, `Schema`, …).
4. **Vitest** pour pouvoir tester `DirectusClient` et les composants : `pnpm add -D vitest @testing-library/react jsdom`. Une fois en place, mettre à jour la skill `/check` pour faire `pnpm lint && pnpm test && pnpm build`.
5. **Variables d'env** : `.env.example` avec `VITE_DIRECTUS_URL=http://localhost:8055`, supprimer les credentials hardcodés.
6. **Routing** : `react-router` 7 supporte le mode "framework" avec data loaders — utile quand il y aura plus de routes, pour faire du fetch déclaratif au lieu de `useEffect` + `useState` partout (cf. `ProtectedRoute.tsx`).

## Suggestion d'ordre de PRs

- **PR 1 — Nettoyage stack** : Tailwind installé + Apollo supprimé + deps mortes virées + `"use client"` retiré. ~60 % du bruit nettoyé d'un coup.
- **PR 2 — TypeScript strict** : ESLint étendu aux `.ts(x)`, types Directus écrits à la main, `App.jsx`/`main.jsx` → `.tsx`.
- **PR 3 — Env vars** : `.env.example` + remplacement des URLs et credentials hardcodés.
- **PR 4 — Vitest** : framework + 2-3 tests de fumée + mise à jour de `/check`.
