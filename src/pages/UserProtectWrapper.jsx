import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Checking authentication..."); // Debugging log

    if (!token) {
      console.log("No token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          console.log("User authenticated:", response.data); // Debugging log
        }
      })
      .catch((err) => {
        console.error("Authentication failed:", err);
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
