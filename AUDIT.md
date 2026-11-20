# Repository audit — first pass

## Findings
- Vite + React + TypeScript frontend with a separate `server.mjs` process.
- Current `dev` script starts the server and Vite together; verify process cleanup and production server architecture. Vercel static hosting is suitable only if the app does not depend on the long-running server at runtime.
- `vite.config.d.ts` and committed TypeScript build-info files appear generated; ensure generated artifacts are not maintained as source.
- Add CI for typecheck and production build, and verify responsive/accessibility behavior.

## Verification
Package manifest and root structure inspected; build not run.