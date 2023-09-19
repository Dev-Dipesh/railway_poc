# Python Worker
import os
import json
import uuid
import feedparser
import redis
import psycopg2
import psycopg2.extras

from celery import Celery
from datetime import datetime

# Redis and PostgreSQL URLs from environment variables
REDIS_URL = os.environ.get('REDIS_URL')
DATABASE_URL = os.environ.get('DATABASE_URL')

# To adapt psycopg2 to work with UUIDs
psycopg2.extras.register_uuid()

# Configure Celery
app = Celery('tasks', broker=REDIS_URL+'/0', backend=REDIS_URL+'/1')

@app.task(bind=True)
def process_feed(self, feed_id, user_id, feed_url):
  # Connect to PostgreSQL using the connection URL
  conn = psycopg2.connect(DATABASE_URL)
  cursor = conn.cursor()

  # Parse the feed
  feed_data = feedparser.parse(feed_url)
  
  if feed_data.status == 200:
    articles = []
    # feed_id, user_id, article_id(from inerting in articles)
    # title, link, summary, published_date, category
    
    for entry in feed_data.entries:
      title = entry.title
      link = entry.link
    
      try:
        # Save Article in articles table
        cursor.execute(
          "INSERT INTO articles(article_id, feed_id, title, link) VALUES(%s, %s, %s, %s) RETURNING article_id",
          (uuid.uuid4(), feed_id, title, link)
        )
        
        # Retrieve article_id
        article_id = cursor.fetchone()[0]
      except psycopg2.errors.UniqueViolation:
        # Handle duplicates, if needed
        print(f"Duplicate article detected: {link}")
        continue
      except Exception as e:
        print(f"Error inserting article: {e}")
        continue

      # Insert into user_articles tables to link user and article
      try:
        # Save Article in user_articles table
        cursor.execute(
          "INSERT INTO user_articles(user_article_id, user_id, article_id, feed_id) VALUES(%s, %s, %s, %s)",
          (uuid.uuid4(), user_id, article_id, feed_id)
        )
      except psycopg2.errors.UniqueViolation:
        # Handle duplicates, if needed
        print(f"Duplicate user article detected: {link}")
        continue
      except Exception as e:
        print(f"Error inserting user article: {e}")
        continue

      # We only need article_id in our usecase, but we can extend the usecase by sending articles to user directly from redis cache
      articles.append({ "article_id": str(article_id), "title": title, "link": link })
    
    conn.commit()
    cursor.close()
    conn.close()

    # print("articles: ", articles)

    # Connect to Redis and set data with expiration
    r = redis.Redis.from_url(REDIS_URL+'/3')
    
    # Set the feed ID and articles in a Redis hash.
    feed_key = f"feed:{feed_url}"
    r.hset(feed_key, "feed_id", feed_id)
    r.hset(feed_key, "articles", json.dumps(articles))
    
    # Set the expiration time for the entire hash.
    r.expire(feed_key, 10800)
    
    return {
      "feed_id": feed_id,
      "user_id": user_id,
      "feed_url": feed_url,
      "success": True
    }
  else:
    print("Error parsing feed", feed_data)
    return

# if __name__ == '__main__':
#   app.worker_main([
#     'worker',
#     '--loglevel=info',
#     '--concurrency=4'
#   ])
