const express = require('express');
const { db, Bookmark } = require('../db');

const app = express.Router();

app.get('/', async (req, res, next) => {
  //don't need 'bookmarks' path because route is redirected to this module
  //in fact this whole file doesn't need that prefix
  try {
    const response = await Bookmark.findAll();
    await res.send(`<html>
    <body style="font-family:helvetica;">
    <h1>Bookmarks</h1>
    ${response
      .map((x) => {
        return `<div>${[
          x.link,
          `<a href="/categories/${x.category}"> ${x.category}</a>`, //here
        ]}
        </div>`;
      })
      .join('')}
        <form method="post">
          <input name="link" placeholder="link"></input>
          <input name="category" placeholder="category"></input>
          <button>submit</button>
        </form>
      </body>
    </html>`);
  } catch (error) {
    next(error);
  }
});

//POST /bookmarks is different request than GET /bookmarks
app.post('/', async (req, res, next) => {
  try {
    const { link, category } = req.body;
    await Bookmark.create({ link: link, category: category }); //so simple!
    res.redirect(`/categories/${category}`);
  } catch (error) {
    next(error);
  }
});

module.exports = app;
