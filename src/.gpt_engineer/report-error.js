// Function to safely extract data from a Request object
const extractRequestData = (request) => {
  try {
    if (request instanceof Request) {
      return {
        url: request.url,
        method: request.method,
        headers: Array.from(request.headers.entries()).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {})
      };
    }
    return typeof request === 'string' ? { url: request } : null;
  } catch (err) {
    console.warn('Error extracting request data:', err);
    return null;
  }
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
    const safeMessage = {
      type: 'error',
      timestamp: new Date().toISOString()
    };

    if (message.error) {
      safeMessage.error = extractErrorInfo(message.error);
    }

    if (message.request) {
      const requestData = extractRequestData(message.request);
      if (requestData) {
        safeMessage.request = requestData;
      }
    }

    window.parent.postMessage(safeMessage, '*');
  } catch (err) {
    console.warn('Error in postMessage:', err);
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
  try {
    const errorDetails = {
      type: 'http_error',
      error: extractErrorInfo(error)
    };

    if (error.request) {
      const requestData = extractRequestData(error.request);
      if (requestData) {
        errorDetails.request = requestData;
      }
    }

    postMessage(errorDetails);
  } catch (err) {
    console.warn('Error reporting HTTP error:', err);
  }
};

// Wrap fetch to handle errors
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  try {
    const response = await originalFetch.apply(this, args);
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.request = args[0];
      reportHTTPError(error);
      throw error;
    }
    return response;
  } catch (error) {
    if (args[0]) {
      error.request = args[0];
      reportHTTPError(error);
    }
    throw error;
  }
};

export { postMessage, reportHTTPError };