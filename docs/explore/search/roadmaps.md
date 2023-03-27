# /api/explore/search/users
```diff
    - This route is not yet implemented.
    ! Subject to change - Just a rough draft.
```

## GET - /api/explore/search/users
Search for roadmaps.

### Notes
This route will prioritize based on the following:
1. Tags that match the query
2. Titles that match the query
3. Descriptions that contain the query
4. Roadmaps that the user has left a review on

### Parameters
| Name  | Type   | Description           |
|-------|--------|-----------------------|
| query | string | String to search for. |

### Response Codes
| Code | Description            |
|------|------------------------|
| 200  | Gets list of roadmaps. |
| 500  | Internal Server Error. |

### Response
Returns an array of users.
```diff
    ! to be determined 
```