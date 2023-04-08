# /api/users/:userId([0-9]+)?/name

## Username [POST - /api/users/:userId([0-9]+)?/name]

Updates user's username.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type   | Description |
|------|--------|-------------|
| name | string | User name   |

### Response Codes

| Code | Description                                  |
|------|----------------------------------------------|
| 200  | Returns information about user with :userId. |
| 400  | Profile not found or doesn't exist           |
| 500  | Internal Server Error.                       |

### Response

#### 200

```json
{
  "success": true
}
```