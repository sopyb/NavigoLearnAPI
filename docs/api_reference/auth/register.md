# POST /api/auth/register

## Description

This endpoint is used to register a new user.

## Request

### Parameters

None

### Body

```json
{
  "email": "string",
  "password": "string"
}
```

### Headers

None

## Response

```json
{
  "success": true,
  "message": "Registration successful"
}
```

### Response Codes

Example:

| Code | Description           |
|------|-----------------------|
| 201  | Created               |
| 400  | Bad Request           |
| 409  | Conflict              |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |


### Cookies

- `token` (optional): JWT token used for authentication if the user successfully registered.