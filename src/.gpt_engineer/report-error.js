// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    };
  }
  return request;
}

// Function to safely clone an object
function safeClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(safeClone);
  }

  if (obj instanceof Object) {
    if (obj.constructor !== Object) {
      // Handle non-plain objects (like Request)
      return extractRequestData(obj);
    }
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, safeClone(value)])
    );
  }

  // If we can't clone it, return a string representation
  return String(obj);
}

// Modified postMessage function
function postMessage(message) {
  try {
    const cloneableMessage = safeClone(message);
    window.parent.postMessage(cloneableMessage, '*');
  } catch (error) {
    console.error('Error in postMessage:', error);
    // Attempt to send a simplified error message
    window.parent.postMessage({
      type: 'error',
      message: 'Failed to send message due to cloning issue',
      originalError: String(error)
    }, '*');
  }
}

// Function to report HTTP errors
function reportHTTPError(error) {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    // Add any other relevant error details that can be safely cloned
  };
  
  postMessage({
    type: 'http_error',
    error: errorDetails,
  });
}

// Wrap the fetch function to catch and report errors
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args).catch(error => {
    reportHTTPError(error);
    throw error;
  });
};

// Export functions if needed
export { postMessage, reportHTTPError };