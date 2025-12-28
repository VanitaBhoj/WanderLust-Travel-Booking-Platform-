const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");
  await initDB();              // ✅ call AFTER connect
  mongoose.connection.close(); // optional but recommended
}

const initDB = async () => {
  const countBefore = await Listing.countDocuments();
  console.log("Before delete:", countBefore);

  const result = await Listing.deleteMany({});
  console.log("Deleted count:", result.deletedCount);

   console.log("📦 Preparing new listings...");
  const newData = initData.data.map((obj) => {
    return {
      ...obj,
      owner: new mongoose.Types.ObjectId("652d0081ae547c5d37e56b5f")  , // your User _id
    };
  });

 const inserted = await Listing.insertMany(newData);
  console.log("Inserted count:", inserted.length);

  const countAfter = await Listing.countDocuments();
  console.log("After insert:", countAfter);

  console.log("✅ Data was initialized successfully!");
  mongoose.connection.close();
  
};
main().catch(console.error);
