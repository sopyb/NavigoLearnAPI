# /api/users/me
```diff
    - This route is not yet implemented.
    ! Subject to change - Just a rough draft.
```
## GET - /api/users/me
Returns information about the currently logged-in user.
### Parameters
| Name | Type | Description |
|------|------|-------------|
| none | none | none        |
### Response Codes
| Code | Description                                             |
|------|---------------------------------------------------------|
| 200  | Returns information about the currently logged-in user. |
| 401  | Unauthorized.                                           |
| 500  | Internal Server Error.                                  |

### Response (TBD)
```json
{
  "id": "bigint",
  "username": "string",
  "email": "string",
    ...
}
```
