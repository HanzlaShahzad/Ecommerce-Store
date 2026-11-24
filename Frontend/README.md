# ShopNest frontend

## Local development

```bash
npm install
npm run dev
```

Local development uses `http://localhost:2000` by default. Production uses
`https://shop-nest-git-main-hanzla-s-team.vercel.app`; set `VITE_API_URL` in the
hosting provider to override the API origin.

## Production build

```bash
npm run build
```

The local frontend runs at `http://localhost:5173` and the API at
`http://localhost:2000`. For the Cloudflare deployment, set
`VITE_API_URL=https://shop-nest-git-main-hanzla-s-team.vercel.app` and allow
the frontend origin in the backend's `FRONTEND_URL` setting. The backend
deployment must be publicly accessible; a Vercel SSO-protected deployment
cannot serve browser API requests from the storefront.
