// Function to safely extract data from a Request object
const extractRequestData = (request) => {
  if (request instanceof Request) {
    // Only extract string properties that can be safely serialized
    return {
      url: request.url || '',
      method: request.method || 'GET'
    };
  }
  if (typeof request === 'string') {
    return { url: request };
  }
  return null;
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
    // Create a basic serializable message
    const safeMessage = {
      type: 'error',
      timestamp: new Date().toISOString()
    };

    // Only add error info if it exists
    if (message.error) {
      safeMessage.error = extractErrorInfo(message.error);
    }

    // Only add request info if it exists and can be serialized
    if (message.request) {
      const safeRequest = extractRequestData(message.request);
      if (safeRequest) {
        safeMessage.request = safeRequest;
      }
    }

    window.parent.postMessage(safeMessage, '*');
  } catch (err) {
    console.warn('Error in postMessage:', err);
    // Fallback to a simple error message
    window.parent.postMessage({
      type: 'error',
      error: {
        message: 'Failed to send error report',
        timestamp: new Date().toISOString()
      }
    }, '*');
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