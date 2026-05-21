---
name: check
description: Verify the codebase still lints, typechecks, and builds. Use after a non-trivial change to confirm nothing is broken, since this project has no test framework.
---

Run the project's verification pipeline and report any failures.

1. Run `pnpm lint`. If it fails, summarize the violations and stop.
2. If lint passes, run `pnpm typecheck` (which is `tsc --noEmit`). If it fails, summarize the type errors and stop.
3. If typecheck passes, run `pnpm build`. If it fails, summarize the build error.
4. If all three pass, report success in one line.

Do not attempt to auto-fix issues unless the user asks. The point of this skill is to surface what's broken.
