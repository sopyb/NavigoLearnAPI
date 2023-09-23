# GET /api/auth/github-callback

## Description

This endpoint is used as a callback URL for GitHub OAuth2.0 authentication. It is called by GitHub after the user has successfully authenticated with GitHub.

## Request

### Parameters

See [GitHub OAuth2.0 documentation](https://docs.github.com/en/developers/apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github) for more information.

- `code`: The authorization code returned by GitHub after the user has successfully authenticated with GitHub.

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

- `token` (optional): The JWT token that is used to authenticate the user. This cookie is only set if the user successfully authenticated with GitHub.