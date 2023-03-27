# /api/users/get/:userId
```diff
    - This route is not yet implemented.
    ! Subject to change - Just a rough draft.
```

## GET - /api/get/:userId
Returns information about user with :userId.

### Parameters
| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes
| Code | Description                                  |
|------|----------------------------------------------|
| 200  | Returns information about user with :userId. |
| 401  | Unauthorized. (Profile is private)           |
| 500  | Internal Server Error.                       |

### Response (TBD)
```json
{
  "id": "bigint",
  "username": "string",
  "email": "string",
    ...
}
```