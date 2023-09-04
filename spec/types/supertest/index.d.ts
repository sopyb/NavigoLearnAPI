import 'supertest';

export interface Response {
  headers: {
    'set-cookie': string[];
  };
  body: {
    success: boolean;
    message: string;
    data: unknown;
  };
}

declare module 'supertest' {
  export interface Response {
    headers: {
      'set-cookie': string[];
    };
    body: {
      success: boolean;
      message: string;
      data: unknown;
    };
  }
}
