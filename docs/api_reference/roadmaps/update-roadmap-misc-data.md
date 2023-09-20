# POST /api/roadmaps/:roadmapId/misc-data

## Description

This endpoint is used to update the miscellaneous data of a roadmap.

## Request

### Parameters

- `roadmapId`: Id of the roadmap to update. (required - included in path)

### Body

```json
{
  "miscData": "string: Base64 encoded JSON data"
}
```

### Headers

None

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