# /api/explore/new

```diff
    - This route is not yet implemented.
    ! Subject to change - Just a rough draft.
```

## GET - /api/explore/new

Gets the newest posts.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description            |
|------|------------------------|
| 200  | Gets the newest posts. |
| 500  | Internal Server Error. |

### Response

Returns an array of posts.

```json
[
  {
    "id": "bigint",
    "ownerId": "bigint",
    "name": "string",
    "description": "string",
    "tags": "string[]",
    "created": "timestamp",
    "updated": "timestamp",
    "deleted": "timestamp",
    "isPublic": "boolean",
    "isDeleted": "boolean",
    "data": "string"
  },
  {
    "id": "bigint",
      ...
  },
  {
    "id": "bigint",
      ...
  },
    ...
]
```
