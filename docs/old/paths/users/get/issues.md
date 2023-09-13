# /api/users/:userId([0-9]+)?/issues

## User issues [GET - /api/users/:userId([0-9]+)?/issues]

Returns all discussions created by userDisplay with :userId or logged-in userDisplay.
With the id of the roadmap the discussion is related to.

### Parameters

| Name   | Type   | Description         |
|--------|--------|---------------------|
| userId | bigint | The id of the userDisplay. |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                           |
|------|-------------------------------------------------------|
| 200  | Returns all discussions created by userDisplay with :userId. |
| 400  | Profile not found or doesn't exist                    |
| 500  | Internal Server Error.                                |

### Response

#### 200

```json
{
  "type": "issues",
  "userId": "45",
  "issues": [
    "Array of issues",
    "Check types for more info"
  ]
}
```