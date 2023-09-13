# /api/auth/github-login

## GET - /api/auth/github-login

Logs in a user using GitHub OAuth.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Body

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