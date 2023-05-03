# /api/auth/login

## POST - /api/auth/login

Logs in a userDisplay.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Body

| Name       | Type    | Description                          |
|------------|---------|--------------------------------------|
| Email      | string  | The email of the userDisplay.               |
| Password   | string  | The password of the userDisplay.            |
| RememberMe | boolean | Whether or not to remember the userDisplay. |

### Response Codes

| Code | Description            |
|------|------------------------|
| 200  | Logs in a userDisplay.        |
| 400  | Bad Request.           |
| 500  | Internal Server Error. |

### Response

Returns session token cookie