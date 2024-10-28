// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    try {
      return {
        url: request.url || '',
        method: request.method || 'GET',
        headers: Object.fromEntries(Array.from(request.headers || []))
      };
    } catch (e) {
      return {
        error: 'Could not extract request data: ' + String(e)
      };
    }
  }
  return String(request);
}

// Function to extract relevant error information
function extractErrorInfo(error) {
  return {
    message: String(error?.message || ''),
    stack: String(error?.stack || ''),
    type: String(error?.name || 'Error')
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
      safeMessage.error = typeof message.error === 'object' 
        ? extractErrorInfo(message.error)
        : String(message.error);
    }
    
    // Safely handle request data
    if (message.request) {
      safeMessage.request = extractRequestData(message.request);
    }
    
    // Post the sanitized message
    window.parent.postMessage(safeMessage, '*');
  } catch (error) {
    // Fallback error message
    window.parent.postMessage({
      type: 'error',
      error: {
        message: 'Failed to send message: ' + String(error),
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

// Export functions
export { postMessage, reportHTTPError };