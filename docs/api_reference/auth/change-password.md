# POST /api/auth/change-password

## Description

This endpoint is used to change the password of a user.

## Request

### Parameters

None

### Body

```json
{
  "password": "string",
  "newPassword": "string"
}
```

### Headers

- 'cookie': 'token=...' (Must be valid)

## Response
    
```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 400  | Bad Request.           |
| 401  | Unauthorized.          |
| 429  | Too Many Requests      |
| 500  | Internal Server Error. |

### Cookies

None