# AGENTS.md

## Project Structure
- `src/pages/`: route pages. Current routes are wired in `src/App.jsx`.
- `src/components/`: reusable UI and reading components.
- `src/data/`: frontend JSON data used by pages.
- `src/lib/`: shared browser-side helpers.
- `public/gallery/`: visual reference wall images. Use stable ASCII filenames for new assets.
- `public/research/`: static research reports served by Vite.
- `book/`: source markdown books/notes.
- `scripts/`: research, book-processing, and automation scripts.
- `reports/` and `data/research/`: generated research outputs.

## Run Commands
- Install dependencies: `bun install`
- Start dev server: `bun dev`
- Production build: `npm run build`
- Preview build: `npm run preview`
- Research pipeline: `npm run research:run`
- Chinese research pipeline: `npm run research:run:cn`
- Book agent: `npm run book:agent`

## Test Commands
- There is no dedicated unit-test command in this project.
- Before finishing code changes, run `npm run lint`.
- Before pushing UI, route, dependency, or asset changes, run `npm run build`.
- Existing acceptable warning: `src/pages/Home.jsx` may warn about `quotePool` in `react-hooks/exhaustive-deps`; do not treat this warning as a blocker unless editing that logic.

## Code Style
- Keep React code in JSX functional components.
- Follow existing dark Dostoevsky visual language: deep night backgrounds, blue-gray accents, serif display type, restrained borders.
- Use `react-router-dom` `Link` for internal routes.
- Use `import.meta.env.BASE_URL` for public assets.
- Use `lucide-react` icons when adding icon UI.
- Keep new filenames and route paths ASCII even when visible labels are Chinese.
- Prefer small local arrays or JSON data files for display content; avoid duplicating large markup blocks.
- Keep comments rare and only for non-obvious logic.

## 禁止事项
- Do not revert or overwrite user changes in unrelated files.
- Do not commit `dist/`, generated reports, or local experiment files unless explicitly requested.
- Do not add new frameworks, styling systems, or state managers without a concrete need.
- Do not use absolute filesystem paths in frontend code.
- Do not hardcode Vite public paths without `import.meta.env.BASE_URL`.
- Do not move or rename existing public assets unless all references are updated.
- Do not push with failing `npm run build` for app changes.

## Completion Standard
- The requested behavior is implemented in the relevant page/component/data files.
- Internal navigation works through `src/App.jsx` routes.
- New public assets are referenced from the UI where the user expects them to appear.
- `npm run lint` has no errors.
- `npm run build` succeeds for UI, route, dependency, and asset changes.
- Git commits include only files relevant to the task; unrelated local changes remain untouched.
- Changes are pushed to the current tracked GitHub branch when the user asks for sync.

## Review Standard
- Prioritize functional regressions, broken routes, missing assets, dependency issues, and build failures.
- Check mobile and desktop layout risks for visible UI changes.
- Verify route additions include imports and `Route` entries in `src/App.jsx`.
- Verify asset additions use stable paths and are included in `public/`.
- Call out missing validation commands or commands that failed.
- Findings must include file paths and tight line references when possible.
