# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package manager

Use **pnpm**. A `package-lock.json` is also present from a stray `npm install` — ignore it; the source of truth is `pnpm-lock.yaml`.

## Language

The codebase mixes `.jsx` and `.tsx` files. For **new** files, use TypeScript (`.tsx` / `.ts`). When editing an existing `.jsx` file, keep it `.jsx` — do not migrate it as a side effect.

## Backend access

Use the **Directus SDK** (`@directus/sdk`) for all data reads and writes. `@apollo/client` is still a dependency but is not the convention — do not introduce new Apollo queries.

## Backend logs

The Directus backend lives in the sibling repo `../huc-back/` and runs via Docker Compose. When you need to debug an API call from this frontend (auth failures, 4xx/5xx, OAuth callbacks, CORS), read the backend logs directly:

```
cd ../huc-back
docker compose logs --tail=200 directus
docker compose logs -f directus             # follow live during reproduction
```

Pull the logs yourself instead of asking the user to copy them.

## User-facing copy

All text rendered to the user must be written in **English** — JSX text, button labels, form placeholders, alert/error messages shown in the UI, `aria-label`, image `alt`, page titles. Do not write user-visible strings in French even if the conversation with the assistant is in French. Code comments and console/log messages are not user-facing and have no language requirement.

## Verifying changes

No test framework is configured. To verify a change does not break the build, run:

```sh
pnpm lint && pnpm build
```
