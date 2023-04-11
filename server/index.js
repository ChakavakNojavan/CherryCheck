"use strict";

const { connect } = require("./db");
const handlers = require("./handlers");
const { json } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const PORT = 8000;

(async () => {
  const { usersCollection } = await connect();
  handlers.setUsersCollection(usersCollection);

  const app = express();

  app
    .use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Methods",
        "OPTIONS, HEAD, GET, PUT, POST, DELETE"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    })

    .use(morgan("tiny"))
    .use(express.static("./server/assets"))
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use("/", express.static(__dirname + "/"))
    .use(cors())

    .get("/api/search", handlers.searchProducts)
    .get("/api/product/:code", handlers.getProduct)
    .post("/api/users", handlers.registerOrLoginUser)
    .post("/api/like", handlers.likeProduct)
    .delete("/api/like/:userId/:code", handlers.unlikeProduct)
    .get("/api/user/:userId/likes", handlers.getUserLikes)
    .post("/api/review", handlers.addReview)
    .delete("/api/review/:userId/:code", handlers.deleteReview)
    .get("/api/user/:userId/reviews", handlers.getUserReviews)
    .get("/api/product/:code/reviews", handlers.getProductReviews);

  app.listen(PORT, () => console.info(`Listening on port ${PORT}`));

  process.on("SIGINT", async () => {
    await client.close();
    process.exit();
  });
})();
