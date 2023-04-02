/**
 * Express router paths go here.
 */

import { Immutable } from '@src/other/types';

const Paths = {
  Base: '/api',
  Auth: {
    Base: '/auth',
    Login: '/login',
    GoogleLogin: '/google-login',
    GithubLogin: '/github-login',
    GithubCallback: '/github-callback',
    Register: '/register',
    Logout: '/logout',
    ForgotPassword: '/forgot-password',
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
    Get: '/:roadmapId',
    Update: '/:roadmapId',
    Delete: '/:roadmapId',
    Progress: {
      Base: '/:roadmapId/progress',
      Get: '/:userId?',
      Update: '/',
    },
    Rating: {
      Base: '/:roadmapId/rating',
      Get: '/:own?', // get rating of roadmap or own rating
      Update: '/',
      Delete: '/',
    },
    Issues: {
      Base: '/:id/issues',
      Create: '/create',
      Get: '/:issueId?', // get all issues or one issue
      Update: '/:issueId',
      Close: '/:issueId',
      Comments: {
        Base: '/:issueId/comments',
        Create: '/create',
        Get: '/:commentId?',
        Update: '/:commentId',
        Delete: '/:commentId',
      },
    },
  },
  Users: {
    Base: '/users',
    Me: '/me',
    Get: '/:userId',
    Update: '/:userId?',
    Delete: '/:userId?',
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
