interface ICookieConfig {
  path: string;
  domain: string;
  secure: boolean;
  sameSite: 'lax';
}

const RELEASE_ENV = process.env.NEXT_PUBLIC_RELEASE_ENV;
const isProd = process.env.RELEASE_ENV === 'production';
let API_BASE_URL = '';

switch (RELEASE_ENV) {
  case 'production':
    API_BASE_URL = 'https://inthesky.kayaji.com';
    break;
  case 'development':
    API_BASE_URL = 'http://localhost:8080';
    break;
  default:
    break;
}

const defaultCookieConfig: ICookieConfig = {
  path: '/',
  domain: '',
  secure: isProd,
  sameSite: 'lax',
};

export { API_BASE_URL, defaultCookieConfig, RELEASE_ENV };
