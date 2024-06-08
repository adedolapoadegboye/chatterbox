// src/pages/Error404.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Error404 from "./Error404";

describe("Error404 Page", () => {
  it("renders the 404 error page correctly", () => {
    // Render the Error404 component inside a BrowserRouter
    render(
      <BrowserRouter>
        <Error404 />
      </BrowserRouter>
    );

    // Check if the main elements are rendered
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText("The page you are looking for does not seem to exist.")
    ).toBeInTheDocument();
    expect(screen.getByText("Go to Home")).toBeInTheDocument();
  });

  it("contains a link to the home page", () => {
    // Render the Error404 component inside a BrowserRouter
    render(
      <BrowserRouter>
        <Error404 />
      </BrowserRouter>
    );

    // Check if the 'Go to Home' button has the correct link
    const homeButton = screen.getByRole("link", { name: /Go to Home/i });
    expect(homeButton).toHaveAttribute("href", "/");
  });
});
