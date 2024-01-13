# GET /api/roadmaps/:roadmapId

## Description

This endpoint is used to get a roadmap by id.

## Request

### Parameters

- `roadmapId`: Id of the roadmap to get. (required - included in path)

### Body

None

### Headers

- 'cookie': 'token=...' (if roadmap is draft or unlisted)

## Response

```json
{
  "success": true,
  "message": "Roadmap found",
  "data": {
    "id": "bigint",
    "name": "string",
    "description": "string",
    "topic": "string: programming, math, physics, biology",
    "data": "JSON",
    "isFeatured": "boolean",
    "isPublic": "boolean",
    "isDraft": "boolean",
    "createdAt": "date",
    "updatedAt": "date",
    "userId": "number",
    "userAvatar": "string | null",
    "likeCount": "number",
    "viewCount": "number",
    "isLiked": "boolean",
    "miscData": "JSON",
    "version": "number"
  }
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 403  | Forbidden              |
| 404  | Not Found.             |
| 500  | Internal Server Error. |

### Cookies

None