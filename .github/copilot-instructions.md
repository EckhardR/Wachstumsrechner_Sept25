# Copilot Instructions for Growth Calculator Web App

## Architecture Overview
- **Monorepo structure**: Contains `frontend` (React), `backend` (Node.js/Express), and `db` (MySQL) directories.
- **Containerized**: All components run in Docker containers, orchestrated via `docker-compose.yml`.
- **Data flow**: Frontend communicates with backend via REST API; backend connects to MySQL database.
- **Config files**: Environment variables are set in `.env` (see root README for required keys).

## Key Workflows
- **Start all services**: `docker-compose up --build` from project root.
- **Build single service**: `docker compose up -d --no-deps --build <service>`
- **Frontend dev**: `cd frontend && npm start` (runs React app on port 3000)
- **Backend dev**: `cd backend && npm run dev` (if not using Docker)
- **Database**: MySQL schema in `db/mysqlDatabase.sql`; admin via phpMyAdmin (see Docker setup).

## Project-Specific Patterns
- **Backend routes**: Organized by resource in `backend/routes/`, with v2 APIs in `backend/routes/v2/`.
- **Frontend components**: Grouped by feature in `frontend/src/components/` (e.g., `Admin`, `patient`, `darkMode`).
- **API calls**: Use `frontend/src/services/Api.js` for backend communication.
- **Internationalization**: Managed via `frontend/src/i18n.js`.
- **Custom utilities**: Shared helpers in `frontend/src/utils/`.

## Integration Points
- **External dependencies**: React, Express, MySQL, Docker, phpMyAdmin.
- **Cross-component communication**: REST API (JSON), environment variables for config.
- **Frontend-backend integration**: API endpoints defined in backend controllers, consumed via frontend services.

## Conventions & Examples
- **Versioned APIs**: Use `/v2/` subfolder for new/updated endpoints (see `backend/routes/v2/`).
- **Component structure**: Example: `frontend/src/components/patient/patient-form.js` for patient forms.
- **Service abstraction**: Example: `frontend/src/services/Api.js` wraps axios for API requests.
- **Docker usage**: All builds and deployments should use Docker unless explicitly developing outside containers.

## References
- See root `README.md` for setup, environment, and Docker instructions.
- See `frontend/README.md` for React-specific scripts and conventions.
- Key files: `docker-compose.yml`, `.env`, `backend/routes/`, `frontend/src/components/`, `frontend/src/services/Api.js`, `db/mysqlDatabase.sql`.

---
_If any section is unclear or missing important project-specific details, please provide feedback to improve these instructions._
