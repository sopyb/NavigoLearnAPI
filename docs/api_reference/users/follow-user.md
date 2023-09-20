# GET /api/users/:userId/follow

## Description

Follow a user.

## Request

### Parameters

- `userId`: ID of the user to follow. (required - included in path)

### Body

None

### Headers

- cookie: token=... (required)

## Response

```json
{
  "success": true,
  "message": "User followed"
}
```

### Response Codes

| Code | Description           |
|------|-----------------------|
| 200  | Success               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 500  | Internal Server Error |

### Cookies

None