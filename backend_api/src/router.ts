import { Hono } from 'hono';
import { users } from './modules/users/users.router';
import { auth } from './modules/auth/auth.router';
import { rss } from './modules/rss/rss.router';

const healthcheck = new Hono();

healthcheck.get('/', (c) => {
  return c.jsonT({ ok: true })
});

const router = new Hono();

router.route('/healthcheck', healthcheck)

router.route('/users', users);
router.route('/auth', auth);
router.route('/feeds', rss);;

export { router };
