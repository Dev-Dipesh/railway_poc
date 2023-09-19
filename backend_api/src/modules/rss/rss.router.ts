import { Hono } from 'hono';
import controller from './rss.controller';
import { authMiddleware } from '../../shared/middlewares/auth-middleware';

const rss = new Hono();

rss.post('/add', authMiddleware(), controller.addFeeds);

rss.get('/list', authMiddleware(), controller.getAllFeeds);

rss.post('/delete', authMiddleware(), controller.deleteFeed);

export { rss };
