const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  await client.connect();
  const db = client.db("CherryCheck");
  const usersCollection = db.collection("users");
  return { usersCollection };
}

module.exports = { connect };
