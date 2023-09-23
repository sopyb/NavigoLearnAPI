# POST /api/auth/login

## Description

This endpoint is used to log in a user.

## Request

### Parameters

None

### Body

```json
{
  "email": "string",
  "password": "string"
}
```

### Headers

None

## Response

```json
{
  "success": true,
  "message": "Login successful"
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 400  | Bad Request.           |
| 429  | Too Many Requests      |
| 500  | Internal Server Error. |

### Cookies

- `token` (optional): JWT token used for authentication if the user successfully logged in.