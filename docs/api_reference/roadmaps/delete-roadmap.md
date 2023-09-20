# DELETE /api/roadmaps/:roadmapId/

## Description

Delete a roadmap.

## Request

### Parameters

- `roadmapId`: ID of the roadmap to delete. (required - included in path)

### Body

None

### Headers

- cookie: token=... (required)

## Response
    
```json
{
  "success": true,
  "message": "Roadmap deleted"
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 401  | Unauthorized           |
| 403  | Forbidden              |
| 404  | Not Found.             |
| 500  | Internal Server Error. |

### Cookies

None