// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      // Only extract safe-to-clone headers
      headers: Object.fromEntries([...request.headers].filter(([key]) => {
        // Only include safe headers that don't contain sensitive data
        const safeHeaders = ['content-type', 'accept', 'content-length'];
        return safeHeaders.includes(key.toLowerCase());
      }))
    };
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
    console.error('Error in postMessage:', error);
    // Fallback error message
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