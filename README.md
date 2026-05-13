# Productivity Hub

Complete 4-in-1 Windows desktop productivity app built with Electron, React 18, Vite, Tailwind CSS, Zustand, react-beautiful-dnd, date-fns, lucide-react, and Docker.

## Modules

- Eisenhower Matrix with persistent priority tasks.
- Time Blocking weekly calendar with modal block creation and duration resizing.
- Pomodoro Timer with settings, SVG progress, system tray status, notifications, and daily focus totals.
- Kanban Board with draggable cards and columns, search, priorities, custom columns, and matrix import.

## Local Development

```powershell
npm install
npm run dev
```

The Electron window opens at `1200x800` with a minimum size of `1024x700`.

## Login

The app uses a single administrator account configured in `src/store/useAuthStore.js`.

## Web Preview / Render

Build and run the web server locally:

```powershell
npm run build
npm start
```

Render deployment:

- Push this repository to GitHub.
- Create a Render Web Service from the GitHub repository.
- Render can use `render.yaml` automatically.
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Add `MONGODB_URI` in Render Environment Variables for MongoDB Atlas persistence.

## Production Build

```powershell
npm run dist
```

Windows installers are written to `release/`.

## Docker

The Docker image builds the Vite app and serves the production renderer preview on port `4173`. Desktop Electron windows normally require a host display server, so this container is best for CI-style build verification and web preview.

```powershell
docker compose build
docker compose up productivity-hub
```

Or run:

```powershell
.\scripts\build-and-run-docker.ps1
```

Persistent app data is mounted at `/root/.config/Productivity Hub` through the `productivity-hub-data` volume.

## Shortcuts

- `Ctrl+1`: Matrix
- `Ctrl+2`: Time Blocking
- `Ctrl+3`: Pomodoro
- `Ctrl+4`: Kanban
- `Space`: Start or pause Pomodoro when not typing
- `Ctrl+N`: Quick add task

## Notes

Auto-update support is wired through `electron-updater`; replace the generic publish URL in `electron-builder.yml` with your release feed before publishing.
