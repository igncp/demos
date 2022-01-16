// The convention is to use `/tests/` instead of `/__tests__/` because there is
// an issue with ts-coverage results in GH pages
module.exports = {
  globals: {
    ROOT_PATH: "ROOT_PATH_TEST",
  },
  moduleNameMapper: {
    ".(css|less)$": "<rootDir>/jest-config/style-mock.js",
    ".(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/jest-config/file-mock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
    "d3": "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
  preset: "ts-jest",
  testEnvironment: "node",
}
