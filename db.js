//const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/bookmarks'
);

//DO NOT CAPITALIZE THE TABLE NAME
const Bookmark = db.define('Bookmark', {
  link: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
  },
});

module.exports = { db, Bookmark };
