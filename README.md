# Real Estate Market Analytics

A modern, full-stack web application for analyzing real estate data.
This project helps users homeowners, buyers, investors, and agents gain insights into the housing market, analyze trends, and make data-driven decisions.

---

## 🏗️ Project Structure

```
real-state-project/
├── backend/   # FastAPI backend (Python)
├── frontend/  # React + Vite frontend (JS/TS)
├── docker-compose.yml
└── README.md
```

* **Frontend**: React app served by Nginx, built with Vite.
* **Backend**: FastAPI REST API (Python), running on Uvicorn.
* **Database**: PostgreSQL container.

---

## 🚀 Quick Start (Local Development)

1. **Clone this repository**

   ```bash
   git clone https://github.com/youruser/real-state-project.git
   cd real-state-project
   ```

2. **Run everything with Docker Compose**

   ```bash
   docker-compose up --build
   ```

   * **Frontend**: [http://localhost:3000](http://localhost:3000)
   * **Backend API docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   * **Database**: accessible at `localhost:5432` (user: `user`, pass: `pass`, db: `realestate`)

3. **To stop the services**

   ```
   docker-compose down
   ```

---

## 🧩 Project Components

### Backend (FastAPI)

* Located in `/backend`
* Main entry: `backend/app/main.py`
* Key dependencies: FastAPI, Uvicorn, SQLAlchemy, psycopg2-binary

### Frontend (React + Vite)

* Located in `/frontend`
* Main entry: `frontend/index.html` and `frontend/src/main.jsx`
* Built and served by Nginx for production-like local development

### Database (PostgreSQL)

* Dockerized Postgres 15 container
* Connection settings defined in `docker-compose.yml` and `.env` files

---

## 🐳 Docker Compose Overview

* **frontend**: Builds and serves the React app using Nginx.
* **backend**: Runs the FastAPI app on Uvicorn.
* **db**: Launches a Postgres database instance.

**All containers are networked and managed together for a seamless dev experience.**

---

## ⚙️ Environment Variables

* `backend/.env.development` (example)

  ```
  DATABASE_URL=postgresql://user:pass@db:5432/realestate
  ```

* `frontend/.env.local` (example)

  ```
  VITE_API_URL=http://localhost:8000
  ```

---

## 📖 API Documentation

* FastAPI auto-generates docs at [http://localhost:8000/docs](http://localhost:8000/docs).
* Try the root endpoint:

  ```
  GET /   ->   { "message": "Hello, Real Estate!" }
  ```

---

## 🛠️ Useful Commands

* **Rebuild images after changes:**

  ```bash
  docker-compose build
  ```
* **Run only backend or frontend:**

  ```bash
  docker-compose up backend
  docker-compose up frontend
  ```

---

## 🏆 Next Steps

* Implement core database models and CRUD endpoints
* Connect frontend to backend APIs
* Add analytics and visualizations for real estate trends
* Prepare for cloud deployment (optional, future)

---

## 📄 License

[MIT License](LICENSE)

---

## 👤 Author

*Spencer Navas*

---
