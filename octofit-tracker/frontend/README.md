# OctoFit Tracker Frontend

This Vite app powers the presentation tier for the OctoFit Tracker multi-tier application.

## Environment configuration

The frontend must know the current GitHub Codespace name so it can call the backend at the correct GitHub.dev URL.

Create a `.env.local` file in this directory with:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

If `VITE_CODESPACE_NAME` is left blank or undefined, the app falls back to `http://localhost:8000` for local development instead of building a broken `https://undefined-8000.app.github.dev` URL.

## Local development

```bash
npm install
npm run dev
```

The app will call backend endpoints using:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

when running in GitHub Codespaces, or fall back to the local backend URL during local development.
