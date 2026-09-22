import { constructUrl } from "../utils/url.js";

// Same cases as Python's test_construct_url.
test.each([
  [
    "https://api.smith.langchain.com",
    "/runs",
    "https://api.smith.langchain.com/runs",
  ],
  [
    "https://api.smith.langchain.com",
    "/api/runs",
    "https://api.smith.langchain.com/api/runs",
  ],
  [
    "https://self-hosted.smith.langchain.com/api",
    "/v1/stuff",
    "https://self-hosted.smith.langchain.com/api/v1/stuff",
  ],
  [
    "https://self-hosted.smith.langchain.com/api",
    "/api/v1/stuff",
    "https://self-hosted.smith.langchain.com/api/v1/stuff",
  ],
  [
    "https://self-hosted.smith.langchain.com/api/v1",
    "/runs",
    "https://self-hosted.smith.langchain.com/api/v1/runs",
  ],
  [
    "https://self-hosted.smith.langchain.com/api/v1",
    "/api/runs",
    "https://self-hosted.smith.langchain.com/api/runs",
  ],
  [
    "https://aks.smith.langchain.dev/api",
    "/api/v1/public/download?jwt=abc",
    "https://aks.smith.langchain.dev/api/v1/public/download?jwt=abc",
  ],
  [
    "https://aks.smith.langchain.dev/api",
    "https://cdn.example.com/file",
    "https://cdn.example.com/file",
  ],
])("constructUrl(%s, %s)", (apiUrl, pathname, expected) => {
  expect(constructUrl(apiUrl, pathname)).toBe(expected);
});

test("constructUrl rejects an api url without a scheme", () => {
  expect(() => constructUrl("", "/some/path")).toThrow(
    "api_url must start with 'http://'",
  );
});
