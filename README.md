# Chirpy-TS

Chirpy-TS is a simple Twitter clone built with TypeScript. It demonstrates core social media features such as user authentication, posting messages ("chirps"), and basic API endpoints, all implemented with modern TypeScript best practices.

## Features
- User registration and authentication (JWT-based)
- Post, read, and delete chirps
- RESTful API endpoints
- Secure password hashing
- Metrics and readiness endpoints
- Modular, testable codebase

## Requirements
- **Node.js**: v18 or newer is required. You can download it from [nodejs.org](https://nodejs.org/).
- **npm** (comes with Node.js)

## Getting Started

### Installation
```sh
npm install
```

### Running the App
```sh
npm start
```

The server will start and listen on the configured port (see `src/config.ts`).

### Running Tests
```sh
npm test
```

## Project Structure
```
/handlers         # Route handlers for API endpoints
/lib/db           # Database schema, queries, and migrations
/api             # API utilities and helpers
src/auth.ts      # Authentication logic (hashing, JWT)
src/middleware.ts# Express/Polka middleware
src/index.ts     # App entry point
```

## Configuration
- Copy `.env.example` to `.env` and fill in the required environment variables before running the app.

## License
MIT
