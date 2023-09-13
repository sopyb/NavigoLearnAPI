# Routes

- Base URL: /api
- [Auth](auth/README.md)
    > :warning: /auth/[login, register, change-password, forgot-password] are all depricated
    - Base URL: /api/auth
    - GoogleLogin: /google-login
    - GithubLogin: /github-login
    - Logout: /logout
- [Explore](explore/README.md)
    > :warning: /explore/* appear to be depricated
    - [Search](explore/search/README.md):
    > :memo: Search functions were moved to /api/search
- [Roadmaps](roadmaps/README.md)
    > :warning: /roadmaps/[progress, rating, issues] appear to be depricated
    - Base URL: /api/roadmaps
    - Create: /create
    - [Get](roadmaps/get/README.md):
        - Base URL: /api/roadmaps/:roadmapId([0-9]+)?
        - Roadmap: /
    - [Update](roadmaps/update/README.md):
        - Base URL: /api/roadmaps/:roadmapId([0-9]+)
        - Title: /title
        - Description: /description
        - Tags: /tags
        - Visibility: /visibility
        - Owner: /owner
        - Data: /data
    - Delete: /:roadmapId([0-9]+)
- [Users](users/README.md)
    - Base URL: /api/users
    - [Get](users/get/README.md):
        > :warning: /users/[issues, followers, following, follower-count, following-count] appear depricated

        - Base URL: /api/users/:userId([0-9]+)?
        - Profile: /
        - Mini profile: /mini
        - User roadmaps: /roadmaps
    - [Update](users/update/README.md):
        - Base URL: /api/users/:userId([0-9]+)?
        - ProfilePicture: /profile-picture
        - Bio: /bio
        - Username: /name
        - Blog url: /blog-url
        - Website url: /website-url
        - Github url: /github-url
        - Email: /email
    - Delete: /:userId([0-9]+)?

- [Search](search/README.md)
    - Base URL: /api/search
    - Roadmaps: /roadmaps
        - Optional query params:
            - q: search query (STRING)
            - topic: search by topic
                - all: all topics
                - programming
                - math
                - physics
                - biology
            - sortBy: sort by
                - likes
                - views
                - new
            - order: order
                - asc
                - desc
            - limit: limit (INTEGER)
            - page: page (INTEGER)
