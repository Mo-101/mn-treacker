// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      // Only include headers if absolutely necessary
      // headers: Object.fromEntries(request.headers.entries()),
    };
  }
  return String(request); // Convert to string if not a Request
}

// Function to extract relevant error information
function extractErrorInfo(error) {
  return {
    message: error.message,
    stack: error.stack,
    // Add any other relevant error properties here
  };
}

// Modified postMessage function
function postMessage(message) {
  try {
    // Extract only necessary information
    const safeMessage = typeof message === 'object' ? extractErrorInfo(message) : message;
    window.parent.postMessage(safeMessage, '*');
  } catch (error) {
    console.error('Error in postMessage:', error);
    // Send a simplified error message
    window.parent.postMessage({
      type: 'error',
      message: 'Failed to send message',
      originalError: String(error)
    }, '*');
  }
}

// Function to report HTTP errors
function reportHTTPError(error) {
  const errorDetails = extractErrorInfo(error);
  
  if (error.request) {
    errorDetails.request = extractRequestData(error.request);
  }
  
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