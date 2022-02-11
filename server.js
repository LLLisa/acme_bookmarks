const { db, Bookmark } = require('./db');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.redirect('/bookmarks');
});

app.get('/bookmarks', async (req, res, next) => {
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
      </body>
    </html>`);
  } catch (error) {
    next(error);
  }
});

app.post('/bookmarks/:trash', async (req, res, next) => {
  try {
    const trash = await Bookmark.findOne({ where: { link: req.params.trash } });
    const past = trash.category;
    await trash.destroy();
    res.redirect(`/bookmarks/${past}`);
  } catch (error) {
    next(error);
  }
});

app.get('/bookmarks/:cat', async (req, res, next) => {
  try {
    const category = req.params.cat;
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
          <div>${x.link},      ${x.category}
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

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });
    await Bookmark.create({ link: 'Bookmark1', category: 'category1' });
    await Bookmark.create({ link: 'Bookmark2', category: 'category2' });
    await Bookmark.create({ link: 'Bookmark3', category: 'category2' });
  } catch (error) {
    console.log(error);
  }
};

const PORT = process.env.PORT || 1337;

const setup = async () => {
  try {
    await db.authenticate();
    await syncAndSeed();
  } catch (error) {
    console.log(error);
  }
};

setup();

app.listen(PORT, () => {
  console.log(`glistening on port ${PORT}`);
});
