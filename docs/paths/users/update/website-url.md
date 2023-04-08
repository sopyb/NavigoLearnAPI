# /api/users/:userId([0-9]+)?/website-url

## User website url [POST - /api/users/:userId([0-9]+)?/website-url]

Updates user's website url.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name       | Type          | Description  |
|------------|---------------|--------------|
| websiteUrl | string - link | User website |

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