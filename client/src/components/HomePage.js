import React from "react";
import styled from "styled-components";
import backgroundImage from "./assets/BG.png";
import Auth0 from "./Auth0";
import FoodSearch from "./FoodSearch";

const Wrapper = styled.div`
  background-image: url(${backgroundImage});
  background-size: auto 100%;
  background-position: center bottom;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Auth0Container = styled.div`
  position: absolute;
  bottom: 28px;
  right: 70px;
`;
const HomePage = () => {
  return (
    <>
      <Wrapper>
        <FoodSearch />
        <Auth0Container>
          <Auth0 />
        </Auth0Container>
      </Wrapper>
    </>
  );
};

export default HomePage;
