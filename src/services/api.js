const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.snsworkbench.ai/v1/recruitment";
export const isMockMode = () => (import.meta.env.VITE_API_MODE || "mock") === "mock";

/**
 * Reusable API request handler for FairHire frontend.
 * Intercepts requests, adds authorization tokens, handles JSON formatting,
 * timeouts, and returns structured standard responses: { success: boolean, data: any, message: string }
 */
export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    timeoutMs = 15000,
    ...customConfig
  } = options;

  // Retrieve auth token from localStorage if available
  const token = localStorage.getItem('fairhire_token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  config.signal = controller.signal;

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data = {};
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP error! Status: ${response.status}`;
      return {
        success: false,
        status: response.status,
        message: errorMessage,
        data: null
      };
    }

    return {
      success: true,
      status: response.status,
      data: data.data || data,
      message: data.message || 'Operation successful'
    };

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return {
        success: false,
        status: 408,
        message: 'Request timed out. Please try again.',
        data: null
      };
    }

    return {
      success: false,
      status: 0,
      message: error.message || 'Network failure. Unable to connect to backend service.',
      data: null
    };
  }
};
