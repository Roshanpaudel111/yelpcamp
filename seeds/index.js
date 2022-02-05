const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://127.0.0.1:27017/campground");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected Successfully");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let index = 0; index < 50; index++) {
    const random = Math.floor(Math.random() * 1000);
    const randomImage = Math.floor(Math.random() * 39);
    const camp = new Campground({
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `/pictures/${randomImage}.jpeg`,
      price: random,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus esse, soluta quibusdam perferendis odio nam, fugiat delectus magni sequi repellendus porro, non fuga autem sit? Sit",
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
