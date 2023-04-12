import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaUserCircle } from "react-icons/fa";
import styled from "styled-components";

const Icon = styled(FaUserCircle)`
  font-size: 95px;
  color: rgb(91, 17, 0);
  pointer-events: none;
`;

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 95px;
  height: 95px;
  &:hover {
    cursor: pointer;
  }
`;

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <IconContainer onClick={() => loginWithRedirect()}>
      <Icon />
    </IconContainer>
  );
};

export default LoginButton;
