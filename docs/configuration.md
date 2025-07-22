# Configuration Documentation

This document details the configuration settings used throughout the inventory project.

## Backend Configuration

### Main Configuration

Core configuration is defined in config.js.

| Setting                       | Description                                                | Default                                               |
| ----------------------------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| `constraints.defaultPageSize` | Default pagination size                                    | `100`                                                 |
| `mongoose.options`            | MongoDB connection options                                 | `{ useNewUrlParser: true, useUnifiedTopology: true }` |
| `services.user.url`           | URL for user service (Retrieving user data for population) | `http://playground-be:8080/v2/users`                  |

### API Documentation

Swagger configuration in swaggerDef.js.

| Server      | URL                                            | Description              |
| ----------- | ---------------------------------------------- | ------------------------ |
| Production  | `https://backend-core-dev.digital.auto/v2`     | Production server        |
| Local       | `http://localhost:${PORT}/v2`                  | Local development server |
| Development | `https://dev.backend-core-dev.digital.auto/v2` | Development server       |

## Frontend Configuration

### Next.js Configuration

Defined in next.config.ts.

| Setting                   | Value                                     | Description                                              |
| ------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `images.remotePatterns`   | `https://bewebstudio.digitalauto.tech/**` | Allowed domains for remote images                        |
| `logging.fetches.fullUrl` | `true`                                    | Enable full URL logging for fetch requests               |
| `output`                  | `standalone`                              | Output mode for Next.js build. Use for Docker deployment |
|                           |
