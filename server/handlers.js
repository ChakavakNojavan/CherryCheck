const axios = require("axios");
const { ObjectId } = require("mongodb");
let usersCollection;

function setUsersCollection(collection) {
  usersCollection = collection;
}
const searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const response = await axios.get(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&search_simple=1&action=process&json=1`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for products" });
  }
};
const getProduct = async (req, res) => {
  try {
    const code = req.params.code;
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${code}.json`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
};

const registerOrLoginUser = async (req, res) => {
  try {
    const { user } = req.body;
    console.log(user);
    const result = await usersCollection.findOneAndUpdate(
      { auth0Id: user.sub },
      {
        $setOnInsert: {
          auth0Id: user.sub,
          name: user.name,
          email: user.email,
          picture: user.picture,
          favorites: [],
          reviews: [],
          _id: new ObjectId(),
        },
      },
      { upsert: true, returnOriginal: false }
    );

    res.json(result.value);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while registering or logging in the user",
    });
  }
};
const likeProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: productId } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error in likeProduct:", error);
    res
      .status(500)
      .json({ error: "An error occurred while liking the product" });
  }
};

const addReview = async (req, res) => {
  try {
    const { userId, productId, review } = req.body;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { reviews: { productId, review } } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("addReview error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the review" });
  }
};

async function getUserLikes(req, res) {
  try {
    const userId = req.params.userId;
    console.log("getUserLikes userId:", userId);

    console.log("Before findOne");
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    console.log("After findOne");

    console.log("getUserLikes user:", user);

    if (!user) {
      console.error(
        `getUserLikes error: user with id ${userId} not found in the database`
      );

      return res
        .status(404)
        .json({ error: `User with id ${userId} not found` });
    }

    const likes = user.favorites;
    console.log("getUserLikes likes:", likes);
    res.status(200).json(likes);
  } catch (error) {
    console.error("getUserLikes error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user's likes" });
  }
}

const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    res.json(user.reviews || []);
  } catch (error) {
    console.error("getUserReviews error:", error);
    res.status(500).json({
      error: `An error occurred while fetching the user's reviews: ${error.message}`,
    });
  }
};
const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.code;
    const usersWithReviews = await usersCollection
      .find({ reviews: { $elemMatch: { productId } } })
      .toArray();
    const reviews = usersWithReviews.flatMap((user) => {
      const matchingReviews = user.reviews.filter(
        (r) => r.productId === productId
      );
      return matchingReviews.map((review) => {
        return {
          user: {
            id: user._id,
            name: user.name,
            picture: user.picture,
          },
          review: review.review,
        };
      });
    });
    res.json(reviews);
  } catch (error) {
    console.error("getProductReviews error:", error);
    res.status(500).json({
      error: `An error occurred while fetching the product's reviews: ${error.message}`,
    });
  }
};

const unlikeProduct = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.code;

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favorites: productId } }
    );

    res.json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while unliking the product" });
  }
};
const deleteReview = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.code;

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { reviews: { productId } } }
    );

    res.json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the review" });
  }
};
module.exports = {
  searchProducts,
  getProduct,
  registerOrLoginUser,
  setUsersCollection,
  likeProduct,
  addReview,
  getUserLikes,
  getUserReviews,
  unlikeProduct,
  deleteReview,
  getProductReviews,
};
