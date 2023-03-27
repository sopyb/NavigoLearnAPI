# /api/auth/login
```diff
    - This route is not yet implemented.
    ! Subject to change - Just a rough draft.
```

## POST - /api/auth/login
Logs in a user.

### Parameters
| Name       | Type    | Description                          |
|------------|---------|--------------------------------------|
| Email      | string  | The email of the user.               |
| Password   | string  | The password of the user.            |
| RememberMe | boolean | Whether or not to remember the user. |

### Response Codes
| Code | Description                          |
|------|--------------------------------------|
| 200  | Logs in a user.                      |
| 400  | Bad Request.                         |
| 401  | Unauthorized.                        |
| 500  | Internal Server Error.               |

### Response
Returns session token cookie