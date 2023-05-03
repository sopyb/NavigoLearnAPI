# /api/users/:userId([0-9]+)?/mini

## Mini profile [GET - /api/users/:userId([0-9]+)?/mini]

Returns esential information such as Name and profile picture about userDisplay with :
userId.

### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| userId | number | User id     |

### Body

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

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
  "type": "mini",
  "name": "mlx3ifp9s5g",
  "profilePictureUrl": "",
  "userId": "45"
}
```