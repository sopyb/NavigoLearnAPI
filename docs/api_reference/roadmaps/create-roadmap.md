# POST /api/roadmaps/create

## Description

This endpoint is used to create a roadmap.

## Request

### Parameters

None

### Body

```json
{
    "name": "string",
    "description": "string",
    "data": "JSON",
    "isPublic": "boolean",
    "isDraft": "boolean",
    "version": "number",
    "miscData": "JSON"
}
```

### Headers

- 'cookie': 'token=...' (required)

## Response

```json
{
  "success": true,
  "message": "Roadmap created",
  "data": {
    "id": "number"
  }
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 201  | Created                |
| 400  | Bad Request            |
| 401  | Unauthorized           |
| 500  | Internal Server Error. |

### Cookies

None