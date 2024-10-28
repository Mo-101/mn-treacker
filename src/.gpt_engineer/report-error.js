// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      // Convert headers to a plain object that can be cloned
      headers: Array.from(request.headers).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {})
    };
  }
  return String(request);
}

// Function to extract relevant error information
function extractErrorInfo(error) {
  return {
    message: error.message,
    stack: error.stack,
    type: error.name,
  };
}

// Safe postMessage function
function postMessage(message) {
  try {
    // Create a cloneable message object
    const safeMessage = {
      type: message.type || 'error',
      error: typeof message.error === 'object' ? extractErrorInfo(message.error) : String(message.error),
    };
    
    // Safely handle request data if present
    if (message.request) {
      safeMessage.request = extractRequestData(message.request);
    }
    
    // Post the sanitized message
    window.parent.postMessage(safeMessage, '*');
  } catch (error) {
    console.error('Error in postMessage:', error);
    // Fallback error message that's guaranteed to be cloneable
    window.parent.postMessage({
      type: 'error',
      error: {
        message: 'Failed to send message',
        originalError: String(error),
      },
    }, '*');
  }
}

// Function to report HTTP errors
function reportHTTPError(error) {
  const errorDetails = {
    type: 'http_error',
    error: extractErrorInfo(error),
  };
  
  postMessage(errorDetails);
}

// Export functions
export { postMessage, reportHTTPError };