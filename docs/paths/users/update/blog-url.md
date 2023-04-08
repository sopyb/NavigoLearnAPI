# /api/users/:userId([0-9]+)?/blog-url

## User blog url [POST - /api/users/:userId([0-9]+)?/blog-url]

Updates user's blog url.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name    | Type          | Description |
|---------|---------------|-------------|
| blogUrl | string - link | User blog   |

### Response Codes

| Code | Description                                  |
|------|----------------------------------------------|
| 200  | Returns information about user with :userId. |
| 400  | Profile not found or doesn't exist           |
| 500  | Internal Server Error.                       |

### Response

#### 200

```json
{
  "success": true
}
```