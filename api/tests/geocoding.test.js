import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import handler from "../geocoding.js";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedAxios = axios;

const createRes = () => {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
    end: vi.fn(() => res),
    setHeader: vi.fn(),
  };
  return res;
};

describe("Geocoding API handler", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 405 for GET requests", async () => {
    const req = { method: "GET" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: "GET method not allowed. POST ONLY" });
  });

  it("returns 400 when address is missing", async () => {
    const req = { method: "POST", body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing address" });
  });

  it("calls the Census geocoder and returns data for a valid address", async () => {
    const address = "1600 Pennsylvania Ave NW, Washington DC";
    const req = { method: "POST", body: { address } };
    const res = createRes();
    const expectedResponse = { some: "data" };

    mockedAxios.get.mockResolvedValue({ data: expectedResponse });

    await handler(req, res);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(
        address
      )}&benchmark=4&format=json`
    );
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});
