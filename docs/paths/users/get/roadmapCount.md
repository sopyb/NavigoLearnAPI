# /api/users/:userId([0-9]+)?/roadmap-count

## Roadmap count [GET - /api/users/:userId([0-9]+)?/roadmap-count]

Returns the number of roadmaps created by user with :userId or logged-in user.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                                  |
|------|--------------------------------------------------------------|
| 200  | Returns the number of roadmaps created by user with :userId. |
| 400  | Profile not found or doesn't exist                           |
| 500  | Internal Server Error.                                       |

### Response

#### 200

```json
{
  "type": "roadmapCount",
  "userId": "45",
  "roadmapCount": "0"
}
```