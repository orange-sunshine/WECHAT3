# NideShop — WECHAT3

Two independent sub-projects:

## `nideshop-server/` — Node.js + ThinkJS 3 + MySQL API

- **Entry:** `development.js` (dev, uses Babel in-memory) or `production.js`
- **Framework:** ThinkJS 3.x (`thinkjs`). Uses `think-model-mysql` for DB.
- **Cluster fix:** On Windows/modern Node, workers fail with `EADDRINUSE`. Add `workers: 1` to `src/common/config/config.js` (already applied).
- **Node compat:** ThinkJS 3.2.15 has cluster issues on Node >= 17. In dev, `workers: 1` avoids port-sharing crash.
- **DB:** MySQL `nideshop` at `127.0.0.1:3306`, user/pass `root`/`Nfl20050920.` (see `src/common/config/database.js`)
- **MySQL 8.0 auth fix:** `ER_NOT_SUPPORTED_AUTH_MODE` means MySQL user uses `caching_sha2_password`. Fix: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '...'`
- **Schema + seed data:** `nideshop.sql` — import before first run
- Commands (run from `nideshop-server/`):
  - `npm start` — dev mode with Babel transpilation + file watcher
  - `npm run compile` — compile `src/` → `app/` via Babel (`think-node` preset)
  - `npm run lint` — `eslint src/` (extends `think`)
  - `npm run lint-fix` — `eslint --fix src/`
- **Production:** PM2 (`pm2.json`), Nginx reverse proxy (`nginx.conf`)
- **Auth:** JWT token in `X-Nideshop-Token` header. Secret in `src/api/service/token.js`
- **WeChat config:** `src/common/config/config.js` (appid, secret, mch_id, partner_key, notify_url) — must set real values before WeChat Pay works
- **Key dirs:** `src/api/` (mini-program API), `src/admin/` (admin backend API), `src/common/config/`
- **Generated/ignored:** `app/`, `runtime/`, `logs/`, `node_modules/`

## `nideshop-client/` — WeChat Mini Program

- Raw Mini Program (WeChat Dev Tools only — no build tool, no npm, no bundler)
- API base URL in `config/api.js` — defaults to `http://127.0.0.1:8360/api/`
- 35 page routes defined in `app.json`, 5-tab layout (Home, Topics, Categories, Cart, Profile)
- Open in WeChat Dev Tool, preview on device or emulator
