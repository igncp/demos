// The convention is to use `/tests/` instead of `/__tests__/` because there is
// an issue with ts-coverage results in GH pages
module.exports = {
  globals: {
    ROOT_PATH: "ROOT_PATH_TEST",
  },
  moduleNameMapper: {
    d3: "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
  preset: "ts-jest",
  testEnvironment: "node",
}
