import { config } from '@keystone-next/keystone/schema';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';
import { lists } from './schemas';
import { getValidatedEnv } from "./utils/validateEnvironment";

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

export default withAuth(
  config({
    db: {
      adapter: 'prisma_postgresql',
      url: env.DATABASE_URL,
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session: statelessSessions({
      maxAge: sessionMaxAge,
      secret: env.SESSION_SECRET,
    }),
    server: {
      port: env.SERVER_PORT,
      maxFileSize: env.MAX_FILESIZE_MB * 1024 * 1024
    }
  })
);
