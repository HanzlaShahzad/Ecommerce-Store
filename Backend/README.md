# ShopNest backend

## Run locally

```bash
npm install
npm run dev
```

Use `npm start` for a production process. The service listens on `PORT`, or
`2000` when `PORT` is not set.

## Required environment

Set these values in the backend host's secret/environment settings; never put
production credentials in source control:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string |
| `SECRET` | Long, random JWT signing secret |
| `FRONTEND_URL` | Exact deployed frontend origin, including `https://` |
| `CLIENT_URL` | Frontend base URL used by verification and Stripe redirects |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `WEBHOOK_SECRET_KEY` | Signing secret for the Stripe `/stripe-webhook` endpoint |
| `EMAIL_USER` | Gmail address used to send verification emails |
| `EMAIL_PASS` | Google App Password (not the Gmail account password) |
| `CLoudinary_Cloud_Name` | Cloudinary cloud name |
| `CLoudinary_Api_Key` | Cloudinary API key |
| `CLoudinary_Api_Secret` | Cloudinary API secret |

Set `FRONTEND_URL` to the frontend origin without a trailing slash. Configure
the Stripe webhook to call `https://<backend-origin>/stripe-webhook` and copy
its signing secret into `WEBHOOK_SECRET_KEY`. The frontend separately needs
`VITE_API_URL` set to the backend origin when frontend and backend are hosted
on different domains.
