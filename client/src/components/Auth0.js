import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import LoginButton from "./LoginButton";

const Auth0 = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: auth0User } = useAuth0();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const handleAuthenticatedUser = async (user) => {
      try {
        const response = await axios.post("http://localhost:8000/api/users", {
          user,
        });
        const fetchedDbUser = response.data;
        console.log("User from the database:", fetchedDbUser);
        setDbUser(fetchedDbUser);
      } catch (error) {
        console.error("Error registering or logging in the user:", error);
      }
    };

    if (isAuthenticated && auth0User) {
      handleAuthenticatedUser(auth0User);
    }
  }, [isAuthenticated, auth0User]);

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  };

  return (
    <div onClick={handleClick}>
      {isAuthenticated && auth0User ? (
        <img
          src={auth0User.picture}
          alt={auth0User.name}
          style={{ borderRadius: "50%", cursor: "pointer" }}
        />
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default Auth0;
