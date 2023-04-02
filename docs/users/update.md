# /api/users/:userId

```diff
    - This route is not yet implemented.
    ! Subject to change - Just a rough draft.
```

## PUT - /api/users/:userId?

Updates user with :userId or the currently logged-in user if no :userId is
provided.

### Parameters

| Name      | Type   | Description                 |
|-----------|--------|-----------------------------|
| Attribute | String | Name of attribute to change |
| Value     | String | New value of attribute      |

### Response Codes

| Code | Description                     |
|------|---------------------------------|
| 200  | User info updated successfully. |
| 401  | Unauthorized.                   |
| 500  | Internal Server Error.          |

### Response

None