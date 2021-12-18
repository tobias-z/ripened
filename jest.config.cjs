module.exports = {
  projects: [
    {
      displayName: "ripened-runtime",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/packages/ripened-runtime/**/*-test.[jt]s?(x)"],
      setupFiles: ["<rootDir>/jest/setupGlobals.ts"],
      transform: {
        ".(ts|tsx)": "ts-jest",
      },
      preset: "ts-jest",
    },
    {
      displayName: "ripened-reactive",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/packages/ripened-reactive/**/*-test.[jt]s?(x)"],
      setupFiles: ["<rootDir>/jest/setupGlobals.ts"],
      transform: {
        ".(ts|tsx)": "ts-jest",
      },
      preset: "ts-jest",
    },
  ],
};
