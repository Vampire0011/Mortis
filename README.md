# CampusRecords - Student Activity Records Platform (frontend demo)

Frontend-only React app (Vite + React Router + Tailwind CSS 3 + motion). No backend, database or real auth.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build check
```

## Demo logins (edit in src/data/demoAccounts.js)
| Role | User ID | Password |
|---|---|---|
| Student | STU001 | Student@123 |
| Faculty | FAC001 | Faculty@123 |
| Super Admin | ADM001 | Admin@123 |

## Where to edit things
- Menus: `src/config/constants.js` (NAV), statuses, categories, flairs
- Mock data: `src/data/*.js` (reset any time from Settings > Reset demo data)
- Privacy rules: `src/utils/permissions.js`
- Design: `src/components/ui/hero.tsx` (landing), `password-strength.tsx`, `src/index.css`, `tailwind.config.js`

## Simulated / not real
Login, privacy and confidentiality are browser-only. Certificate verification is a simulated faculty decision. "Signed" is a demo step, not a legal e-signature. Files are never uploaded; small images persist in localStorage, larger ones only for the session.
[![Architecture diagram of vampire0011/mortis](https://gitdiagram.com/vampire0011/mortis/diagram.png)](https://gitdiagram.com/vampire0011/mortis?utm_source=readme&utm_medium=picture)
