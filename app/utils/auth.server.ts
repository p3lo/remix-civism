import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import { createCookieSessionStorage } from 'remix';
import type { Auth0Profile } from 'remix-auth-auth0';
import {
  AUTH0_CALLBACK_URL,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_DOMAIN,
  SECRETS,
} from '~/constants/index.server';
import { prisma } from '~/db.server';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_remix_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [SECRETS],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const auth = new Authenticator<Auth0Profile>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: AUTH0_CALLBACK_URL,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    domain: AUTH0_DOMAIN,
  },
  async ({ profile }) => {
    //
    // Use the returned information to process or write to the DB.
    //
    await prisma.user.createMany({
      data: [
        {
          name: profile._json.nickname,
          email: profile._json.email,
          picture: profile._json.picture,
        },
      ],
      skipDuplicates: true,
    });
    return profile;
  }
);

auth.use(auth0Strategy);

export const { getSession, commitSession, destroySession } = sessionStorage;
