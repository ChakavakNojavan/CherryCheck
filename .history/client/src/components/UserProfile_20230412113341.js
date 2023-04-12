import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
const Profile = () => {
  const { user } = useAuth0();
  const [likes, setLikes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [_id, set_id] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState([]);
  const navigate = useNavigate();
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const handleProductClick = (productCode) => {
    navigate(`/products/${productCode}`);
  };

  useEffect(() => {
    if (user?.sub) {
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      })
        .then((res) => res.json())
        .then((data) => {
          set_id(data._id);
        });
    }
  }, [user]);

  useEffect(() => {
    if (_id) {
      fetchUserData();
    }
  }, [_id]);
  async function fetchProductData(productCodes) {
    const products = [];
    for (const code of productCodes) {
      try {
        const response = await axios.get(`/api/product/${code}`);
        products.push(response.data.product);
      } catch (error) {
        console.error(`Error fetching product data for code ${code}:`, error);
      }
    }
    return products;
  }
  async function handleDeleteReview(productId) {
    try {
      await axios.delete(`/api/review/${_id}/${productId}`);
      fetchUserData();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  async function fetchUserData() {
    if (!_id) {
      console.error("Error fetching user data: _id is null");
      return;
    }
    setLoadingFavorites(true);
    setLoadingReviews(true);
    try {
      const likesResponse = await axios.get(`/api/user/${_id}/likes`);

      const likesData = likesResponse.data;
      if (likesData.error) {
        console.error("Client: fetchUserData likesData:", likesData);
      } else {
        setLikes(likesData);
      }

      const reviewsResponse = await axios.get(`/api/user/${_id}/reviews`);

      const reviewsData = reviewsResponse.data;
      if (reviewsData.error) {
        console.error("Client: fetchUserData reviewsData:", reviewsData);
      } else {
        setReviews(reviewsData);
      }
      const likedProductsData = await fetchProductData(likesData);
      setLikedProducts(likedProductsData);

      const reviewedProductCodes = reviewsData.map(
        (review) => review.productId
      );
      const reviewedProductsData = await fetchProductData(reviewedProductCodes);
      setReviewedProducts(reviewedProductsData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingFavorites(false);
      setLoadingReviews(false);
    }
  }
  return (
    <Container>
      <Title>My Profile</Title>
      <Header>
        {user?.picture && <UserImg src={user.picture} alt={user?.name} />}
        <H2>{user?.email}</H2>
        <LogoutButton />
      </Header>
      <Section>
        <H2>Favorites</H2>
        <FavoritesList>
          {likedProducts.map(
            (product, index) =>
              product && (
                <ListItem key={index}>
                  <Img
                    src={product?.image_url}
                    onClick={() => handleProductClick(product.code)}
                  />
                </ListItem>
              )
          )}
        </FavoritesList>
      </Section>
      <Section>
        <H2>Reviews</H2>
        <ul>
          {reviews.map((review, index) => {
            const product = reviewedProducts.find(
              (product) => product.code === review.productId
            );
            return (
              product && (
                <ListItem key={index}>
                  <DeleteButton
                    onClick={() => handleDeleteReview(review.productId)}
                  >
                    ❌
                  </DeleteButton>
                  <ImgReview
                    src={product?.image_url}
                    onClick={() => handleProductClick(product.code)}
                  />
                  {product ? product.product_name : review.productId}:{" "}
                  {review.review}
                </ListItem>
              )
            );
          })}
        </ul>
      </Section>
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Roboto", sans-serif;
  background-color: #f8f8f8;
`;
const H2 = styled.h2`
  font-size: 36px;
  padding: 10px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const UserImg = styled.img`
  width: 100px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Img = styled.img`
  width: 100px;
  margin-right: 1rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const FavoritesList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
`;
const ImgReview = styled.img`
  width: 70px;
  height: 70px;
  margin-right: 1rem;
  border-radius: 50%;
  object-fit: cover;
`;
const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: red;
  font-weight: bold;
  cursor: pointer;
`;
