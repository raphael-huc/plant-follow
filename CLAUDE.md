# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package manager

Use **pnpm**. A `package-lock.json` is also present from a stray `npm install` — ignore it; the source of truth is `pnpm-lock.yaml`.

## Language

The codebase mixes `.jsx` and `.tsx` files. For **new** files, use TypeScript (`.tsx` / `.ts`). When editing an existing `.jsx` file, keep it `.jsx` — do not migrate it as a side effect.

## Backend access

Use the **Directus SDK** (`@directus/sdk`) for all data reads and writes. `@apollo/client` is still a dependency but is not the convention — do not introduce new Apollo queries.

## Verifying changes

No test framework is configured. To verify a change does not break the build, run:

```sh
pnpm lint && pnpm build
```
