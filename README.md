# Real Estate Investment Portfolio Manager

A full-stack application for managing real estate investment portfolios, built with FastAPI, React, and PostgreSQL.

## Features

- **Property Management**

  - Add, edit, and delete properties
  - Track property details (address, type, bedrooms, bathrooms, square footage)
  - Monitor property values and purchase prices
  - View property history and status

- **Sales Analytics**

  - Track property sales and ROI
  - View market trends and average prices
  - Analyze sales volume over time
  - Property type distribution analysis

- **Renovation Tracking**

  - Record renovation projects and costs
  - Track renovation status and progress
  - Calculate renovation ROI
  - Analyze renovation costs by property type

- **Dashboard**
  - Interactive charts and graphs
  - Key performance metrics
  - Market trend visualization
  - Property portfolio overview

## Tech Stack

- **Backend**

  - FastAPI (Python)
  - SQLAlchemy (ORM)
  - PostgreSQL (Database)
  - Pydantic (Data validation)

- **Frontend**
  - React
  - TypeScript
  - Chart.js (Data visualization)
  - Tailwind CSS (Styling)

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Docker and Docker Compose

## Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd real-state-project
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Database Setup**

   ```bash
   # Start PostgreSQL using Docker
   docker-compose up -d db

   # Run database migrations
   cd backend
   alembic upgrade head
   ```

4. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   ```

5. **Environment Variables**
   Create a `.env` file in the backend directory:

   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/real_estate
   SECRET_KEY=your-secret-key
   ```

6. **Running the Application**

   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn app.main:app --reload

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   The application will be available at:

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## API Endpoints

- `GET /api/properties` - List all properties
- `POST /api/properties` - Create a new property
- `GET /api/properties/{id}` - Get property details
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property
- `GET /api/analytics/sales` - Get sales analytics
- `GET /api/analytics/renovations` - Get renovation analytics

## Project Structure

```
real-state-project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── alembic/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   └── types/
│   └── package.json
└── docker-compose.yml
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🏗️ Project Structure

```
real-state-project/
├── backend/   # FastAPI backend (Python)
├── frontend/  # React + Vite frontend (JS/TS)
├── docker-compose.yml
└── README.md
```

- **Frontend**: React app served by Nginx, built with Vite.
- **Backend**: FastAPI REST API (Python), running on Uvicorn.
- **Database**: PostgreSQL container.

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

   - **Frontend**: [http://localhost:3012](http://localhost:3012)
   - **Backend API docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Database**: accessible at `localhost:5432` (user: `user`, pass: `pass`, db: `realestate`)

3. **To stop the services**

   ```
   docker-compose down
   ```

---

## 🧩 Project Components

### Backend (FastAPI)

- Located in `/backend`
- Main entry: `backend/app/main.py`
- Key dependencies: FastAPI, Uvicorn, SQLAlchemy, psycopg2-binary

### Frontend (React + Vite)

- Located in `/frontend`
- Main entry: `frontend/index.html` and `frontend/src/main.tsx`
- Built and served by Nginx for production-like local development
- **Now fully TypeScript: all new code should use `.tsx` or `.ts` extensions**

### Database (PostgreSQL)

- Dockerized Postgres 15 container
- Connection settings defined in `docker-compose.yml` and `.env` files

---

## 🐳 Docker Compose Overview

- **frontend**: Builds and serves the React app using Nginx.
- **backend**: Runs the FastAPI app on Uvicorn.
- **db**: Launches a Postgres database instance.

**All containers are networked and managed together for a seamless dev experience.**

---

## ⚙️ Environment Variables

- `backend/.env.development` (example)

  ```
  DATABASE_URL=postgresql://user:pass@db:5432/realestate
  ```

- `frontend/.env.local` (example)

  ```
  VITE_API_URL=http://localhost:8000
  ```

---

## 📖 API Documentation

- FastAPI auto-generates docs at [http://localhost:8000/docs](http://localhost:8000/docs).
- Try the root endpoint:

  ```
  GET /   ->   { "message": "Hello, Real Estate!" }
  ```

---

## 🛠️ Useful Commands

- **Rebuild images after changes:**

  ```bash
  docker-compose build
  ```

- **Run only backend or frontend:**

  ```bash
  docker-compose up backend
  docker-compose up frontend
  ```

---

## 🗂️ Entity Relationship Diagram (ERD)

![Entity Relationship Diagram](ERD.png)

## 🖼️ Project System Design

![System Design Diagram](systemdesign.jpg)

---

## 📄 License

[MIT License](LICENSE)

---

## 👤 Author

_Spencer Navas_

---

## UI/UX

- Modern navigation bar with dropdown analytics menu
- Responsive Home and About pages
- Consistent, modern styling with Tailwind CSS
- Analytics dashboards for sales and renovations

## Key Frontend Components

- **PropertyList**: Manage and display properties
- **SaleList**: Manage and display sales
- **RenovationList**: Manage and display renovations
- **PropertyAnalytics, SalesAnalytics, RenovationsAnalytics**: Analytics dashboards
- **Home, About, Footer**: Main site pages and layout

## Frontend Testing

- Unit and integration tests are written using Jest and React Testing Library.
- To run tests:
  ```bash
  cd frontend
  yarn jest
  ```
  or
  ```bash
  npx jest
  ```
- Test files are located in `frontend/src/components/__tests__/`.
- For setup, see `frontend/src/setupTests.ts`.
