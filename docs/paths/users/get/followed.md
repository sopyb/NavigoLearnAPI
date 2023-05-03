# /api/users/:userId([0-9]+)?/following

## User following [GET - /api/users/:userId([0-9]+)?/following-count]

Returns all users followed by userDisplay with :userId or logged-in userDisplay.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                      |
|------|--------------------------------------------------|
| 200  | Returns all users followed by userDisplay with :userId. |
| 400  | Profile not found or doesn't exist               |
| 500  | Internal Server Error.                           |

### Response

#### 200

```json
{
  "type": "following",
  "userId": "45",
  "following": ["Array of follows", "Check types for more info"]
}
```
