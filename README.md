# SDT Assessment Test - Backend Developer

## Setup & Installation

- Environment variables (.env) setup

Please create new .env file based on .env.example file. Update DATABASE_URL & PORT accordingly.

- Install dependencies

```bash
$ npm install
```

- Migrate database

> Please make sure PostgreSQL is installed in your system

```bash
$ npm run migrate:dev
```

## Running the app

```bash
# developement
$ npm run dev
```

## API Documentation & Notes

This app uses Swagger API Documentation

> Swagger API Documentation can be accessed after starting the development server at: {BASE_URL}/api

```bash
# Available endpoints

POST /users
PATCH /users
DELETE /users

GET /locations

POST /messages/resend-birthday-messages
```

- Location (attribute: location) is using IANA string format. List of valid locations can be accessed from GET /locations or visit https://en.wikipedia.org/wiki/List_of_tz_database_time_zones. For examples: America/New_York, Asia/Jakarta, Australia/Melbourne
- Birthday date (attribute: birthDate) format: yyyy-MM-dd.
- Endpoint POST /messages/resend-birthday-messages available to re-send unsent messages (failed to send messages).
- Task scheduler for checking birthday (include sending message) runs every 15 minutes server time (e.g. 09:00, 09:15, 09:30, ...). This is in considerations of non-standard GMT offsets, such as GMT+09:30 (Australian Central Standard Time/ACST) or GMT+05:45(Nepal Time/NPT).

## Tech Stacks & Notable Dependencies

- Typescript
- Nest.js
- PostgreSQL
- Prisma
- Luxon (dates & times library)
- Axios (HTTP request)
