# Agent Instructions

## Scope
- This repository is a small Express + MongoDB backend.
- Prefer the actual import graph and runtime flow over filename intuition; several files use inconsistent names.

## Start Here
- Entry point: [src/index.js](src/index.js)
- Scripts: [package.json](package.json)
- Environment: [./.env](.env)

## How To Run
- `npm run dev` starts the server with nodemon.
- `npm start` runs the server with Node.
- There is no test script in [package.json](package.json), so verify changes with focused runtime or lint-style checks when available.

## Architecture
- [src/index.js](src/index.js) loads env vars, connects to MongoDB, installs middleware, and mounts routes.
- Request handling is split across [src/routes](src/routes), [src/controllers](src/controllers), [src/services](src/services), [src/middlewares](src/middlewares), and [src/models](src/models).
- Keep controller logic thin when a service already owns the workflow.

## Conventions And Pitfalls
- Trust the live import paths. The codebase contains naming mismatches such as `authRoute.js`, `studentRoute.js`, and `autenticationMiddleware.js`.
- Role values are not normalized consistently, so check the model and route guard before changing authorization logic.
- The student router wiring in [src/index.js](src/index.js) should be treated carefully because route order matters in Express.
- [src/services/leadService.js](src/services/leadService.js) is incomplete and should not be assumed to be the source of truth for lead behavior without checking the controllers and models.

## Link, Don’t Duplicate
- If detailed behavior is already obvious from code, link to the file instead of restating it.
- Add new instructions only for project-specific behavior that cannot be inferred quickly from nearby code.

## Useful References
- Auth flow: [src/routes/authRoute.js](src/routes/authRoute.js), [src/controllers/authController.js](src/controllers/authController.js), [src/middlewares/autenticationMiddleware.js](src/middlewares/autenticationMiddleware.js)
- Lead flow: [src/routes/leadRoutes.js](src/routes/leadRoutes.js), [src/controllers/leadController.js](src/controllers/leadController.js), [src/services/leadService.js](src/services/leadService.js)
- Student flow: [src/routes/studentRoute.js](src/routes/studentRoute.js), [src/controllers/studentController.js](src/controllers/studentController.js)
- Data models: [src/models/Users.js](src/models/Users.js), [src/models/Lead.js](src/models/Lead.js), [src/models/Student.js](src/models/Student.js)