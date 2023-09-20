# POST /api/roadmap/:roadmapId

## Description

Post all data related to a roadmap.

## Request

### Parameters

- `roadmapId`: Id of the roadmap to post data to (in path).

### Body

```json
{
  "name": "string",
  "description": "string", 
  "data": "string: Base64 encoded JSON",
  "topic": "string: programming, math, physics, biology",
  "miscData": "string: Base64 encoded JSON",
  "__COMMENT__": "The following fields are optional. If they are not included, they will not be updated.",
  "isDraft": "boolean"
}
```

### Headers

- cookie: token=... (required)

## Response

Show an example of the response.

Example:
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