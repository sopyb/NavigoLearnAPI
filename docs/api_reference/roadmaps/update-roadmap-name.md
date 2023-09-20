# POST /api/roadmaps/:roadmapId/name

## Description

This endpoint is used to update the name of a roadmap.

## Request

### Parameters

- `roadmapId`: Id of the roadmap to update. (required - included in path)

### Body

```json
{
  "name": "string"
}
```

### Headers

- cookie: token=... (required)

## Response

```json
{
  "success": true,
  "message": "Roadmap updated"
}
```

### Response Codes

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 400  | Bad Request            |
| 401  | Unauthorized           |
| 403  | Forbidden              |
| 404  | Not Found.             |
| 500  | Internal Server Error. |

### Cookies

None