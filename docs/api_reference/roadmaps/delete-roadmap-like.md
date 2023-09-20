# DELETE /api/roadmaps/:roadmapId/like
# DELETE /api/roadmaps/:roadmapId/dislike

## Description

This endpoint is used to give a dislike to a roadmap.

## Request

### Parameters

- `roadmapId`: ID of the roadmap to like. (required - included in path)

### Body

None

### Headers

- cookie: token=... (required)

## Response

```json
{
  "success": true,
  "message": "Roadmap unrated"
}
```

### Response Codes

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 400  | Bad Request            |
| 401  | Unauthorized           |
| 404  | Not Found.             |
| 500  | Internal Server Error. |

### Cookies

None