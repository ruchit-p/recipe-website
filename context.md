# Project Context

- App: Meal Planner – Recipe Website
- Stack: React + Vite, React Router, Tailwind + Radix, Firebase (Auth, Firestore), Spoonacular API
- Base path: `/recipe-website/` (GitHub Pages)

## Environment Variables

- See `.env.example` for required keys (Spoonacular + Firebase)

## Auth & Data

- Firebase Auth for email/password login
- Firestore collection `bookmarks` with doc per user: `{ bookmarks: string[] }`

## Security

- DOMPurify sanitizes API-provided HTML summaries
- `.env` is gitignored

## Important Files

- `src/AuthContext.jsx`: auth and bookmark helpers
- `src/firebaseConfig.js`: Firebase initialization
- `src/Components/RecipeInfo.jsx`: card view + bookmark toggle
- `src/pages/Details.jsx`: detailed recipe view + nutrition

## Deployment

- `vite.config.js` sets `base` to `/recipe-website/`
- `npm run deploy` publishes `dist` via gh-pages
