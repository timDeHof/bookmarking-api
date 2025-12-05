# Bookmarking API

A simple bookmarking API built with Hono, Drizzle ORM, and SQLite/PostgreSQL.

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL setup)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

### Using SQLite (Default)

The application uses SQLite by default. Just run:

```bash
npm run dev
```

### Using PostgreSQL with Docker

1. Start the PostgreSQL container:

```bash
docker-compose up -d
```

2. Install PostgreSQL dependencies:

```bash
npm install postgres
```

3. Create a `.env` file with the database connection:

```env
DATABASE_URL=postgres://bookmark_user:bookmark_password@localhost:5432/bookmark_db
```

4. Update the database import in your application to use PostgreSQL:

```typescript
// Change from:
import { db } from "./drizzle/database.ts";

// To:
import { db } from "./drizzle/database.postgres.ts";
```

5. Run the application:

```bash
npm run dev
```

### Accessing pgAdmin

If you want to manage the database visually, pgAdmin is available at:

- URL: http://localhost:5050
- Email: admin@example.com
- Password: admin_password

## Database Schema

The application uses the following tables:

- `bookmarks`: Stores bookmark information
- `bookmark_tags`: Stores tags associated with bookmarks

## API Endpoints

- `GET /bookmarks`: Get all bookmarks
- `POST /bookmarks`: Create a new bookmark
- `GET /bookmarks/:id`: Get a specific bookmark
- `PUT /bookmarks/:id`: Update a bookmark
- `DELETE /bookmarks/:id`: Delete a bookmark

## Development

- Run in development mode: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
