/* eslint-disable node/no-process-env */
/* eslint-disable no-process-env */
/**
 * Environments variables declared here.
 */

import { NodeEnvs } from '@src/constants/misc';

interface IEnvVars {
  NodeEnv: NodeEnvs;
  Port: number;
  CookieProps: {
    Key: string;
    Secret: string;
    Options: {
      httpOnly: boolean;
      signed: boolean;
      path: string;
      maxAge: number;
      domain: string;
      secure: boolean;
    };
  };
  DBCred: {
    host: string;
    user: string;
    port: number;
    password: string;
    database: string;
  };
  Google: {
    ClientID: string;
    ClientSecret: string;
    RedirectUri: string;
  };
  GitHub: {
    ClientID: string;
    ClientSecret: string;
    RedirectUri: string;
  };
}

// Config environment variables
const EnvVars = {
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: process.env.PORT ?? 0,
  CookieProps: {
    Secret: process.env.COOKIE_SECRET ?? '',
    // Casing to match express cookie options
    Options: {
      httpOnly: false,
      signed: true,
      path: process.env.COOKIE_PATH ?? '/',
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: process.env.COOKIE_DOMAIN ?? '',
      secure: process.env.SECURE_COOKIE === 'true',
    },
  },
  DBCred: {
    host: process.env.MARIADB_HOST ?? '',
    user: process.env.MARIADB_USER ?? '',
    port: process.env.MARIADB_PORT ?? 3306,
    password: process.env.MARIADB_PASSWORD ?? '',
    database: process.env.MARIADB_DATABASE ?? '',
  },
  Google: {
    ClientID: process.env.GOOGLE_CLIENT_ID ?? '',
    ClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    RedirectUri: process.env.GOOGLE_REDIRECT_URI ?? '',
  },
  GitHub: {
    ClientID: process.env.GITHUB_CLIENT_ID ?? '',
    ClientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    RedirectUri: process.env.GITHUB_REDIRECT_URI ?? '',
  },
} as Readonly<IEnvVars>;

export default EnvVars;
export { EnvVars };
