# /api/roadmaps/:roadmapId([0-9]+)?

## GET - /api/roadmaps/:roadmapId([0-9]+)?

Get a roadmap by its id.

### Parameters

| Name      | Type   | Description |
|-----------|--------|-------------|
| roadmapId | number | Roadmap id  |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                |
|------|----------------------------|
| 200  | Roadmap found successfully |
| 400  | Bad request.               |
| 404  | Roadmap not found.         |
| 500  | Internal Server Error.     |

### Example

```json
{
  "roadmap": {
    "id": "bigint",
    "name": "string",
    "description": "string",
    "ownerId": "bigint",
    "...": "roadmap fields"
  }
}
```
