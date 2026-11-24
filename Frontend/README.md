# ShopNest frontend

## Local development

```bash
npm install
npm run dev
```

Set `VITE_API_URL` to the backend origin when the API is hosted separately, for
example `https://api.example.com`. If it is omitted, development uses
`http://localhost:2000` and a production build uses the current site origin.

## Production build

```bash
npm run build
```

Deploy the generated `dist/` directory as a static site. Configure
`VITE_API_URL` in the hosting provider before building when the backend is on a
different origin. The backend must allow the frontend's exact HTTPS origin via
its `FRONTEND_URL` setting.
