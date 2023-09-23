# GET /api/auth/google-callback

## Description

This endpoint is used as a callback URL for Google OAuth2.0 authentication. It is called by Google after the user has successfully authenticated with Google.

## Request

### Parameters

See [Google OAuth2.0 documentation](https://developers.google.com/identity/protocols/oauth2/web-server#handlingresponse) for more information.

- `code`: The authorization code returned by Google after the user has successfully authenticated with Google.
- `error`: The error code returned by Google if the user failed to authenticate with Google.

### Body

None

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
| 201  | Created                |
| 400  | Bad Request            |
| 500  | Internal Server Error. |

### Cookies

- `token` (optional): The JWT token that is used to authenticate the user. This cookie is only set if the user successfully authenticated with Google.