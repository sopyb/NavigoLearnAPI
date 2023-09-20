# GET /api/roadmap/:roadmapId/progress

## Description

This endpoint is used to get user's progress of a roadmap.

## Request

### Parameters

- `roadmapId`: id of the roadmap to get progress of. (required - included in path)

### Body

None

### Headers

- cookie: token=... (required)

## Response

```json
{
  "success": true,
  "message": "Roadmap progress found",
  "data": "string: Base64 encoded JSON string"
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