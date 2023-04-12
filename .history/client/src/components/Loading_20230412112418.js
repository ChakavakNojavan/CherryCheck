import React from "react";
import { IconContext } from "react-icons";
import { FiLoader } from "react-icons/fi";
import styled, { keyframes } from "styled-components";

// Component to render loading icon
const Loading = () => {
  return (
    <LoadingDiv>
      <IconDiv>
        <IconContext.Provider value={{ size: "2rem " }}>
          <FiLoader />
        </IconContext.Provider>
      </IconDiv>
    </LoadingDiv>
  );
};

export default Loading;

// Styled components for loading icon
const rotate = keyframes`
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
}
`;
const IconDiv = styled.div`
  position: absolute;
  left: 20;
  top: 45;
  animation: ${rotate} 2s linear infinite;
  opacity: 0, 5;
  font-size: 15em;
  display: flex;
  justify-content: center;
`;
const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 300px;
  left: 0;
`;
