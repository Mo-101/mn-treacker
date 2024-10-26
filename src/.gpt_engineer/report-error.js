// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers),
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
    const safeMessage = {
      type: message.type || 'error',
      error: typeof message.error === 'object' ? extractErrorInfo(message.error) : String(message.error),
    };
    
    if (message.request) {
      safeMessage.request = extractRequestData(message.request);
    }
    
    window.parent.postMessage(safeMessage, '*');
  } catch (error) {
    console.error('Error in postMessage:', error);
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