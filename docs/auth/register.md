# /api/auth/register

## POST - /api/auth/register

Registers a new user.

### Parameters

| Name     | Type   | Description               |
|----------|--------|---------------------------|
| Email    | string | The email of the user.    |
| Password | string | The password of the user. |

### Response Codes

| Code | Description            |
|------|------------------------|
| 200  | Registers a new user.  |
| 400  | Bad Request.           |
| 401  | Unauthorized.          |
| 500  | Internal Server Error. |

### Response

Returns session token.