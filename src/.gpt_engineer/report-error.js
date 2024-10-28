// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    try {
      // Only extract string and boolean properties that can be safely cloned
      return {
        url: request.url || '',
        method: request.method || '',
        headers: request.headers ? Object.fromEntries(request.headers) : {},
        mode: request.mode || '',
        credentials: request.credentials || '',
        cache: request.cache || '',
        redirect: request.redirect || '',
        referrer: request.referrer || '',
        referrerPolicy: request.referrerPolicy || '',
        integrity: request.integrity || '',
        keepalive: Boolean(request.keepalive),
        hasSignal: Boolean(request.signal),
        isHistoryNavigation: Boolean(request.isHistoryNavigation)
      };
    } catch (error) {
      return {
        error: 'Failed to extract request data',
        message: String(error.message)
      };
    }
  }
  return String(request);
}

// Function to extract relevant error information
function extractErrorInfo(error) {
  return {
    message: String(error.message),
    stack: String(error.stack),
    type: String(error.name),
  };
}

// Safe postMessage function
function postMessage(message) {
  try {
    // Create a cloneable message object with only serializable data
    const safeMessage = {
      type: String(message.type || 'error'),
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
    // Fallback error message that's guaranteed to be cloneable
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