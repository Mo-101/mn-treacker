// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    // Create a simple serializable object with only necessary request info
    const safeRequest = {
      url: request.url,
      method: request.method,
      // Only include safe headers as a plain object
      headers: {}
    };

    // Safely extract headers
    if (request.headers && typeof request.headers.forEach === 'function') {
      const safeHeaders = ['content-type', 'accept', 'content-length'];
      request.headers.forEach((value, key) => {
        if (safeHeaders.includes(key.toLowerCase())) {
          safeRequest.headers[key] = value;
        }
      });
    }

    return safeRequest;
  }
  return String(request);
}

// Function to extract relevant error information
function extractErrorInfo(error) {
  return {
    message: error?.message || String(error),
    stack: error?.stack,
    type: error?.name || 'Error',
    timestamp: new Date().toISOString()
  };
}

// Safe postMessage function
function postMessage(message) {
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
      safeMessage.request = extractRequestData(message.request);
    }
    
    window.parent.postMessage(safeMessage, '*');
  } catch (error) {
    // Fallback error message if something goes wrong
    window.parent.postMessage({
      type: 'error',
      error: {
        message: 'Failed to send error report',
        timestamp: new Date().toISOString()
      }
    }, '*');
  }
}

// Function to report HTTP errors
function reportHTTPError(error) {
  const errorDetails = {
    type: 'http_error',
    error: extractErrorInfo(error),
    timestamp: new Date().toISOString()
  };
  
  if (error.request) {
    errorDetails.request = extractRequestData(error.request);
  }
  
  postMessage(errorDetails);
}

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
    error.request = args[0];
    reportHTTPError(error);
    throw error;
  }
};

export { postMessage, reportHTTPError };