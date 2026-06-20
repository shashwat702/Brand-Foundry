# Brand Foundry

Startup branding assistant — React + Vite frontend with an Express/Node backend for AI-powered startup video and branding generation.

Repository: https://github.com/shashwat702/Brand-Foundry

## Overview

- Frontend: React + Vite (client app in `src/`)
- Backend: Node/Express (server in `server/`)
- Features: AI generation endpoints, Cloudinary integration, video/reel templates

## Quick start

1. Install dependencies (root and server):

```bash
npm install
cd server
npm install
cd ..
```

2. Create a `.env` file in the `server/` folder (see `server/.env.example`) and set the required keys (Cloudinary, DB, JWT_SECRET, etc.).

3. Run the frontend and backend (two terminals):

Frontend:
```bash
npm run dev
```

Backend (from `server/`):
```bash
node server.js
```

## Notes

- Sensitive files such as `.env` should not be committed — ensure you update your `.gitignore` with the appropriate entries.
- See `server/.env.example` for the env variables required by the backend.

## Contributing

PRs and issues are welcome.

If you want me to add CI, a deployment workflow, or a GitHub release, tell me and I'll prepare the files.
