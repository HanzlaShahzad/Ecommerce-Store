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
| `FRONTEND_URL` | Frontend origin allowed by CORS (local default: `http://localhost:5173`) |
| `CLIENT_URL` | Frontend base URL used by verification and Stripe redirects |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `WEBHOOK_SECRET_KEY` | Signing secret for the Stripe `/stripe-webhook` endpoint |
| `EMAIL_USER` | Gmail address used to send verification emails |
| `EMAIL_PASS` | Google App Password (not the Gmail account password) |
| `CLoudinary_Cloud_Name` | Cloudinary cloud name |
| `CLoudinary_Api_Key` | Cloudinary API key |
| `CLoudinary_Api_Secret` | Cloudinary API secret |

For local development, set `FRONTEND_URL` and `CLIENT_URL` to
`http://localhost:5173`. The frontend API defaults to `http://localhost:2000`.
For the current deployment, set `FRONTEND_URL` and `CLIENT_URL` in Vercel to
`https://shop-nest.hanzlashahzad41.workers.dev`, and set the frontend's
`VITE_API_URL` to `https://shop-nest-git-main-hanzla-s-team.vercel.app`.
Disable Vercel Deployment Protection for the API deployment so browser requests
from the storefront do not get redirected to Vercel SSO. Configure the Stripe
webhook endpoint as
`https://shop-nest-git-main-hanzla-s-team.vercel.app/stripe-webhook`.
