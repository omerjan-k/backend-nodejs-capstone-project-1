# Second Chance — Node.js Capstone Project

A full-stack capstone project implementing a marketplace for reusable items.

Key parts:
- Backend: Express + MongoDB — secondChance-backend/
- Frontend: React — secondChance-frontend/
- Sentiment microservice: sentiment/

Repository highlights
- Backend
  - Server entry: secondChance-backend/app.js
  - Database helper: secondChance-backend/models/db.js
  - Routes: secondChance-backend/routes/
  - Static files: secondChance-backend/public/images
  - Import tool: secondChance-backend/util/import-mongo/
- Frontend
  - App entry: secondChance-frontend/src/index.js
  - Config: secondChance-frontend/src/config.js
- Sentiment service
  - sentiment/index.js

Prerequisites
- Node.js (v16+ recommended)
- Running MongoDB instance

Environment
Copy and edit the provided samples:
- secondChance-backend/.env.sample
- secondChance-frontend/.env.sample
Important variables:
- MONGO_URL — MongoDB connection string (see .env.sample)
- JWT_SECRET — authentication secret
- REACT_APP_BACKEND_URL — frontend -> backend base URL

Quick setup (macOS)
1. Backend
   cd secondChance-backend
   npm install
   npm run dev

2. Frontend
   cd secondChance-frontend
   npm install
   npm start

3. Sentiment (optional)
   cd sentiment
   npm install
   npm start

Import sample data
cd secondChance-backend/util/import-mongo
node index.js

API overview (backend routes)
- Auth: POST /api/auth/register, POST /api/auth/login, PUT /api/auth/update
- Items: GET/POST/GET(id)/PUT/DELETE at /api/secondchance/items
- Search: GET /api/secondchance/search?name=&category=&condition=&age_years=

Notes
- Uploaded images stored in secondChance-backend/public/images
- Logger implementations in backend and sentiment folders
- License: see LICENSE at repository root
