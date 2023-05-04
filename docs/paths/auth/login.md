# /api/auth/login

## POST - /api/auth/login

Logs in a user.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Body

| Name       | Type    | Description                          |
|------------|---------|--------------------------------------|
| Email      | string  | The email of the user.               |
| Password   | string  | The password of the user.            |
| RememberMe | boolean | Whether or not to remember the user. |

### Response Codes

| Code | Description            |
|------|------------------------|
| 200  | Logs in a user.        |
| 400  | Bad Request.           |
| 500  | Internal Server Error. |

### Response

Returns session token cookie