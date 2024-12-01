const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MongoUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=  initData.data.map((obj)=>({...obj,owner:'673ace0de4eab433f2eff0b6'}));
  await Listing.insertMany(initData.data);
  console.log("Successfully Inserted");
};

initDB();
