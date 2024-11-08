module.exports = {
  verbose: false,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "js", "json", "node"], // Specify module file extensions
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore these paths for testing
  coverageDirectory: "coverage", // Output directory for test coverage
  collectCoverage: true // Enable test coverage collection
};

