import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./Login/Signup";
import Login from "./Login/Login";

const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default Views;
