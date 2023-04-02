# /api/auth/logout

```diff
    - This route is not yet implemented.
    ! Subject to change - Just a rough draft.
```

## DELETE - /api/auth/logout

Logs out a user.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description             |
|------|-------------------------|
| 200  | Logs out a user.        |
| 401  | Unauthorized. (No user) |
| 500  | Internal Server Error.  |

### Response

Deletes the session token.