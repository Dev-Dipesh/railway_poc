import { Context } from 'hono';
import usersService from './users.service';
// import { HTTPException } from 'hono/http-exception';
import { CreateUser } from './users.types';

class UsersController {
  async create(c: Context) {
    const { username, email, password } = await c.req.json<CreateUser>();

    const hash = await Bun.password.hash(password, {
      algorithm: "bcrypt"
    });

    const user = await usersService.insertUser({ username, email, password: hash });

    return c.json(user);
  }

  // async findAll(c: Context) {
  //   const users = await usersService.findAll();

  //   return c.json(users);
  // }

  // async findOneById(c: Context) {
  //   const { id } = c.req.param();

  //   const user = await usersService.findOneById(id);

  //   if(!user) throw new HTTPException(404, { message: 'User not found.' });

  //   return c.json(user);
  // }

  // async update(c: Context) {
  //   const { id } = c.req.param();
  //   const { name, email, password, members } = await c.req.json<Partial<User>>();

  //   const user = await usersService.update(id, { name, email, password, members });

  //   if(!user) throw new HTTPException(404, { message: 'User not found.' });

  //   return c.json(user);
  // }

  // async delete(c: Context) {
  //   const { id } = c.req.param();

  //   const user = await usersService.delete(id);

  //   if(!user) throw new HTTPException(404, { message: 'User not found.' });

  //   return c.status(204);
  // }
}

export default new UsersController();
