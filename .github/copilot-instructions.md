# Copilot instructions

## Commands

Use Node.js `^22.18.0` or `>=24.12.0` (see `package.json`).

- `npm install` — install dependencies.
- `npm run dev` — start the Vite development server.
- `npm run build` — create the production build.
- `npm run preview` — preview the production build locally.
- `npm run doc:vue` — generate Vue component documentation under `docs/components`.

There is currently no test runner, test script, lint script, or test suite in this repository, so there is no single-test command.

## Architecture

- `src/main.js` creates the Vue app and installs Pinia and Vue Router. `App.vue` provides the shared page shell and initializes/polls authentication, system parameters, and date settings.
- `src/router/index.js` owns page routes and aliases. It uses history mode with Vite's `BASE_URL`; route metadata drives the document title.
- `src/stores/app.js` is the shared Pinia store for server-backed auth, system parameters, and registration/result dates. When extracting reactive store state, use `storeToRefs()`.
- `src/api/client.js` is the shared `fetch` wrapper, including the `/newklms/api` prefix, JSON/FormData handling, HTTP errors, and the unauthorized callback. Add feature endpoints to the relevant module in `src/api/` and export them through `src/api/index.js`; don't call `fetch` directly from views or components.
- Registration is a staged flow: `RegisterForm.vue` creates the initial application using `useStudentForm` and `StudentBasicFields`; `MemberareaView.vue` authenticates and loads a member record, then provides `memberData` and `fetchMemberdata` to the `MemberForm*` children. The API's `success` response is separate from HTTP success, so handle both application-level failures and thrown request errors.
- `usePeriod()` derives registration and score availability from the shared server-provided `dateVars`. Keep time-window behavior driven by these settings rather than adding dates in page components.

## Repository conventions

- Components and views use Vue 3 `<script setup>` with the Composition API. Shared form behavior belongs in composables; reusable form controls communicate through props, `v-model` (`update:modelValue`), and emitted events.
- Preserve backend field names and request payload shapes in `src/api/` and form-to-payload conversions. Registration dates are converted between ISO dates and Republic of China calendar fields in `useStudentForm`.
- The interface copy and labels are Traditional Chinese. `src/ABOUT.md` is compiled as a Vue-rendered Markdown page by `AboutView.vue`; update it alongside `README.md` when user-facing system information changes.
- Vite's production base path is `/vue/`, while API requests use `/newklms/api`. The development API proxy target is configured in `vite.config.js`; deployment also needs history-route fallback to `index.html` as described in `README.md`.
