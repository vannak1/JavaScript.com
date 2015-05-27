var db = require('./db');
var slugGenerator = require('./slug-generator');

/* Articles fall into two seperate categories, Flow and News. Flow stories are user
 * submitted. News is a curated section that is mostly fivejs at the moment.  News
 * articles aren't moderated and automatically get approved.
 */
var Articles = {

  // Returns Flow stories that haven't been moderated.
  pending(cb) {
    db.query('SELECT * FROM articles where approved IS NULL ORDER BY created_at ASC', [], cb)
  },

  // Returns all stories that have been approved along with user information
  // in DESC published_date order.
  published(cb){
    db.query('SELECT a.news, a.url, a.title, a.slug, a.body, a,published_at, u.name, u.avatar_url, (SELECT count(*) from comments where article_id = a.id) as commentCount FROM articles as a LEFT JOIN users as u ON a.user_id = u.id WHERE a.approved = true ORDER BY published_at DESC', [], cb)
  },

  // Returns all stories that have been approved for RSS feed. Limit: 25
  rss(cb){
    db.query('SELECT a.news, a.url, a.title, a.slug, a.body, a,published_at FROM articles as a WHERE a.approved = true ORDER BY published_at DESC', [], cb)
  },

  // Returns article based on slug
  findBySlug(slug, cb) {
    db.query('SELECT a.title, a.id, a.slug, a.body, a.url, u.avatar_url, u.name FROM articles a JOIN users u on a.user_id = u.id WHERE a.slug = $1', [slug], cb)
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
