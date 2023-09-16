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
  Notifications: {
    Base: '/notifications',
    Get: '/',
    Dismiss: '/:commentId([0-9]+)',
  },
  Roadmaps: {
    Base: '/roadmaps',
    Create: '/create',
    Get: {
      Base: '/:roadmapId([0-9]+)?',
      Roadmap: '/',
    },
    Update: {
      Base: '/:roadmapId([0-9]+)',
      // Owner only
      All: '/',
      About: '/about',
      Name: '/name',
      Description: '/description',
      Topic: '/topic',
      Visibility: '/visibility',
      Draft: '/draft',
      Data: '/data',
      MiscData: '/misc-data', // used for roadmap wide data like roadmap theme
      Version: '/version',

      // Everyone
      Progress: '/progress',
      Like: '/like',
      Dislike: '/dislike',
    },
    Delete: '/:roadmapId([0-9]+)',
  },
  Search: {
    Base: '/search',
    Roadmaps: '/roadmaps',
    FeelingLucky: '/feeling-lucky',
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
      All: '/',
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
