# /api/users/:userId([0-9]+)?/issue-count

## Issue count [GET - /api/users/:userId([0-9]+)?/issue-count]

Returns the number of discussions created by userDisplay with :userId or logged-in
userDisplay.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                                     |
|------|-----------------------------------------------------------------|
| 200  | Returns the number of discussions created by userDisplay with :userId. |
| 400  | Profile not found or doesn't exist                              |
| 500  | Internal Server Error.                                          |

### Response

#### 200

```json
{
  "type": "issueCount",
  "userId": "45",
  "issueCount": "0"
}
```