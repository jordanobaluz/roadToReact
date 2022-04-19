import { render, screen } from "@testing-library/react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import App from "./App";

describe("App", () => {
  test("renders learn react link", () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
