# GET /api/search/roadmaps

## Description

This endpoint is used to search for roadmaps. The search is done by name and description.

## Request

### Parameters

- `query`: The search query. `String` Will be used to search for roadmaps by name and description.
- `limit`: The maximum number of roadmaps to return. `Integer` Default is 12.
- `page`: The page number. `Integer` Default is 1.
- `sort`: The sort order. `String:String` Default is `new:desc`. The first string is the field to sort by. The second string is the sort order. The field can be one of `new`, `likes`, `view`. The sort order can be one of `asc` or `desc`.
- `topic`: The topic(s) to filter by. `String,String,...,String`. Default is all of them. The topics to filter by. The topics must be separated by commas. The topics must be valid topic names like `programming`, `math`, `physics` or `biology`.

(**No parameters are required**)
 


### Body

None

### Headers

- 'cookie': 'token=...' (optional - adds info about user's likes to the response

## Response

```json
{
    "success": true,
    "message": "Roadmaps {,not} found.",
    "data": [
        {
            "id": "string",
            "name": "string",
            "description": "string",
            "topic": "string: programming, math, physics, biology",
            "isFeatured": "boolean",
            "isPublic": "boolean",
            "isDraft": "boolean",
            "createdAt": "string: date",
            "updatedAt": "string: date",
            "userId": "string",
            "userAvatar": "string",
            "userName": "string",
            "likeCount": "number",
            "viewCount": "number",
            "isLiked": "boolean"
        },
        { "Other Items": "..." }
    ],
    "total": "number"
}
```

### Response Codes

Example:

| Code | Description            |
|------|------------------------|
| 200  | Success                |
| 500  | Internal Server Error. |

### Cookies

None