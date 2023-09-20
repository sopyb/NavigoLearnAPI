# /api/users/:userId([0-9]+)?/github-url

## User github url [POST - /api/users/:userId([0-9]+)?/github-url]

Updates userDisplay's github url.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name      | Type          | Description |
|-----------|---------------|-------------|
| githubUrl | string - link | User github |

### Response Codes

| Code | Description                                  |
|------|----------------------------------------------|
| 200  | Returns information about userDisplay with :userId. |
| 400  | Profile not found or doesn't exist           |
| 500  | Internal Server Error.                       |

### Response

#### 200

```json
{
  "success": true
}
```