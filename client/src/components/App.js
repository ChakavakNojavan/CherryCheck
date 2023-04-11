import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import FoodSearch from "./FoodSearch";
import HomePage from "./HomePage";
import SingleProduct from "./SingleProduct";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./UserProfile";
import axios from "axios";
import GlobalStyles from "../GlobalStyles";

const App = () => {
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

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route
          path="/"
          element={<HomePage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/search"
          element={<FoodSearch isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/products/:code"
          element={
            <SingleProduct
              userId={dbUser?._id}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/profile"
          element={<Profile isAuthenticated={isAuthenticated} />}
        />

        <Route path="*" element={<h1>404: Oops!</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
