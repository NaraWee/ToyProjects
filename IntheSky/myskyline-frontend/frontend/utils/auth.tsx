import nookies from 'nookies';
import { GetServerSidePropsContext } from 'next';
import { defaultCookieConfig } from 'utils/config';

const TOKEN_NAME = 'token';

export function getToken(ctx: GetServerSidePropsContext | null) {
  const cookies = nookies.get(ctx || null);
  return cookies[TOKEN_NAME];
}

export function setToken(ctx: GetServerSidePropsContext | null, token: string) {
  nookies.set(ctx, TOKEN_NAME, token, defaultCookieConfig);
}

export function destroyToken(ctx: GetServerSidePropsContext | null) {
  nookies.destroy(ctx || null, TOKEN_NAME, defaultCookieConfig);
}
