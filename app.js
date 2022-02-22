const express = require('express');
const app = express();
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const Campground = require('./models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/campground');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
  console.log('Database Connected Successfully');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home');
});
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});
app.post(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
  })
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
  })
);

app.put(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const editedCampground = req.body;
    const campground = await Campground.findByIdAndUpdate(id, editedCampground);
    res.redirect(`/campgrounds/${campground.id}`);
  })
);
app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);

app.use((err, req, res, next) => {
  res.send('Oh boy we got an error !!!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`listening to Port:${port}`);
});
