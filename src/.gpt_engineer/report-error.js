// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      // Convert headers to a plain object
      headers: Object.fromEntries(request.headers.entries())
    };
  }
  return String(request);
}

// Function to extract relevant error information
function extractErrorInfo(error) {
  return {
    message: error?.message || String(error),
    stack: error?.stack,
    type: error?.name || 'Error'
  };
}

// Safe postMessage function
function postMessage(message) {
  try {
    // Create a cloneable message object
    const safeMessage = {
      type: 'error',
      timestamp: new Date().toISOString()
    };
    
    // Safely handle error data
    if (message.error) {
      safeMessage.error = extractErrorInfo(message.error);
    }
    
    // Safely handle request data
    if (message.request) {
      safeMessage.request = extractRequestData(message.request);
    }
    
    // Post the sanitized message
    window.parent.postMessage(safeMessage, '*');
  } catch (error) {
    // Fallback error message
    console.error('Error in postMessage:', error);
    window.parent.postMessage({
      type: 'error',
      error: {
        message: 'Failed to send error report: ' + String(error),
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
  
  postMessage(errorDetails);
}

// Wrap fetch to handle errors without cloning the Request object
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  try {
    const response = await originalFetch.apply(this, args);
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      reportHTTPError({
        message: error.message,
        request: extractRequestData(args[0])
      });
      throw error;
    }
    return response;
  } catch (error) {
    reportHTTPError({
      message: error.message,
      request: extractRequestData(args[0])
    });
    throw error;
  }
};

export { postMessage, reportHTTPError };