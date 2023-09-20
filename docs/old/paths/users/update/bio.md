# /api/users/:userId([0-9]+)?/bio

## User bio [POST - /api/users/:userId([0-9]+)?/bio]

Updates userDisplay's bio.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type   | Description |
|------|--------|-------------|
| bio  | string | User bio    |

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