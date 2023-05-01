/**
 * Express router paths go here.
 */

import { Immutable } from '@src/other/types';

const Paths = {
  Base: '/api',
  Auth: {
    Base: '/auth',
    Login: '/login',
    Register: '/register',
    ChangePassword: '/change-password',
    ForgotPassword: '/forgot-password',
    GoogleLogin: '/google-login',
    GoogleCallback: '/google-callback',
    GithubLogin: '/github-login',
    GithubCallback: '/github-callback',
    Logout: '/logout',
  },
  Explore: {
    Base: '/explore',
    New: '/new',
    Popular: '/popular',
    Trending: '/trending',
    Search: {
      Base: '/search',
      Users: '/users',
      Roadmaps: '/roadmaps',
    },
  },
  Roadmaps: {
    Base: '/roadmaps',
    Create: '/create',
    Get: {
      Base: '/:roadmapId([0-9]+)?',
      Roadmap: '/',
      MiniRoadmap: '/mini',
      Tags: '/tags',
      Owner: '/owner',
      OwnerMini: '/owner/mini',
    },
    Update: {
      Base: '/:roadmapId([0-9]+)',
      Title: '/title',
      Description: '/description',
      Tags: '/tags',
      Visibility: '/visibility',
      Owner: '/owner',
      Data: '/data',
    },
    Delete: '/:roadmapId([0-9]+)',
    Progress: {
      Base: '/:roadmapId/progress',
      Get: '/:userId?',
      Update: '/',
    },
    Rating: {
      Base: '/:roadmapId/rating',
      Get: '/:own?', // get average rating of roadmap or own rating
      Update: '/',
      Delete: '/',
    },
    Issues: {
      Base: '/:roadmapId([0-9]+)/issues',
      Create: '/create',
      Get: '/:issueId([0-9]+)?',
      Update: {
        Base: '/:issueId([0-9]+)',
        Title: '/title',
        Content: '/content',
        Status: '/status',
      },
      Delete: '/:issueId',
      Comments: {
        Base: '/:issueId/comments',
        Create: '/create',
        Get: '/:commentId?',
        Update: '/:commentId',
        Delete: '/:commentId',
      },
    },

    TabsInfo: {
      Base: '/:roadmapId([0-9]+)/tabsInfo',
      Create: '/create',
      Get: '/:tabInfoId?',
      Update: '/:tabInfoId?',
      Delete: '/:tabInfoId',
    },
  },
  Users: {
    Base: '/users',
    Get: {
      Base: '/:userId([0-9]+)?',
      Profile: '/',
      MiniProfile: '/mini',
      UserRoadmaps: '/roadmaps',
      UserIssues: '/issues',
      UserFollowers: '/followers',
      UserFollowing: '/following',
      RoadmapCount: '/roadmap-count',
      IssueCount: '/issue-count',
      FollowerCount: '/follower-count',
      FollowingCount: '/following-count',
      Follow: '/follow',
    },
    Update: {
      Base: '/:userId([0-9]+)?',
      ProfilePicture: '/profile-picture',
      Bio: '/bio',
      Quote: '/quote',
      Name: '/name',
      BlogUrl: '/blog-url',
      WebsiteUrl: '/website-url',
      GithubUrl: '/github-url',
      Email: '/email',
    },
    Delete: '/:userId([0-9]+)?',
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
