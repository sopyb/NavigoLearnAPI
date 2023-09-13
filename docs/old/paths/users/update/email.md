# /api/users/:userId([0-9]+)?/email

## User email [POST - /api/users/:userId([0-9]+)?/email]

Updates userDisplay's email.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name     | Type   | Description   |
|----------|--------|---------------|
| email    | string | New email     |
| password | string | User password |

### Response Codes

| Code | Description                                  |
|------|----------------------------------------------|
| 200  | Returns information about userDisplay with :userId. |
| 400  | Profile not found or doesn't exist           |
| 500  | Internal Server Error.                       |

### Response

#### 200

```json
{
  "success": true
}
```
