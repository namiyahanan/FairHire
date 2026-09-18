const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.agents.snsihub.ai/webhook/candidate-workflow-system";

/**
 * Recruitment API Mode:
 * Evaluates whether recruitment workflows (jobs, candidates, interviews, compliance)
 * use mock stores or the real live SNS Workbench backend.
 * Evaluates to false (LIVE mode) when VITE_API_MODE is "live".
 */
export const isMockMode = () => (import.meta.env.VITE_API_MODE || "live").toLowerCase() === "mock";

/**
 * Authentication Mode:
 * Authentication is NOT implemented in SNS Workbench, so authentication
 * (login, registration, OAuth) defaults to mock.
 */
export const isAuthMockMode = () => (import.meta.env.VITE_AUTH_MODE || "mock").toLowerCase() === "mock";

/**
 * Reusable API request handler for FairHire frontend.
 * Intercepts requests, adds authorization tokens, handles JSON formatting,
 * FormData/multipart uploads without overriding boundaries, timeouts, and returns
 * structured standard responses: { success: boolean, status: number, data: any, message: string }
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

  // Detect FormData (multipart) vs standard JSON payload
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const requestHeaders = {
    ...authHeaders,
    ...headers,
  };

  // Only set Content-Type to application/json for non-FormData payloads
  if (!isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers: requestHeaders,
    ...customConfig,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
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
      try {
        data = await response.json();
      } catch (jsonErr) {
        return {
          success: false,
          status: response.status,
          message: 'Malformed JSON response received from backend service.',
          data: null
        };
      }
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
      data: data.data !== undefined ? data.data : data,
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

/**
 * Unified HR webhook caller.
 *
 * All HR write operations (create_job, update_job, update_candidate_status,
 * shortlist_candidate, reject_candidate) are routed through this single function.
 *
 * URL is read from VITE_HR_WORKFLOW_WEBHOOK_URL at call time — never hard-coded.
 * Throws on HTTP error or explicit { success: false } response.
 * Never called in mock mode.
 */
export async function callHRWebhook(action, data) {
  const webhookUrl = import.meta.env.VITE_HR_WORKFLOW_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('[FairHire] VITE_HR_WORKFLOW_WEBHOOK_URL is not configured.');
  }

  const response = await fetch(
    webhookUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        data
      })
    }
  );

  let result = null;

  try {
    result = await response.json();
  } catch {
    throw new Error('Invalid response from HR workflow');
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || 'HR workflow request failed'
    );
  }

  return result;
}

/**
 * Unified Candidate webhook caller.
 *
 * All candidate write operations (applyCandidate, confirmInterviewSlot,
 * updateCandidateStatus, shortlistCandidate, rejectCandidate)
 * are routed through this function to the candidate-workflow-system webhook.
 *
 * URL is read from VITE_CANDIDATE_WORKFLOW_WEBHOOK_URL with fallback to production candidate webhook URL.
 * Throws on HTTP error or explicit { success: false } response.
 * Never called in mock mode.
 */
export async function callCandidateWebhook(action, data) {
  const webhookUrl =
    import.meta.env.VITE_CANDIDATE_WORKFLOW_WEBHOOK_URL ||
    'https://api.agents.snsihub.ai/webhook/candidate-workflow-system';

  const response = await fetch(
    webhookUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        data
      })
    }
  );

  let result = null;

  try {
    result = await response.json();
  } catch {
    throw new Error('Invalid response from Candidate workflow');
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || 'Candidate workflow request failed'
    );
  }

  return result;
}

/**
 * Production Resume Parsing webhook caller.
 *
 * Dispatches candidate resume files or text to the dedicated SNS resume parsing workflow.
 * URL is read from VITE_RESUME_PARSING_WEBHOOK_URL with fallback to the production webhook URL.
 */
export async function callResumeParsingWebhook(payload) {
  const webhookUrl =
    import.meta.env.VITE_RESUME_PARSING_WEBHOOK_URL ||
    'https://api.agents.snsihub.ai/webhook/94145035-0642-49c0-a019-23f3fc06d144';

  const isFile = typeof File !== 'undefined' && payload instanceof File;
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  const isFilePayloadObject = typeof payload === 'object' && payload !== null && typeof File !== 'undefined' && payload.file instanceof File;

  let requestBody;
  let headers = {};

  if (isFilePayloadObject) {
    const fd = new FormData();
    fd.append('file', payload.file, payload.file.name);
    fd.append('resume', payload.file, payload.file.name);
    fd.append('fileName', payload.file.name);
    if (payload.candidateId || payload.candidate_id) {
      const cId = payload.candidateId || payload.candidate_id;
      fd.append('candidateId', cId);
      fd.append('candidate_id', cId);
    }
    if (payload.trackId || payload.track_id) {
      const tId = payload.trackId || payload.track_id;
      fd.append('trackId', tId);
      fd.append('track_id', tId);
    }
    requestBody = fd;
  } else if (isFile) {
    const fd = new FormData();
    fd.append('file', payload, payload.name);
    fd.append('resume', payload, payload.name);
    fd.append('fileName', payload.name);
    requestBody = fd;
  } else if (isFormData) {
    requestBody = payload;
  } else if (typeof payload === 'object' && payload !== null) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(payload);
  } else {
    requestBody = payload;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: requestBody
  });

  let result = null;

  try {
    result = await response.json();
  } catch {
    throw new Error('Invalid response from Resume Parsing workflow');
  }

  if (!response.ok || (result && result.success === false)) {
    throw new Error(
      result?.message || result?.error || `Resume parsing workflow request failed (Status: ${response.status})`
    );
  }

  return result;
}



