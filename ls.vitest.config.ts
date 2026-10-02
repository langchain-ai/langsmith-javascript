import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.vitesteval.?(c|m)[jt]s"],
    reporters: ["./src/lib/vitest/reporter.mts"],
    setupFiles: ["dotenv/config"],
    hookTimeout: 30000,
  },
});
