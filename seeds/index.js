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
    const camp = new Campground({
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
