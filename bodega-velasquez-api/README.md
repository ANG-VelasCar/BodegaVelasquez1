# Firebase / Firestore setup

Firestore collections replace the in-memory data modules:

- `categories`: category catalog.
- `products`: product catalog, stock, and a `categoryRef` path.
- `customers`: customer contact details and normalized email.
- `orders`: immutable item/price snapshots, customer path, and current status.
- `promotions`: active campaigns and product paths.

The API uses Firebase Admin SDK. Keep its service-account JSON out of source control and the browser. Firestore Security Rules can deny direct client access because all database access goes through this API.

## Deploy the API to Render

The repository includes a root-level `render.yaml` Blueprint for this API. Before using it:

1. Push the latest repository changes, including `render.yaml`, to GitHub.
2. In Render, choose **New → Blueprint**, connect `ANG-VelasCar/BodegaVelasquez1`, and select the branch containing those changes.
3. Render will read `render.yaml` and create the `bodega-velasquez-api` web service. Enter the requested `FIREBASE_SERVICE_ACCOUNT_JSON` secret and `ALLOWED_ORIGINS` values in Render; never commit them.
4. For `ALLOWED_ORIGINS`, enter the exact HTTPS origins of the storefront and the admin panel, separated by commas, without paths or trailing slashes. If either site is not hosted yet, deploy it first and then add its origin in the API service's Render environment.
5. Deploy the service and check `https://<your-api-host>/api/health`; it should return `{"success":true,"data":{"firestore":"connected"}}`.

The Blueprint preconfigures project ID `bodega-aab6f` and administrator email `angel.vc.0205@gmail.com`. Review these values in Render before creating the service. The API rejects browser origins unless they are listed in `ALLOWED_ORIGINS`.

## Initial data

The seed script copies the existing sample records into the five collections with their original IDs. It adds references between categories/products, customers/orders, and products/promotions/orders. It refuses to run if any target collection already has documents.

1. Create a Firebase service account with Firestore access, download its JSON key locally, and store it outside this repository.
2. From PowerShell in this directory, set the credential path and run the seed script:

   ```powershell
   $env:FIREBASE_PROJECT_ID = "bodega-aab6f"
   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\secure\firebase-admin.json"
   npm run seed:firestore
   ```

3. Keep the downloaded key private and remove it from any shared/download folder when finished. Do not commit it or paste its contents into chat.

The seed script is a one-time migration for the current sample arrays, not a runtime fallback. API operations use Firestore only.

## Render API environment

Configure these values in the API service's Render environment, then deploy the updated API:

- `FIREBASE_PROJECT_ID`: `bodega-aab6f`.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: the complete service-account JSON as a Render secret value. Never add it to `.env`, Git, or the frontend.
- `ADMIN_EMAILS`: comma-separated email addresses of Firebase Authentication users permitted to manage data.
- `ALLOWED_ORIGINS`: exact HTTPS origins of the storefront and admin frontend, comma-separated.

The API verifies Firebase ID tokens and checks the account email/UID against its administrator allowlist. Creating an Authentication user alone does not grant API administration until its email or UID is allowlisted.

## Local API

Copy `.env.example` to `.env`, configure a local service-account path via `GOOGLE_APPLICATION_CREDENTIALS`, and set the authorized admin email. Run `npm run dev`. The checked-in `.env.example` contains placeholders only.

## Firestore data and inventory rules

Checkout is public, but it trusts neither the submitted total nor submitted prices. The API reads current product prices, checks availability, deducts stock, creates/updates the customer by normalized email, and writes the order in one Firestore transaction. Order items retain product IDs, names, prices, and quantities as a historical snapshot.

Order/customer reads and all administrative writes require an allowlisted Firebase Authentication token. Orders are not hard-deleted; status changes preserve their audit trail. Product deletion is soft deletion so order history can retain product references.
