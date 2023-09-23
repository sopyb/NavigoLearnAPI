# POST /api/users/bio

## Description

Post bio to update logged-in user.

## Request

### Parameters

None

### Body

```json
{
  "bio": "string"
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