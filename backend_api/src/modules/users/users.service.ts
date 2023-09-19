import { v4 as uuidv4 } from 'uuid';
import sql from '../../db';
import { CreateUser } from './users.types';

class UsersService {
  async findByUsername(username: string) {
    const users = await sql`
      select
        user_id, password
      from users
      where username = ${ username }
    `
    return users[0]
  }

  async findByEmail(email: string) {
    const users = await sql`
      select
        user_id, password
      from users
      where email = ${ email }
    `
    return users[0]
  }

  async insertUser({ username, email, password }: CreateUser) {
    const users = await sql`
      insert into users
        (user_id, username, email, password)
      values
        (${ uuidv4() }, ${ username }, ${ email }, ${ password })
      returning user_id, username
    `
    return users[0]
  }
}

export default new UsersService();
