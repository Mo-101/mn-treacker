// Function to safely extract data from a Request object
function extractRequestData(request) {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
    };
  }
  return String(request);
}

// Function to extract relevant error information
function extractErrorInfo(error) {
  return {
    message: error.message,
    stack: error.stack,
  };
}

// Modified postMessage function
function postMessage(message) {
  try {
    // Extract only necessary information and ensure it's cloneable
    const safeMessage = JSON.parse(JSON.stringify(message));
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