const express = require('express');
const { db, Bookmark } = require('../db');

const app = express.Router();
module.exports = app;

app.get('/', async (req, res, next) => {
  //don't need 'bookmarks path because route is redirected to this module
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
          `<a href="/bookmarks/${x.category}"> ${x.category}</a>`,
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
    res.redirect(`/bookmarks/${category}`);
  } catch (error) {
    next(error);
  }
});

app.post('/:trash', async (req, res, next) => {
  try {
    console.log(`trash = ${req.params.trash}`);
    const trash = await Bookmark.findOne({ where: { link: req.params.trash } });
    const previous = trash.category;
    await trash.destroy();
    res.redirect(`/bookmarks/${previous}`);
  } catch (error) {
    next(error);
  }
});

app.get('/:_category', async (req, res, next) => {
  try {
    const category = req.params._category;
    const response = await Bookmark.findAll({
      where: { category },
    });
    res.send(
      `<html>
      <body style="font-family:helvetica;">
      <h1>${category}</h1>
      <p><a href="/">back</a></p>
      ${response
        .map((x) => {
          return `
          <div>${x.link}, ${x.category}
          <form method="post" action="/bookmarks/${x.link}">
            <button>delete</button>
          </form>
          </div>`;
        })
        .join('')}
        </body>
      </html>`
    );
  } catch (error) {
    next(error);
  }
});
