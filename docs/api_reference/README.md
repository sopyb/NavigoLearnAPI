# API Reference

This directory provides detailed documentation of each endpoint in the NavigoLearn API.



## Overview

For each endpoint, we provide the following details:

- The HTTP method (GET, POST, PUT, DELETE)
- Endpoint URL
- Required parameters in the request
- A short description of what the endpoint does
- An example request
- An example response

## Endpoints

- /api
  - /api/auth
    - [GET /api/auth/google-login](./auth/google-login.md)
    - [GET /api/auth/google-callback](./auth/google-callback.md)
    - [GET /api/auth/github-login](./auth/github-login.md)
    - [GET /api/auth/github-callback](./auth/github-callback.md)
    - [POST /api/auth/login](./auth/login.md)
    - [POST /api/auth/register](./auth/register.md)
    - [POST /api/auth/change-password](./auth/change-password.md)
    - [POST /api/auth/forgot-password](./auth/forgot-password.md) (Not Implemented - Not planned)
    - [DELETE /api/auth/logout](./auth/logout.md)
  - /api/search (formerly /api/explore)
    - [GET /api/search/roadmaps](./search/roadmaps.md) (To be added)
    - [GET /api/search/feeling-lucky](./search/feeling-lucky.md) (To be added)
    - ... More to be added
  - /api/roadmaps
    - [GET /api/roadmaps/:roadmapId?](./roadmaps/get-roadmap.md) (To be added)
    - [POST /api/roadmaps/create](./roadmaps/create-roadmap.md) (To be added)
    - /api/roadmaps/:roadmapId
      - **Update roadmap data** 
      - [POST /api/roadmaps/:roadmapId/](./roadmaps/update-roadmap.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/about](./roadmaps/update-roadmap-about.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/name](./roadmaps/update-roadmap-name.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/description](./roadmaps/update-roadmap-description.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/topics](./roadmaps/update-roadmap-topic.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/visibility](./roadmaps/update-roadmap-visibility.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/draft](./roadmaps/update-roadmap-draft.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/data](./roadmaps/update-roadmap-data.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/misc-data](./roadmaps/update-roadmap-misc-data.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/cover-image](./roadmaps/update-roadmap-cover-image.md) (To be added)
      - **Interact with the roadmap**
      - [GET /api/roadmaps/:roadmapId/like](./roadmaps/like-roadmap.md) (To be added)
      - [GET /api/roadmaps/:roadmapId/dilike](./roadmaps/unlike-roadmap.md) (To be added)
      - [POST /api/roadmaps/:roadmapId/progress](./roadmaps/update-roadmap-progress.md) (To be added)
      - [DELETE /api/roadmaps/:roadmapId/{like,dislike}](./roadmaps/delete-roadmap-like.md) (To be added)
    - [DELETE /api/roadmaps/:roadmapId](./roadmaps/delete-roadmap.md) (To be added)
  - /api/users
    - [GET /api/users/:userId?](./users/get-user.md) (To be added)
    - [GET /api/users/:userId/roadmaps](./users/get-user-roadmaps.md) (To be added)
    - [GET /api/users/:userId/follow](./users/follow-user.md) (To be added)
    - [DELETE /api/users/:userId/follow](./users/unfollow-user.md) (To be added)
    - [POST /api/users/]('./users/update-user.md) (To be added)
    - [POST /api/users/:userId/profile-picture](./users/update-user-profile-picture.md) (To be added)
    - [POST /api/users/:userId/bio](./users/update-user-bio.md) (To be added)
    - [POST /api/users/:userId/quote](./users/update-user-quote.md) (To be added)
    - [POST /api/users/:userId/name](./users/update-user-name.md) (To be added)
    - [POST /api/users/:userId/website-url](./users/update-user-website-url.md) (To be added)
    - [POST /api/users/:userId/github-url](./users/update-user-github-url.md) (To be added)
    - [DELETE /api/users/:userId](./users/delete-user.md) (To be added)

## Responses

All responses are in JSON format and have the keys `success` and `message`. The `success` key is a boolean that indicates whether the request was successful or not. The `message` key is a string that contains a message about the request. If the request was successful, the `message` key will contain a confirmation message. If the request was unsuccessful, the `message` key will contain an error message.

Additionally, some responses will contain a `data` key. The `data` key will contain the data requested by the user. For example, if the user requests a roadmap, the `data` key will contain the roadmap data.

Also, some responses will contain a `total` key. The `total` key will contain the total number of items that match the response `data` array. For example, if the user requests a list of roadmaps, the `total` key will contain the total number of roadmaps that match the request.

**Each response file above contains an example response.**

## Note

Please note that this API reference is a work in progress and will continue to grow as new endpoints are added to the NavigoLearn API.

And some might change requirements or functionality as the project evolves.