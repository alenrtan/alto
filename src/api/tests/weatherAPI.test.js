import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { getForecast, getForecastLink } from "../weatherAPI.js";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedAxios = axios;

describe("Weather API helpers", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns the forecast link from NWS metadata", async () => {
    // sample coords for the White House in Washington, D.C.
    const lat = "38.8977";
    const long = "-77.0365";
    const forecastUrl = "https://api.weather.gov/gridpoints/XYZ/1,1/forecast";

    mockedAxios.get.mockResolvedValue({
      data: {
        properties: {
          forecast: forecastUrl,
        },
      },
    });

    const result = await getForecastLink(lat, long);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://api.weather.gov/points/${lat},${long}`
    );
    expect(result).toBe(forecastUrl);
  });

  it("returns forecast periods for a valid forecast link", async () => {
    const forecastLink = "https://api.weather.gov/gridpoints/XYZ/1,1/forecast";
    const periods = [{ name: "Today" }, { name: "Tonight" }];

    mockedAxios.get.mockResolvedValue({
      data: {
        properties: {
          periods,
        },
      },
    });

    const result = await getForecast(forecastLink);

    expect(mockedAxios.get).toHaveBeenCalledWith(forecastLink);
    expect(result).toBe(periods);
  });
});
