# Star Wars Movie Management API
The Star Wars Movie Management API is a backend application that allows users to interact with Star Wars films by retrieving data from the Star Wars Public API (SWAPI). It provides a centralized database for storing and managing film data, user authentication, and role-based access control for different operations.

# Features

- In order to query the API you must have a user and log in. You can create a user using the ```register``` endpoint and log in using the ```login``` one. When you create a user you must choose one of two roles (```ADMIN``` or ```USER```). With an admin role you will be able to sync, create, update and delete films, while with a user role you will only be able to get and see for films and its data.

# Environment Variables

The application uses environment variables for various purposes, such as configuring the connection to your PostgreSQL database. Therefore, before running the application, make sure to set up the environment variables in the .env file (you can follow the .env.template file as a guide). If any of the environment variables are not configured correctly, the application will not start and will throw an error specifying which environment variables are missing or misconfigured.

# Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- PostgreSQL

- Docker: Ensure that you have Docker installed on your system. If you don't have Docker installed, you can download and install it from [Docker's official website](https://www.docker.com/).

### Clone and Run with Docker

To clone and run the project using Docker, follow these steps:

1. Clone the repository to your local machine:
```bash
$ git clone https://github.com/JuanLisc/c-challenge.git
```

2. Navigate to the project directory:
```bash
$ cd c-challenge
```

3. Create a .env file in the root of the project and add the environment variables following the .env.template file.
   
4. Build the Docker container:
```bash
$ docker-compose up
```

5. The API should be running now.

### Clone and Run without Docker

If you prefer to run the project without Docker, follow these steps:

1. Clone the repository to your local machine and navigate to the project directory as described in the previous section.

2. Install project dependencies:
```bash
$ npm install
```

3. Create .env file in the root of the project and add the environment variables following the .env.template file.

4. Run the create command to create the database:
```bash
$ npm run db:create
```

5. Run the migrations to create the database schema:
```bash
$ npm run db:migrate
```

6. Start the application:
```bash
$ npm run start:dev
```

7. The API should be running now.

## API Endpoints

- A brief summary, you can find it more detailed in swagger documentation.

### Auth Module
> Handles user authentication and password management.

1. Login
- **URL**: ```/auth/login```
- **Method**: ```POST```
- **Request**:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
- **Response**:
```json
{
  "access_token": "your_jwt_token"
}
```
- **Description**: Logs in a user and returns a JWT token.
2. Register
- **URL**: /auth/register
- **Method**: POST
- **Request**:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
- **Response**:
```json
{
  "access_token": "your_jwt_token"
}
```
- **Description**: Registers a new user and returns a JWT token.
3. Change Password
- **URL**: /auth/change-password
- **Method**: PATCH
- **Request**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```
- **Response**:
```json
{
  "message": "Password changed successfully"
}
```
- **Description**: Changes the current user's password.

### Films Module
> Manages the retrieval and manipulation of Star Wars films.

1. Get All Films
- **URL**: /films
- **Method**: GET
- **Response**:
```json
[
  {
    "id": 1,
    "title": "A New Hope",
    "episodeId": 4,
    "director": "George Lucas",
    ...
  },
  ...
]
```
- **Description**: Retrieves a list of all films stored in the database.
2. Get Film by ID
- **URL**: /films/:id
- **Method**: GET
- **Response**:
```json
{
  "id": 1,
  "title": "A New Hope",
  "episodeId": 4,
  "director": "George Lucas",
  ...
}
```
- **Description**: Retrieves a specific film by its ID. This endpoint is restricted to USER role.
3. Create Film (ADMIN only)
- **URL**: /films
- **Method**: POST
- **Request**:
```json
{
  "title": "A New Hope",
  "episodeId": 4,
  "director": "George Lucas",
  "producer": "Gary Kurtz",
  "releaseDate": "1977-05-25"
}
```
- **Response**:
```json
{
  "id": 1,
  "title": "A New Hope",
  "episodeId": 4,
  "director": "George Lucas",
  ...
}
```
- **Description**: Creates a new film. Only accessible by ADMIN.
4. Sync Films from SWAPI (ADMIN only)
- **URL**: /films/sync
- **Method**: POST
- **Response**:
```json
{
  "message": "Films synchronized successfully"
}
```
- **Description**: Fetches and stores films from the Star Wars Public API into the database.

5. Update Film (ADMIN only)
- **URL**: /films/:id
- **Method**: PUT
- **Request**:
```json
{
  "title": "New title",
  "episodeId": 4,
  "director": "New director",
  "producer": "Gary Kurtz",
  "releaseDate": "1977-05-25"
}
```
- **Response**:
```json
{
  "id": 1,
  "title": "New title",
  "episodeId": 4,
  "director": "New Director",
  ...
}
```
- **Description**: Updates a new film. Only accessible by ADMIN.

3. Delete Film (ADMIN only)
- **URL**: /films/:id
- **Method**: DELETE
- **Request**:
```json
{
  "message": "Film deleted successfully"
}
```
- **Description**: Deletes a new film. Only accessible by ADMIN.

### Users Module
> Manages users and their roles.

1. Get All Users (ADMIN only)
- **URL**: /users
- **Method**: GET
- **Response**:
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  ...
]
```
- **Description**: Retrieves a list of all users.
2. Delete User by ID (ADMIN only)
- **URL**: /users/:id
- **Method**: DELETE
- **Response**:
```json
{
  "message": "User with ID X deleted successfully"
}
```
- **Description**: Deletes a user by ID.

## Swagger Documentation
> **Swagger is integrated for easy API exploration and testing. Access it at ```/api/docs```.**