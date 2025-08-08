## Meal Planner – Recipe Website

React app to discover recipes, view nutrition details, and bookmark favorites. Uses Spoonacular API for data and Firebase Authentication + Firestore for user accounts and bookmarks.

Try it out at: https://ruchit-p.github.io/recipe-website/

### Features

- Search recipes with filters (type, calories)
- View recipe details, ingredients, instructions, nutrition
- User auth (sign up / log in / log out)
- Bookmark recipes per user in Firestore
- Safe HTML rendering for API-provided summaries

### Tech Stack

- React 18 + Vite 5
- React Router 6
- Tailwind CSS + Radix UI + lucide-react
- Firebase (Auth, Firestore)
- Spoonacular API

### Getting Started

1. Prerequisites

- Node.js 18+
- A Spoonacular API key
- A Firebase project (Auth + Firestore enabled)

2. Clone and install

```bash
git clone https://github.com/ruchit-p/recipe-website.git
cd recipe-website
npm install
```

3. Configure environment
   Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables:

- Spoonacular
  - `VITE_APP_API_KEY`
  - `VITE_APP_API_KEY_BACKUP`
  - `VITE_APP_API_KEY_SEARCH`
  - `VITE_APP_API_KEY_BOOKMARK`
  - `VITE_APP_API_KEY_BOOKMARK_BACKUP`
  - `VITE_APP_API_KEY_BOOKMARK_BACKUP2`
  - `VITE_APP_API_KEY_BOOKMARK_DETAILS`
- Firebase
  - `VITE_APP_FIREBASE_API_KEY`
  - `VITE_APP_FIREBASE_AUTH_DOMAIN`
  - `VITE_APP_FIREBASE_PROJECT_ID`
  - `VITE_APP_FIREBASE_STORAGE_BUCKET`
  - `VITE_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_APP_FIREBASE_APP_ID`

4. Run locally

```bash
npm run dev
```

5. Build

```bash
npm run build
npm run preview
```

### Deployment

This repo is configured for GitHub Pages with Vite base set to `/recipe-website/` in `vite.config.js`.

1. Set `homepage` in `package.json` to `https://ruchit-p.github.io/recipe-website/`
2. If deploying under a different base path, update `base` in `vite.config.js`.
3. Build and deploy

```bash
npm run build
npm run deploy
```

### Security

- We sanitize API-provided HTML summaries with DOMPurify.
- Do not commit your real `.env`; use `.env.example` for sharing variable names.
- See `SECURITY.md` for reporting vulnerabilities.

### Contributing

Please read `CONTRIBUTING.md` and follow the `CODE_OF_CONDUCT.md`.

### License

MIT – see `LICENSE`.
