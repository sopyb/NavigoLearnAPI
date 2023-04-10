# /api/roadmaps/create

## POST - /api/roadmaps/create
Creates a new roadmap.

### Parameters

| Name       | Type   | Description |
|------------|--------|-------------|
| none       | none   | none        |

### Body

| Name    | Type    | Description    |
|---------|---------|----------------|
| roadmap | Roadmap | Roadmap objec. |

### Response Codes

| Code | Description                   |
|------|-------------------------------|
| 200  | Roadmap created successfully. |
| 403  | Forbidden. Not logged-in.     |
| 500  | Internal Server Error.        |

### Example

```json
{
  "id": "bigint"
}
```