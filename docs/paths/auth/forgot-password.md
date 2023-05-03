# /api/auth/forgot-password

```diff
- This route is not yet implemented.
! Subject to change - Just a rough draft.
```

## POST - /api/auth/forgot-password

Sends a password reset email to the userDisplay.

### Parameters

| Name  | Type   | Description            |
|-------|--------|------------------------|
| Email | string | The email of the userDisplay. |

### Response Codes

| Code | Description                   |
|------|-------------------------------|
| 200  | Sends a password reset email. |
| 400  | Bad Request.                  |
| 500  | Internal Server Error.        |

### Response

Returns a success message.