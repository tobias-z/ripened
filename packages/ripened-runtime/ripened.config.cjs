module.exports = {
  entryPoint: "__tests__/test-app/main.tsx",
  devServerPort: 4000,
  publicDirectory: "__tests__/public",
  target: ["chrome58", "firefox57", "safari11", "edge18"],
  liveReload: true,
  showDevUpdates: true,
};
