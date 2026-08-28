# OAuth browser QA

The OAuth implementation builds successfully and targeted ESLint passes. The server on port 3000 was an older process and did not show the latest OAuth buttons. A fresh Vite server was started from the GitHub clone on port 4173; its browser console showed no JavaScript errors, only the existing React Router future-flag warnings. The browser screenshot on 4173 appeared blank during the first load, so the route should be reloaded or checked after the dev server has fully warmed up before release.

The warmed Vite preview on port 4173 rendered Login and Register with all three accessible buttons: Continue with Google, Continue with Apple, and Continue with Microsoft. The existing username/password forms and Legal footer links remain visible. Register also keeps the username generator and password confirmation fields.
