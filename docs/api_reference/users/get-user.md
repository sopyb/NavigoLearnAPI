# GET /api/users/:userId?

## Description

Get your profile or another user's profile.

## Request

### Parameters

- userId: ID of the user to get. (optional - included in path)

### Body

None

### Headers

- cookie: token=... (required if userId is not included in path)

## Response

```json
{
  "success": true,
  "message": "User found.",
  "data": {
    "id": "number",
    "avatar": "string",
    "name": "string",
    "bio": "string",
    "quote": "string",
    "websiteUrl": "string",
    "githubUrl": "string",
    "roadmapsCount": "number",
    "roadmapsViews": "number",
    "roadmapsLikes": "number",
    "followersCount": "number",
    "followingCount": "number",
    "githubLinked": "boolean",
    "googleLinked": "boolean",
    "createdAt": "timestamp",
    "isFollowing": "boolean"
  }
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 404  | Not Found.             |
| 500  | Internal Server Error. |

### Cookies

None