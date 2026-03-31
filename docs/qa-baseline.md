# QA Baseline

## Goal
为乐清商会项目提供一套可重复执行的 QA 基线，避免测试口径漂移。

## Fixed Entry
- Repo: `flyzorro/yueqing-chamber`
- Primary QA path: member query flow
- Preferred validation surface: Expo Web
- API base URL: `EXPO_PUBLIC_API_BASE_URL`
- If `EXPO_PUBLIC_API_BASE_URL` is not set, dev fallback is `http://127.0.0.1:3000`

## Environment Baseline
### Server
Required env:
- `DATABASE_URL`
- `DIRECT_DATABASE_URL` (for schema/setup tasks)
- `JWT_SECRET`
- `NODE_ENV`
- `PORT`

### Mobile
Recommended QA env:
- `EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:3000`

## Data Baseline
Before QA, verify real DB baseline:
```bash
cd server
npm run db:verify:real
```
Expected:
- pooled/direct both connect
- `memberCount` is available

## Minimal Verification Scope
Run QA for:
1. Default member list
2. Search by name
3. Search by company
4. Status filter
5. Pagination / load more
6. Empty state
7. Error state
8. Retry after error
9. Refresh keeps current keyword/status

## Suggested Verification Commands
### Server checks
```bash
cd server
npx prisma validate
npm run db:verify:real
npm run dev
```

### API smoke
```bash
curl 'http://127.0.0.1:3000/api/members?page=1&limit=10'
curl 'http://127.0.0.1:3000/api/members?page=1&limit=10&keyword=乐清'
```

## Pass Criteria
QA can be considered pass-ready when:
- member list API returns 200
- search/filter/pagination behave correctly
- empty/error/retry paths are reproducible
- refresh preserves current conditions
- no evidence that client is using fixture/local fallback unexpectedly

## Known Limits
- Expo Web is the closest current QA surface, not final packaged build
- Pull-to-refresh gesture behavior on web may differ from device behavior
- If real Neon data changes, rerun `npm run db:verify:real` first
