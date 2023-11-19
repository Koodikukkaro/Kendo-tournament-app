# Kendo Tournament App (Backend)

## Getting Started

These instructions will help you set up the project locally for development and testing purposes. To access a local database, follow the instructions [here](https://github.com/Koodikukkaro/Kendo-tournament-app/blob/development/backend/database/README.md).

### Prerequisites

- Node.js (v18.x or higher)
- Access to MongoDB (../database with Docker, local or Atlas)

### Installation

1. Use the node version defined in .nvmrc (or simply run `nvm use` if you have nvm installed)

2. Install dependencies

    ```bash
    npm install
    ```

3. Copy `.env.example` and set up the `.env` as required.

    ```bash
    cp `.env.example` `.env`
    ```
    
4. The backend uses [tsoa](https://github.com/lukeautry/tsoa) for generating the routes and the swagger documentation files. To generate these files you can run: 

    ```bash
    npm run build
    ```

5. Start the dev server

    ```bash
    npm run dev
    ```

if you have `docker` installed, then

1. Use `docker-compose` to run the system in dev mode:

  ```bash
  docker-compose up --build
  ```

The first time it will take time to build and run. Every other time, it will take 2-3 minutes to set up and 20-25 seconds to shut down the containers.

## Usage 

The API documentation can be accessed via the `/docs` endpoint. 

### Authentication

The API uses [JSON Web Tokens](https://jwt.io/) for authentication and authorization.

To access private endpoints, you must first authenticate as a user using the `auth\login` endpoint. Upon successful login, the server responds with an access token, which is set as an HTTP-only cookie in the response. The cookie is then automatically attached to all of the requests to the same domain.

Note that the lifespan of the access token is short-lived. If you need to refresh the token, you can do so via the `auth/refresh` endpoint.

### Authorization

The roles of the users are scoped to tournaments and matches. I.e., the tournament organizers can act as an administrator for their organized tournament. The role of an official needs to be assigned by the tournament administrator.