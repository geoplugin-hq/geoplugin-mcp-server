import type { GeopluginIPResponse } from "./types.js";
import { createGeopluginError } from "./utils.js";

class APIRequest {
  readonly apiKey: string;

  constructor(_apiKey: string) {
    this.apiKey = _apiKey;
  }

  async makeRequest<T = any>(path: string, options?: RequestInit): Promise<T> {
    options = Object.assign({}, options, {
      headers: Object.assign({}, options?.headers, {
        "user-agent": "GeopluginMCPServer/0.1.0",
      }),
    });

    const url = `https://api.geoplugin.com${path}`;

    const res = await fetch(url, options);
    if (res.status >= 400) {
      throw await createGeopluginError(res);
    }

    const contentType = res.headers.get("content-type");
    const result = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();
    return result as T;
  }

  async getIPLocation(ip: string): Promise<GeopluginIPResponse> {
    return await this.makeRequest<GeopluginIPResponse>(
      `/?auth=${this.apiKey}&ip=${ip}`
    );
  }

  async getMyLocation(): Promise<GeopluginIPResponse> {
    return await this.makeRequest<GeopluginIPResponse>(
      `/me?auth=${this.apiKey}`
    );
  }
}

export class Geoplugin {
  public apiRequest: APIRequest;

  constructor(apiKey: string) {
    this.apiRequest = new APIRequest(apiKey);
  }
}
