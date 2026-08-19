# Repository Guidelines

## Project Structure & Module Organization

Full-stack movie catalog app (Spring-style Java WAR + Vue 3 SPA).

- `src/main/java/com/cac/Movies/` — Java backend: `controller/`, `service/`, `entity/`, `dto/`, `db/`, `middlewares/`
- `src/main/webapp/` — WAR root. **Build output for the frontend**; do not edit generated files (`index.html`, `assets/`). `WEB-INF/web.xml` is copied here by the build.
- `ui/` — Vue 3 + TypeScript frontend. `ui/src/` holds `App.vue`, `components/`, `router.ts`, `utils/`. `ui/WEB-INF/web.xml` is the source of truth for the WAR descriptor.
- `db_cac_movies.sql` — database schema/seed data.
- `docker-compose.yml` / `Dockerfile` — local MySQL + app stack.

## Build, Test, and Development Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Vite dev server (proxies to backend) |
| `pnpm build` | Type-check (`vue-tsc -b`) then bundle into `src/main/webapp/` |
| `pnpm preview` | Preview the production build |
| `mvn package` | Build the WAR (includes the bundled frontend) |
| `docker compose up` | Start MySQL and the app locally |

Frontend env vars live in `.env` (gitignored): `DB_USER`, `DB_PASS`, `SALT_KEY`, `VITE_DB_HOST`, `VITE_IMDB_AUTH`.

## Coding Style & Naming Conventions

- **Java 21**, 4-space indentation. Classes PascalCase (`MoviesController`), methods/fields camelCase. Layer naming: `*Controller`, `*Service`, `*DTO`.
- **TypeScript/Vue**, 2-space indentation. `tsconfig` enforces `strict`, `noUnusedLocals`, `noUnusedParameters`. Components PascalCase (`CardPelicula.vue`); route names and API utils camelCase.
- No dedicated linter is configured; `vue-tsc` is the gate for frontend changes. Run `pnpm build` before committing.

## Testing Guidelines

No test framework or test suites are currently configured for either the Java or Vue code. If adding tests: use JUnit 5 under `src/test/java` (Maven) and Vitest under `ui/`, mirroring the source layout. Name tests `*Test.java` / `*.spec.ts`.

## Commit & Pull Request Guidelines

- Commit messages follow light conventional style: `feat`, `fix`, `chore` prefix with a short description (e.g. `fix cors genres y users`, `chore database refactor user entity`).
- PRs should describe the change, note backend/frontend impact, and confirm `pnpm build` and `mvn package` both pass. Include screenshots for UI changes.

## Security & Configuration Tips

- Never commit `.env` or credentials; `SALT_KEY` is used for password hashing in `middlewares/auth.java`.
- CORS is configured via `CorsFilter` in `ui/WEB-INF/web.xml` — keep it in sync if endpoints change.
- `pnpm build` wipes `src/main/webapp/` (`emptyOutDir`) and re-copies `WEB-INF/web.xml` from `ui/`; never store manual files in `src/main/webapp/`.
