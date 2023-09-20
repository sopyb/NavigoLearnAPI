# POST /api/users/

## Description

Post all user information to update logged-in user.

## Request

### Parameters

None

### Body

```json
{
  "name": "string",
  "bio": "string",
  "websiteUrl": "string",
  "githubUrl": "string"
}
```

### Headers

- cookie: token=... (required)

## Response

```json
{
  "success": true,
  "message": "Profile updated"
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 400  | Bad Request.           |
| 401  | Unauthorized.          |
| 404  | Not Found.             |
| 500  | Internal Server Error. |

### Cookies

None