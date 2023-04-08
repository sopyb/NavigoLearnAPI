# /api/auth/change-password

## POST - /api/auth/change-password

Changes a users password.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Body

| Name        | Type   | Description              |
|-------------|--------|--------------------------|
| password    | string | The new password of user |
| newPassword | string | The new password of user |

### Response Codes

| Code | Description               |
|------|---------------------------|
| 200  | Changes a users password. |
| 400  | Bad Request.              |
| 500  | Internal Server Error.    |

### Response

#### 200

```json
{
  "message": "Password changed successfully."
}
```

#### 400

```json
{
  "error": "Incorrect password"
}
```

```json
{
  "error": "A valid session, the old and the new password are required"
}
```

#### 500

```json
{
  "error": "Something went wrong"
}
```

```json
{
  "error": "Invalid user"
}
```