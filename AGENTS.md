# NideShop — WECHAT3

Two independent sub-projects:

## `nideshop-server/` — Node.js + ThinkJS 3 + MySQL API

- **Entry:** `development.js` (dev, Babel in-memory + file watcher) or `production.js` (proxy mode)
- **Framework:** ThinkJS 3.x (`thinkjs`), `think-model-mysql` for DB, `think-cache-file` for cache
- **Cluster fix:** On Windows/Node ≥ 17, workers crash with `EADDRINUSE`. `workers: 1` in `src/common/config/config.js` (already applied). Production config sets `workers: 0` (auto).
- **DB:** MySQL `nideshop` at `127.0.0.1:3306`, user/pass `root`/`Nfl20050920.` (`src/common/config/database.js`)
- **MySQL 8.0 auth fix:** `ER_NOT_SUPPORTED_AUTH_MODE` → MySQL user uses `caching_sha2_password`. Fix: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '...'`
- **Schema + seed data:** `nideshop.sql` — import before first run
- Commands (run from `nideshop-server/`):
  - `npm start` — dev mode with Babel transpilation + file watcher
  - `npm run compile` — `babel src/ --presets think-node --out-dir app/`
  - `npm run lint` — `eslint src/` (extends `think`)
  - `npm run lint-fix` — `eslint --fix src/`
- **No test framework configured** — no test script in package.json
- **Production:** PM2 (`pm2.json`, exec_mode: fork), Nginx reverse proxy (`nginx.conf`)
- **Auth:** JWT in `X-Nideshop-Token` header. Same secret (`SLDLKKDS323ssdd@#@@gf`) in both `src/api/service/token.js` and `src/admin/service/token.js`
- **Third-party configs** (must set real values before use):
  - `src/common/config/config.js` — WeChat (appid, secret, mch_id, partner_key, notify_url) + 快递鸟 logistics (appid, appkey)
  - `src/common/config/config.js` — WeChat Pay notify URL
- **Generated/ignored:** `app/`, `runtime/`, `logs/`, `node_modules/`

### `src/` structure

- `src/api/` — mini-program API (17 controllers: auth, goods, cart, order, pay, etc.)
- `src/admin/` — admin backend API
- `src/common/` — config (database, middleware, adapter, router, extend), bootstrap

## `nideshop-client/` — WeChat Mini Program

- Raw Mini Program (WeChat Dev Tools only — no build tool, no npm, no bundler)
- API base URL in `config/api.js` — defaults to `http://127.0.0.1:8360/api/`
- 33 page routes in `app.json`, 5-tab layout (首页, 专题, 分类, 购物车, 我的)
- Helper services in `services/pay.js` and `services/user.js`
- Open in WeChat Dev Tool, preview on device or emulator
