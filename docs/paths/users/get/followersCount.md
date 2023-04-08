# /api/users/:userId([0-9]+)?/follower-count

## Followers count [GET - /api/users/:userId([0-9]+)?/follower-count]

Returns the number of followers for user with :userId or logged-in user.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                            |
|------|--------------------------------------------------------|
| 200  | Returns the number of followers for user with :userId. |
| 400  | Profile not found or doesn't exist                     |
| 500  | Internal Server Error.                                 |

### Response

#### 200

```json
{
  "type": "followersCount",
  "userId": "45",
  "followersCount": "0"
}
```