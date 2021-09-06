import { config } from '@keystone-next/keystone/schema';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';
import { lists } from './schema';
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error(
    'The SESSION_SECRET environment variable must be set'
  );
}

let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'name',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
});

export default withAuth(
  config({
    db: {
      adapter: 'prisma_postgresql',
      url: process.env.DATABASE_URL || '',
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
  })
);
