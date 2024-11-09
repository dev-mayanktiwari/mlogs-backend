# MLOGS: Custom Blog Application for Everyone

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Dependency Graph](#dependency-graph)
- [Development](#development)
  - [Manual Setup](#manual-setup)
  - [Setup using Docker](#setup-using-docker)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

MLOGS is a platform that puts you in control of your content and your data. Unlike typical blogging services, MLOGS is designed for flexibility, whether you're sharing personal stories, tutorials, or professional insights. With a focus on user-friendly design, scalability, and custom features, mlogs is built to grow alongside you.

Why MLOGS?

- **Complete Ownership**: Host it yourself or use our hosting, with full control over your data and content.

- **Flexible & Customizable**: Tailor your blog's appearance, user experience, and features to match your brand.

- **Engaging & Interactive**: Built-in support for comments, likes, and sharing tools to keep your audience engaged.

- **Developer-Friendly**: Designed with a modular architecture, allowing you to expand and scale with ease.

### Built With

- [Node.js](https://nodejs.org/en)
- [Typescript](https://www.typescriptlang.org/)
- [Prisma.io](https://prisma.io/?ref=cal.com)
- [Express](https://expressjs.com/)
- [Zod](https://zod.dev/)

## Getting Started

To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run MLOGS.

- Node.js (Version: >=20.x)
- PostgreSQL (Version: >=13.x)
- NPM

### Dependency Graph

![Backend Dependency Graph](./public/backend-dependency-graph.svg)

## Development

### Manual Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/dev-mayanktiwari/mlogs-final).

   ```sh
   git clone https://github.com/dev-mayanktiwari/mlogs-final
   ```

   > If you are on Windows, run the following command on `gitbash` with admin privileges: <br> > `git clone -c core.symlinks=true https://github.com/dev-mayanktiwari/mlogs-final` <br>

2. Go to the project folder

   ```sh
   cd https://github.com/dev-mayanktiwari/mlogs-final
   ```

3. Install packages with npm

   ```sh
   npm install
   ```

4. Set up your `.env` file

   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` to generate a key and add it under `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` in the `.env` file.
   - Set the `ACCESS_TOKEN_EXPIRY` to 3600000 (1 hour) and the `REFRESH_TOKEN_EXPIRY` to 604800000 (7 days)

5. Setup Node
   If your Node version does not meet the project's requirements as instructed by the docs, "nvm" (Node Version Manager) allows using Node at the version required by the project:

   ```sh
   nvm use
   ```

   You first might need to install the specific version and then use it:

   ```sh
   nvm install && nvm use
   ```

   You can install nvm from [here](https://github.com/nvm-sh/nvm).

6. Database Setup
   You can configure the database for `mlogs` using either a managed service like Aiven or by setting up a local instance. Follow the instructions below for each approach.

   Option 1: Managed Database on Aivenc(or any other servive)
   Using Aiven simplifies database setup, security, and scaling. Here’s how to get started:

   1. **Create an Account on Aiven (or any other service)**

      - Sign up at [Aiven.com](https://aiven.io/) and start a free trial if needed.

   2. **Create a Database Instance**

      - Choose your preferred database type (e.g., PostgreSQL, MySQL).
      - From your Aiven dashboard, select **Create Service**.
      - Configure the instance with the desired name, region, and plan, then create the database.

   3. **Get Connection Details**

      - After creation, navigate to your database’s **Connection Information**.
      - Copy the connection URL, which includes the host, port, user, password, and database name.

   4. **Configure Your Project**

      - Add the database URL to your project’s `.env` file:

      ```plaintext
      DATABASE_URL="your-aiven-database-url"
      ```

   5. **Run Migrations** (if applicable)

      - Run migrations using

      ```sh
      npx prisma migrate dev --name init
      ```

   Option 2: Local Database Setup
   For development purposes, you can also set up a local database. Here’s how to do it with PostgreSQL:

   1. **Install PostgreSQL**

      - Download and install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/).

   2. **Start the PostgreSQL Service**
      - Make sure the PostgreSQL service is running. Use the following commands:

   ```bash
   sudo service postgresql start  # on Linux
   brew services start postgresql # on macOS with Homebrew
   ```

   3. **Create a Database and User**

      - Open the PostgreSQL command line (using `psql`) and set up your database and user:

      ```sql
      CREATE DATABASE mlogs;
      CREATE USER yourusername WITH ENCRYPTED PASSWORD 'yourpassword';
         GRANT ALL PRIVILEGES ON DATABASE mlogs TO yourusername;
      ```

   4. **Configure Your Project**

      - Add your local database connection details to the `.env` file:

      ```plaintext
      DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/mlogs"
      ```

   5. **Run Migrations** (if applicable)
      - Run migrations to set up your local database schema.

7. Log Database Setup (Optional)

   To enable logging in the `mlogs` application, you can set up a MongoDB database to store logs. Follow the steps below to configure MongoDB either through a managed service (MongoDB Atlas) or locally using Docker.

   Setup using MongoDB Atlas (Cloud-based)

   1. **Create an Account on MongoDB Atlas**

      - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.

   2. **Create a New Cluster**

      - After logging in, create a new cluster. Select your preferred cloud provider and region.

   3. **Create a MongoDB User**

      - Go to the "Database Access" section, and create a user with a username and password. Remember to keep these credentials safe.

   4. **Get the Connection String**

      - Replace `<username>` and `<password>` in the connection string with the MongoDB user credentials you created.
      - Go to the "Connect" section, select "Connect your application," and copy the connection string.

   5. **Add the Connection String to Your Environment Variables**

      - In your `.env` file, add the connection string as follows:

      ```plaintext
      MONGO_URL="mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/logs?retryWrites=true&w=majority"
      ```

   6. **Verify the Connection (Optional)**
      - Run a quick connection test in your application to ensure MongoDB is correctly set up and accessible.

8. Redis Setup(Optional, required for email services)

   To enable Redis functionality in the `mlogs` application, you need to configure Redis. You can set up Redis either locally or by using a cloud-based service.

   Redis Cloud (Cloud-based)

   1. **Choose a Redis Cloud Provider**

      - Pick a Redis cloud provider from the following options:
      - [Redis Labs](https://redislabs.com/)
      - [Upstash](https://upstash.com/)
      - [Aiven](https://aiven.io/redis)

   2. **Create an Account and Provision a Redis Instance**

      - Sign up for an account with your chosen provider.
      - Create a new Redis instance through their dashboard.
      - After the instance is created, you will be provided with connection details, including:
        - **Host** (Redis endpoint)
        - **Port** (usually `6379` or a custom port)
        - **Password** (if authentication is enabled)

   3. **Get the Redis Connection Details**

      - You will need the following information from your Redis provider:
        - **Host**: Your Redis instance hostname (e.g., `your-redis-hostname`).
        - **Port**: Typically `6379`.
        - **Password**: The password (if set) for connecting to the Redis instance.

   4. **Add Redis Connection Details to Your `.env` File**

      - In your `.env` file, configure the Redis connection as follows:

        ```plaintext
        REDIS_HOST=your-redis-hostname
        REDIS_PORT=6379
        REDIS_PASSWORD=your-redis-password (if applicable)
        ```

9. Running the application

   Once you've completed the setup, you can start the backend server by running(make sure you have nodemon installed):

   ```bash
   npm run dev
   ```

### Setup using Docker

1. Run PostgresDB Container
   Start a postgres container in Docker using the following command:

   ```bash
   docker run -d --name postgres_container -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
   ```

   Enter the connection url of the database in the .env file

   ```plaintext
   postgresql://postgres:mysecretpassword@localhost:5432/postgres
   ```

2. Run MONGODB Container (Optional)

   Start a MONGODB container using docker, require for logging:

   ```bash
   docker run -d --name mlogs -p 27017:27017 mongo
   ```

   Update the .env file with the connection string:

   ```plaintext
   MONGO_URL="mongodb://localhost:27017"
   ```

3. Run Redis container (Optional, for email service)

   Use the following docker command to run a docker container:

   ```sh
   docker run -d --name mlogs_redis -p 6379:6379 redis redis-server --requirepass mysecretpassword
   ```

   Update the .env file with the connection details:

   ```plaintext
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=mysecretpassword
   ```

4. Build the image

   In the root directory run the following command to build the image:

   ```bash
       docker build -t mlogs-backend .
   ```

5. Start the container:

   Run the image by running the following command and passing the env file:

   ```bash
       docker run -d --name mlogs_backend_container --env-file .env -p 3000:3000 mlogs-backend
   ```

<!-- CONTRIBUTING -->

## Contributing

Please see our [contributing guide](/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
