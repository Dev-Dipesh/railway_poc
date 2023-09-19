import { Hono } from 'hono';
import controller from './auth.controller';

const auth = new Hono();

auth.post('/', controller.signIn);

export { auth };
