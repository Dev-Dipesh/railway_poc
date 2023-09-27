import { Hono } from 'hono';
import controller from './users.controller';

const users = new Hono();

users.post('/register', controller.create);

export { users };
