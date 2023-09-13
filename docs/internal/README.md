# Internal Architecture

This section provides a detailed overview of the internal architecture and important modules used in the NavigoLearn API. This is primarily meant for developers who wish to understand the inner workings of the API or contribute to its development.

## Table of Contents
- [Internal Architecture](#internal-architecture)
- [Controllers](#controllers)
- [Types](#types)
    - [Models](#models)
    - [Responses](#responses)
- [Helpers](#helpers)
    - [Database Management](#database-management)
    - [Response Management](#response-management)
- [Routes](#routes)
- [Middleware](#middleware)
    - [Validators](#validators)
- [Utilities](#utilities)
- [SQL](#sql)

## Table of Contents
- [Controllers](#controllers)
- [Types](#types)
- [Routes](#routes)
- [Middleware](#middleware)
- [Validators](#validators)
- [Utilities](#utilities)

## Controllers

Controllers are the handlers that respond to various HTTP requests. Each controller has different tasks, such as handling user authorization or dealing with specific database records.

- **Further Reading**: [Controllers Documentation](./controllers.md) (To be added)

## Types
Types are used to define the structure of various data entities (like Users or Events) and their relationships.

### Models

Models define the structure of the various data entities (like Users or Events), their relationships, and also the methods to interact with the database.

- **Further Reading**: [Models Classes Documentation](./models.md) (To be added)

### Responses

Responses classes are used to send data back to the client in a consistent format.

- **Further Reading**: [Responses Classes Documentation](./responses.md) (To be added)

## Helpers

Helpers are used to perform various tasks so that the controllers are not bloated with code that might change.

- **Further Reading**: [Helpers Documentation](./helpers.md) (To be added)

### Database Management

Database management helpers are used to perform various tasks related to the database.

- **Further Reading**: [Database Management Documentation](./database_management.md) (To be added)

### Response Management

Response management helpers are used to format the response JSON sent back to the client. This usually uses [Responses classes](#responses) 

## Routes

Routes decide how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

This uses [Controllers](#controllers) 

- **Further Reading**: [Routes Documentation](./routes.md) (To be added)

## Middleware

Middleware functions have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle.

- **Further Reading**: [Middleware Documentation](./middleware.md) (To be added)

### Validators

Validators are middlewares used to check the integrity of incoming data before it's processed by the application.

- **Further Reading**: [Validators Documentation](./validators.md) (To be added)

## Utilities

Utility functions and classes provide useful features used across the application.

- **Further Reading**: [Utility Documentation](./utilities.md) (To be added)

Remember, understanding the codebase's architecture is crucial for making meaningful contributions or understanding how to resolve issues. You are encouraged to explore each section in detail.

## SQL

SQL files are used to create and update the database schema. They are also used to create stored procedures and functions for creating dummy data.

- **Further Reading**: [SQL Documentation](./sql.md) (To be added)