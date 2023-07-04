module.exports = {
  testRegex: "./__tests__/.*\\.spec\\.js$",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/config/"],
  testEnvironment: "node",
};
