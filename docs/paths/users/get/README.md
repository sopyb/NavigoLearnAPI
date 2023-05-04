# /api/users/:userId([0-9]+)?

## [Profile](profile.md) [GET - /api/users/:userId([0-9]+)?]

Returns information about userDisplay with :userId or logged-in userDisplay.

## [Mini profile](mini.md) [GET - /api/users/:userId([0-9]+)?/mini]

Returns esential information such as Name and profile picture
about userDisplay with :userId.

## [User roadmaps](roadmaps.md) [GET - /api/users/:userId([0-9]+)?/roadmaps]

Returns all roadmaps created by userDisplay with :userId or logged-in userDisplay.

## [User issues](issues.md) [GET - /api/users/:userId([0-9]+)?/issues]

Returns all discussions created by userDisplay with :userId or logged-in userDisplay.
With basic information about the roadmap the discussion is related to.

## [User followers](followers.md) [GET - /api/users/:userId([0-9]+)?/followers]

Returns all followers of userDisplay with :userId or logged-in userDisplay.

## [User followed](followed.md) [GET - /api/users/:userId([0-9]+)?/following]

Returns all users followed by userDisplay with :userId or logged-in userDisplay.

## [Roadmap count](roadmapCount.md) [GET - /api/users/:userId([0-9]+)?/roadmap-count]

Returns the number of roadmaps created by userDisplay with :userId or logged-in userDisplay.

## [Issue count](issueCount.md) [GET - /api/users/:userId([0-9]+)?/issue-count]

Returns the number of discussions created by userDisplay with :userId or logged-in
userDisplay.

## [Followers count](followersCount.md) [GET - /api/users/:userId([0-9]+)?/follower-count]

Returns the number of followers for userDisplay with :userId or logged-in userDisplay.

## [Following count](followingCount.md) [GET - /api/users/:userId([0-9]+)?/following-count]

Returns the number of users followed by userDisplay with :userId or logged-in userDisplay.


