# /api/users/:userId([0-9]+)?

## [Profile](profile.md) [GET - /api/users/:userId([0-9]+)?]

Returns information about user with :userId or logged-in user.

## [Mini profile](mini.md) [GET - /api/users/:userId([0-9]+)?/mini]

Returns esential information such as Name and profile picture
about user with :userId.

## [User roadmaps](roadmaps.md) [GET - /api/users/:userId([0-9]+)?/roadmaps]

Returns all roadmaps created by user with :userId or logged-in user.

## [User issues](issues.md) [GET - /api/users/:userId([0-9]+)?/issues]

Returns all discussions created by user with :userId or logged-in user.
With basic information about the roadmap the discussion is related to.

## [User followers](followers.md) [GET - /api/users/:userId([0-9]+)?/followers]

Returns all followers of user with :userId or logged-in user.

## [User followed](followed.md) [GET - /api/users/:userId([0-9]+)?/following]

Returns all users followed by user with :userId or logged-in user.

## [Roadmap count](roadmapCount.md) [GET - /api/users/:userId([0-9]+)?/roadmap-count]

Returns the number of roadmaps created by user with :userId or logged-in user.

## [Issue count](issueCount.md) [GET - /api/users/:userId([0-9]+)?/issue-count]

Returns the number of discussions created by user with :userId or logged-in
user.

## [Followers count](followersCount.md) [GET - /api/users/:userId([0-9]+)?/follower-count]

Returns the number of followers for user with :userId or logged-in user.

## [Following count](followingCount.md) [GET - /api/users/:userId([0-9]+)?/following-count]

Returns the number of users followed by user with :userId or logged-in user.


