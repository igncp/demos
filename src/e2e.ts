export const demosBaseURL = (() => {
  if (process.env.CI) {
    return "http://localhost:9000/demos"
  }

  return process.env.NODE_ENV === "production"
    ? "https://igncp.github.io/demos"
    : "http://localhost:8000"
})()
