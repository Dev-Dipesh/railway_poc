CREATE TABLE feeds (
  feed_id UUID PRIMARY KEY,
  feed_url TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feeds_feed_url ON feeds(feed_url); -- optimize lookups by feed_url

CREATE TABLE articles (
  article_id UUID PRIMARY KEY,
  feed_id UUID REFERENCES feeds(feed_id),
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE, 
  summary TEXT,
  category TEXT[],
  published_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_feed_id ON articles(feed_id); -- optimize lookups by feed_id

CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_feeds (
  user_feed_id UUID PRIMARY KEY,
  feed_id UUID REFERENCES feeds(feed_id),
  user_id UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, feed_id) -- ensures the same user can't add the same feed URL more than once
);

CREATE INDEX idx_user_feeds_user_id ON user_feeds(user_id); -- optimize lookups by user_id

CREATE TYPE read_status AS ENUM ('READ', 'UNREAD');

CREATE TABLE user_articles (
  user_article_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  article_id UUID REFERENCES articles(article_id),
  feed_id UUID REFERENCES feeds(feed_id),
  status read_status DEFAULT 'UNREAD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, article_id) -- ensures the same user can't add the same article more than once
);

CREATE INDEX idx_user_articles_user_id ON user_articles(user_id);
CREATE INDEX idx_user_articles_article_id ON user_articles(article_id);
