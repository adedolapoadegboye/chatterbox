import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Error404 from "./Error404";

describe("Error404 Component", () => {
  test("renders Error404 component with correct elements", () => {
    render(
      <Router>
        <Error404 />
      </Router>
    );

    // Check if the 404 heading is displayed
    expect(screen.getByText("404")).toBeInTheDocument();
    // Check if the page not found text is displayed
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    // Check if the description text is displayed
    expect(
      screen.getByText("The page you are looking for does not seem to exist.")
    ).toBeInTheDocument();
    // Check if the button is displayed
    expect(
      screen.getByRole("button", { name: /go to home/i })
    ).toBeInTheDocument();
  });
});
