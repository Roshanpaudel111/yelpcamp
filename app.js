const express = require('express');
const app = express();
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const campgroundSchema = require('./schemas.js');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const Campground = require('./models/campground');
const { diffieHellman } = require('crypto');
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

// Campground middleware validation
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};

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
  validateCampground,
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
  validateCampground,
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

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Oh No!! Something Went Wrong!!!';
  }
  res.status(statusCode).render('error', { err });
});

const port = 3000;
app.listen(port, () => {
  console.log(`listening to Port:${port}`);
});
