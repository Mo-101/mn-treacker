// Function to safely extract data from a Request object
const extractRequestData = (request) => {
  if (request instanceof Request) {
    // Create a simple serializable object with only necessary request info
    const safeRequest = {
      url: request.url || '',
      method: request.method || 'GET',
      headers: {}
    };

    // Safely extract headers without accessing the Headers object directly
    if (request.headers && typeof request.headers.get === 'function') {
      const safeHeaders = ['content-type', 'accept', 'content-length'];
      safeHeaders.forEach(header => {
        const value = request.headers.get(header);
        if (value) {
          safeRequest.headers[header] = value;
        }
      });
    }

    return safeRequest;
  }
  return String(request);
};

// Function to extract safe error information
const extractErrorInfo = (error) => ({
  message: error?.message || String(error),
  stack: error?.stack,
  type: error?.name || 'Error',
  timestamp: new Date().toISOString()
});

// Safe postMessage function
const postMessage = (message) => {
  try {
    // Create a serializable message object
    const safeMessage = {
      type: 'error',
      timestamp: new Date().toISOString()
    };

    if (message.error) {
      safeMessage.error = extractErrorInfo(message.error);
    }

    if (message.request) {
      const safeRequest = extractRequestData(message.request);
      if (safeRequest) {
        safeMessage.request = safeRequest;
      }
    }

    // Send the sanitized message
    window.parent.postMessage(safeMessage, '*');
  } catch (err) {
    console.warn('Error in postMessage:', err);
    // Send a simplified error message if the main one fails
    try {
      window.parent.postMessage({
        type: 'error',
        error: {
          message: 'Failed to send error report',
          timestamp: new Date().toISOString()
        }
      }, '*');
    } catch (e) {
      console.error('Failed to send fallback error message:', e);
    }
  }
};

// Function to report HTTP errors
const reportHTTPError = (error) => {
  const errorDetails = {
    type: 'http_error',
    error: extractErrorInfo(error),
    timestamp: new Date().toISOString()
  };

  if (error.request) {
    const safeRequest = extractRequestData(error.request);
    if (safeRequest) {
      errorDetails.request = safeRequest;
    }
  }

  postMessage(errorDetails);
};

// Wrap fetch to handle errors
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  try {
    const response = await originalFetch.apply(this, args);
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      if (args[0] instanceof Request || typeof args[0] === 'string') {
        error.request = args[0];
        reportHTTPError(error);
      }
      throw error;
    }
    return response;
  } catch (error) {
    if (args[0] instanceof Request || typeof args[0] === 'string') {
      error.request = args[0];
      reportHTTPError(error);
    }
    throw error;
  }
};

export { postMessage, reportHTTPError };