import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { createContext } = require("react");

export const accountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:4000/auth/login", {
      method: "GET",
      credentials: "include", // Important to include cookies
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch((err) => {
        setUser({ loggedIn: false });
        // console.log("Not logged in");
        return;
      })
      .then((res) => {
        if (!res || !res.ok || res.status >= 400) {
          setUser({ loggedIn: false });
          // console.log("Not logged in");

          return;
        }

        return res.json();
      })
      .then((data) => {
        if (!data) {
          setUser({ loggedIn: false });
          // console.log("Not logged in");

          return;
        }
        // console.log(data);
        setUser({ ...data });
        navigate("/home");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <accountContext.Provider value={{ user, setUser }}>
      {children}
    </accountContext.Provider>
  );
};

export default UserContext;
