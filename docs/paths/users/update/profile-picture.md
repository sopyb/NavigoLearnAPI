# /api/users/:userId([0-9]+)?/profile-picture

## ProfilePicture [POST - /api/users/:userId([0-9]+)?/profile-picture]

Updates userDisplay's profile picture url.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name      | Type          | Description     |
|-----------|---------------|-----------------|
| avatarURL | string - link | link to new pfp |

### Response Codes

| Code | Description                                  |
|------|----------------------------------------------|
| 200  | Returns information about userDisplay with :userId. |
| 400  | Profile not found or doesn't exist           |
| 500  | Internal Server Error.                       |

### Response

#### 200

```json
{
  "success": true
}
```
