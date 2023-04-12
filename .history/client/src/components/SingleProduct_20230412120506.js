import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import styled, { keyframes } from "styled-components";
import {
  GiWheat,
  GiPeanut,
  GiAcorn,
  GiJellyBeans,
  GiMilkCarton,
  GiBigEgg,
  GiDoubleFish,
  GiSesame,
} from "react-icons/gi";
import { HiSearchCircle } from "react-icons/hi";
import ingImage from "./assets/ing.png";
import alImage from "./assets/al.png";
import ecoImage from "./assets/eco.png";
import levelImage from "./assets/level.png";
import BannerImage from "./assets/logo.png";
import Auth0 from "./Auth0";
import Loading from "./Loading";
const SingleProduct = ({ userId, isAuthenticated }) => {
  const { code } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");
  const [liked, setLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/");
  };

  const fetchProductReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/product/${code}/reviews`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching product reviews:", error);
    }
  };

  useEffect(() => {
    if (product) {
      fetchUserLikes();
      fetchProductReviews();
    }
  }, [userId, product]);

  const fetchUserLikes = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/${userId}/likes`
      );
      const userLikes = response.data;

      if (userLikes.includes(product.code)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    } catch (error) {
      console.error("Error fetching user likes:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/product/${code}`
        );
        const data = response.data;
        console.log("API response:", data);

        if (data.status === 1) {
          setProduct(data.product);
          console.log("Product data:", data.product);
        } else {
          console.error("Error fetching product:", data.status_verbose);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [code]);
  useEffect(() => {
    if (product) {
      fetchUserLikes();
    }
  }, [userId, product]);

  const handleLike = async () => {
    try {
      console.log("Like button clicked");
      await axios.post("http://localhost:8000/api/like", {
        userId,
        productId: product.code,
      });
      setLiked(!liked);
      console.log("Liked state:", !liked);
    } catch (error) {
      console.error("Error liking product:", error);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/api/review", {
        userId,
        productId: product.code,
        review,
      });
      setReview("");
      fetchProductReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  return (
    <StyledContainer>
      {loading ? (
        <Loading />
      ) : product ? (
        <>
          <StyledPage1>
            <Element1>
              <BannerImg src={BannerImage} />
              <IconsContainer>
                <SearchIcon>
                  <HiSearchCircle size={110} onClick={handleSearchClick} />
                </SearchIcon>
                <Auth0Container>
                  <Auth0 />
                </Auth0Container>
              </IconsContainer>
            </Element1>

            <Element2>
              <StyledColumn>
                <Name>
                  {product.generic_name
                    ? product.generic_name
                    : product.product_name}
                </Name>

                <div>
                  <Title>Reviews:</Title>
                  {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review this product!</p>
                  ) : (
                    <ul>
                      {reviews.map((review, index) => (
                        <li key={index}>
                          <strong>{review.user.name}:</strong> {review.review}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  {isAuthenticated ? (
                    <ReviewForm>
                      <Textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />
                      <Button onClick={handleReviewSubmit}>
                        Submit Review
                      </Button>
                    </ReviewForm>
                  ) : (
                    <p>Please log in to submit a review.</p>
                  )}
                </div>
              </StyledColumn>
              <StyledColumn>
                <ImageContainer>
                  {isAuthenticated && (
                    <HeartIcon>
                      {liked ? (
                        <AiFillHeart
                          size={50}
                          color="red"
                          onClick={handleLike}
                        />
                      ) : (
                        <AiOutlineHeart size={50} onClick={handleLike} />
                      )}
                    </HeartIcon>
                  )}
                  <StyledImage
                    src={product.image_url}
                    alt={product.product_name}
                  />
                </ImageContainer>
              </StyledColumn>
            </Element2>
          </StyledPage1>

          <StyledPage2>
            <StyledColumn>
              <StyledImage src={ingImage} />
            </StyledColumn>

            <StyledColumn>
              <Title>Ingredients</Title>
              <p>{product.ingredients_text}</p>
            </StyledColumn>
          </StyledPage2>
          <StyledPage3>
            {product.nutrient_levels && (
              <StyledColumn>
                <Title>Nutrient Levels</Title>
                <p>
                  Fat:{" "}
                  <NutrientLevel level={product.nutrient_levels.fat}>
                    {product.nutrient_levels.fat}
                  </NutrientLevel>
                </p>
                <p>
                  Salt:{" "}
                  <NutrientLevel level={product.nutrient_levels.salt}>
                    {product.nutrient_levels.salt}
                  </NutrientLevel>
                </p>
                <p>
                  Saturated Fat:{" "}
                  <NutrientLevel
                    level={product.nutrient_levels["saturated-fat"]}
                  >
                    {product.nutrient_levels["saturated-fat"]}
                  </NutrientLevel>
                </p>
                <p>
                  Sugars:{" "}
                  <NutrientLevel level={product.nutrient_levels.sugars}>
                    {product.nutrient_levels.sugars}
                  </NutrientLevel>
                </p>
              </StyledColumn>
            )}
            <StyledColumn>
              <StyledImage src={levelImage} />
            </StyledColumn>
          </StyledPage3>
          <StyledPage4>
            <StyledColumn>
              <StyledImage src={alImage} />
            </StyledColumn>
            {product.allergens_tags && (
              <StyledColumn>
                <Title>Allergens</Title>
                <ul>
                  {product.allergens_tags.map((allergen, index) => {
                    const { displayName, icon } = allergenInfo(allergen);
                    return (
                      <li key={index}>
                        {icon && <span>{icon}</span>}
                        <span>{displayName}</span>
                      </li>
                    );
                  })}
                </ul>
              </StyledColumn>
            )}
          </StyledPage4>
          <StyledPage5>
            <StyledColumn>
              {product.ecoscore_grade && (
                <Div>
                  <Title>Eco-Score</Title>
                  <Description>
                    An environmental impact score for the product, from A (best)
                    to E (worst).
                  </Description>
                  <ScoreDisplay grade={product.ecoscore_grade}>
                    {product.ecoscore_grade.toUpperCase()}
                  </ScoreDisplay>
                </Div>
              )}
              {product.nutriscore_grade && (
                <Div>
                  <Title>Nutri-Score</Title>
                  <Description>
                    A nutritional quality score for the product, from A (best)
                    to E (worst).
                  </Description>

                  <ScoreDisplay grade={product.nutriscore_grade}>
                    {product.nutriscore_grade.toUpperCase()}
                  </ScoreDisplay>
                </Div>
              )}
            </StyledColumn>
            <StyledColumn>
              <StyledImage src={ecoImage} />
            </StyledColumn>
          </StyledPage5>
        </>
      ) : (
        <p>not found</p>
      )}
    </StyledContainer>
  );
};
export default SingleProduct;
const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledContainer = styled.div`
  background-color: rgb(250, 239, 219);
`;
const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem;
  text-align: center;
`;
const BannerImg = styled.img`
  position: absolute;
  top: 0;
  left: 50px;
  height: 80px;
`;
const Element1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 1rem;
  z-index: 1000;
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 30px;
  left: 1100px;
`;
const Element2 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 100px;
`;

const Name = styled.h1`
  font-size: 200%;
  padding-right: 200px;
  padding-bottom: 50px;
`;
const StyledPage1 = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
`;
const Title = styled.h3`
  font-weight: 900;
  padding-bottom: 30px;
`;
const Textarea = styled.textarea``;
const Button = styled.button``;
const ReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 30px;
`;

const StyledPage2 = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  background-color: #deced5;
`;

const StyledPage3 = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  background-color: #afc493;
  font-size: 30px;
`;
const StyledPage4 = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  font-size: 30px;
`;
const StyledPage5 = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  background-color: #ceddde;
  font-size: 30px;
`;
const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 200%;
  padding: 0 50px;
`;

const NutrientLevel = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  background-color: ${({ level }) => nutrientLevelColor(level)};
  color: white;
`;
const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const HeartIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
`;

const nutrientLevelColor = (level) => {
  if (level === "low") {
    return "#2ecc71";
  } else if (level === "moderate") {
    return "#e28743";
  } else if (level === "high") {
    return "#e74c3c";
  } else {
    return "#bdc3c7";
  }
};
const Auth0Container = styled.div`
  position: absolute;
  top: 28px;
  right: 100px;
`;
const Div = styled.div`
  text-align: center;
  padding-bottom: 50px;
`;

const ScoreDisplay = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  text-align: center;

  ${({ grade }) =>
    grade &&
    {
      A: "background-color: #008000;", // Green
      B: "background-color: #85BB2F;", // Light Green
      C: "background-color: #FECB02;", // Yellow
      D: "background-color: #FFA400;", // Orange
      E: "background-color: #FF0000;", // Red
    }[grade.toUpperCase()]};
`;
const allergenInfo = (allergenTag) => {
  switch (allergenTag) {
    case "en:gluten":
      return {
        displayName: "Gluten",
        icon: <GiWheat size={60} />,
      };
    case "en:peanut":
      return {
        displayName: "Peanut",
        icon: <GiPeanut size={60} />,
      };
    case "en:soybeans":
      return {
        displayName: "Soybeans",
        icon: <GiJellyBeans size={60} />,
      };
    case "en:milk":
      return {
        displayName: "Milk",
        icon: <GiMilkCarton size={60} />,
      };
    case "en:eggs":
      return {
        displayName: "Eggs",
        icon: <GiBigEgg size={60} />,
      };
    case "en:nuts":
      return {
        displayName: "Nuts",
        icon: <GiAcorn size={60} />,
      };
    case "en:fish":
      return {
        displayName: "Fish",
        icon: <GiDoubleFish size={60} />,
      };
    case "en:sesame-seeds":
      return {
        displayName: "Sesame Seeds",
        icon: <GiSesame size={60} />,
      };
    default:
      return {
        displayName: allergenTag.replace(/^en:/, "").replace(/-/g, " "),
      };
  }
};
