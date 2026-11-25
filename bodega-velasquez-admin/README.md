# Bodega Velasquez Admin

Independent Vite frontend for authenticated administration of products, categories, customers, orders, and promotions.

## Local use

1. Copy `.env.example` to `.env.local` and fill in the Firebase Web App API key and App ID shown in Firebase Console → Project settings → General → Bodega Velasquez Admin app.
2. Confirm Firebase Authentication has Email/Password enabled and create the administrator user in Authentication → Users.
3. Run `npm install` and `npm run dev -- --port 5174`.
4. Open the Vite URL. The panel sends Firebase ID tokens to the API; the API must include the signed-in email in `ADMIN_EMAILS`.

The Firebase Web App config is public client configuration. Never put a Firebase Admin service-account key in this frontend.

## Production

Build with `npm run build` and deploy `dist` as a separate static site. Configure the `VITE_API_URL` and `VITE_FIREBASE_*` values for the deployed site before building. Add the exact site origin to the API's Render `ALLOWED_ORIGINS`.

## Install as an app

The admin panel is an installable Progressive Web App (PWA). Serve it over HTTPS and open its URL in Chrome or Edge. Use the install icon in the address bar (or the browser menu → **Install app**) and confirm the browser prompt. Browsers require this user confirmation; a website cannot silently install itself. On iPhone or iPad, open the panel in Safari, tap **Share**, then choose **Add to Home Screen**.

The service worker caches the application shell and static assets only. It does not cache Firebase, API responses, customer data, or orders; data management still requires an internet connection.
