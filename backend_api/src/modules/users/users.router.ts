import { Hono } from 'hono';
import controller from './users.controller';

const users = new Hono();

users.post('/register', controller.create);

// users.get('/', controller.findAll);

// users.get('/:id', controller.findOneById);

// users.patch('/:id', controller.update);

// users.delete('/:id', controller.delete);

export { users };
