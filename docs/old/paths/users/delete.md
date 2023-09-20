# /api/users/:userId([0-9]+)?

## DELETE - /api/users/:userId([0-9]+)?

Deletes user with :userId or logged-in user. This action is irreversible.

## Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                |
|------|----------------------------|
| 200  | User deleted successfully. |
| 401  | Unauthorized.              |
| 500  | Internal Server Error.     |

