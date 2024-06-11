import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./Login/Signup";
import Login from "./Login/Login";
import Error404 from "./ErrorHandling/Error404";
import Home from "./Appflow/Home";
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes";

const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default Views;
