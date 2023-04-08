# /api/users/:userId([0-9]+)?/followers

## User followers [GET - /api/users/:userId([0-9]+)?/followers]

Returns all followers of user with :userId or logged-in user.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                 |
|------|---------------------------------------------|
| 200  | Returns all followers of user with :userId. |
| 400  | Profile not found or doesn't exist          |
| 500  | Internal Server Error.                      |

### Response

#### 200

```json
{
  "type": "followers",
  "userId": "45",
  "followers": [
    "Array of follows",
    "Check types for more info"
  ]
}
```