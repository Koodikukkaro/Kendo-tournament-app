# Koodikukkaro (Kendo Backend)

Koodikukkaro is a RESTful backend API built with Node.js, Express, and MongoDB. This project aims to provide a robust and secure backend service with advanced features like user authentication, CRUD operations, and more.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

These instructions will help you set up the project locally for development and testing purposes.

Swagger documentation at /doc

### Prerequisites

- Node.js (v18.x or higher)
- Access to MongoDB (../database with Docker, local or Atlas)

### Installation

1. Clone the repository

   ```bash
   git clone git@github.com:Koodikukkaro/Kendo-tournament-app.git
   ```

2. Navigate to the project directory

    ```bash
    cd backend/server
    ```

3. Install dependencies

    ```bash
    npm install
    ```

4. Copy `.env.example` and set up the `.env` as required.

    ```bash
    cp `.env.example` `.env`
    ```
    
5. Generate the routes and the API documentation files

    ```bash
    npm run build
    ```

6. Start the dev server

    ```bash
    npm run dev
    ```

if you have `docker` installed, then

1. Use `docker-compose` to run the system in dev mode:

  ```bash
  docker-compose up --build
  ```

The first time it will take time to build and run. Every other time, it will take 2-3 minutes to setting up and 20-25 seconds to shutdown the containers.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

See `LICENSE` for more information.
