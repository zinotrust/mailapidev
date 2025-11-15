// src/BaseClient.js
import axios from "axios";
import { MailApiError } from "./MailApiError.js";

export class BaseClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error(
        "MailAPI key is not configured. Please pass the API key to the MailApiDev constructor."
      );
    }

    // Create an axios instance with the API key and base URL
    this.client = axios.create({
      baseURL: "https://api.mailapi.dev/v1",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Centralized request handler
  async request(method, path, payload) {
    try {
      let response;
      if (method === "POST") {
        response = await this.client.post(path, payload);
      } else if (method === "GET") {
        response = await this.client.get(path, { params: payload });
      }

      // On success, return { data, error: null }
      return { data: response.data, error: null };
    } catch (err) {
      // On failure, return { data: null, error: ... }
      if (err.response) {
        // ADD THIS LINE FOR DEBUGGING
        console.error("API Error Response Body:", err.response.data);
        // API error (e.g., 400, 401, 404, 500)
        const { error, code, message } = err.response.data;
        const errorMessage = error || message || "An API error occurred";
        return { data: null, error: new MailApiError(errorMessage, code) };
      } else if (err.request) {
        // Network error
        return {
          data: null,
          error: new MailApiError(
            "Network error, could not reach MailAPI.",
            "network_error"
          ),
        };
      } else {
        // Other JavaScript error
        return {
          data: null,
          error: new MailApiError(err.message, "internal_error"),
        };
      }
    }
  }
}
