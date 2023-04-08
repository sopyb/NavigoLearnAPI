# /api/users/:userId([0-9]+)?/quote

## User quote [POST - /api/users/:userId([0-9]+)?/quote]

Updates user's quote.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name  | Type   | Description |
|-------|--------|-------------|
| quote | string | User quote  |

### Response Codes

| Code | Description  |
|------|--------------|
| 200  | Success      |
| 400  | Bad Request  |
| 500  | Server Error |

### Response

#### 200

```json
{
  "success": true
}
```