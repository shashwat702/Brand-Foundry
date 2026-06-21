Google OAuth quick setup for deployed app
======================================

Follow these steps to fix the "origin_mismatch" (Error 400) when signing in with Google on your deployed site.

1) Google Cloud Console — OAuth 2.0 Client
- Open https://console.cloud.google.com/apis/credentials and select your project.
- Find the OAuth 2.0 Client ID used by your app (the one matching `VITE_GOOGLE_CLIENT_ID`).
- Edit the client and set:
  - Authorized JavaScript origins:
    - add your deployed origin, e.g. `https://branfy-five.vercel.app`
    - add any dev origins you use, e.g. `http://localhost:5173`
  - Authorized redirect URIs:
    - add the redirect URI you configured, e.g. `https://branfy-five.vercel.app/auth/google/callback`
    - add dev callback: `http://localhost:5173/auth/google/callback`

2) Vercel environment variables
- In your Vercel project settings, set the same Vite env vars for production:
  - `VITE_GOOGLE_CLIENT_ID` = (your client id)
  - `VITE_GOOGLE_REDIRECT_URI` = (the redirect URI above)
  - `VITE_API_URL` = (your backend URL)

3) Redeploy
- After saving changes in Google Cloud and Vercel, re-deploy the Vercel project so the runtime sees the updated env vars.

4) Quick verification
- Open the deployed site and open the browser console. You should see logs:
  - `Google clientId (VITE_GOOGLE_CLIENT_ID): ...`
  - `Google redirect URI (VITE_GOOGLE_REDIRECT_URI): ...`
  - `App origin: https://branfy-five.vercel.app`
- Try signing in again.

5) If you still see origin_mismatch
- Confirm the origin shown in the console exactly matches one of the Authorized JavaScript origins in Google Cloud (including protocol and host).
- Confirm the redirect URI shown matches exactly one of the Authorized redirect URIs (no trailing slash differences).

Notes
- The app uses the client-side Google Identity flow via `@react-oauth/google`. An origin_mismatch means Google blocked the JavaScript origin — it must be listed in the OAuth client settings.
- If you prefer a server-side (authorization-code) flow, I can add a callback route and exchange codes on the server — tell me if you want that.
