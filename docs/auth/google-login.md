# /api/auth/google-login

## POST - /api/auth/google-login

Logs in a user using Google OAuth.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description            |
|------|------------------------|
| 200  | Logs in a user.        |
| 401  | Unauthorized.          |
| 500  | Internal Server Error. |

### Response

Returns session token cookie