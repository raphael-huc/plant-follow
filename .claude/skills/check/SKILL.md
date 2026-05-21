---
name: check
description: Verify the codebase still lints and builds. Use after a non-trivial change to confirm nothing is broken, since this project has no test framework.
---

Run the project's lint + build pipeline and report any failures.

1. Run `pnpm lint` from the repo root. If it fails, summarize the violations and stop — do not proceed to build.
2. If lint passes, run `pnpm build`. If it fails, summarize the build error.
3. If both pass, report success in one line.

Do not attempt to auto-fix lint or build errors unless the user asks. The point of this skill is to surface what's broken, not to silently change code.
