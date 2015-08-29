var db = require(path.join(__dirname, 'db'));
var slugGenerator = require('./slug-generator');

/* Articles fall into two seperate categories, Flow and News. Flow stories are user
 * submitted. News is a curated section that is mostly fivejs at the moment.  News
 * articles aren't moderated and automatically get approved.
 */
var Articles = {

  // Returns Flow stories that haven't been moderated.
  pending(cb) {
    db.query('SELECT a.id, a,url, a.title, a.slug, a.body, u.name, u.avatar_url FROM articles as a JOIN users as u on a.user_id = u.id WHERE approved IS NULL ORDER BY a.created_at ASC', [], cb)
  },

  // Return 25 of the most recent Flow and News articles that are published
  // along with user infomation.
  recent(cb) {
    db.query(
      'SELECT a.news, a.url, a.title, a.slug, a.body, a.published_at, u.name, u.avatar_url, (SELECT COUNT(*) FROM comments WHERE article_id = a.id) AS comment_count FROM articles AS a LEFT JOIN users AS u ON a.user_id = u.id WHERE a.id IN (SELECT id FROM articles WHERE news = true AND approved = true ORDER BY published_at DESC LIMIT 25) OR a.id IN (SELECT id FROM articles WHERE news = false AND approved = true ORDER BY published_at DESC LIMIT 25) ORDER BY published_at DESC;',
      [],
      cb
    )
  },

  // Returns 10 Flow articles that are published along with user information
  paginated(offset, cb){
    db.query(
      'SELECT a.news, a.url, a.title, a.slug, a.body, a.published_at, u.name, u.avatar_url, (SELECT COUNT(*) FROM comments WHERE article_id = a.id) AS comment_count FROM articles AS a LEFT JOIN users AS u ON a.user_id = u.id WHERE a.id IN (SELECT id FROM articles WHERE news = false AND approved = true ORDER BY published_at DESC LIMIT 25 OFFSET $1) ORDER BY published_at DESC;',
      [offset],
      cb
    )
  },

  totalPublished(cb){
    db.query(
      'SELECT count(*) FROM articles WHERE news = false AND approved = true',
      [],
      cb
    )
  },

  // Returns all stories that have been approved for RSS feed. Limit: 25
  rss(cb){
    db.query('SELECT a.news, a.title, a.slug, a.body, a,published_at FROM articles as a WHERE a.approved = true AND a.news = false ORDER BY published_at DESC', [], cb)
  },

  // Returns article based on slug
  findBySlug(slug, cb) {
    db.query('SELECT a.title, a.id, a.slug, a.body, a.url, u.avatar_url, u.name FROM articles a JOIN users u on a.user_id = u.id WHERE a.slug = $1', [slug], cb)
  },

  // Returns slug based on id
  getMailerInfo(id, cb) {
    db.query('SELECT a.slug, u.email FROM articles AS a JOIN users AS u on u.id = user_id WHERE a.id = $1;', [id], cb)
  },

  // Approve a Flow story.
  approve(id, cb) {
    db.query("UPDATE articles SET approved = true, published_at = NOW() WHERE id = $1;", [id], cb)
  },

  // Denies a Flow story.
  deny(id, cb) {
    db.query('UPDATE articles SET approved = false WHERE id = $1;', [id], cb)
  },

  // Creates a new News story pre-approved.
  createNews(newStory, cb) {
    var slug = slugGenerator.createSlug(newStory.title);

    db.query(
      "INSERT INTO articles (title, slug, body, url, published_at, news, approved) VALUES ($1, $2, $3, $4, now(), true, true);",
      [newStory.title, slug, newStory.summary, newStory.url],
      cb
    )
  },

  // Creates a new Flow article
  createFlow(newFlow, cb) {
    var title = newFlow.title;
    var slugTitle = slugGenerator.createSlug(title);
    var body = newFlow.body;
    var userId = newFlow.userId;
    var url = newFlow.url;

    // Returning slug in order to properly redirect after create.
    db.query(
      "INSERT INTO articles (title, slug, body, url, user_id, news) VALUES ($1, $2, $3, $4, $5, false) RETURNING slug;",
      [title, slugTitle, body, url, userId],
      cb
    )
  }
}

module.exports = Articles;
