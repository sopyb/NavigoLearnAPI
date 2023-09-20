# DELETE /api/users/userId

## Description

Deletes logged in user.

## Request

### Parameters

- `userId`: ID of the user to delete. (optional - ADMIN ONLY - not implemented yet)

### Body

None

### Headers

- cookie: token=... (required)

## Response

```json
{
  "success": true,
  "message": "Account successfully deleted"
}
```

### Response Codes

| Code | Description           |
|------|-----------------------|
| 200  | Success               |
| 401  | Unauthorized          |
| 500  | Internal Server Error |

### Cookies

- token - set to expire immediately