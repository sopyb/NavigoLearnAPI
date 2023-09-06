/**
 * Express router paths go here.
 */

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
    Search: {
      Base: '/search',
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
      Owner: '/owner',
      OwnerMini: '/owner/mini',
    },
    Update: {
      Base: '/:roadmapId([0-9]+)',
      All: '/',
      Name: '/title',
      Description: '/description',
      Topic: '/topic',
      Visibility: '/visibility',
      Draft: '/draft',
      Data: '/data',
    },
    Delete: '/:roadmapId([0-9]+)',
    Like: '/:roadmapId([0-9]+)/like',
    Dislike: '/:roadmapId([0-9]+)/dislike',
    Issues: {
      Base: '/:roadmapId([0-9]+)/issues',
      Create: '/create',
      Get: '/:issueId([0-9]+)',
      GetAll: '/',
      Update: {
        Base: '/:issueId([0-9]+)',
        All: '/',
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
  },
  Users: {
    Base: '/users',
    Get: {
      Base: '/:userId([0-9]+)?',
      Profile: '/',
      MiniProfile: '/mini',
      UserRoadmaps: '/roadmaps',
      Follow: '/follow',
    },
    Update: {
      Base: '/',
      ProfilePicture: '/profile-picture',
      Bio: '/bio',
      Quote: '/quote',
      Name: '/name',
      WebsiteUrl: '/website-url',
      GithubUrl: '/github-url',
    },
    Delete: '/:userId([0-9]+)?',
  },
} as const;

// **** Export **** //
export default Paths;
