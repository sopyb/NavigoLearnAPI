# /api/users/:userId([0-9]+)?

## User roadmaps [GET - /api/users/:userId([0-9]+)?/roadmaps]

Returns all roadmaps created by userDisplay with :userId.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                        |
|------|----------------------------------------------------|
| 200  | Returns all roadmaps created by userDisplay with :userId. |
| 400  | Profile not found or doesn't exist                 |
| 500  | Internal Server Error.                             |

### Response

#### 200

```json
{
  "type": "roadmaps",
  "userId": "45",
  "roadmaps": ["Array of roadmaps", "Check types for more info"]
}
```