import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const FoodSearchContainer = styled.div`
  padding: 50px;
  border-radius: 50px;
  position: fixed;
  top: 190px;
`;

const Suggestions = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid rgb(250, 239, 219);
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1;
  left: 70px;
  top: 150px;
  width: 80%;
  box-sizing: border-box;
`;

const Suggestion = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 8px;
  object-fit: cover;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 50px;
  padding: 8px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 68px;
  border-radius: 50px;
  margin: 0 30px;
`;

const MagnifierIcon = styled.div`
  font-size: 50px;
  margin-left: 8px;
  cursor: pointer;
`;

const FoodSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      searchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const searchProducts = async () => {
    try {
      if (searchTerm.trim() !== "") {
        const response = await axios.get(
          `http://localhost:8000/api/search?searchTerm=${searchTerm}`
        );
        console.log("Response:", response);
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("An error occurred while searching for products:", error);
    }
  };

  const handleSuggestionClick = (code) => {
    navigate(`/products/${code}`);
  };

  return (
    <FoodSearchContainer>
      <SearchBox>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="off"
        />
        <MagnifierIcon onClick={searchProducts}>&#128269;</MagnifierIcon>
      </SearchBox>
      {products.length > 0 && (
        <Suggestions>
          {products.map((product) => (
            <Suggestion
              key={product.id}
              onClick={() => handleSuggestionClick(product.id)}
            >
              <ProductImage
                src={product.image_small_url}
                alt={product.product_name}
              />
              <StyledLink to={`/products/${product.id}`}>
                {product.product_name}
              </StyledLink>
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </FoodSearchContainer>
  );
};

export default FoodSearch;
