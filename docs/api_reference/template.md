# GET /api/...

**Note**: Replace '/api/...' with the actual endpoint.

## Description

Explain what this endpoint is for and what it does here, for example: "This endpoint allows users to sign in using their Google account."

## Request

### Parameters

List all parameters that the endpoint requires here.

- `parameter1`: Description for parameter1
- `parameter2`: Description for parameter2

(**If the endpoint does not require parameters, then state that there are no parameters required**)

### Body

Show an example of the body.

For **GET** endpoints, this might be just an empty object `{}`.

For **POST** endpoints, this might be a JSON object.

For **DELETE** endpoints, this might be an empty object `{}`.

Example:
```json
{
  "name": "string",
  "age": "number"
}
```

### Headers

List all the headers required here if any

- `header1`: Description for header1
- `header2`: Description for header2

(**If the endpoint does not require headers, then state that there are no headers required**)
Example when requiring token authentication:
```
- 'cookie': 'token=...'
```

## Response

Show an example of the response.

Example:
```json
{
  "success": true,
  "message": "User found.",
  "data": {
    "id": "bigint",
    "name": "string",
    "email": "string",
    "profilePicture": "string",
    "bio": "string",
    "quote": "string",
    "websiteUrl": "string",
    "githubUrl": "string",
    "created": "timestamp",
    "updated": "timestamp",
    "deleted": "timestamp",
    "isDeleted": "boolean"
  }
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 500  | Internal Server Error. |

### Cookies

List all the cookies that the endpoint sets here if any

- `cookie1`: Description for cookie1
- `cookie2`: Description for cookie2

(**If the endpoint does not set any cookies, then state that there are no cookies set**)