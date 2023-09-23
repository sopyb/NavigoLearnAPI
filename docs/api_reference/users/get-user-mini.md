# GET /api/users/:userId?/mini

## Description

Get your profile or another user's mini profile.

## Request

### Parameters

- userId: ID of the user to get. (optional - included in path)

### Body

None

### Headers

- cookie: token=... (required if userId is not included in path)

## Response

```json
{
  "success": true,
  "message": "User found",
  "data": {
    "id": "number",
    "avatar": "string",
    "name": "string",
    "createdAt": "timestamp"
  }
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 404  | Not Found.             |
| 500  | Internal Server Error. |

### Cookies

None