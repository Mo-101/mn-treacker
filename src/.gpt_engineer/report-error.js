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
      if (obj instanceof Request) {
        return {
          url: obj.url,
          method: obj.method,
          headers: Object.fromEntries(obj.headers.entries()),
          // Add other properties as needed
        };
      }
      // For other custom objects, return a plain object with their properties
      return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, safeClone(value)]));
    }
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, safeClone(value)])
    );
  }

  // If we can't clone it, return the object itself
  return obj;
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
    }, '*');
  }
}

// Function to report HTTP errors
function reportHTTPError(error) {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    // Add any other relevant error details
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