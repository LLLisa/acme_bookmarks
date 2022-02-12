const { db, Bookmark } = require('./db');
const express = require('express');
const app = express();

/*
//npm install method-override
//midware:
//app.use(func) will trigger on any app calls (here, express calls)
// - before GET/POST handler recieves it
//midwares run in the order they are declared - thats why we order as below
//next calls next function
//app.get takes 2 things: path and midware functions
can use req,res inside midware functions
next() doesn't exit a function, it executes the next func and then continues withthe line after next()
res.send is only one response, but code can keep executing after it
*/

app.use(express.urlencoded({ extended: false }));
app.use('/bookmarks', require('./views/bookmarks'));
app.use('/categories', require('./views/categories'));

app.get('/categories', (req, res) => {
  res.redirect('/categories');
});

app.get('/', (req, res) => {
  res.redirect('/bookmarks');
});

const syncAndSeed = async () => {
  try {
    //can destructure and map over instances
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
    //await db.authenticate(); //must connect to db???
    await db.sync({ force: true }); //DROP IF EXISTS
    await syncAndSeed();
    app.listen(PORT, () => {
      console.log(`glistening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

setup();
