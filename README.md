# Mini CRM Backend - Sprint 1

Production-ready Node.js backend for Sprint 1 scope: authentication, user CRUD, validation, Swagger docs, seed script, and Docker setup.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Joi validation
- Swagger OpenAPI
- Docker + Docker Compose

## Project Structure

```text
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  utils/
  validations/
  seeds/
```

## Environment Variables

1. Copy `.env.example` to `.env`
2. Set values:

```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=15m
```

## Install & Run

```bash
npm install
npm run dev
```

## API Docs

- Swagger UI: `http://localhost:5000/api-docs`

## Seed Data

Creates:
- 1 admin user
- 1 manager user
- 2 regular users

Run:

```bash
npm run seed
```

Default seeded users:
- `admin@academy.az / Admin123!`
- `manager@academy.az / Manager123!`
- `user1@academy.az / User12345!`
- `user2@academy.az / User12345!`

## Docker

```bash
docker compose up --build
```

App runs on `http://localhost:5000`.
