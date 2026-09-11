# Sprout — a gamified study planner 🌱

A cozy study planner, habit tracker, and tiny companion game in one. Complete
study tasks from an exact weekly schedule, earn XP and stars, watch your
plant companion grow through five stages, keep a streak alive, and unlock
achievements — all mobile-first.

```
/client   React + Vite + Tailwind + Framer Motion (frontend)
/server   Node.js + Express + MongoDB + Mongoose (backend API)
```

---

## 1. MongoDB setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   (or run MongoDB locally).
2. Create a database user and allow network access (for local dev, allow
   your current IP; for Render, allow `0.0.0.0/0` or Render's IP ranges).
3. Copy the connection string — it looks like:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/study-planner`

## 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env and paste your MONGODB_URI
npm run seed   # loads the exact weekly schedule + achievement definitions
npm run dev    # starts the API on http://localhost:5000
```

The seed script is safe to re-run — it refreshes the schedule/achievement
definitions but never touches your saved XP, stars, streaks, or companion.

## 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env
# edit .env if your backend isn't on http://localhost:5000/api
npm run dev    # starts the app on http://localhost:5173
```

Open the printed local URL on your phone (same Wi-Fi) or in a mobile
viewport in your browser to see the mobile-first layout.

## 4. Environment variables

**server/.env**
| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string |
| `PORT` | Port for the API (default `5000`) |
| `CLIENT_ORIGIN` | Comma-separated allowed origins for CORS (your frontend URL) |

**client/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed API, e.g. `https://your-api.onrender.com/api` |

## 5. Local development

Run both servers side by side (two terminals):

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

The app works even if the backend is briefly unreachable — completed tasks
are saved to `localStorage` immediately and synced automatically once the
API is reachable again, so nothing is ever lost.

## 6. Production build (frontend)

```bash
cd client
npm run build     # outputs to client/dist
npm run preview   # sanity-check the production build locally
```

## 7. Deploying the backend to Render

1. Push this repo to GitHub.
2. In Render, create a **New Web Service** pointed at the repo, with:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
3. Add environment variables `MONGODB_URI`, `CLIENT_ORIGIN` (your Vercel
   URL), and optionally `PORT` (Render sets this automatically).
4. Once deployed, run the seed script once, either locally against the
   production `MONGODB_URI`, or via Render's shell:
   ```bash
   npm run seed
   ```

## 8. Deploying the frontend to Vercel

1. In Vercel, import the same repo.
2. Set **Root directory** to `client`.
3. Framework preset: **Vite**. Build command `npm run build`, output
   directory `dist` (Vercel usually detects this automatically).
4. Add environment variable `VITE_API_URL` pointing at your Render API,
   e.g. `https://your-api.onrender.com/api`.
5. Deploy. Update `CLIENT_ORIGIN` on the backend to match your final
   Vercel URL, then redeploy the backend.

---

## How the gamification works

- **XP & Levels** — every completed study task awards XP based on its
  duration. Five companion growth stages (🌱 → 🌿 → 🪴 → 🌳 → 🌸), each
  needing more XP than the last.
- **Stars** — a separate currency, spent only on cosmetic companion
  customization in the Reward Shop. No randomness, no real money.
- **Streaks** — completing at least one study task on consecutive days
  keeps the streak alive; missing a day resets it gently, it's never
  punished harshly.
- **Perfect Day** — finishing every study task scheduled for the day
  triggers a bonus + a short celebration animation.
- **Weekly Quest** — a rolling target of study tasks with a bonus reward
  on completion.
- **Achievements** — unlock automatically based on tasks completed,
  streaks, stars earned, and consistency.

All of this logic is computed on the backend (source of truth) and
mirrored on the frontend for instant, optimistic feedback — the two are
reconciled automatically after every request.

## Editing the schedule

Go to **Schedule → Add** (or tap any task) to add, edit, or delete tasks
directly from the phone — no code changes needed. Changing a task's type
determines whether it counts toward XP/stars/progress: `study`,
`online-class`, `offline-class`, `review`, and `problem-solving` all count;
`break`, `meal`, `preparation`, and `sleep` do not (but still show up in
the timeline).

## Notes

- The companion is built entirely from SVG + CSS — no external image
  hosting, so it never breaks.
- All animations respect `prefers-reduced-motion`.
- This is set up as a single-user app by design (per the brief), but the
  data models are structured so a `userId`/auth layer could be added later
  without reshaping anything.
