const { db, Bookmark } = require('./db');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/bookmarks', require('./views/bookmarks'));

app.get('/', (req, res) => {
  res.redirect('/bookmarks');
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
    await db.authenticate(); //must connect to db
    await syncAndSeed();
    app.listen(PORT, () => {
      console.log(`glistening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

setup();
