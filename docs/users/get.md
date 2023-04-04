# /api/users/get/:userId?

## GET - /api/users/:userId?

Returns information about user with :userId.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| none | none | none        |

### Response Codes

| Code | Description                                  |
|------|----------------------------------------------|
| 200  | Returns information about user with :userId. |
| 400  | Profile not found or doesn't exist           |
| 500  | Internal Server Error.                       |

### Response

```json
{
  "name": "Sopy",
  "profilePictureUrl": "https://avatars.githubusercontent.com/u/32602702?v=4",
  "userId": "4",
  "bio": "Tech nerd running through my veins",
  "quote": "",
  "blogUrl": "https://sopy.one",
  "websiteUrl": "",
  "githubUrl": "https://github.com/sopyb",
  "githubLink": true,
  "googleLink": true
}
```