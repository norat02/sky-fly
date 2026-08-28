# Multilingual browser smoke test

- Route tested: `http://localhost:3000/login`
- Result: login page rendered successfully after multilingual changes.
- Visual state: existing paper-studio responsive auth layout remains intact.
- Console: no runtime errors. Only React DevTools info and two known React Router v7 future-flag warnings (`v7_startTransition`, `v7_relativeSplatPath`).
- Build: Vite production build passed after the i18n changes.
- Lint: targeted ESLint run passed with no output.
