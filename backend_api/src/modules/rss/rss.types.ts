type UUID = string;

export interface Feed {
  user_id: UUID;
  feed_id: UUID;
}

export interface UserArticle{
  user_id: UUID;
  article_id: UUID;
  feed_id: UUID;
}
