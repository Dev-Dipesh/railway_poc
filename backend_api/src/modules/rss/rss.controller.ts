import { Context } from 'hono';
import celery from 'celery-node';
import redis from 'redis';
import { HTTPException } from 'hono/http-exception';
import rssService from './rss.service';
import { getUserIdFromHeader } from '../../shared/utils/jwtUtils';

const redisClient = redis.createClient({
  url: `${process.env.REDIS_URL}/3`
});

redisClient.connect();

// Create Celery Client
const celeryClient = celery.createClient(
  `${process.env.REDIS_URL}/0`,
  `${process.env.REDIS_URL}/1`
);

redisClient.on('error', err => { throw new Error('Redis Client Error', err)});

class RssController {
  async addFeeds(c: Context) {
    try {
      const user_id = await getUserIdFromHeader(c.req);
      const feeds = await c.req.json();
      
      for (const url of feeds) {
        const feed_key = `feed:${url}`;
        const articlesRaw = await redisClient.hGet(feed_key, "articles");

        if (articlesRaw) {
          const articles = JSON.parse(articlesRaw);
          // Type assertion - assuming when articlesRaw is not null, feed_id will be present
          const feed_id = (await redisClient.hGet(feed_key, "feed_id")) as string;
          for (const article of articles) {
            await rssService.insertUserFeeds({ user_id, feed_id });
            await rssService.insertUserArticle({
              user_id,
              article_id: article.article_id,
              feed_id
            })
          }
        } else {
          // Add feed_url data to Database
          const feed_id = await rssService.insertFeeds(url);
          await rssService.insertUserFeeds({ user_id, feed_id });
          
          // Add to Queue
          const task = celeryClient.createTask("tasks.process_feed");
          task.applyAsync([], { feed_id, user_id, feed_url: url }); // Schedule the task but don't wait for it
        }
      }

      return c.json({ message: 'Processing started' }); // Send response back to the user immediately
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, { message: 'Invalid Authorization Token. Sign In again to get new token.' })
    }
  }

  async getAllFeeds(c: Context) {
    // Get All Feeds
  }

  async deleteFeed(c: Context) {
    // Delete Feed
    const user_id = await getUserIdFromHeader(c.req);
    const feeds = await c.req.json();

    for (const url of feeds) {
      const feed_id = await rssService.getFeed(url);
      await rssService.deleteUserFeed({ user_id, feed_id });
      await rssService.deleteUserArticles({ user_id, feed_id });
    }

    return c.json({ message: 'All requested feeds and their articles are deleted.' });
  }
}

export default new RssController();
