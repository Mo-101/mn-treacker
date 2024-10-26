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
    // Ensure the message is cloneable by converting it to a plain object
    const safeMessage = JSON.parse(JSON.stringify({
      type: message.type || 'error',
      error: typeof message.error === 'object' ? extractErrorInfo(message.error) : String(message.error),
      request: message.request ? extractRequestData(message.request) : undefined,
    }));
    window.parent.postMessage(safeMessage, '*');
  } catch (error) {
    console.error('Error in postMessage:', error);
    // Send a simplified error message if JSON serialization fails
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
  
  if (error.request) {
    errorDetails.request = extractRequestData(error.request);
  }
  
  postMessage(errorDetails);
}

// Export functions if needed
export { postMessage, reportHTTPError };