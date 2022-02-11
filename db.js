const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/bookmarks'
);

const Bookmark = db.define('Bookmark', {
  link: {
    type: STRING,
  },
  category: {
    type: STRING,
  },
});

module.exports = { db, Bookmark };
