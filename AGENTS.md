# NideShop — WECHAT3

Two independent sub-projects:

## `nideshop-server/` — Node.js + ThinkJS 3 + MySQL API

- **Entry:** `development.js` (dev, Babel in-memory + file watcher) or `production.js` (proxy mode behind Nginx)
- **Framework:** ThinkJS 3.x, `think-model-mysql`, `think-cache-file`, JWT via `jsonwebtoken`
- **Windows/Node ≥ 17 cluster crash:** `workers: 1` in `src/common/config/config.js` (already applied). Production (`config.production.js`) sets `workers: 0`.
- **DB:** MySQL `nideshop` at `127.0.0.1:3306`, user/pass `root`/`Nfl20050920.` (`src/common/config/database.js`). MySQL 8.0 `caching_sha2_password` fix: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Nfl20050920.'`
- **Schema + seed data:** `nideshop.sql` (~9400 lines) — import before first run. `CREATE SCHEMA nideshop DEFAULT CHARACTER SET utf8mb4;`
- **Generated/ignored:** `app/` (babel compile output), `runtime/`, `logs/`, `node_modules/`
- **Static files (dev):** served from `www/` via `resource` middleware

### Commands (run from `nideshop-server/`)

| Command | What it does |
|---|---|
| `npm start` | Dev mode with Babel transpilation + file watcher |
| `npm run compile` | `babel src/ --presets think-node --out-dir app/` |
| `npm run lint` | `eslint src/` (extends `think`) |
| `npm run lint-fix` | `eslint --fix src/` |
| *(none)* | No test framework configured |

### Auth

- JWT in `X-Nideshop-Token` header. Same secret (`SLDLKKDS323ssdd@#@@gf`) in both `src/api/service/token.js` and `src/admin/service/token.js`
- Unauthenticated endpoints are declared in `src/api/config/config.js` as `publicController` and `publicAction` arrays

### Configs to fill before use

- `src/common/config/config.js` — WeChat (appid, secret, mch_id, partner_key, notify_url) + 快递鸟 (appid, appkey)
- `src/common/config/database.js` — MySQL credentials

### `src/` structure

- `src/api/` — mini-program API (17 controllers: auth, goods, cart, order, pay, etc.)
- `src/admin/` — admin backend API (10 controllers)
- `src/common/` — config (database, middleware, adapter, router, extend), bootstrap hooks

### Production

- PM2 (`pm2.json`, `exec_mode: fork`, cwd `/var/www/nideshop`), Nginx reverse proxy (`nginx.conf`)

## `nideshop-client/` — WeChat Mini Program

- Raw Mini Program — no build tool, no npm, no bundler. Open in WeChat Dev Tools.
- API base URL in `config/api.js` — defaults to `http://127.0.0.1:8360/api/`
- 33 page routes in `app.json`, 5-tab layout (首页, 专题, 分类, 购物车, 我的)
- AppID in `project.config.json`: `wxad7bbc6214e1719b`
- Helper services in `services/pay.js` and `services/user.js`
