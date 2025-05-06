# Introduction

The Inventory project serves as a central repository for defining schemas and creating instances data based on those schemas. It provides a structured way to manage and store various types of data, facilitating the reuse of architecture artifacts and supporting AI model training for the playground.

### Why Inventory?

- **Reuse of Architecture Artifacts**: Some SDV artifacts, for example, steps can be reused in multiple places.
- **Data for AI Model Training**: The structured data stored in the inventory can be utilized to tailor and train AI models, enhancing the capabilities of the playground.
- **Data Change Tracking**: The inventory enables tracking of changes to data, providing a history of modifications to schemas, instances, and relations for better versioning and auditability.

# Getting Started with Development using Docker Compose

### 1. Clone the Repository

Clone the Inventory project repository from GitHub:

```bash
git clone https://github.com/eclipse-autowrx/inventory.git
cd inventory
```

### 2. Configure the Environment

Set up environment variables for frontend and backend:

```bash
cp .env.example .env.dev
# Adjust .env.dev to your needs
```

### 3. Run the Development Server

Start the development server to test the application locally:

```bash
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up -V
```

The frontend will be accessible at `http://localhost:3000`.

# Deployment

> Will be updated later

# Other Concept

## Key Components

### Schema

- **Definition**: Schemas define the structure of the data.
- **Core Schemas**: Pre-defined, built-in schemas that cannot be modified or deleted.

### Relation

- **Definition**: Relations define connections between schemas.
- **Core Relations**: Pre-defined relations between core schemas.

### Instance

- **Definition**: Instances are concrete data entries created based on schema definitions.

### Instance Relation

- **Definition**: Instance relations are specific connections between instances, based on the defined relations between their respective schemas.

## Development Plan

For a comprehensive breakdown of the master plan, including specific objectives and phases, refer to the Inventory Project Plan on [docs.digital.auto.](https://docs.digital.auto/docs/epic/inventory/index.html)

## Additional Resources

- **digital.auto Playground**: [https://playground.digital.auto/](https://playground.digital.auto/)
- **digital.auto Documentation**: [https://docs.digital.auto](https://docs.digital.auto) for playground integration and prototyping guides.[](https://eclipse.dev/autowrx/basics/play/)
- **Eclipse AutoWRX GitHub**: [https://github.com/eclipse-autowrx](https://github.com/eclipse-autowrx)[](https://github.com/eclipse-autowrx)
