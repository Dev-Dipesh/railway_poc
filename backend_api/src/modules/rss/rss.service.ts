import { v4 as uuidv4 } from 'uuid';
import sql from '../../db';
import { Feed, UserArticle } from './rss.types';

class RssService {
  async getFeed(feed_url: string) {
    const feeds = await sql`
      select feed_id from feeds
      where feed_url = ${ feed_url }
    `
    return feeds[0].feed_id;
  }

  async insertFeeds(feed_url: string) {
    const feeds = await sql`
      insert into feeds
        (feed_id, feed_url)
      values
        (${ uuidv4() }, ${ feed_url })
      on conflict (feed_url) do nothing
      returning feed_id
    `
    return feeds[0] ? feeds[0].feed_id : null
  }

  async insertUserFeeds({ user_id, feed_id }: Feed) {
    const feeds = await sql`
      insert into user_feeds
        (user_feed_id, user_id, feed_id)
      values
        (${ uuidv4() }, ${ user_id }, ${ feed_id })
      on conflict (user_id, feed_id) do nothing
      returning user_feed_id
    `
    return feeds[0] ? feeds[0].user_feed_id : null
  }

  async insertUserArticle({ user_id, article_id, feed_id }: UserArticle) {
    const user_articles = await sql`
      insert into user_articles
        (user_article_id, user_id, article_id, feed_id)
      values
        (${ uuidv4() }, ${ user_id }, ${ article_id }, ${ feed_id })
      on conflict (user_id, article_id) do nothing
      returning user_article_id
    `
    return user_articles[0] ? user_articles[0].user_article_id : null
  }

  async deleteUserFeed({ user_id, feed_id }: Feed) {
    const feeds = await sql`
      delete from user_feeds
      where user_id = ${ user_id } and feed_id = ${ feed_id }
      returning 1
    `
    return feeds[0]
  }

  async deleteUserArticles({ user_id, feed_id }: Feed) {
    const articles = await sql`
      delete from user_articles
      where user_id = ${ user_id } and feed_id = ${ feed_id }
      returning 1
    `
    return articles[0]
  }
}

export default new RssService();
