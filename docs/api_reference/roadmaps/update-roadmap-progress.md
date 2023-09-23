# POST /api/roadmaps/:roadmapId/progress

## Description

Update the progress of user on a roadmap.

## Request

### Parameters

- `roadmapId`: id of the roadmap to update progress of. (required - included in path)

### Body

```json
{
  "data": "Base64 encoded JSON string"
}
```

### Headers

- cookie: token=... (required)

## Response

```json
{
  "success": true,
  "message": "Roadmap progress updated"
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