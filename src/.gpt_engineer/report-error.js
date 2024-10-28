// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    try {
      return {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        integrity: request.integrity,
        keepalive: request.keepalive,
        signal: request.signal ? 'AbortSignal' : undefined,
        isHistoryNavigation: request.isHistoryNavigation,
      };
    } catch (error) {
      return {
        error: 'Failed to extract request data',
        message: error.message
      };
    }
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
      timestamp: new Date().toISOString()
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
        timestamp: new Date().toISOString()
      },
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