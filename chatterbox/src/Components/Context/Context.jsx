import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create a context for user account
export const accountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://localhost:4000/auth/login", {
          method: "GET",
          credentials: "include", // Important to include cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res || !res.ok || res.status >= 400) {
          setUser({ loggedIn: false });
          return;
        }

        const data = await res.json();
        if (!data) {
          setUser({ loggedIn: false });
          return;
        }

        setUser({ ...data });
        navigate("/home");
      } catch (err) {
        setUser({ loggedIn: false });
      }
    };

    checkLoginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <accountContext.Provider value={{ user, setUser }}>
      {children}
    </accountContext.Provider>
  );
};

export default UserContext;
