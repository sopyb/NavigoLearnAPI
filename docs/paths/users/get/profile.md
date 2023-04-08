# /api/users/:userId([0-9]+)?

## Profile [GET - /api/users/:userId([0-9]+)?]

Returns information about user with :userId or logged-in user.

### Parameters

| Name   | Type   | Description                           |
|--------|--------|---------------------------------------|
| userId | Number | Id of person you want to get info of. |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                  |
|------|----------------------------------------------|
| 200  | Returns information about user with :userId. |
| 400  | Profile not found or doesn't exist           |
| 500  | Internal Server Error.                       |

### Response

#### 200

```json
{
  "type": "profile",
  "name": "mlx3ifp9s5g",
  "profilePictureUrl": "",
  "userId": "45",
  "COMM_ID_TYPE": "bigint",
  "bio": "",
  "quote": "",
  "blogUrl": "",
  "roadmapsCount": "0",
  "issueCount": "0",
  "followerCount": "0",
  "followingCount": "0",
  "websiteUrl": "",
  "githubUrl": "",
  "githubLink": false,
  "googleLink": false
}
```