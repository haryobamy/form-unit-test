import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import App, { validateInput } from "./App";
import axiosMock from "axios";

// jest.mock("./Api");
// export const validateInput = (str = " ") => str.includes("@")

afterEach(cleanup);

const api = {
  get: jest.fn().mockResolvedValue({
    data: {},
  }),
};

global.fetch = jest.fn(() => {
  Promise.resolve({
    json: () => Promise.resolve({ data: { message: "Login successfully" } }),
  });
});

describe("login", () => {
  test("validate function should pass on correct input", () => {
    const text = "text@test.com";
    expect(validateInput(text)).toBe(true);
  });

  test("validate function should fail on incorrect input  ", () => {
    const text = "text";
    expect(validateInput(text)).not.toBe(true);
  });
  test(" login form should be in the document", () => {
    const component = render(<App />);
    const labelNode = component.getByText("Username");
    expect(labelNode).toBeInTheDocument();
  });

  test("username field should have label", () => {
    const component = render(<App />);
    const usernameInputNode = component.getByLabelText("Username");
    expect(usernameInputNode.getAttribute("name")).toBe("username");
  });
  test("username input  should accept text", () => {
    const { getByLabelText, getByText } = render(<App />);
    const usernameInputNode = getByLabelText("Username");
    expect(usernameInputNode.value).toMatch("");
    fireEvent.change(usernameInputNode, { target: { value: "testing" } });
    expect(usernameInputNode.value).toMatch("testing");
  });

  test("password input should accept text", () => {
    const { getByLabelText, getByText } = render(<App />);
    const passwordInputNode = getByLabelText("Password");
    expect(passwordInputNode.value).toMatch("");
    fireEvent.change(passwordInputNode, { target: { value: "password" } });
    expect(passwordInputNode.value).toMatch("password");

    const errorMessgeNode = getByText("Password Must Contain Symbols");
    expect(errorMessgeNode).toBeInTheDocument();

    fireEvent.change(passwordInputNode, { target: { value: "@password" } });
    expect(errorMessgeNode).not.toBeInTheDocument();
  });
  test("should be able to submit form ", () => {
    const mockfn = jest.fn();
    const { getByRole } = render(<App handleSubmit={mockfn} />);
    const buttonNode = getByRole("button");
    fireEvent.submit(buttonNode);
    expect(mockfn).toHaveBeenCalledTimes(1);
  });
});

describe("it signup successfully", () => {
  test("it signup of perfectly on submit ", () => {
    const mockfn = jest.fn();

    const { getByLabelText, getByText, getByRole } = render(
      <App handleSubmit={mockfn} />
    );
    const usernameInputNode = getByLabelText("Username");
    expect(usernameInputNode.value).toMatch("");
    fireEvent.change(usernameInputNode, { target: { value: "testing" } });
    expect(usernameInputNode.value).toMatch("testing");

    const passwordInputNode = getByLabelText("Password");
    expect(passwordInputNode.value).toMatch("");
    fireEvent.change(passwordInputNode, { target: { value: "@password" } });
    expect(passwordInputNode.value).toMatch("password");

    const buttonNode = getByRole("button");
    fireEvent.submit(buttonNode);
    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  test("it fetches and display data", async () => {
    api.get.mockResolvedValueOnce({ data: { message: "Welcome user" } });
    const url = "/login";
    const { getByTestId, getByText } = render(<App url={url} />);

    expect(getByTestId("loading")).toHaveTextContent("Verifying user ....");

    // const resolvedData = await waitFor(() => getByTestId("loggedin"));

    // // expect(resolvedData).toHaveTextContent("Welcome user");

    // expect(axiosMock.get).toHaveBeenCalled(1);
  });
});
