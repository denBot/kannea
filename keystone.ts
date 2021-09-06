import { config } from '@keystone-next/keystone/schema';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';
import { lists } from './schema';
import { getValidatedEnv } from "./validateEnvironment";

const env = getValidatedEnv();

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
  secret: process.env.SESSION_SECRET,
});

export default withAuth(
  config({
    db: {
      adapter: 'prisma_postgresql',
      url: process.env.DATABASE_URL || 'postgres://tbxlrqaw:IJ_FevSavdDCP5K3AystdFJL_f2HdVVD@surus.db.elephantsql.com/tbxlrqaw',
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
  })
);
