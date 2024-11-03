import { describe, it, expect } from "@jest/globals";
import axios from "axios";

describe("Health Check", () => {
  const healthEndpoint = "http://localhost:3000/api/v1/checkup/health";

  it("should return 200 OK", async () => {
    try {
      const response = await axios.get(healthEndpoint);
      expect(response.status).toBe(200);
    } catch (error) {
      throw error;
    }
  });
});

