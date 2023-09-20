# GET /api/search/feeling-lucky

## Description

Get the id of a random roadmap.

## Request

### Parameters

None

### Body

None

### Headers

None

## Response

```json
{
  "success": true,
  "message": "User found.",
  "data": "number: id of the random roadmap"
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