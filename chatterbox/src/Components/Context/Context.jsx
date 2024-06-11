import React, { useState } from "react";

const { createContext } = require("react");

export const accountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  return (
    <accountContext.Provider value={{ user, setUser }}>
      {children}
    </accountContext.Provider>
  );
};

export default UserContext;
