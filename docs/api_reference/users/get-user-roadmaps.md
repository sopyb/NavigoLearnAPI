# GET /api/users/:userId?/roadmaps

## Description

Get your profile or another user's roadmaps.

## Request

### Parameters

- userId: ID of the user to get roadmaps of. (optional - included in path)

### Body

None

### Headers

- cookie: token=... (required if userId is not included in path)

## Response

```json
{
    "success": true,
    "message": "Roadmaps found",
    "data": [
        {
            "id": "string",
            "name": "string",
            "description": "string",
            "topic": "string: programming, math, physics, biology",
            "isFeatured": "boolean",
            "isPublic": "boolean",
            "isDraft": "boolean",
            "createdAt": "string: date",
            "updatedAt": "string: date",
            "userId": "string",
            "userAvatar": "string | null",
            "userName": "string",
            "likeCount": "number",
            "viewCount": "number",
            "isLiked": "boolean"
        },
        { "Other Items": "..." }
    ],
    "total": "number"
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