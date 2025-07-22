# Environment Variables Documentation

This document outlines all environment variables used in the inventory project.

## Backend Environment Variables

These variables are defined in .env files and loaded through the configuration module in config.js.

| Variable            | Description                                                      | Default Value                                 | Required |
| ------------------- | ---------------------------------------------------------------- | --------------------------------------------- | -------- |
| `NODE_ENV`          | Environment mode (production, development, test)                 | -                                             | Yes      |
| `PORT`              | Server port for the backend API                                  | `3001`                                        | No       |
| `MONGODB_URL`       | MongoDB connection URL                                           | -                                             | Yes      |
| `AUTHORIZATION_URL` | URL for authorization service                                    | `http://playground-be:8080/v2/auth/authorize` | No       |
| `LOGS_MAX_SIZE`     | Maximum size of change logs in MB. Auto truncate logs if exceeds | `100`                                         | No       |

## Frontend Environment Variables

These variables are defined in .env.fe and loaded by Next.js for the frontend application.

| Variable                      | Description                       | Default Value                                   |
| ----------------------------- | --------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SERVER_BASE_URL` | Base URL for backend API requests | `https://backend-core-dev.digital.auto/v2`      |
| `NEXT_PUBLIC_UPLOAD_URL`      | URL for file uploads              | `https://backend-core-dev.digital.auto/v2/file` |
| `NEXT_PUBLIC_CACHE_BASE_URL`  | Base URL for cache service        | `http://cache.digitalauto.tech`                 |
| `NEXT_PUBLIC_LOG_BASE_URL`    | Base URL for logging service      | `http://log.digital.auto`                       |
