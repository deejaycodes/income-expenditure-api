```
# INCOME AND EXPEDITURE API

The Income and Expenditure API is designed to help users manage their financial statements.
This API allows for the creation, retrieval, and management of income and expenditure statements for authenticated users.
It is built using TypeScript and the Ts.ED framework, with PostgreSQL as the backend database.
```

# Overview

## Features

### Key Functionalities

- **Create Income and Expenditure Statements**

  - Users can create detailed statements that include multiple transaction entries for both income and expenditure.

- **Retrieve Specific Statement**

  - Users can fetch a specific statement using its unique identifier (ID).

- **List All Statements**

  - Users can view a complete list of all statements associated with their account.

- **Authentication Middleware**
  - All API endpoints are protected by authentication middleware, ensuring that only authorized users can access their data.

## Technology Stack

The project utilizes the following technologies:

- **Node.js**: A JavaScript runtime for building server-side applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
- **Ts.ED**: A TypeScript framework designed for building web applications and APIs.
- **PostgreSQL**: A powerful relational database management system (RDBMS) for storing application data.
- **Liquibase**: A database migration tool that helps manage schema changes and version control for databases.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or later)
- **Yarn** package manager
- **PostgreSQL** (version 12 or later)

### Installation Steps

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/income-expenditure-api.git
   ```

2. **Change to the project directory:**

   ```bash
   cd income-expenditure-api
   ```

3. **Install project dependencies:**

   ```bash
   yarn install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root of the project and add your configuration:

   ```env
   CHANGELOG_FILE=database/liquibase/config/income_expenditure_changelog.yaml
   DB_URL=jdbc:postgresql://localhost:5432/income-expenditure-database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DRIVER=org.postgresql.Driver
   ```

5. **Run database migrations using Liquibase:**

   ```bash
   liquibase update
   ```

6. **Start the application:**

   ```bash
   yarn start
   ```

## API Endpoints

### POST /statements

**Create a new income and expenditure statement.**

#### Request Body

```json
{
  "transactionEntries": [
    {
      "description": "Salary",
      "amount": 5000,
      "type": "INCOME",
      "date": "2024-10-02T10:00:00Z"
    },
    {
      "description": "Rent",
      "amount": 2000,
      "type": "EXPENDITURE",
      "date": "2024-10-02T10:00:00Z"
    }
  ]
}
```

#### Response

```json
{
  "status": "Success",
  "statusCode": 201,
  "message": "Statement created successfully",
  "data": {
    "statementId": "statement123"
  }
}
```

### GET /statements/:statementId

**Retrieve a specific statement by its ID.**

#### Response

```json
{
  "status": "Success",
  "data": {
    "statementId": "statement123",
    "totalIncome": 5000,
    "totalExpenditure": 2000,
    "disposableIncome": 3000,
    "rating": "C"
  },
  "message": "Statement was successfully retrieved"
}
```

### GET /statements/

**Retrieve all statements for the authenticated user.**

#### Response

```json
{
  "status": "Success",
  "data": {
    "statements": [
      {
        "statementId": "statement123",
        "totalIncome": 5000,
        "totalExpenditure": 2000,
        "disposableIncome": 3000,
        "rating": "C"
      }
    ]
  },
  "message": "Statements were successfully retrieved"
}
```

## Running Tests

To run the tests for the API, use the following command:

```bash
yarn test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
