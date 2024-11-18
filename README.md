# AS Backend

This project is a backend for the "Amigo Secreto" event management system, where it is possible to conduct draws among groups of people. It is built with Node.js, Express, and TypeScript, and uses Prisma for database management and Zod for schema validation.

```

## Project Structure

.env
.env.example
.gitignore
build/
	controllers/
		auth.js
		events.js
		groups.js
		people.js
	libs/
		prisma.js
	routes/
		admin.js
		main.js
		site.js
	schemas/
		event.js
		group.js
		login.js
		person.js
	server.js
	services/
		auth.js
		event.js
		groups.js
		people.js
	types/
		Group.js
		People.js
	utils/
		getCurrentDate.js
		...
package.json

prisma/
	migrations/
	schema.prisma

README.md

src/
	controllers/
	libs/
	routes/
	schemas/
	server.ts
	services/
	types/
	utils/

tsconfig.json

```

## Getting Started

### Prerequisites

- Node.js
- npm
- Prisma

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/kauavitorrodrigues/as-backend.git
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Set up the environment variables:
    ```sh
    cp .env.example .env
    ```

### Running the Project

#### Development

To run the project in development mode:
```sh
npm run dev
```

#### Build

To build the project:
```sh
npm run build
```

#### Production

To start the project in production mode:
```sh
npm start
```

### Database Migration

To run database migrations in development:
```sh
npm run migrate:dev
```

To deploy database migrations:
```sh
npm run migrate:deploy
```

## Project Structure

- `controllers/`: Contains the controllers for handling requests.
- `libs/`: Contains library files.
- `routes/`: Contains route definitions.
- `schemas/`: Contains schema definitions for validation.
- `services/`: Contains service files for business logic.
- `types/`: Contains TypeScript type definitions.
- `utils/`: Contains utility functions.
- `prisma/`: Contains Prisma configuration and migration files.
- `src/`: Contains the source code for the project.