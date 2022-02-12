const express = require('express');
const { db, Bookmark } = require('../db');

const app = express.Router(); //export the router

app.post('/:trash', async (req, res, next) => {
  try {
    console.log('hi');
    const trash = await Bookmark.findOne({ where: { link: req.params.trash } });
    const previous = trash.category;
    await trash.destroy();
    res.redirect(`/categories/${previous}`);
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
          <form method="post" action="/categories/${x.link}">
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

module.exports = app;
