# DELETE /api/auth/logout

## Description

This endpoint is used to log out a user. This will invalidate the JWT token.

## Request

### Parameters

None

### Body

None

### Headers

- 'cookie': 'token=...' (Must be valid)

## Response

```json
{
    "success": true,
    "message": "Logout successful"
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 401  | Unauthorized.          |
| 500  | Internal Server Error. |

### Cookies

- `token` (optional): cookie will be set to expire immediately.