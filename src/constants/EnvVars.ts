/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

const EnvVars = {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 0),
  CookieProps: {
    Key: 'ExpressGeneratorTs',
    Secret: (process.env.COOKIE_SECRET ?? ''),
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: (process.env.COOKIE_PATH ?? ''),
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: (process.env.COOKIE_DOMAIN ?? ''),
      secure: (process.env.SECURE_COOKIE === 'true'),
    },
  },
  Jwt: {
    Secret: (process.env.JWT_SECRET ?? ''),
    Exp: (process.env.COOKIE_EXP ?? ''), // exp at the same time as the cookie
  },
  DBCred: {
    host: (process.env.MARIADB_HOST ?? ''),
    user: (process.env.MARIADB_USER ?? ''),
    password: (process.env.MARIADB_PASSWORD ?? ''),
    database: (process.env.MARIADB_DATABASE ?? ''),
  },
  Google: {
    ClientID: (process.env.GOOGLE_CLIENT_ID ?? ''),
    ClientSecret: (process.env.GOOGLE_CLIENT_SECRET ?? ''),
    RedirectUri: (process.env.GOOGLE_REDIRECT_URI ?? ''),
  },
  GitHub: {
    ClientID: (process.env.GITHUB_CLIENT_ID ?? ''),
    ClientSecret: (process.env.GITHUB_CLIENT_SECRET ?? ''),
    RedirectUri: (process.env.GITHUB_REDIRECT_URI ?? ''),
  },
} as const;

export default EnvVars;
export { EnvVars };
